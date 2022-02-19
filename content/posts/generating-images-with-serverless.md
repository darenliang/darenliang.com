---
title: "Generating Images with Serverless"
date: "2022-02-18"
showthedate: true
---

One thing I've always wanted to do was write a serverless function that could generate
[CS:GO](https://counter-strike.net/) crosshair images. The serverless platform that I chose
is [Cloudflare Workers](https://workers.cloudflare.com/)
which utilizes a vast edge network and
supports [0 ms cold starts](https://blog.cloudflare.com/eliminating-cold-starts-with-cloudflare-workers/).

Writing a serverless function for this task didn't seem too difficult, but I've quickly ran into some issues.

### Using node-canvas

Modern browsers are equipped with the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) which
makes it extremely easy to create 2D graphics. Although this API is meant to be used in the browser, Automattic
(the makers of Wordpress) has an implementation of Canvas for Node.js
called [node-canvas](https://github.com/Automattic/node-canvas).

However, using node-canvas has a number of problems.

Workers limits scripts to [1 MB](https://developers.cloudflare.com/workers/platform/limits#script-size). Node-canvas
uses [Cairo](https://www.cairographics.org/) as a native dependency. Suppose it was possible to compile Cairo into a
WASM module it would very likely exceed 1 MB.

There is another library called [node-pureimage](https://github.com/joshmarinacci/node-pureimage) which is a pure JS
implementation of the Canvas API.

Free Workers limits the CPU runtime of functions
to [10 ms](https://developers.cloudflare.com/workers/platform/limits#cpu-runtime)
for their free plan. Having the function run under the 10 ms CPU runtime limit proved to be difficult due to the
complexity of generating images on the fly. Node-pureimage uses a library
called [pngjs](https://github.com/lukeapage/pngjs) which in itself, is very useful in generating PNGs through a
low-level interface.

### Using pngjs

Pngjs provides an incredibly simple interface for manipulating individual pixels.

The data to the PNG image is represented as an array with each pixel represented as a group of 4 values
(red, green, blue, alpha (opacity)).

For example, if you want to color any given pixel, you could do the following:

```js
const idx = (png.width * y + x) << 2; // same as (png.width * y + x) * 4
png.data[idx] = red;
png.data[idx + 1] = green;
png.data[idx + 2] = blue;
png.data[idx + 3] = alpha;
```

Using pngjs was enough to keep the function from timing out and made generating crosshair images surprisingly quick!

By passing the crosshair command settings as query parameters, we have all the information we need to draw a crosshair.

https://crosshair.darenliang.workers.dev/?cl_crosshaircolor=0&cl_crosshairsize=2.5&cl_crosshairgap=-3

Here are some example crosshairs from the best CS:GO players as of writing, served from the serverless function.

![s1mple's crosshair image](https://crosshair.darenliang.workers.dev/?cl_crosshairalpha=255&cl_crosshaircolor=4&cl_crosshairdot=1&cl_crosshairgap=-2&cl_crosshairsize=1&cl_crosshairstyle=5&cl_crosshairusealpha=1&cl_crosshairthickness=0&cl_crosshair_drawoutline=0&cl_crosshair_sniper_width=1&cl_crosshaircolor_r=1&cl_crosshaircolor_g=0&cl_crosshaircolor_b=255)

<p align="center" style="font-size: small">s1mple's crosshair</p>

![ZywOo's crosshair image](https://crosshair.darenliang.workers.dev/?cl_crosshair_drawoutline=0&cl_crosshair_sniper_width=1&cl_crosshairalpha=200&cl_crosshaircolor=4&cl_crosshaircolor_b=50&cl_crosshaircolor_g=250&cl_crosshaircolor_r=50&cl_crosshairdot=0&cl_crosshairgap=-2&cl_crosshairsize=2&cl_crosshairstyle=4&cl_crosshairthickness=1)

<p align="center" style="font-size: small">ZywOo's crosshair</p>

![NiKo's crosshair image](https://crosshair.darenliang.workers.dev/?cl_crosshairalpha=255&cl_crosshaircolor=5&cl_crosshairdot=0&cl_crosshairgap=-4&cl_crosshairsize=1&cl_crosshairstyle=4&cl_crosshairthickness=1&cl_crosshair_drawoutline=0&cl_crosshair_sniper_width=1&cl_crosshaircolor_r=255&cl_crosshaircolor_g=255&cl_crosshaircolor_b=255)

<p align="center" style="font-size: small">NiKo's crosshair</p>

### What I've Learned

Generating images with serverless functions might've been a bad idea, especially on a free plan! However, the experience
of working around the imposed limits was actually pretty fun.

Workers does offer a paid Unbound Usage Model which allows for functions to run up to 30 seconds which is an ample
amount of time. All in all, Cloudflare Workers is a great platform to get started with serverless; it has a low-latency
key-value database, has more favourable pricing compared to the big three cloud providers (AWS, GCP, and Azure) and can
run JavaScript code with minimal delay in large part due in running code inside isolates rather than individual
containers.

Here is an interactive demo of you want to try it out for
yourself: [CS:GO Crosshair Preview](/demos/csgo-crosshair-preview/)

<details>
<summary>Source code for anyone who is curious</summary>

```js {linenos=table}
/**
 * Import pngjs library
 * https://github.com/lukeapage/pngjs
 */
const {PNG} = require("pngjs");

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
    const newCoords = [[coords[0][0] - pad, coords[0][1] - pad], [coords[1][0] + pad, coords[1][1] + pad]];

    drawRectangle(pixels, newCoords, [0, 0, 0, 255]);
}

/**
 * Generate crosshair
 */
function generateCrosshair(req) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    /**
     * Basic
     */
    const cl_crosshairthickness = parseNum(params.get("cl_crosshairthickness"), 0.5, 5, 0.5, 2);
    const cl_crosshairgap = parseNum(params.get("cl_crosshairgap"), -5, 5, 0, 1);

    /**
     * Detect no reticle
     */
    let crosshairReticle;
    {
        const val = parseFloat(params.get("cl_crosshairgap"));
        if (!isNaN(val) && Math.abs(val) > 100) {
            crosshairReticle = 0;
        } else {
            crosshairReticle = 1;
        }
    }

    /**
     * Some people use 0-0.5 crosshair sizes
     */
    const cl_crosshairsize = parseNum(params.get("cl_crosshairsize"), 0, 10, 5, 2);

    /**
     * Outlines
     */
    const cl_crosshair_drawoutline = parseBool(params.get("cl_crosshair_drawoutline"), 0);
    const cl_crosshair_outlinethickness = parseNum(params.get("cl_crosshair_outlinethickness"), 1, 3, 1, 1);

    /**
     * Dot
     */
    const cl_crosshairdot = parseBool(params.get("cl_crosshairdot"), 0);

    /**
     * Color
     */
    const cl_crosshaircolor = parseNum(params.get("cl_crosshaircolor"), 0, 5, 1, 1);
    const cl_crosshaircolor_r = parseNum(params.get("cl_crosshaircolor_r"), 0, 255, 50, 1);
    const cl_crosshaircolor_g = parseNum(params.get("cl_crosshaircolor_g"), 0, 255, 250, 1);
    const cl_crosshaircolor_b = parseNum(params.get("cl_crosshaircolor_b"), 0, 255, 50, 1);

    /**
     * Alpha
     */
    const cl_crosshairusealpha = parseBool(params.get("cl_crosshairusealpha"), 1);
    const cl_crosshairalpha = parseNum(params.get("cl_crosshairalpha"), 0, 255, 200, 1);
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
    const cl_crosshair_t = parseBool(params.get("cl_crosshair_t"), 0);


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
    if (crosshairReticle === 1) {
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
     * Write out buffer
     */
    return PNG.sync.write(png);
}

/**
 * Add event listener
 */
addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
});

/**
 * Handle request
 * @param {Request} req: request object
 */
async function handleRequest(req) {
    const res = new Response(generateCrosshair(req));
    res.headers.append("Content-Type", "image/png");
    res.headers.append("Content-Disposition", "inline; filename=\"crosshair.png\"");
    res.headers.append("Cache-Control", "s-maxage=31536000");
    return res;
}
```

</details>
