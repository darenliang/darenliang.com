---
title: "FFmpeg.wasm YouTube Downloader"
date: "0002-01-01"
showthedate: false
---

This is a simple browser-based app (using [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
and [node-ytdl-core](https://github.com/fent/node-ytdl-core)) that allows you to download YouTube videos without the
need to use [youtube-dl](https://youtube-dl.org/) locally.

This demo is confirmed to work on modern Firefox/Chromium-based browsers.

There are four options in this demo:

* Get formats: Manually select formats to merge. If video is selected, the output will be a video. If only audio is selected, the output will be an audio file.
* Get fast video: Get a high quality video file with audio. No encoding is done.
* Get best video: Encode the highest quality video file with audio. The best video and audio files are merged into a single file.
* Get best audio: Encode the highest quality audio file.

The source code can be found [here](https://github.com/darenliang/darenliang.com/tree/master/misc/ytdl-ffmpeg-demo).

<style>
input[type="radio"]{
    margin-right: 10px;
}
</style>
<label>YouTube video URL: <input type="text" id="url" style="width: 100%"></label>
<br>
<button onclick="getFormats()">Get formats</button>
<button onclick="getFastVideo()">Get fast video</button>
<button onclick="getBestVideo()">Get best video</button>
<button onclick="getBestAudio()">Get best audio</button>
<form id="formats" action="javascript:void(0);"></form>
<div id="output" style="width: 100%"></div>
<br>
<textarea id="log" style="height: 200px; width: 99%; resize: vertical; font-size: 9px;" readonly></textarea>

{{< script "/js/ytdl-ffmpeg-demo-controller.min.js" >}}
{{< script "/js/ytdl-ffmpeg-demo.min.js" >}}
