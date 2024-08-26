addEventListener("fetch", event => {
    event.respondWith(fetchAndStream(event.request));
});

async function fetchAndStream(request) {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    if (!params.has("url")) {
        return new Response("400 Bad Request", {status: 400});
    }
    
    if (request.method === "OPTIONS") {
        const response = new Response();
        response.headers.append("Access-Control-Allow-Origin", "https://www.darenliang.com");
        response.headers.append("Access-Control-Allow-Headers", "*");
        response.headers.append("Access-Control-Allow-Methods", "*");
        response.status = 200;
        return response
    }

    const requestInit = {
        method: request.method,
        headers: request.headers,
        redirect: "follow"
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
        requestInit.body = request.body;
    }

    const response = await fetch(decodeURIComponent(params.get("url")), requestInit);

    const {readable, writable} = new TransformStream();
    response.body.pipeTo(writable);

    const newResponse = new Response(readable, response);
    newResponse.headers.append("Access-Control-Allow-Origin", "https://www.darenliang.com");
    newResponse.headers.append("Access-Control-Allow-Headers", "*");
    newResponse.headers.append("Access-Control-Allow-Methods", "*");

    return newResponse;
}
