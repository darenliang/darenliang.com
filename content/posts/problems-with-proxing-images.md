---
title: "Problems with proxying images"
date: "2022-08-27"
showthedate: true
tags: ["programming"]
---

Let's face it. Serving images on the web suck. You have to manage endless formats, dimensions, variants, and more. What
are some of the solutions we have at the moment?

* [**imgproxy**](https://imgproxy.net)
* [**imgix**](https://imgix.com)
* [**ImageKit**](https://imagekit.io)
* [**Optimole**](https://optimole.com)

Let's discuss some flaws that affect each of these services.

**imgproxy** is a self-hosted solution for proxying images. The core is open source but advanced features are paid. One
major downside is that you must pay for concurrency, making it not suitable for real-time
image transformations. Moreover, it can be expensive to self-host multiple image proxies, making it hard to deploy image
proxies to the edge, increasing latency to your users.

**imgix** and **ImageKit** are cloud services for proxying images. Both services offer unlimited image transformations
and requests. However, they limit the number of images that can be proxied. **imgix** limits the number of source
images. **ImageKit** limits the total size of the source images.

**Optimole** is similar to previously mentioned cloud offerings, but instead of limiting the number of images that can
be proxied, it limits the total monthly visits. If your website exceeds the monthly limit, you have to pay for more
expensive plans that increase very steeply.

### Can we do better?

Yes! Why not combine the freedom of self-hosted solutions with the ease of cloud-based solutions?

### Introducing [imglabs.io](https://imglabs.io)

> **disclaimer: I'm one of the co-founders of imglabs.io**

[imglabs.io](https://imglabs.io) is an image proxy service that utilizes edge computing to decrease latency of serving
images to users all around the globe.

<div align="center">
  <img style="display: inline;" src="https://picsum.photos/seed/picsum/300/200"/>
  <img style="display: inline;" src="https://imglabs.io/?id=750511df-1a3f-43e3-b126-eedf392813b7&url=https://picsum.photos/seed/picsum/300/200&grayscale"/>
</div>

It is written as a highly optimized serverless function that aims to pass the cost savings to users using the service.

Here are some of the benefits of using imglabs.io:

* **Feature-full**: imglabs.io supports a large number of image transformations and formats
* **Concurrency is included**: the image proxy can scale up and down effortlessly through the power of serverless
  computing
* **Minimal latency**: each function runs physically close to each user in hundreds of locations, dramatically
  decreasing the latency of proxying
  images
* **Global CDN**: images are cached with a global CDN with no extra cost
* **DDoS protection**: powered by [Cloudflare](https://www.cloudflare.com), imglabs.io and your proxied images are
  protected by best-in-class DDoS
  protection
* **Bandwidth included**: whether you are serving images large or small, you'll never be charged for extra bandwidth
  usage
* **Cheap transformations**: nothing is truly "unlimited", but because millions of transformations and requests only
  costs a few dollars, its pretty darn cheap
* **Unlimited source images**: use as many source images as you want, the number of requests is all that is counted for

imglabs.io is now in alpha, and is open to anyone who wants to try out the service! If you have any questions please
direct them to [support@imglabs.io](mailto:support@imglabs.io).
