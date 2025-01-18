---
title: "In-browser SQL using DuckDB"
description: "Run SQL queries in the browser using DuckDB WASM"
date: "0008-01-01"
showthedate: false
---

All queries are executed in the browser using [DuckDB WASM](https://duckdb.org/docs/api/wasm/overview.html). *P.S. I mainly use this tool when I'm too lazy to set up a proper database to test SQL queries*

Feel free to come up with your own SQL queries, as everything is running at your own expense!

<p>Example queries:</p>
<ul>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'SELECT *\nFROM read_json(\'https://moneymarket.fun/data/fundYields.json\')\nWHERE category = \'Government\'\nORDER BY yield DESC'; execute()">Which US government money markets currently have the highest yield?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'SELECT\n  &quot;Primary Fur Color&quot; as fur_color,\n  COUNT() as occurrences,\n  100 * COUNT() / SUM(COUNT()) OVER() as percentage\nFROM \'https://data.cityofnewyork.us/api/views/vfnx-vebw/rows.csv\'\nWHERE &quot;Primary Fur Color&quot; IS NOT NULL\nGROUP BY &quot;Primary Fur Color&quot;'; execute()">What is the fur color breakdown for the 2018 NYC squirrel census?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'SELECT *\nFROM read_csv(\'https://data.gov.au/data/dataset/553b3049-2b8b-46a2-95e6-640d7986a8c1/resource/34076296-6692-4e30-b627-67b7c4eb1027/download/toiletmapexport_241101_074429.csv\')\nWHERE BabyChange AND Town = \'Sydney\''; execute()">Need to find a public toilet with a baby changer in Sydney, Australia?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('query').value = 'SELECT * FROM (\n  SELECT unnest(outputs, recursive:=True)\n  FROM read_parquet(\'s3://aws-public-blockchain/v1.0/btc/transactions/date=2024-04-20/part-00000-9c311aa4-8f1b-483d-9ef1-5d643c1d4de7-c000.snappy.parquet\')\n  WHERE is_coinbase AND block_number = 840000\n)\nWHERE address IS NOT NULL'; execute()">Which address mined block 840000 which marks the 4th bitcoin halving?</a></li>
</ul>

<textarea id="query" rows="8" style="width: 100%; font-family: 'Space mono';" onkeypress="handle(event)"></textarea>
<p><button onclick="execute()">Run</button> (Ctrl/Cmd+Enter)</p>

<div id="error"></div>
<div id="grid"></div>

<script src="https://unpkg.com/js-spread-grid@latest/dist/index.js"></script>

<script type="module">
import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm';

const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

const worker_url = URL.createObjectURL(
  new Blob([`importScripts("${bundle.mainWorker}");`], {type: 'text/javascript'})
);

const worker = new Worker(worker_url);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
URL.revokeObjectURL(worker_url);

const c = await db.connect(
    {
        filesystem: { allowFullHTTPReads: true }
    }
);

async function execute() {
    const query = document.getElementById("query").value;
    try {
        const result = await c.query(query);
        SpreadGrid(document.getElementById('grid'), {
            data: result.toArray().map((row) => row.toJSON()),
            columns: [
                { type: 'DATA-BLOCK', width: 'fit' },
            ]
        });
        document.getElementById('grid').style["max-height"] = '50vh';
        document.getElementById("error").textContent = '';
    } catch (e) {
        SpreadGrid(document.getElementById('grid'), {
            data: []
        });
        document.getElementById("error").textContent = e;
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
