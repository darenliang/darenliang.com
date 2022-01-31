let running = false;
const url = document.getElementById("url");
const video = document.getElementById("player");

const getVideo = async _ => {
    if (running) {
        alert("Currently processing a video...");
        return;
    }
    running = true;
    try {
        const buffer = await script.getVideoBuffer(url.value);
        video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
    } catch {
        alert("Failed to process video.");
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
        const buffer = await script.getBestVideoBuffer(url.value);
        video.src = URL.createObjectURL(new Blob([buffer], {type: "video/mp4"}));
    } catch {
        alert("Failed to process video.");
    }
    running = false;
};
