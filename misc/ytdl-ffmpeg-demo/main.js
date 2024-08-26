const ytdl = require("ytdl-core");
const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({ log: true });

(async () => {
  await ffmpeg.load();
})();

const cleanMemory = () => {
  console.log("[info] unlinking old data");
  try {
    ffmpeg.FS("unlink", "output.mp3");
  } catch {}
  try {
    ffmpeg.FS("unlink", "output.mp4");
  } catch {}
};

const proxy = (url) => {
  return "https://proxy.darenliang.com/?url=" + encodeURIComponent(url);
};

const getInfo = async (url) => {
  const re =
    /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|shorts\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  const videoId = url.match(re)[8];
  const apiKey = "AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc";

  const headers = {
    "X-YouTube-Client-Name": "5",
    "X-YouTube-Client-Version": "19.09.3",
    "User-Agent":
      "com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)",
    "Content-Type": "application/json",
  };

  const b = {
    context: {
      client: {
        clientName: "IOS",
        clientVersion: "19.09.3",
        deviceModel: "iPhone14,3",
        userAgent:
          "com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)",
        hl: "en",
        timeZone: "UTC",
        utcOffsetMinutes: 0,
      },
    },
    videoId,
    playbackContext: {
      contentPlaybackContext: { html5Preference: "HTML5_PREF_WANTS" },
    },
    contentCheckOk: true,
    racyCheckOk: true,
  };

  console.log("[info] getting info");
  return fetch(
    proxy(
      `https://www.youtube.com/youtubei/v1/player?key=${apiKey}&prettyPrint=false`
    ),
    {
      method: "POST",
      body: JSON.stringify(b),
      headers,
    }
  ).then((r) => r.json());
};

const augmentFormats = (formats) => {
  const fn = (format) => {
    const [type, codecsPart] = format.mimeType.split(";");
    const container = type.split("/")[1].trim(); // 'mp4'
    const codecs = codecsPart.match(/codecs="(.+)"/)[1]; // 'mp4a.40.2'
    const hasVideo =
      codecs.includes("avc1") ||
      codecs.includes("vp8") ||
      codecs.includes("vp9");
    const hasAudio =
      codecs.includes("mp4a") ||
      codecs.includes("opus") ||
      codecs.includes("vorbis");
    return {
      ...format,
      container,
      hasVideo,
      hasAudio,
      codecs,
      videoCodec: hasVideo ? codecs : undefined,
      audioCodec: hasAudio ? codecs : undefined,
      isLive: false,
      isHLS: false,
      isDashMPD: false,
    };
  };

  return formats.map((format) => fn(format));
};

const getAudioBuffer = async (audioInfo) => {
  cleanMemory();

  console.log("[info] fetching data");
  const audioData = await fetchFile(proxy(audioInfo.url));

  console.log("[info] writing data");
  const audioFilename = `audio.${audioInfo.container}`;
  ffmpeg.FS("writeFile", audioFilename, audioData);

  console.log("[info] encoding as mp3");
  await ffmpeg.run("-i", audioFilename, "output.mp3");

  console.log("[info] unlink temporary file");
  ffmpeg.FS("unlink", audioFilename);

  console.log("[info] sending final data");
  return ffmpeg.FS("readFile", "output.mp3").buffer;
};

const getVideoBuffer = async (videoInfo, audioInfo = null) => {
  cleanMemory();

  console.log("[info] fetching data");
  let videoData, audioData, audioFilename;
  if (audioInfo) {
    [videoData, audioData] = await Promise.all([
      fetchFile(proxy(videoInfo.url)),
      fetchFile(proxy(audioInfo.url)),
    ]);
    audioFilename = `audio.${audioInfo.container}`;
    ffmpeg.FS("writeFile", audioFilename, audioData);
  } else {
    videoData = await fetchFile(proxy(videoInfo.url));
  }

  console.log("[info] writing data");
  const videoFilename = `video.${videoInfo.container}`;
  ffmpeg.FS("writeFile", videoFilename, videoData);

  console.log("[info] encoding as mp4");
  if (audioInfo) {
    await ffmpeg.run(
      "-i",
      videoFilename,
      "-i",
      audioFilename,
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      "-shortest",
      "output.mp4"
    );
    ffmpeg.FS("unlink", audioFilename);
  } else {
    await ffmpeg.run("-i", videoFilename, "output.mp4");
  }

  console.log("[info] unlink temporary files");
  ffmpeg.FS("unlink", videoFilename);

  console.log("[info] sending final data");
  return ffmpeg.FS("readFile", "output.mp4").buffer;
};

const getFastVideoBuffer = async (url) => {
  const info = await getInfo(url);

  console.log("[info] choosing formats");
  const formats = augmentFormats(info.streamingData.adaptiveFormats);
  const videoInfo = ytdl.chooseFormat(formats, {
    quality: "highest",
    filter: (format) => format.container === "mp4",
  });

  console.log("[info] fetching data");
  const videoData = await fetchFile(proxy(videoInfo.url));

  console.log("[info] sending data");
  return videoData.buffer;
};

const getBestVideoBuffer = async (url) => {
  const info = await getInfo(url);

  console.log("[info] choosing formats");
  const formats = augmentFormats(info.streamingData.adaptiveFormats);
  const videoInfo = ytdl.chooseFormat(formats, {
    quality: "highestvideo",
  });
  const audioInfo = ytdl.chooseFormat(formats, {
    quality: "highestaudio",
    filter: "audioonly",
  });

  return await getVideoBuffer(videoInfo, audioInfo);
};

const getBestAudioBuffer = async (url) => {
  const info = await getInfo(url);

  console.log("[info] choosing format");
  const formats = augmentFormats(info.streamingData.adaptiveFormats);
  const audioInfo = ytdl.chooseFormat(formats, {
    quality: "highestaudio",
    filter: "audioonly",
  });

  return await getAudioBuffer(audioInfo);
};

module.exports = {
  getInfo: getInfo,
  getAudioBuffer: getAudioBuffer,
  getVideoBuffer: getVideoBuffer,
  getFastVideoBuffer: getFastVideoBuffer,
  getBestVideoBuffer: getBestVideoBuffer,
  getBestAudioBuffer: getBestAudioBuffer,
};
