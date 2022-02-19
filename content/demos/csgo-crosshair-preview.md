---
title: "CS:GO Crosshair Preview"
showthedate: false
---

This is a simple demo which utilizes [Cloudflare Workers](https://workers.cloudflare.com/) to generate CS:GO crosshair
images.

To learn more about how this demo: [Generating Images with Serverless](/posts/generating-images-with-serverless/)

<div style="display: flex;">
<div style="width: 70px; height: 70px;"><img id="image"></div>
<textarea id="input" style="height: 100px; width: 99%; resize: vertical; flex-grow: 1;" placeholder="Enter your crosshair commands here" oninput="updatePreview()"></textarea>
</div>
<p id="latency">Loaded image in: - ms</p>

Note: you can sometimes get super low image loading values, this is caused by fetching the image previously saved in
cache.

<script src="/js/csgo-crosshair-demo.js?v=1.0.0"></script>
