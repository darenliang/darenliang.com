const weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
});

class Rewriter {
    constructor(content) {
        this.content = content;
    }

    element(element) {
        element.setInnerContent(this.content, {html: true});
    }
}

function isImperial(country) {
    switch (country) {
        case "United States of America":
        case "Palau":
        case "Cayman Islands":
        case "Liberia":
            return true;
        default:
            return false;
    }
}

function localeTemp(temp, isImperial) {
    if (isImperial) {
        return `${((temp * 9 / 5) + 32).toFixed(0)}°F`;
    } else {
        return `${temp}°C`;
    }
}

function localeSpeed(speed, isImperial) {
    if (isImperial) {
        return `${(speed / 1.60934).toFixed(0)} mph`;
    } else {
        return `${speed} km/h`;
    }
}

function localePrecipitation(precipitation, isImperial) {
    if (isImperial) {
        return `${(precipitation / 2.54).toFixed(1)} in`;
    } else {
        return `${precipitation} mm`;
    }
}

function isDay(day) {
    return day === "yes";
}

function titleCase(str) {
    const splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
}

/**
 * https://weatherstack.com/site_resources/weatherstack-weather-condition-codes.zip
 * @param {number} code
 * @param {boolean} day
 */
function weatherCodeEmoji(code, day = true) {
    switch (code) {
        case 113:
            return day ? "☀️" : "🌙";
        case 116:
            return day ? "⛅" : "🌙";
        case 119:
        case 122:
            return "☁️";
        case 143:
        case 248:
        case 260:
            return "🌫️";
        case 176:
        case 263:
        case 266:
        case 293:
        case 296:
        case 299:
        case 302:
        case 305:
        case 308:
        case 353:
        case 356:
        case 359:
            return "🌧️";
        case 179:
        case 182:
        case 185:
        case 227:
        case 230:
        case 281:
        case 284:
        case 311:
        case 314:
        case 317:
        case 320:
        case 323:
        case 326:
        case 329:
        case 332:
        case 335:
        case 338:
        case 350:
        case 362:
        case 365:
        case 368:
        case 371:
        case 374:
        case 377:
            return "🌨️";
        case 200:
        case 386:
        case 389:
        case 392:
        case 395:
            return "⛈️";
        default:
            return "❔";
    }
}

async function generateContent(request) {
    const clientIP = request.headers.get("CF-Connecting-IP");
    const apiStartTime = Date.now();
    const data = await fetch(`https://weatherstack.com/ws_api.php?ip=${clientIP}`);
    const apiTime = Date.now() - apiStartTime;
    const json = await data.json();

    let content = "";
    content += `<p>${json.location.name}, ${json.location.region}, ${json.location.country}<br>`;

    const time = new Date(json.location.localtime_epoch * 1000);
    const currentTime = new Date((new Date()).toLocaleString("en-US", {timeZone: json.location.timezone_id}));
    const minutesAgo = Math.floor((currentTime - time) / 60000);
    content += `${time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timezone: "UTC"
    })} (${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago)</p>`;

    content += "<table class=\"weather-table\">";
    content += `<tr><td><b>Weather</b></td><td><b>Wind</b></td></tr>`;
    content += `<tr><td>${weatherCodeEmoji(json.current.weather_code, isDay(json.current.is_day))} ${titleCase(json.current.weather_descriptions[0])}</td><td>${json.current.wind_dir} <span title="${localeSpeed(json.current.wind_speed, !isImperial(json.location.country))}">${localeSpeed(json.current.wind_speed, isImperial(json.location.country))}</span></td></tr>`;
    content += `<tr><td><b>Temperature</b></td><td><b>Humidity</b></td></tr>`;
    content += `<tr><td><span title="${localeTemp(json.current.temperature, !isImperial(json.location.country))}">${localeTemp(json.current.temperature, isImperial(json.location.country))}</span></td><td>${json.current.humidity}%</td></tr>`;
    content += `<tr><td><b>Feels Like</b></td><td><b>Precipitation</b></td></tr>`;
    content += `<tr><td><span title="${localeTemp(json.current.feelslike, !isImperial(json.location.country))}">${localeTemp(json.current.feelslike, isImperial(json.location.country))}</span></td><td><span title="${localePrecipitation(json.current.precip, !isImperial(json.location.country))}">${localePrecipitation(json.current.precip, isImperial(json.location.country))}</span></td></tr>`;
    content += "</table><br>";

    content += "<table class=\"weather-table\">";
    let dayRow = "";
    let emojiRow = "";
    let maxTempRow = "";
    let avgTempRow = "";
    let minTempRow = "";
    for (const key in json.forecast) {
        const date = new Date(key);
        dayRow += `<td><b>${weekday[date.getDay()]}</b></td>`;

        const forecast = json.forecast[key];
        emojiRow += `<td><span title="${titleCase(forecast.hourly[0].weather_descriptions[0])}">${weatherCodeEmoji(forecast.hourly[0].weather_code)}</span></td>`;
        maxTempRow += `<td><span title="${localeTemp(forecast.maxtemp, !isImperial(json.location.country))}">${localeTemp(forecast.maxtemp, isImperial(json.location.country))}</span></td>`;
        avgTempRow += `<td><span title="${localeTemp(forecast.avgtemp, !isImperial(json.location.country))}">${localeTemp(forecast.avgtemp, isImperial(json.location.country))}</span></td>`;
        minTempRow += `<td><span title="${localeTemp(forecast.mintemp, !isImperial(json.location.country))}">${localeTemp(forecast.mintemp, isImperial(json.location.country))}</span></td>`;
    }

    content += `<tr>${dayRow}</tr><tr>${emojiRow}</tr><tr>${maxTempRow}</tr><tr>${avgTempRow}</tr><tr>${minTempRow}</tr></table>`;
    content += "<details><summary>Connection Details</summary>";
    content += `<p>Request IP: ${clientIP}<br>`;
    content += `Request from: ${request.cf.asOrganization} (AS${request.cf.asn})<br>`;
    content += `Request handled: ${request.cf.colo}<br>`;
    content += `API latency: ${apiTime} ms<br>`;
    return content;
}

/**
 * Rewrite HTML
 * @param {Request} request
 */
async function handleRequest(request) {
    const response = await fetch(request);
    const contentType = response.headers.get("Content-Type");

    if (!contentType.startsWith("text/html")) {
        return response;
    }

    let content;
    try {
        content = await generateContent(request);
    } catch {
        content = "500 Internal Server Error";
    }

    const rewriter = new HTMLRewriter()
        .on("div#weather", new Rewriter(content));

    return rewriter.transform(response);
}
