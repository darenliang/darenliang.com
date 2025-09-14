(() => {
    const ENDPOINT = "https://crosshair.darenliang.com/";

    const input = document.getElementById("input");
    const latency = document.getElementById("latency");
    const copy = document.getElementById("copy");

    let startTime;
    const image = document.getElementById("image");
    image.onload = () => {
        latency.innerText = `Loaded image in: ${Math.round(performance.now() - startTime)} ms`;
    };
    
    image.onerror = () => {
        latency.innerText = "❌ Failed to load crosshair image";
        image.style.display = "none";
    };

    const commandMap = new Map([
        ["cl_crosshairthickness", undefined],
        ["cl_crosshairgap", undefined],
        ["cl_crosshairgap", undefined],
        ["cl_crosshairsize", undefined],
        ["cl_crosshair_drawoutline", undefined],
        ["cl_crosshair_outlinethickness", undefined],
        ["cl_crosshairdot", undefined],
        ["cl_crosshaircolor", undefined],
        ["cl_crosshaircolor_r", undefined],
        ["cl_crosshaircolor_g", undefined],
        ["cl_crosshaircolor_b", undefined],
        ["cl_crosshairusealpha", undefined],
        ["cl_crosshairalpha", undefined],
        ["cl_crosshair_t", undefined],
    ]);

    const generateURL = () => {
        const url = [];
        for (const [key, value] of commandMap) {
            if (value === null) {
                continue;
            }
            url.push(`${key}=${value}`);
        }
        return `${ENDPOINT}?${url.join("&")}`;
    };

    const updateCommandSet = () => {
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

    const updatePreview = () => {
        if (!updateCommandSet()) {
            return;
        }
        startTime = performance.now();
        console.log("Updating crosshair...");
        image.src = generateURL();
    };
    updatePreview();

    let currentCopyTimeout = null;
    const copyLink = () => {
        if (!navigator.clipboard) {
            copy.innerText = "Copy not supported";
            setTimeout(() => {
                copy.innerText = "Copy";
            }, 2000);
            return;
        }
        
        navigator.clipboard.writeText(image.src)
            .then(() => {
                copy.innerText = "Copied!";

                if (currentCopyTimeout !== null) {
                    clearTimeout(currentCopyTimeout);
                }
                currentCopyTimeout = setTimeout(() => {
                    copy.innerHTML = "Copy";
                    currentCopyTimeout = null;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                copy.innerText = "Copy failed";
                setTimeout(() => {
                    copy.innerText = "Copy";
                }, 2000);
            });
    };

    window["copyLink"] = copyLink;
    window["updatePreview"] = updatePreview;
})();
