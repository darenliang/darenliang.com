---
title: "FFmpeg.wasm YouTube Downloader Demo"
showthedate: false
---

This is a simple browser-based app (using [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
and [node-ytdl-core](https://github.com/fent/node-ytdl-core)) that allows you to download YouTube videos without the
need to use [youtube-dl](https://youtube-dl.org/).

To use this demo, you must disable CORS in your browser.

The easiest way is to install a web extension such as CORS Unblock.

* Chrome: https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?hl=en
* Firefox: https://addons.mozilla.org/en-CA/firefox/addon/cors-unblock/

There are two options in this demo:

* Get video: gets the best mp4 video+audio file available
* Get best video: encode the best possible mp4 file
* Get audio: encode the best possible mp3 file

To check the progress you can open up DevTools and look at the console output.

Although I'll highly likely publish the source code in the near future, please contact me at daren@darenliang.com if you
want to inquire about it.

<style>
input, textarea, button {
  margin: 3px 0;
  font-family: 'Noto Sans Mono', monospace;
}

@media (prefers-color-scheme: dark) {
  input, textarea, button {
    border: 1px solid white;
    background-color: black;
    color: white;
  }
}

@media (prefers-color-scheme: light) {
  input, textarea, button {
    border: 1px solid black;
  }
}
</style>

<div class="boxed">
    <label>YouTube video URL: <input type="text" id="url" style="width: 100%"></label>
    <br>
    <button onclick="getVideo()">Get video</button>
    <button onclick="getBestVideo()">Get best video</button>
    <button onclick="getAudio()">Get best video</button>
</div>

<video id="player" width="100%" controls></video>

<script src="/js/ffmpeg-wasm-demo-controller.js?v=1.0.4"></script>
<script src="/js/ffmpeg-wasm-demo.js?v=1.0.4"></script>
