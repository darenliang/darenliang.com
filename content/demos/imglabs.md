---
title: "Imglabs.io Image Proxy Demo"
description: "Cache and transform images on the network edge with Imglabs.io"
date: "0005-01-01"
showthedate: false
nocomments: true
---

Imglabs.io is an image proxy that caches and transforms images on the network
edge. The image proxy core is written from the ground up in Rust and compiled
to WebAssembly and deployed to hundreds of edge locations around the world
to achieve industry-leading image proxying latency and performance.

Want to give a try on your website or project? You can sign up and proxy images for free
at [Imglabs.io](https://www.imglabs.io/signup).

<label>Image URL: <input type="url" id="url" style="width: 100%" placeholder="https://www.darenliang.com/img/imglabs/example.jpg"></label>
<br><button onclick="getImage()">Get Image</button>

<div id="img"></div>

<label>Width <output id="widthl">
100</output>%: <br><input id="width" type="range" min="1" max="100" value="100" oninput="document.getElementById('widthl').value = this.value"></label>

<label>Height <output id="heightl">
100</output>%: <br><input id="height" type="range" min="1" max="100" value="100" oninput="document.getElementById('heightl').value = this.value"></label>

<label>Contrast <output id="constrastl">
0</output>%: <br><input id="contrast" type="range" min="-100" max="100" value="0" oninput="document.getElementById('constrastl').value = this.value"></label>

<label>Brightness <output id="brightnessl">
0</output>: <br><input id="brightness" type="range" min="-100" max="100" value="0" oninput="document.getElementById('brightnessl').value = this.value"></label>

<label>Blur <output id="blurl">
0</output>: <br><input id="blur" type="range" min="0" max="100" value="0" oninput="document.getElementById('blurl').value = this.value"></label>

<input type="checkbox" id="grayscale" name="grayscale" value="1">
<label for="grayscale">Grayscale</label><br>
<input type="checkbox" id="invert" name="invert" value="1">
<label for="invert">Invert Colors</label>

Rotate

<input type="radio" id="r0" name="rotate" value="0" checked>
<label for="r0">No rotation</label><br>
<input type="radio" id="r90" name="rotate" value="90">
<label for="r90">90° clockwise</label><br>
<input type="radio" id="r180" name="rotate" value="180">
<label for="r180">180° clockwise</label><br>
<input type="radio" id="r270" name="rotate" value="270">
<label for="r270">270° clockwise</label>

Flip

<input type="checkbox" id="fliph" name="fliph" value="h">
<label for="fliph">Horizontal</label><br>
<input type="checkbox" id="flipv" name="flipv" value="v">
<label for="flipv">Vertical</label>

<script>
function getImage(){
    const url = encodeURIComponent(document.getElementById("url").value || "https://www.darenliang.com/img/imglabs/example.jpg");

    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;

    const contrast = document.getElementById("contrast").value;
    const brightness = document.getElementById("brightness").value;
    const blur = document.getElementById("blur").value;

    const grayscale = document.getElementById("grayscale").checked;
    const invert = document.getElementById("invert").checked;

    const r90 = document.getElementById("r90").checked;
    const r180 = document.getElementById("r180").checked;
    const r270 = document.getElementById("r270").checked;

    const fliph = document.getElementById("fliph").checked;
    const flipv = document.getElementById("flipv").checked;

    let options = "";

    if (width !== "100" || height !== "100") {
        options += `&resize=e,near,${width}%,${height}%`;
    }

    if (contrast !== "0") {
        options += `&contrast=${contrast}`;
    }

    if (brightness !== "0") {
        options += `&brighten=${brightness}`;
    }

    if (blur !== "0") {
        options += `&blur=${blur}`;
    }

    if (grayscale) {
        options += `&grayscale`;
    }

    if (invert) {
        options += `&invert`;
    }

    if (r90) {
        options += `&rotate=90`;
    }

    if (r180) {
        options += `&rotate=180`;
    }

    if (r270) {
        options += `&rotate=270`;
    }

    if (fliph) {
        options += `&flip=h`;
    }

    if (flipv) {
        options += `&flip=v`;
    }

    document.getElementById("img").innerHTML = `<img src="https://imglabs.io/?id=750511df-1a3f-43e3-b126-eedf392813b7&url=${url}${options}" />`;
}
</script>
