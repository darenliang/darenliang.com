---
title: "FFmpeg.wasm YouTube Downloader"
date: "0002-01-01"
showthedate: false
---

This is a simple browser-based app (using [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
and [node-ytdl-core](https://github.com/fent/node-ytdl-core)) that allows you to download YouTube videos without the
need to use [youtube-dl](https://youtube-dl.org/) locally.

There are two options in this demo:

* Get video: gets the best mp4 video+audio file available
* Get best video: encode the best possible mp4 file
* Get audio: encode the best possible mp3 file

The source code can be found [here](https://github.com/darenliang/darenliang.com/tree/master/misc/ytdl-ffmpeg-demo).

<div>
    <label>YouTube video URL: <input type="text" id="url" style="width: 100%"></label>
    <br>
    <button onclick="getVideo()">Get video</button>
    <button onclick="getBestVideo()">Get best video</button>
    <button onclick="getAudio()">Get best audio</button>
    <br>
</div>

<video id="player" width="100%" controls></video>

<textarea id="log" style="height: 150px; width: 99%; resize: vertical; font-size: 9px;" readonly></textarea>

{{< script "/js/ytdl-ffmpeg-demo-controller.min.js" >}}
{{< script "/js/ytdl-ffmpeg-demo.min.js" >}}
