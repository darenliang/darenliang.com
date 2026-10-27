---
title: "Managed Futures ETFs Review"
description: "This post analyzes the underlying holdings of managed futures ETFs."
date: "2026-10-19"
showthedate: true
tags: [ "finance" ]
---

The ten funds, in the order they appear in every chart legend:

* **DBMF** — iMGP DBi Managed Futures Strategy ETF
* **CTA** — Simplify Managed Futures Strategy ETF
* **KMLM** — KraneShares Mount Lucas Managed Futures Index Strategy ETF
* **FFUT** — Fidelity Managed Futures ETF
* **IMF** — Invesco Managed Futures Strategy ETF
* **FMF** — First Trust Managed Futures Strategy Fund
* **WTMF** — WisdomTree Managed Futures Strategy Fund
* **ISMF** — iShares Managed Futures Active ETF
* **ASMF** — Virtus AlphaSimplex Managed Futures ETF
* **HFMF** — Unlimited HFMF Managed Futures ETF

All figures show net notional exposure as a percentage of NAV (negative =
short), sourced from fund holdings and N-CSR filings. Hover over the bars for
exact values, and click a fund in the legend to isolate it.

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js" charset="utf-8"></script>
<script src="/js/chart-theme.js"></script>

<script>
const funds = ["DBMF","CTA","KMLM","FFUT","IMF","FMF","WTMF","ISMF","ASMF","HFMF"];
const fundColors = ["#1f4e79","#c0392b","#2e7d32","#e67e22","#6c3483","#16a085","#f1c40f","#7f8c8d","#27ae60","#a04000"];
</script>

## Equity Exposure by Country / Region

In general, I'm a bit skeptical of non-zero net equity exposure in managed
futures ETFs, as managed futures strategies are designed to be diversifiers
with low correlation to equities.

A market neutral approach to equities is often preferred, harvesting known risk
premia such as value, momentum, and quality, however such strategies are too
complex to be implemented in a simple ETF wrapper. So bonus points go to CTA
and KMLM for having zero net equity exposure. Most ETFs have small net equity
exposure, with the exception of DBMF which has a large overweight to US
equities and IMF which has a significant position in European equities.

<div id="graph"></div>

<script>
const equity = {
  categories: ["Emerging Markets","Australia","Canada","Europe","Japan","United States"],
  values: {
    DBMF: [6,-0.6,-0.4,-5.2,-1.8,44],
    CTA: [0,0,0,0,0,0],
    KMLM: [0,0,0,0,0,0],
    FFUT: [4.3,-0.1,1.3,3.8,0.8,0.1],
    IMF: [3.7,-0.5,5.7,20,3.4,8.3],
    FMF: [1.9,-0.5,2,1,2.6,6.5],
    WTMF: [0,0,5.7,7.4,7.6,7.6],
    ISMF: [3.4,0,0,1.9,2.9,6.1],
    ASMF: [4.8,-1.4,0,7.6,9.3,11.6],
    HFMF: [0,0,0,0,-5.8,2.2],
  }
};

Plotly.newPlot("graph", funds.map((fund, i) => ({
  x: equity.values[fund],
  y: equity.categories,
  type: "bar",
  orientation: "h",
  name: fund,
  marker: {
    color: fundColors[i]
  },
  hovertemplate: `<b>${fund}</b><br>%{y}: %{x:.1f}% of NAV<extra></extra>`
})), {
  font: {
    family: "Commit Mono",
    size: 12
  },
  barmode: "group",
  bargap: 0.14,
  bargroupgap: 0.04,
  height: 620,
  xaxis: {
    ticksuffix: "%",
    automargin: true,
    range: [-10, 46]
  },
  yaxis: {
    showgrid: false,
    zeroline: false,
    automargin: true
  }
});
</script>

## US Treasury Futures Exposure by Duration

Unlike equities, managed futures with significant net exposure to US Treasuries
is often preferred. Harvesting the persistence of long term trends in US
Treasuries is a common strategy for managed futures. This is why I like DBMF
and CTA for their large net (short) exposure to US Treasuries. Other managed
futures ETFs have too little net exposure which limits their value add as
diversifiers to equities.

<div id="graph2"></div>

<script>
const ustDuration = {
  categories: ["2Y","5Y","10Y","20Y+"],
  values: {
    DBMF: [-98,0,-82,-22],
    CTA: [-93.9,0,-90.4,0],
    KMLM: [0,0,-26.2,0],
    FFUT: [-12.5,-16.9,-6.4,-7],
    IMF: [-7.9,-7.9,-9,-5.3],
    FMF: [-12.1,-7.2,-6,-6.5],
    WTMF: [12.5,0,-5.3,5.3],
    ISMF: [0,0,0,0],
    ASMF: [-38.1,0,-33.7,-15.2],
    HFMF: [0,0,0,-47.2],
  }
};

