(() => {
    const counter = document.getElementById("counter");
    const url = "https://counter.darenliang.com/hit/{{ .Site.Params.counterKey }}";
    const generateAnchor = text => "<a href=\"" + url + "\">" + text + "</a>.";

    counter.innerHTML = generateAnchor("Loading hits");

    fetch(url)
        .then(data => data.json())
        .then(response => {
            counter.innerHTML = generateAnchor(`${response.value} hits`);
        })
        .catch(_ => {
            counter.innerHTML = generateAnchor("500 Internal Server Error");
        });
})();
