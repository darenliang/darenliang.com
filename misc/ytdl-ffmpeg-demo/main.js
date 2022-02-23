const ytdl = require("ytdl-core");
const {createFFmpeg, fetchFile} = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({log: true});

(async () => {
    await ffmpeg.load();
})();

const cleanMemory = () => {
    console.log("[info] unlinking old data");
    try {
        ffmpeg.FS("unlink", "output.mp3");
    } catch {
    }
    try {
        ffmpeg.FS("unlink", "output.mp4");
    } catch {
    }
};

const proxy = url => {
    return "https://proxy.darenliang.com/?url=" + encodeURIComponent(url);
};

const ytdlOptions = {
    requestOptions: {
        maxRetries: 5,
        backoff: {inc: 2000, max: 2000},
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

const getInfo = async url => {
    console.log("[info] getting info");
    return await ytdl.getInfo(url, ytdlOptions);
};

const getAudioBuffer = async audioInfo => {
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
        [videoData, audioData] = await Promise.all([fetchFile(proxy(videoInfo.url)), fetchFile(proxy(audioInfo.url))]);
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
        await ffmpeg.run("-i", videoFilename, "-i", audioFilename, "-c:v", "copy", "-c:a", "copy", "-shortest", "output.mp4");
        ffmpeg.FS("unlink", audioFilename);
    } else {
        await ffmpeg.run("-i", videoFilename, "output.mp4");
    }

    console.log("[info] unlink temporary files");
    ffmpeg.FS("unlink", videoFilename);

    console.log("[info] sending final data");
    return ffmpeg.FS("readFile", "output.mp4").buffer;
};

const getFastVideoBuffer = async url => {
    const info = await getInfo(url);

    console.log("[info] choosing formats");
    const videoInfo = ytdl.chooseFormat(info.formats, {
        quality: "highest",
        filter: format => format.container === "mp4"
    });

    console.log("[info] fetching data");
    const videoData = await fetchFile(proxy(videoInfo.url));

    console.log("[info] sending data");
    return videoData.buffer;
};

const getBestVideoBuffer = async url => {
    const info = await getInfo(url);

    console.log("[info] choosing formats");
    const videoInfo = ytdl.chooseFormat(info.formats, {
        quality: "highestvideo"
    });
    const audioInfo = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
        filter: "audioonly"
    });

    return await getVideoBuffer(videoInfo, audioInfo);
};

const getBestAudioBuffer = async url => {
    const info = await getInfo(url);

    console.log("[info] choosing format");
    const audioInfo = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
        filter: "audioonly"
    });

    return await getAudioBuffer(audioInfo);
};

module.exports = {
    getInfo: getInfo,
    getAudioBuffer: getAudioBuffer,
    getVideoBuffer: getVideoBuffer,
    getFastVideoBuffer: getFastVideoBuffer,
    getBestVideoBuffer: getBestVideoBuffer,
    getBestAudioBuffer: getBestAudioBuffer
};