Plotly.newPlot("graph2", funds.map((fund, i) => ({
  x: ustDuration.categories,
  y: ustDuration.values[fund],
  type: "bar",
  orientation: "v",
  name: fund,
  marker: {
    color: fundColors[i]
  },
  hovertemplate: `<b>${fund}</b><br>%{x}: %{y:.1f}% of NAV<extra></extra>`
})), {
  font: {
    family: "Commit Mono",
    size: 12
  },
  barmode: "group",
  bargap: 0.14,
  bargroupgap: 0.04,
  yaxis: {
    ticksuffix: "%",
    automargin: true,
    range: [-118, 22]
  },
  xaxis: {
    showgrid: false,
    zeroline: false,
    automargin: true
  }
});
</script>

## Bond Exposure by Country

Here again, DBMF and CTA stand out for their large net (short) exposure to
bonds. But KMLM and FFUT also have significant net exposures as well. FFUT in
particular has a very diversified and varied exposure to bonds across many
countries and regions which is compelling.

<div id="graph3"></div>

<script>
const bondCountry = {
  categories: ["South Korea","Italy","France","Australia","Canada","Japan","United Kingdom","Germany","United States"],
  values: {
    DBMF: [0,0,0,0,0,0,0,0,-202],
    CTA: [0,0,0,0,0,0,0,0,-184.3],
    KMLM: [0,0,0,0,-26.2,-25.9,-26,-25.9,-26.2],
    FFUT: [6,-2.5,1.5,-41,-1.3,22.2,-2.8,-36.3,-42.8],
    IMF: [0,-5.5,-8.4,-15.8,-9,0,-7,-27.8,-30.1],
    FMF: [0,0,0,0,-3.7,-7.9,-2.9,-27.8,-31.9],
    WTMF: [0,0,0,0,0,0,0,0,12.5],
    ISMF: [0,0,0,-13.6,12.3,-39,8,-4.6,0],
    ASMF: [0,0,0,0,0,0,-25.5,-48.2,-87],
    HFMF: [0,0,0,0,0,0,0,0,-47.2],
  }
};

Plotly.newPlot("graph3", funds.map((fund, i) => ({
  x: bondCountry.values[fund],
  y: bondCountry.categories,
  type: "bar",
  orientation: "h",
  name: fund,
  marker: {
    color: fundColors[i]
  },
  hovertemplate: `<b>${fund}</b><br>%{y}: %{x:.1f}% of NAV<extra></extra>`
})), {
  font: {
    family: "Commit Mono",
    size: 12
  },
  barmode: "group",
  bargap: 0.14,
  bargroupgap: 0.04,
  height: 620,
  xaxis: {
    ticksuffix: "%",
    automargin: true,
    range: [-225, 32]
  },
  yaxis: {
    showgrid: false,
    zeroline: false,
    automargin: true
  }
});
</script>

## Currency Exposure

ASMF is the undisputed winner for currency exposure, with large net positions
in various currencies. KMLM also looks really good, and DBMF has significant
exposure, but they look somewhat unbalanced with a large net short exposure to
the Euro.

<div id="graph4"></div>

<script>
const currency = {
  categories: ["Other DM","EM FX","NZD","AUD","CAD","CHF","GBP","JPY","EUR"],
  values: {
    DBMF: [0,0,0,0,0,0,0,3,-69],
    CTA: [0,0,0,0,0,0,0,0,0],
    KMLM: [0,0,0,15,-16.6,-16.6,-16.6,-16.4,-16.3],
    FFUT: [-27.6,-14,0.8,-9.9,15.3,3.8,-3.9,-4.4,-3.9],
    IMF: [0,0,-3.9,7.6,-1.8,-1.4,6.1,-6,2.7],
    FMF: [0,0.9,-3.2,2.8,-11.7,-11.1,0,-7.3,-7.2],
    WTMF: [0,10.3,0,0,0,0,0,0,0],
    ISMF: [22.8,7.2,-25.3,5.7,-15.3,0.4,8.4,-15.1,-0.3],
    ASMF: [0,0,0,12.1,-42.1,0,-10.8,-12,-36.1],
    HFMF: [0,0,0,0.2,0,0,-2.1,-12.2,-1],
  }
};

