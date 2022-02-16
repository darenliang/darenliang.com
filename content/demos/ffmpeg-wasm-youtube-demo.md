---
title: "FFmpeg.wasm YouTube Downloader Demo"
showthedate: false
---

This is a simple browser-based app (using [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
and [node-ytdl-core](https://github.com/fent/node-ytdl-core)) that allows you to download YouTube videos without the
need to use [youtube-dl](https://youtube-dl.org/).

To use this demo, you **must disable CORS** in your browser.

The easiest way is to install a web extension such as CORS Unblock.

* Chrome: [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?hl=en)
* Firefox: I don't think there is a way to disable CORS at the moment. Here is
  a [Hacker News post](https://news.ycombinator.com/item?id=18595258) relating to the issue.

There are two options in this demo:

* Get video: gets the best mp4 video+audio file available
* Get best video: encode the best possible mp4 file
* Get audio: encode the best possible mp3 file

To check the progress you can open up DevTools and look at the console output.

Although I'll highly likely publish the source code in the near future, please contact me at daren@darenliang.com if you
want to inquire about it.

<div class="boxed">
    <label>YouTube video URL: <input type="text" id="url" style="width: 100%"></label>
    <br>
    <button onclick="getVideo()">Get video</button>
    <button onclick="getBestVideo()">Get best video</button>
    <button onclick="getAudio()">Get best audio</button>
</div>

<video id="player" width="100%" controls></video>

<script src="/js/ffmpeg-wasm-demo-controller.js?v=1.0.4"></script>
<script src="/js/ffmpeg-wasm-demo.js?v=1.0.7"></script>
