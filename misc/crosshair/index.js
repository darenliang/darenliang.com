/**
 * Import pngjs library
 * https://github.com/lukeapage/pngjs
 */
const PNG = require("pngjs").PNG;

/**
 * Headers used
 */
const headers = {
    "Content-Type": "image/png",
    "Content-Disposition": "inline; filename=\"crosshair.png\"",
    "Cache-Control": "s-maxage=31536000",
    // Used to protect your function from abuse
    // If you want anyone to use it use "*" instead
    "Access-Control-Allow-Origin": "https://www.darenliang.com"
};

/**
 * Dimensions
 */
const [width, height] = [64, 64];
const [centerX, centerY] = [Math.floor(width / 2), Math.floor(height / 2)];

/**
 * Parse str to number
 *
 * @param {string} str: string value
 * @param {number} low: lowest value
 * @param {number} high: highest value
 * @param {number} def: default value
 * @param {number} round: round reciprocal (1 / round precision)
 * @return {number} number value
 */
function parseNum(str, low, high, def, round) {
    let val = parseFloat(str);
    val = isNaN(val) ? def : val;
    if (val < low || high < val) {
        return def;
    }
    return Math.round(val * round) / round;
}

/**
 * Parse str to bool (0 - 1)
 *
 * @param {string} str: string value
 * @param {number} def: default value
 * @return {number} bool value
 */
function parseBool(str, def) {
    const val = parseInt(str) || def;
    if (val < 0 || 1 < val) {
        return def;
    }
    return val;
}

/**
 * Draw rectangle
 *
 * @param {Array<Array<Array<number>>>} pixels: pixels data
 * @param {Array<Array<number>>} coords: [[x0, y0], [x1, y1]]
 * @param {Array<number>} color: [r, g, b, a]
 */
function drawRectangle(pixels, coords, color) {
    for (let y = coords[0][1]; y < coords[1][1]; y++) {
        for (let x = coords[0][0]; x < coords[1][0]; x++) {
            pixels[y][x][0] = color[0]; // red
            pixels[y][x][1] = color[1]; // green
            pixels[y][x][2] = color[2]; // blue
            pixels[y][x][3] = color[3]; // alpha
        }
    }
}

/**
 * Draw outline
 *
 * @param {Array<Array<Array<number>>>} pixels: pixels data
 * @param {Array<Array<number>>} coords: [[x0, y0], [x1, y1]]
 * @param {number} pad: pad size
 */
function drawOutline(pixels, coords, pad) {
    const newCoords = [
        [
            coords[0][0] - pad,
            coords[0][1] - pad
        ],
        [
            coords[1][0] + pad,
            coords[1][1] + pad
        ]
    ];

    drawRectangle(pixels, newCoords, [0, 0, 0, 255]);
}

/**
 * Handle request
 *
 * @param event: event to handle
 * @return {Promise<Response>} response
 */
