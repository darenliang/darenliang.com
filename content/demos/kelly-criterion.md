---
title: "Kelly Criterion"
description: "Compute the Kelly Criterion right in your browser"
date: "0001-01-01"
showthedate: false
---

The Kelly Criterion is a formula that determines the optimal theoretical size for a bet.[^1]

General formula:
<p>
    \[
        f^* = p - \frac{q}{b} = p + \frac{p-1}{b}
    \]
</p>
where:

* <p>\( f^* \): is the fraction of the current bankroll to wager</p>
* <p>\( p \): is the probability of a win</p>
* <p>\( q \): is the probability of a loss \( (q = 1 - p) \)</p>
* <p>\( b \): is the proportion of the bet gained with a win (\( 1 \) means you will gain the same amount you bet)</p>

<div class="boxed">
<h3>Simple Calculator</h3>
<div style="margin: 10px 0">
    <label>Probability of a win: <input type="text" id="winPercentage" placeholder="Example: 0.5"></label>
    <br>
    <label>Proportion of the bet gained with a win: <input type="text" id="winProportion" placeholder="Example: 1.2"></label>
    <br>
    <button onclick="calculate()">Calculate</button>
</div>
<div style="margin: 10px 0">
<p id="result"><br><br></p>
</div>
</div>

[^1]: https://en.wikipedia.org/wiki/Kelly_criterion

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
{{< script "/js/kelly.min.js" >}}
