let running = false;
const urlInput = document.getElementById("url");
const video = document.getElementById("player");

const getVideo = async _ => {
    if (running) {
        alert("Currently processing a video...");
        return;
    }
    running = true;
    try {
        const buffer = await script.getVideoBuffer(urlInput.value);
        video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
    } catch {
        alert("Failed to process video, please check the console output.");
    }
    running = false;
};

const getBestVideo = async _ => {
    if (running) {
        alert("Currently processing a video...");
        return;
    }
    running = true;
    try {
        const buffer = await script.getEncodedVideoBuffer(urlInput.value);
        video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
    } catch {
        alert("Failed to process video, please check the console output.");
    }
    running = false;
};
