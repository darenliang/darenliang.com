---
title: "Problems with Proxying Images"
description: "The future of serving images lies in the edge"
date: "2022-08-27"
showthedate: true
tags: [ "programming" ]
---

Let's face it. Serving images on the web sucks. You have to manage endless
formats, dimensions, variants, and more. What are some of the solutions we have
at the moment?

* [**imgproxy**](https://imgproxy.net)
* [**imgix**](https://imgix.com)
* [**ImageKit**](https://imagekit.io)
* [**Optimole**](https://optimole.com)

Let's discuss some flaws that affect each of these services.

**imgproxy** is a self-hosted solution for proxying images. The core is open
source but advanced features are paid. One major downside is that you must pay
for concurrency, making it not suitable for real-time image transformations.
Moreover, it can be expensive to self-host multiple image proxies, making it
hard to deploy image proxies to the edge, increasing latency to your users.

**imgix** and **ImageKit** are cloud services for proxying images. Both
services offer unlimited image transformations and requests. However, they
limit the number of images that can be proxied. **imgix** limits the number of
source images. **ImageKit** limits the total size of the source images.

**Optimole** is similar to previously mentioned cloud offerings, but instead of
limiting the number of images that can be proxied, it limits the total monthly
visits. If your website exceeds the monthly limit, you have to pay for more
expensive plans that increase very steeply.

### Can we do better?

Yes! Why not combine the freedom of self-hosted solutions with the ease of
cloud-based solutions?

### Introducing [Imglabs.io](https://imglabs.io)

> **Disclaimer: I'm one of the co-founders of Imglabs.io**

[Imglabs.io](https://imglabs.io) is an image proxy service that utilizes edge
computing to decrease the latency of serving
images to users all around the globe.

<div align="center">
  <img style="display: inline;" src="https://www.darenliang.com/img/imglabs/example.jpg"/>
  <img style="display: inline;" src="https://imglabs.io/?id=750511df-1a3f-43e3-b126-eedf392813b7&url=https://www.darenliang.com/img/imglabs/example.jpg&grayscale"/>
</div>

It is written as a highly optimized serverless function that aims to pass the
cost savings to users using the service.

### Why Imglabs.io?

Here are some of the benefits of using Imglabs.io:

* **Feature-full**: Imglabs.io supports a large number of image transformations
  and formats

* **Concurrency is included**: Imglabs.io is designed to scale up and down
  effortlessly through the power of serverless computing; you'll never have to
  worry about irregular request patterns or pay for reserving concurrency

* **Minimal latency**: Imglabs.io's image proxy workers run physically close to
  each user in +250 edge locations, decreasing the latency of proxying images

* **Engineered for performance**: Imglabs.io's image proxy workers are hosted
  in lightweight isolates, instead of heavyweight containers, allowing for
  blazingly fast cold starts and efficient resource usage in constrained
  compute environments

* **Global CDN**: images are cached with a global CDN at no extra cost

* **DDoS protection**: powered by [Cloudflare](https://www.cloudflare.com),
  Imglabs.io and your proxied images are protected by best-in-class DDoS
  protection

* **Bandwidth included**: whether you are serving images large or small, you'll
  never be charged for extra bandwidth usage

* **Cost-effective**: nothing is truly "unlimited", but because millions
  of transformations and requests only cost a few dollars, it's pretty darn
  cheap

* **Unlimited source images**: use as many source images as you want, the
  number of requests is all that is counted for

Imglabs.io is now in beta, and is open to anyone who wants to try out the
service! If you have any questions please direct them
to [support@imglabs.io](mailto:support@imglabs.io).
