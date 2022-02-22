const ytdl = require("ytdl-core");
const {createFFmpeg, fetchFile} = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({log: true});

(async () => {
    await ffmpeg.load();
})();

const proxy = url => {
    return "https://proxy.darenliang.com/?url=" + encodeURIComponent(url);
};

const ytdlOptions = {
    requestOptions: {
        maxRetries: 5,
        backoff: {inc: 500, max: 10000},
        transform: (parsed) => {
            const originURL = parsed.protocol + "//" + parsed.hostname + parsed.path;
            parsed.host = "proxy.darenliang.com";
            parsed.hostname = "proxy.darenliang.com";
            parsed.path = "/?url=" + encodeURIComponent(originURL);
            parsed.protocol = "https:";
            return parsed;
        }
    }
};

const getEncodedAudioBuffer = async url => {
    console.log("[info] unlinking old audio data");
    try {
        ffmpeg.FS("unlink", "output.mp3");
    } catch {
    }

    console.log("[info] getting audio info");
    const info = await ytdl.getInfo(url, ytdlOptions);

    console.log("[info] getting audio formats");
    const audioInfo = ytdl.chooseFormat(info.formats, {quality: "highestaudio", filter: "audioonly"});

    console.log("[info] fetching audio data");
    const audioData = await fetchFile(proxy(audioInfo.url));

    console.log("[info] writing audio data");
    const audioFilename = `audio.${audioInfo.container}`;
    ffmpeg.FS("writeFile", audioFilename, audioData);

    console.log("[info] encoding audio as mp3");
    await ffmpeg.run("-i", audioFilename, "output.mp3");

    console.log("[info] unlink temporary audio file");
    ffmpeg.FS("unlink", audioFilename);

    console.log("[info] sending final audio data");
    return ffmpeg.FS("readFile", "output.mp3").buffer;
};

const getVideoBuffer = async url => {
    console.log("[info] getting video info");
    const info = await ytdl.getInfo(url, ytdlOptions);

    console.log("[info] getting video formats");
    const videoInfo = ytdl.chooseFormat(info.formats, {
        quality: "highest",
        filter: format => format.container === "mp4"
    });

    console.log("[info] fetching final video data");
    const audioData = await fetchFile(proxy(videoInfo.url));

    console.log("[info] sending final video data");
    return audioData.buffer;
};

const getEncodedVideoBuffer = async url => {
    console.log("[info] unlinking old video data");
    try {
        ffmpeg.FS("unlink", "output.mp4");
    } catch {
    }

    console.log("[info] getting video info");
    const info = await ytdl.getInfo(url, ytdlOptions);

    console.log("[info] getting video formats");
    const videoInfo = ytdl.chooseFormat(info.formats, {quality: "highestvideo"});

    console.log("[info] getting audio formats");
    const audioInfo = ytdl.chooseFormat(info.formats, {quality: "highestaudio", filter: "audioonly"});

    console.log("[info] fetching video and audio data");
    const [videoData, audioData] = await Promise.all([fetchFile(proxy(videoInfo.url)), fetchFile(proxy(audioInfo.url))]);

    console.log("[info] writing video and audio data");
    const videoFilename = `video.${videoInfo.container}`;
    const audioFilename = `audio.${audioInfo.container}`;
    ffmpeg.FS("writeFile", videoFilename, videoData);
    ffmpeg.FS("writeFile", audioFilename, audioData);

    console.log("[info] merging video and audio data");
    await ffmpeg.run("-i", videoFilename, "-i", audioFilename, "-c:v", "copy", "-c:a", "copy", "-shortest", "output.mp4");

    console.log("[info] unlink temporary video and audio files");
    ffmpeg.FS("unlink", videoFilename);
    ffmpeg.FS("unlink", audioFilename);

    console.log("[info] sending final video data");
    return ffmpeg.FS("readFile", "output.mp4").buffer;
};

module.exports = {
    getEncodedAudioBuffer: getEncodedAudioBuffer,
    getVideoBuffer: getVideoBuffer,
    getEncodedVideoBuffer: getEncodedVideoBuffer,
};
