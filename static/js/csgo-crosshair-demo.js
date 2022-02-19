/**
 * This is some really messy and janky code
 * Please don't look :(
 */


const ENDPOINT = "https://crosshair.darenliang.workers.dev/";

let startTime;

const input = document.getElementById("input");
const latency = document.getElementById("latency");

const image = document.getElementById("image");
image.onloadstart = _ => {
    startTime = performance.now();
};
image.onload = _ => {
    latency.innerText = `Loaded image in: ${performance.now() - startTime} ms`;
};

const commandMap = new Map([
    ["cl_crosshairthickness", null],
    ["cl_crosshairgap", null],
    ["cl_crosshairgap", null],
    ["cl_crosshairsize", null],
    ["cl_crosshair_drawoutline", null],
    ["cl_crosshair_outlinethickness", null],
    ["cl_crosshairdot", null],
    ["cl_crosshaircolor", null],
    ["cl_crosshaircolor_r", null],
    ["cl_crosshaircolor_g", null],
    ["cl_crosshaircolor_b", null],
    ["cl_crosshairusealpha", null],
    ["cl_crosshairalpha", null],
    ["cl_crosshair_t", null],
]);

const generateURL = _ => {
    const url = [];
    for (const [key, value] of commandMap) {
        if (value === null) {
            continue;
        }
        url.push(`${key}=${value}`);
    }
    return `${ENDPOINT}?${url.join("&")}`;
};

const updateCommandSet = _ => {
    let updated = false;
    const activeSet = new Set();
    const params = input.value.split(";");
    for (const param of params) {
        let kv = param.trim().split(" ");
        if (kv.length !== 2) {
            continue;
        }
        if (!commandMap.has(kv[0])) {
            continue;
        }
        if (commandMap.get(kv[0]) === kv[1]) {
            activeSet.add(kv[0]);
            continue;
        }
        commandMap.set(kv[0], kv[1]);
        activeSet.add(kv[0]);
        updated = true;
    }
    for (const key of commandMap.keys()) {
        if (activeSet.has(key)) {
            continue;
        }
        if (commandMap.get(key) !== null) {
            updated = true;
        }
        commandMap.set(key, null);
    }
    return updated;
};

/**
 * https://stackoverflow.com/a/64929732
 */
const getBase64FromUrl = async (url) => {
    const start = performance.now();
    const data = await fetch(url);
    latencyValue = performance.now() - start;
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        };
    });
};

const updatePreview = _ => {
    if (!updateCommandSet()) {
        return;
    }
    console.log("Updating crosshair...");
    image.src = generateURL();
};
