---
title: "Query Financial Data"
description: "Run SQL queries on financial data in the browser using DuckDB WASM"
date: "0010-01-01"
showthedate: false
---

All queries are executed in the browser
using [DuckDB WASM](https://duckdb.org/docs/api/wasm/overview.html) on
all [10-Qs since January 2009](https://www.sec.gov/data-research/sec-markets-data/financial-statement-data-sets).

<p id="loader">Loading dataset</p>

## Get financials for a period

<div>
Ticker: <input type="text" id="ticker" />
<button onclick="searchPeriods()">Search Periods</button>
Period: <select id="period"><option value="volvo">N/A</option></select>
<button onclick="queryFinancials()">Get Financials</button>
</div>
<br>
<div id="grid"></div>

<script src="https://unpkg.com/js-spread-grid@latest/dist/index.js"></script>
<script src="https://cdn.plot.ly/plotly-3.1.0.min.js" charset="utf-8"></script>

## Graph financials over time

<p>Example queries:</p>
<ul>
    <li><a href="javascript:void(0);" onclick="document.getElementById('ticker').value = 'NVDA'; document.getElementById('query').value = `(   Revenues
  - CostOfRevenue
  - SellingGeneralAndAdministrativeExpense
  - ResearchAndDevelopmentExpense
  + COALESCE(NonoperatingIncomeExpense, OtherNonoperatingIncomeExpense)
  - IncomeTaxExpenseBenefit
) / Revenues`; execute()">What is NVIDIA's net profit margin?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('ticker').value = 'COST'; document.getElementById('query').value = `(   COALESCE(RevenueFromContractWithCustomerExcludingAssessedTax, Revenues)
  - CostOfGoodsAndServicesSold
  - SellingGeneralAndAdministrativeExpense
  - IncomeTaxExpenseBenefit
  + InterestAndOtherIncome
  - InterestExpense
) / COALESCE(RevenueFromContractWithCustomerExcludingAssessedTax, Revenues)`; execute()">What is Costco's net profit margin?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('ticker').value = 'MSTR'; document.getElementById('query').value = 'PaymentsToAcquireIntangibleAssets'; execute()">How much is Strategy spending to acquire Bitcoin?</a></li>
    <li><a href="javascript:void(0);" onclick="document.getElementById('ticker').value = 'AAPL'; document.getElementById('query').value = 'WeightedAverageNumberOfSharesOutstandingBasic'; execute()">When has Apple performed stock splits and stock buybacks?</a></li>
</ul>

<textarea id="query" rows="8" style="width: 100%; font-family: 'Space mono';" onkeypress="handle(event)"></textarea>
<p><button onclick="execute()">Run</button> (Ctrl/Cmd+Enter)</p>

<div id="graph"></div>

<script type="module">
import * as duckdb
  from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm";

const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

const worker_url = URL.createObjectURL(new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" }));

const worker = new Worker(worker_url);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
URL.revokeObjectURL(worker_url);

const c = await db.connect({
  filesystem: { allowFullHTTPReads: true }
});

const data_url = "https://sec-data.darenliang.com";

async function fetchFilenames() {
  const response = await fetch(`${data_url}/manifest.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch manifest");
  }
  return await response.json();
}

const filenames = await fetchFilenames();

async function init() {
  for (const filename of filenames) {
    document.getElementById("loader").textContent = `Loading dataset: ${filename}`;
    const resp = await fetch(`${data_url}/${filename}`);
    if (!resp.ok) {
      alert(`Failed to fetch dataset: ${filename}`);
      throw new Error(`Failed to fetch dataset: ${filename}`);
    }
    await db.registerFileBuffer(`/parquet/${filename}`, new Uint8Array(await resp.arrayBuffer()));
  }
  await c.query(`CREATE VIEW data AS
  SELECT *
  FROM read_parquet('/parquet/*.parquet')`);
  document.getElementById("loader").textContent = "Loaded dataset";
}

await init();

async function searchPeriods() {
  const ticker = document.getElementById("ticker").value.toUpperCase();
  try {
    const result = await c.query(`
      SELECT DISTINCT ddate
      FROM data
      WHERE ticker = '${ticker}'
      ORDER BY ddate DESC
    `);
    const periods = result.toArray().map((row) => row.toJSON()["ddate"]);
    if (periods.length === 0) {
      throw new Error(`No data found for ticker: ${ticker}`);
    }
    const periodSelect = document.getElementById("period");
    periodSelect.innerHTML = "";
    for (const period of periods) {
      const option = document.createElement("option");
      option.value = period;
      option.textContent = period;
      periodSelect.appendChild(option);
    }
  } catch (e) {
    SpreadGrid(document.getElementById("grid"), {
      data: []
    });
    window.alert(e);
  }
}

async function queryFinancials() {
  const ticker = document.getElementById("ticker").value.toUpperCase();
  const period = document.getElementById("period").value;
  try {
    const result = await c.query(`
      SELECT tag AS metric, first (value) AS value
      FROM data
      WHERE ticker = '${ticker}' AND ddate = ${period}
      GROUP BY tag, rqtr
        QUALIFY ROW_NUMBER() OVER (PARTITION BY tag ORDER BY rqtr DESC) = 1
      ORDER BY tag
    `);
    SpreadGrid(document.getElementById("grid"), {
      data: result.toArray().map((row) => row.toJSON()),
      columns: [{ type: "DATA-BLOCK", width: "fit" }]
    });
    document.getElementById("grid").style["max-height"] = "50vh";
  } catch (e) {
    SpreadGrid(document.getElementById("grid"), {
      data: []
    });
    window.alert(e);
  }
}

async function execute() {
  const ticker = document.getElementById("ticker").value.toUpperCase();
  const query = document.getElementById("query").value;
  try {
    const result = await c.query(`
      SELECT ddate, (${query}) AS metric_value
      FROM (
             PIVOT(SELECT * FROM data WHERE ticker = '${ticker}' QUALIFY ROW_NUMBER() OVER (PARTITION BY ticker, tag, ddate ORDER BY rqtr DESC) = 1) ON tag
                USING first(value)
             )
      WHERE metric_value IS NOT NULL
      ORDER BY ddate
    `);
    Plotly.newPlot("graph", [{
      x: result.toArray().map((row) => {
        const ddate = row.toJSON()["ddate"].toString();
        return `${ddate.slice(0, 4)}-${ddate.slice(4, 6)}-${ddate.slice(6, 8)} 00:00:00`;
      }),
      y: result.toArray().map((row) => row.toJSON()["metric_value"]),
      type: "scatter"
    }]);
  } catch (e) {
    Plotly.purge("graph");
    window.alert(e);
  }
}

async function handle(event) {
  if (event.ctrlKey && event.key === "Enter") {
    await execute();
  }
}

window.searchPeriods = searchPeriods;
window.queryFinancials = queryFinancials;
window.execute = execute;
window.handle = handle;
</script>