async function handleRequest(event) {
    const url = new URL(event.request.url);
    const key = new Request(url.toString(), event.request);
    const cache = caches.default;

    /**
     * If response is cached, return cached response
     */
    let response = await cache.match(key);
    if (response) {
        return response;
    }

    const {searchParams} = url;

    /**
     * Basic
     */
    const cl_crosshairthickness = parseNum(searchParams.get("cl_crosshairthickness"), 0.5, 5, 0.5, 2);
    const cl_crosshairgap = parseNum(searchParams.get("cl_crosshairgap"), -2, 5, 0, 1);
    const cl_crosshairsize = parseNum(searchParams.get("cl_crosshairsize"), 1, 10, 5, 1);

    /**
     * Outlines
     */
    const cl_crosshair_drawoutline = parseBool(searchParams.get("cl_crosshair_drawoutline"), 0);
    const cl_crosshair_outlinethickness = parseNum(searchParams.get("cl_crosshair_outlinethickness"), 1, 3, 1, 1);

    /**
     * Dot
     */
    const cl_crosshairdot = parseBool(searchParams.get("cl_crosshairdot"), 0);

    /**
     * Color
     */
    const cl_crosshaircolor = parseNum(searchParams.get("cl_crosshaircolor"), 0, 5, 1, 1);
    const cl_crosshaircolor_r = parseNum(searchParams.get("cl_crosshaircolor_r"), 0, 255, 50, 1);
    const cl_crosshaircolor_g = parseNum(searchParams.get("cl_crosshaircolor_g"), 0, 255, 250, 1);
    const cl_crosshaircolor_b = parseNum(searchParams.get("cl_crosshaircolor_b"), 0, 255, 50, 1);

    /**
     * Alpha
     */
    const cl_crosshairusealpha = parseBool(searchParams.get("cl_crosshairusealpha"), 1);
    const cl_crosshairalpha = parseNum(searchParams.get("cl_crosshairalpha"), 0, 255, 200, 1);
    const crosshairalpha = cl_crosshairusealpha === 1 ? cl_crosshairalpha : 255;

    /**
     * Create crosshair color
     */
    let crosshaircolor;
    switch (cl_crosshaircolor) {
        /**
         * Red
         */
        case 0:
            crosshaircolor = [255, 0, 0, crosshairalpha];
            break;
        /**
         * Green
         */
        case 1:
            crosshaircolor = [0, 255, 0, crosshairalpha];
            break;
        /**
         * Yellow
         */
        case 2:
            crosshaircolor = [255, 255, 0, crosshairalpha];
            break;
        /**
         * Blue
         */
        case 3:
            crosshaircolor = [0, 0, 255, crosshairalpha];
            break;
        /**
         * Light Blue
         */
        case 4:
            crosshaircolor = [0, 255, 255, crosshairalpha];
            break;
        /**
         * Custom
         */
        case 5:
            crosshaircolor = [cl_crosshaircolor_r, cl_crosshaircolor_g, cl_crosshaircolor_b, crosshairalpha];
            break;
    }

    /**
     * T-shaped
     */
    const cl_crosshair_t = parseBool(searchParams.get("cl_crosshair_t"), 0);


    const dot = [[centerX, centerY], [centerX, centerY]];
    /**
     * Thickness dot
     */
    {
        const thickness = cl_crosshairthickness * 2;
        const rb = Math.floor(thickness / 2);
        const lt = thickness - rb;

        dot[0][0] -= lt;
        dot[0][1] -= lt;
        dot[1][0] += rb;
        dot[1][1] += rb;
    }

    /**
     * Prefill pixels
     */
    const pixels = [];
    for (let i = 0; i < height; i++) {
        pixels[i] = [];
        for (let j = 0; j < width; j++) {
            pixels[i][j] = [];
            for (let k = 0; k < 4; k++) {
                pixels[i][j][k] = 0;
            }
        }
    }

    /**
     * Crosshair coordinates
     */
    const topBase = dot[0][1] - 4 - cl_crosshairgap;
    const bottomBase = dot[1][1] + 4 + cl_crosshairgap;
    const leftBase = dot[0][0] - 4 - cl_crosshairgap;
    const rightBase = dot[1][0] + 4 + cl_crosshairgap;
    const crosshair = [
        [[dot[0][0], topBase - cl_crosshairsize * 2], [dot[1][0], topBase]],       // top
        [[dot[0][0], bottomBase], [dot[1][0], bottomBase + cl_crosshairsize * 2]], // bottom
        [[leftBase - cl_crosshairsize * 2, dot[0][1]], [leftBase, dot[1][1]]],     // left
        [[rightBase, dot[0][1]], [rightBase + cl_crosshairsize * 2, dot[1][1]]],   // right
    ];

    /**
     * Color dot
     */
    if (cl_crosshairdot === 1) {
        /**
         * Dot outline
         */
        if (cl_crosshair_drawoutline === 1) {
            drawOutline(pixels, dot, cl_crosshair_outlinethickness);
        }

        drawRectangle(pixels, dot, crosshaircolor);
    }

    /**
     * Color crosshair
     */
    for (const [i, el] of crosshair.entries()) {
        /**
         * Check for T crosshair
         */
        if (cl_crosshair_t === 1 && i === 0) {
            continue;
        }

        /**
         * Crosshair outline
         */
        if (cl_crosshair_drawoutline === 1) {
            drawOutline(pixels, el, cl_crosshair_outlinethickness);
        }

        /**
         * Crosshair part
         */
        drawRectangle(pixels, el, crosshaircolor);
    }


    /**
     * Init PNG
     */
    const png = new PNG({
        width: width,
        height: height,
        bitDepth: 8,
        colorType: 6,
        inputColorType: 6,
        inputHasAlpha: true,
    });

    /**
     * Raster crosshair
     */
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const idx = (png.width * y + x) << 2;
            png.data[idx] = pixels[y][x][0];
            png.data[idx + 1] = pixels[y][x][1];
            png.data[idx + 2] = pixels[y][x][2];
            png.data[idx + 3] = pixels[y][x][3];
        }
    }

    /**
     * Write out buffer and cache response
     */
    const buffer = PNG.sync.write(png);
    response = new Response(buffer, {headers});
    event.waitUntil(cache.put(key, response.clone()));
    return response;
}

addEventListener("fetch", event => {
    switch (event.request.method) {
        case "GET":
            return event.respondWith(handleRequest(event));
    }
});