Plotly.newPlot("graph4", funds.map((fund, i) => ({
  x: currency.values[fund],
  y: currency.categories,
  type: "bar",
  orientation: "h",
  name: fund,
  marker: {
    color: fundColors[i]
  },
  hovertemplate: `<b>${fund}</b><br>%{y}: %{x:.1f}% of NAV<extra></extra>`
})), {
  font: {
    family: "Commit Mono",
    size: 12
  },
  barmode: "group",
  bargap: 0.14,
  bargroupgap: 0.04,
  height: 620,
  xaxis: {
    ticksuffix: "%",
    automargin: true
  },
  yaxis: {
    showgrid: false,
    zeroline: false,
    automargin: true
  }
});
</script>

## Commodity Exposure by Sector

All ETFs maintain positive net exposure to energy which is mostly all that
matters in this current regime with the situation in the Middle East. But CTA
stands out for having a gigantic net long exposure to energy. I personally
believe it is a matter of personal taste whether to favor such large net
exposures or to go for a more balanced approach. I personally prefer a more
balanced approach, but CTA is the go-to ETF for extreme commodity exposure.

<div id="graph5"></div>

<script>
const commodities = {
  categories: ["Livestock","Softs","Agriculture","Precious Metals","Industrial Metals","Energy"],
  values: {
    DBMF: [0,0,0,4,0,20],
    CTA: [0,14.2,13.6,0,8.2,85.4],
    KMLM: [-3.7,7.7,16.2,-6.9,6.9,15.1],
    FFUT: [-0.5,-0.4,-4.6,1.8,9.5,15.9],
    IMF: [0,0,9.9,4.9,6.4,7.6],
    FMF: [-4.4,1,0.1,2,0.1,17.2],
    WTMF: [0.6,0.6,1.7,1.2,2.9,2.9],
    ISMF: [0,0,-1.9,5.3,-0.6,6.3],
    ASMF: [0,0,4.6,-2.5,5.4,11.2],
    HFMF: [-4.5,1.2,5.7,0,10.7,17.4],
  }
};

Plotly.newPlot("graph5", funds.map((fund, i) => ({
  x: commodities.values[fund],
  y: commodities.categories,
  type: "bar",
  orientation: "h",
  name: fund,
  marker: {
    color: fundColors[i]
  },
  hovertemplate: `<b>${fund}</b><br>%{y}: %{x:.1f}% of NAV<extra></extra>`
})), {
  font: {
    family: "Commit Mono",
    size: 12
  },
  barmode: "group",
  bargap: 0.14,
  bargroupgap: 0.04,
  height: 620,
  xaxis: {
    ticksuffix: "%",
    automargin: true
  },
  yaxis: {
    showgrid: false,
    zeroline: false,
    automargin: true
  }
});
</script>

## Net Exposure by Asset Class

A good hallmark of a managed futures ETF is to have a good net exposure to all
asset classes. Ultimately you're paying a pretty significant management fee for
this exposure, you better to be sure getting it. With this perspective in mind,
I personally like DBMF, KMLM and CTA.

<div id="graph6"></div>

<script>
const assetClass = {
  categories: ["Commodities","Currencies","Bonds","Equities"],
  values: {
    DBMF: [24,-66,-202,42],
    CTA: [121.4,0,-184.3,0],
    KMLM: [35.3,-67.5,-130.1,0],
    FFUT: [21.7,-43.8,-97,10.2],
    IMF: [28.8,3.2,-103.5,40.6],
    FMF: [16.1,-36.8,-74.1,13.5],
    WTMF: [9.9,10.3,12.5,28.3],
    ISMF: [9.2,-11.4,-36.9,14.3],
    ASMF: [18.7,-88.8,-160.7,32],
    HFMF: [30.5,-15.1,-47.2,-3.6],
  }
};

Plotly.newPlot("graph6", funds.map((fund, i) => ({
  x: assetClass.values[fund],
  y: assetClass.categories,
  type: "bar",
  orientation: "h",
  name: fund,
  marker: {
    color: fundColors[i]
  },
  hovertemplate: `<b>${fund}</b><br>%{y}: %{x:.1f}% of NAV<extra></extra>`
})), {
  font: {
    family: "Commit Mono",
    size: 12
  },
  barmode: "group",
  bargap: 0.14,
  bargroupgap: 0.04,
  height: 620,
  xaxis: {
    ticksuffix: "%",
    automargin: true,
    range: [-225, 140]
  },
  yaxis: {
    showgrid: false,
    zeroline: false,
    automargin: true
  }
});
</script>

Ultimately, I personally like KMLM as it has zero exposure to equities and has
a balanced exposure across other asset classes. But DBMF and CTA are compelling
choices as well. DBMF is good to limit risk in a particular strategy with its
returns replication approach, while CTA has a more aggressive approach with its
large net exposure to commodities. But recent changes to CTA's management
brings some uncertainty to the fund's future performance.