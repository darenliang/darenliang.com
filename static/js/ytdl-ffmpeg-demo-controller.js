let running = false;
const urlInput = document.getElementById("url");
const video = document.getElementById("player");
const log = document.getElementById("log");

(_ => {
    const consoleLogger = console.log;
    console.log = text => {
        if (typeof text == "object") {
            log.value += `${JSON.stringify(text)}\n`;
        } else {
            log.value += `${text}\n`;
        }
        log.scrollTop = log.scrollHeight;
        consoleLogger(text);
    };
})();

const handleError = e => {
    if (e instanceof TypeError) {
        console.log("[error] CORS must be disabled.");
        return;
    }
    console.log("[error] Failed to process files, please check the console output.");
};

const getVideo = async _ => {
    if (running) {
        alert("Currently processing a video file...");
        return;
    }
    running = true;
    try {
        const buffer = await script.getVideoBuffer(urlInput.value);
        video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
    } catch (e) {
        handleError(e);
    }
    running = false;
};

const getBestVideo = async _ => {
    if (running) {
        alert("Currently processing a video file...");
        return;
    }
    running = true;
    try {
        const buffer = await script.getEncodedVideoBuffer(urlInput.value);
        video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
    } catch (e) {
        handleError(e);
    }
    running = false;
};

const getAudio = async _ => {
    if (running) {
        alert("Currently processing an audio file...");
        return;
    }
    running = true;
    try {
        const buffer = await script.getEncodedAudioBuffer(urlInput.value);
        video.src = URL.createObjectURL(new Blob([buffer], {type: "audio/mp3"}));
    } catch {
        handleError(e);
    }
    running = false;
};
