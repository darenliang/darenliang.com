---
title: "CS:GO Crosshair Preview"
description: "Preview and customize your CS:GO crosshair settings in real-time with this interactive browser tool. Generate crosshair images instantly."
date: "0002-01-01"
showthedate: false
---

This is an interactive demo that lets you preview your CS:GO crosshair settings in real-time. Simply paste your crosshair commands and see the results instantly.

**How to use:**
1. Copy your crosshair settings from CS:GO (type `crosshair` in console to see current settings)
2. Paste the commands in the text area below
3. The crosshair preview updates automatically
4. Click "Copy" to get a shareable link to your crosshair image

To learn more about how this demo works: [Generating Images with Serverless](/posts/generating-images-with-serverless/)

<style>
@media (prefers-color-scheme: light) {
    img {
        background-color: black;
    }
}
.demo-container {
    margin: 20px 0;
}
.crosshair-preview {
    display: flex; 
    gap: 10px; 
    align-items: flex-start;
}
.crosshair-image {
    width: 80px; 
    text-align: center;
    flex-shrink: 0;
}
.crosshair-input {
    flex-grow: 1;
}
.example-commands {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    margin: 10px 0;
    font-size: 14px;
}
@media (prefers-color-scheme: dark) {
    .example-commands {
        background-color: #2d2d2d;
    }
}
</style>

<div class="demo-container">
<div class="crosshair-preview">
<div class="crosshair-image">
    <img width="64px" height="64px" id="image" alt="Crosshair preview">
    <button id="copy" onclick="copyLink()">Copy</button>
</div>
<div class="crosshair-input">
    <textarea id="input" style="height: 150px; width: 100%; resize: vertical; font-size: 14px;" placeholder="Enter your crosshair commands here&#10;&#10;Example:&#10;cl_crosshairsize 2.5; cl_crosshairgap -3; cl_crosshairdot 0; cl_crosshair_drawoutline 0; cl_crosshaircolor 1; cl_crosshairthickness 1.5;" oninput="updatePreview()"></textarea>
</div>
</div>
<p id="latency">Loaded image in: - ms</p>
</div>

<details>
<summary>Example crosshair commands</summary>
<div class="example-commands">
<strong>Classic crosshair:</strong><br>
<code>cl_crosshairsize 5; cl_crosshairgap 1; cl_crosshairdot 0; cl_crosshair_drawoutline 1; cl_crosshaircolor 1; cl_crosshairthickness 0.5;</code>
<br><br>
<strong>Dot crosshair:</strong><br>
<code>cl_crosshairsize 0; cl_crosshairgap 0; cl_crosshairdot 1; cl_crosshair_drawoutline 1; cl_crosshaircolor 2;</code>
<br><br>
<strong>Pro player style:</strong><br>
<code>cl_crosshairsize 2; cl_crosshairgap -2; cl_crosshairdot 0; cl_crosshair_drawoutline 0; cl_crosshaircolor 4; cl_crosshairthickness 1;</code>
</div>
</details>

**Note:** Image loading times can vary. Very low values (under 50ms) usually indicate the image was cached from a previous request.

{{< script "/js/csgo-crosshair-demo.min.js" >}}
