(() => {
    let running = false;
    let formatsRunning = false;
    let videoList = [];
    let audioList = [];

    const urlInput = document.getElementById("url");
    const formatsForm = document.getElementById("formats");
    const video = document.getElementById("player");
    const log = document.getElementById("log");

    const handleError = e => {
        if (e instanceof TypeError) {
            console.log("[error] YouTube proxy is currently having issues, please try again later.");
            alert("YouTube proxy is currently having issues, please try again later.");
            return;
        }
        console.log("[error] An error has occurred, please check the console output or DevTools.");
        alert("An error has occurred, please check the console output or DevTools.");
    };

    (() => {
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

    const getFormats = async () => {
        if (formatsRunning) {
            alert("Currently getting formats...");
            return;
        }
        formatsRunning = true;

        let info;
        try {
            info = await script.getInfo(urlInput.value);
        } catch (e) {
            handleError(e);
            formatsRunning = false;
            return;
        }
        const formats = info.formats;

        videoList = [];
        audioList = [];
        for (const format of formats) {
            if (format.hasVideo) {
                videoList.push(format);
            } else {
                audioList.push(format);
            }
        }

        let result = "<p>Video Formats</p>";
        for (const [i, video] of videoList.entries()) {
            result += `<input type="radio" id="video-${i}" name="video" value="${i}"><label for="video-${i}">${video.qualityLabel} - ${video.fps} fps - ${video.mimeType}${!video.hasAudio ? " - audio only" : ""}</label><br>`;
        }
        result += "<p>Audio Formats</p>";
        for (const [i, audio] of audioList.entries()) {
            result += `<input type="radio" id="audio-${i}" name="audio" value="${i}"><label for="audio-${i}">${audio.audioBitrate} Kbps - ${audio.mimeType}</label><br>`;
        }
        result += "<br><button onclick=\"getMedia()\">Convert</button>";
        formatsForm.innerHTML = result;
        formatsRunning = false;
    };

    const getMedia = async () => {
        if (running) {
            alert("Currently processing a video file...");
            return;
        }
        running = true;
        const form = document.forms["formats"];
        const formData = new FormData(form);
        const videoValue = formData.get("video");
        const audioValue = formData.get("audio");

        try {
            if (videoValue) {
                if (audioValue) {
                    const buffer = await script.getVideoBuffer(videoList[parseInt(videoValue)], audioList[parseInt(audioValue)]);
                    video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
                } else {
                    const buffer = await script.getVideoBuffer(videoList[parseInt(videoValue)]);
                    video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
                }
            } else {
                if (audioValue) {
                    const buffer = await script.getAudioBuffer(audioList[parseInt(audioValue)]);
                    video.src = URL.createObjectURL(new Blob([buffer], {type: "audio/mp3"}));
                } else {
                    alert("No format was selected...");
                }
            }
        } catch (e) {
            handleError(e);
        }
        running = false;
    };

    const getFastVideo = async () => {
        if (running) {
            alert("Currently processing a video file...");
            return;
        }
        running = true;
        try {
            const buffer = await script.getFastVideoBuffer(urlInput.value);
            video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
        } catch (e) {
            handleError(e);
        }
        running = false;
    };

    const getBestVideo = async () => {
        if (running) {
            alert("Currently processing a video file...");
            return;
        }
        running = true;
        try {
            const buffer = await script.getBestVideoBuffer(urlInput.value);
            video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
        } catch (e) {
            handleError(e);
        }
        running = false;
    };

    const getBestAudio = async () => {
        if (running) {
            alert("Currently processing an audio file...");
            return;
        }
        running = true;
        try {
            const buffer = await script.getBestAudioBuffer(urlInput.value);
            video.src = URL.createObjectURL(new Blob([buffer], {type: "audio/mp3"}));
        } catch (e) {
            handleError(e);
        }
        running = false;
    };

    window["getFormats"] = getFormats;
    window["getMedia"] = getMedia;
    window["getFastVideo"] = getFastVideo;
    window["getBestVideo"] = getBestVideo;
    window["getBestAudio"] = getBestAudio;
})();
