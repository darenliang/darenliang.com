---
title: "CS:GO Crosshair Preview"
date: "0001-01-01"
showthedate: false
---

This is a simple demo which utilizes [Cloudflare Workers](https://workers.cloudflare.com/) to generate CS:GO crosshair
images.

To learn more about how this demo: [Generating Images with Serverless](/posts/generating-images-with-serverless/)

<div style="display: flex; gap: 10px;">
<div style="width: 80px; text-align: center;"><img id="image"><button id="copy" onclick="copyLink()">Copy</button></div>
<textarea id="input" style="height: 150px; width: 99%; resize: vertical; flex-grow: 1;" placeholder="Enter your crosshair commands here&#10;&#10;Example: cl_crosshairsize 2.5; cl_crosshairgap -3; cl_crosshairdot 0; cl_crosshair_drawoutline 0; cl_crosshaircolor 1; cl_crosshairthickness 1.5;  " oninput="updatePreview()"></textarea>
</div>
<p id="latency">Loaded image in: - ms</p>

Note: you can sometimes get super low image loading values, this is caused by fetching the image previously saved in
cache.

{{< script "/js/csgo-crosshair-demo.min.js" >}}
