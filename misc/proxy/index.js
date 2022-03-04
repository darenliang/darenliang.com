addEventListener("fetch", event => {
    event.respondWith(fetchAndStream(event.request));
});

async function fetchAndStream(request) {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    if (!params.has("url")) {
        return new Response("400 Bad Request", {status: 400});
    }

    const response = await fetch(decodeURIComponent(params.get("url")), {
        headers: request.headers,
        redirect: "follow"
    });

    const {readable, writable} = new TransformStream();
    response.body.pipeTo(writable);

    const newResponse = new Response(readable, response);
    newResponse.headers.append("Access-Control-Allow-Origin", "https://www.darenliang.com");
    newResponse.headers.append("Access-Control-Allow-Headers", "*");
    newResponse.headers.append("Access-Control-Allow-Methods", "*");

    return newResponse;
}
