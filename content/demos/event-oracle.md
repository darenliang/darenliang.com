---
title: "Event Oracle powered by Qdrant"
description: "Event oracle demo which sources event data from Polymarket and uses Qdrant as a vector database for search."
date: "0011-01-01"
showthedate: false
---

Ask a question about current or past events!

<p>Example questions:</p>
<ul>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'Will Gavin Newsom win the 2028 US Presidential Election?'; execute()">Will Gavin Newsom win the 2028 US Presidential Election?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'Will the Fed cut rates in 2025?'; execute()">Will the Fed cut rates in 2025?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'Which company has the best AI model in 2025?'; execute()">Who currently has the best AI model in 2025?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'Who will win the New York City Mayoral Election in 2025?'; execute()">Who will win the New York City Mayoral Election in 2025?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'Who will be Time\'s Person of the Year in 2025?'; execute()">Who will be Time's Person of the Year in 2025?</a></li>
</ul>

<textarea id="query" rows="4" style="width: 100%; font-family: 'Space mono';" onkeypress="handle(event)"></textarea>
<p><button onclick="execute()">Fast</button> <button onclick="execute(true)">Think</button> (Ctrl/Cmd+Enter)</p>

<div id="results"></div>
<br/>
<details>
<summary><b>Want to know how it works?</b></summary>

This demo uses [Qdrant](https://qdrant.tech/) as a vector database to store
embeddings of event data sourced from [Polymarket](https://polymarket.com/).
When you ask a question, the system retrieves relevant events from Qdrant based
on the embeddings and uses them to generate a summary response.

There might be a few additional extensions that might worth exploring:

- Add more alternative data sources for alpha research
- Use a time series database like kdb+ to store historical data to build correlation matrices and find similar events that vector search might miss
- Integrate traditional financial data sources like exchange market data to employ statistical arbitrage strategies

</details>

<link rel="stylesheet" href="https://unpkg.com/css-skeletons@1.0.7/dist/css-skeletons.min.css" />

<script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
<script>
async function execute(think = false) {
    const query = document.getElementById('query').value;
    document.getElementById('results').innerHTML = `<div class="skeleton skeleton-line" style="--lines: 4; --c-p: 0px; --c-w: 100%; --bg: #161b22;"></div>`;
    const response = await fetch(`https://oracle.darenliang.com/summary?query=${encodeURIComponent(query)}&think=${think}`);
    if (response.ok) {
        const data = await response.json();
        const converter = new showdown.Converter();
        document.getElementById('results').innerHTML = `<h3>Response</h3>${converter.makeHtml(data.summary)}`;
    } else {
        document.getElementById('results').innerHTML = '<h3>Response</h3><p>Error fetching summary.</p>';
    }
}

async function handle(event) {
    if (event.ctrlKey && event.key === "Enter") {
        await execute();
    }
}

window.execute = execute;
window.handle = handle;
</script>
