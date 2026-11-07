---
title: "To Kelly or not to Kelly"
description: "Even with confidence in your edge, I argue betting Kelly with any significant fraction is dangerous. Here's why and what to do instead."
date: "2026-11-07"
showthedate: true
tags: [ "probability" ]
---

Kelly criterion is a popular bet sizing formula that maximizes the expected
logarithmic growth of your bankroll. The formula is simple:

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

## Applying Kelly to prediction market gambling

Given a prediction market with a mispriced outcome, you can use the Kelly
formula to determine the optimal bet size. For example, if you believe a market
is mispriced at 60% when you think the true probability is 70%, the net odds
of buying in at 60c are b = (1 - 0.6) / 0.6 = 2/3, so you should bet

<p>
    \[
        f^* = 0.7 + \frac{0.7-1}{\frac{2}{3}} = 0.25
    \]
</p>

Intuitively, betting 25% of your bankroll on a single market still seems too
risky, as a single loss wipes out a quarter of your bankroll. Due to the risk
of ruin by slight probability misestimations, many will bet a fraction of the
Kelly amount, with popular fractions being 1/2 Kelly (aka half-Kelly) or 1/4
Kelly (aka quarter-Kelly).

However, I'd argue that even fractional Kelly still has significant drawbacks
and that a simple extension to the concept can boost risk adjusted returns
while still offering a framework to take on extra risk whenever needed.

## Drawbacks of Kelly

The biggest drawback of Kelly is its sensitivity to probability misestimation.
If you misestimate the probability of winning, the results can be catastrophic.
However, most people are aware of this, hence the popularity of fractional Kelly.

Take the 60c market from the example above. Here is how bet size changes your
expected bankroll growth per bet, depending on the true probability:

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js" charset="utf-8"></script>
<script src="/js/chart-theme.js"></script>

<div id="graph"></div>

<script>
const betSizes = [];
for (let i = 0; i <= 75; i++) {
  betSizes.push(i / 100);
}

// expected compounding growth per bet for a 60c contract (net odds 2/3)
const growthRate = (p, f) =>
  Math.exp(p * Math.log(1 + (2 / 3) * f) + (1 - p) * Math.log(1 - f)) - 1;

const beliefs = [
  { p: 0.7, name: "True probability 70%", color: "rgb(0, 174, 243)" },
  { p: 0.6, name: "True probability 60%", color: "rgb(232, 27, 35)" },
  { p: 0.55, name: "True probability 55%", color: "rgb(128, 128, 128)" }
];

Plotly.newPlot("graph", [...beliefs.map(({ p, name, color }) => ({
  x: betSizes,
  y: betSizes.map((f) => growthRate(p, f)),
  mode: "lines",
  name,
  line: {
    color
  }
})), {
  x: [0.25],
  y: [growthRate(0.7, 0.25)],
  mode: "markers",
  name: "Kelly bet size (25%)",
  marker: {
    color: "rgb(0, 174, 243)",
    size: 10
  }
}], {
  title: {
    text: "Expected Growth per Bet (60c contract)"
  },
  font: {
    family: "Commit Mono",
    size: 12
  },
  xaxis: {
    tickformat: ".0%",
    range: [0, 0.78]
  },
  yaxis: {
    tickformat: ".0%"
  }
});
</script>

Even when your estimate is right, the top of the curve is flat: betting 15% of
your bankroll instead of 25% barely dents your growth. This is exactly why
fractional Kelly works as well as it does. But when your estimate is wrong, the
curve falls off a cliff. If the true probability turns out to be the market's
own 60%, every positive bet size has negative expected growth, and the full
Kelly bet grinds your bankroll down at about 2% per bet.

Sometimes estimations can be very uncertain. For example, there are markets
like ["Trump calls Nicki Minaj hot again in 2026?"](https://polymarket.com/event/trump-calls-nicki-minaj-hot-again-in-2026-20260708230616939),
yes I know, this is a real market, and I can shamelessly say that I have bet on
it. There's no reasonable way to estimate the probability of this event,
however, it's possible to have a feel for the probability with respect to the
market price. In the absence of certainty, the Kelly formula can be hard to
apply.

Ideally, you want to be able to bet even when you are uncertain of your own
edge. Ways to do this include fixed bet sizing: a fixed amount, a fixed
fraction of your bankroll, or a fixed number of shares.

## Fixed fraction bet sizing

The simplest alternative is to risk the same amount on every bet no matter the
price or your perceived edge: either a fixed amount (e.g., $100 per bet) or a
fixed fraction of your bankroll (e.g., 2% per bet).

The appeal is obvious:

* No probability estimates are required, so you can bet even on markets where
  you cannot quantify your own edge.
* Dollar risk is identical across bets and trivial to reason about. You always
  know the worst case for a single bet.
* The fixed fraction version scales automatically with your bankroll.

The problem is that it treats a 5c contract and a 95c contract as the same
bet. $100 buys 2,000 shares of a 5c contract but only about 105 shares of a
95c contract. Your share exposure is massively skewed towards the cheapest
contracts, which, as we will see, is exactly the wrong place to be skewed.

Here is how many shares the same bet buys at every price, a fixed $100 stake
versus a fixed 100 shares:

<div id="graph2"></div>

<script>
const cents = [];
for (let c = 5; c <= 95; c++) {
  cents.push(c);
}

// $100 buys 100/p shares; the fixed share alternative always buys 100
Plotly.newPlot("graph2", [{
  x: cents,
  y: cents.map((c) => 10000 / c),
  mode: "lines",
  name: "Fixed fraction ($100 per bet)",
  line: {
    color: "rgb(232, 27, 35)"
  }
}, {
  x: cents,
  y: cents.map(() => 100),
  mode: "lines",
  name: "Fixed shares (100 shares per bet)",
  line: {
    color: "rgb(0, 174, 243)"
  }
}], {
  title: {
    text: "Shares Bought per Bet"
  },
  font: {
    family: "Commit Mono",
    size: 12
  },
  xaxis: {
    ticksuffix: "c"
  },
  yaxis: {
    tickformat: ","
  }
});
</script>

## Fixed shares bet sizing

The alternative I use is to buy the same number of shares on every trade. For
example, I might buy 100 shares no matter the market.

Since every share pays out $1 on a win, the money at risk is simply the price
times the number of shares: 100 shares cost $5 at 5c and $95 at 95c, and the
payout is always $100.

A few practical notes:

* Share counts are easy to reason about and compare across markets. "I own 100
  shares" is cleaner than "I own $23.70 worth of some contract".
* Dollar risk does not scale with your bankroll. As your bankroll grows, step
  your share count up in tiers instead of adjusting it continuously.
* Dollar risk does scale with price. A 95c contract ties up 19 times the
  capital of a 5c contract for the same share count, so the rule implicitly
  demands much more confidence in expensive contracts.

## Why I prefer using fixed shares

Fixed fraction sizing puts the same number of dollars into every bet. Fixed
shares sizing puts more dollars into high-priced contracts and fewer dollars
into low-priced ones. This matters because of a well documented risk premium:
high-priced contracts are generally undervalued.

A [recent study of Polymarket](https://arxiv.org/html/2609.12878v1) examines
588 million trades by 2.48 million wallets and documents a classic
favorite-longshot bias: the cheap contracts that everyone loves to buy are
overpriced, and the expensive contracts that nobody wants are underpriced.

* Purchases below 10c lose 19.3 cents per dollar wagered, while purchases at
  or above 90c earn 0.83 cents per dollar.
* Weighting every market equally instead of every dollar, longshots still lose
  6.3 cents per dollar while favorites earn 0.28 cents per dollar.

Here are the same numbers charted across the three ways the study aggregates
returns: weighting each market equally, weighting each dollar equally, and
weighting each parent event equally (a parent event is Polymarket's umbrella
listing that groups related contracts, such as "Presidential Election Winner
2024" holding one contract per candidate):

<div id="graph3"></div>

<script>
const flbGroups = ["Equal market weight", "Dollar weighted", "Equal parent-event weight"];
const flbTails = [
  { name: "Longshots (below 10c)", color: "rgb(232, 27, 35)", values: [-6.3, -19.35, 4.09] },
  { name: "Favorites (90c and above)", color: "rgb(0, 174, 243)", values: [0.277, 0.83, 0.392] }
];

Plotly.newPlot("graph3", flbTails.map(({ name, color, values }) => ({
  x: flbGroups,
  y: values,
  type: "bar",
  name,
  marker: {
    color
  },
  text: values.map((v) => v.toFixed(2) + "%"),
  textposition: "outside",
  hovertemplate: `<b>${name}</b><br>%{x}: %{y:.2f}% per dollar<extra></extra>`
})), {
  title: {
    text: "Polymarket Tail Returns per Dollar Wagered"
  },
  font: {
    family: "Commit Mono",
    size: 12
  },
  barmode: "group",
  bargap: 0.14,
  bargroupgap: 0.04,
  xaxis: {
    automargin: true
  },
  yaxis: {
    ticksuffix: "%",
    range: [-24, 6],
    automargin: true
  }
});
</script>

To back this up with my own data, I pulled every resolved Polymarket market
since 2023 with more than $25k of volume: 32,918 contracts from 17,487
markets. For each contract I compared the last traded price at least 24 hours
before resolution with how often the outcome actually happened:

<div id="graph4"></div>

<script>
// each contract's last traded price 24h+ before close vs its realized payoff
const calibration = [
  { price: 0.0072, realized: 0.004, n: 10744, ci: 0.0012 },
  { price: 0.0709, realized: 0.0535, n: 990, ci: 0.014 },
  { price: 0.1242, realized: 0.1067, n: 731, ci: 0.0224 },
  { price: 0.1749, realized: 0.1484, n: 593, ci: 0.0286 },
  { price: 0.2227, realized: 0.2035, n: 565, ci: 0.0332 },
  { price: 0.27, realized: 0.2278, n: 676, ci: 0.0316 },
  { price: 0.3221, realized: 0.2872, n: 491, ci: 0.04 },
  { price: 0.3735, realized: 0.3671, n: 444, ci: 0.0448 },
  { price: 0.4237, realized: 0.3472, n: 481, ci: 0.0425 },
  { price: 0.4789, realized: 0.3472, n: 599, ci: 0.0381 },
  { price: 0.5128, realized: 0.6023, n: 870, ci: 0.0325 },
  { price: 0.572, realized: 0.6291, n: 461, ci: 0.0441 },
  { price: 0.6212, realized: 0.6451, n: 448, ci: 0.0443 },
  { price: 0.6755, realized: 0.7161, n: 539, ci: 0.0381 },
  { price: 0.73, realized: 0.775, n: 671, ci: 0.0316 },
  { price: 0.7772, realized: 0.7944, n: 569, ci: 0.0332 },
  { price: 0.8274, realized: 0.8567, n: 656, ci: 0.0268 },
  { price: 0.8782, realized: 0.8922, n: 668, ci: 0.0235 },
  { price: 0.9291, realized: 0.9462, n: 985, ci: 0.0141 },
  { price: 0.9929, realized: 0.996, n: 10737, ci: 0.0012 }
];

Plotly.newPlot("graph4", [{
  x: calibration.map((b) => b.price),
  y: calibration.map((b) => b.realized),
  customdata: calibration.map((b) => b.n),
  mode: "lines+markers",
  name: "Realized outcome frequency",
  line: {
    color: "rgb(0, 174, 243)"
  },
  marker: {
    size: 7
  },
  error_y: {
    type: "data",
    array: calibration.map((b) => b.ci),
    color: "rgb(0, 174, 243)",
    thickness: 1,
    width: 3
  },
  hovertemplate: "<b>Price %{x:.1%}</b><br>Realized: %{y:.1%}<br>Contracts: %{customdata:,}<extra></extra>"
}, {
  x: [0, 1],
  y: [0, 1],
  mode: "lines",
  name: "Perfect calibration",
  hoverinfo: "skip",
  line: {
    color: "rgb(128, 128, 128)",
    dash: "dot",
    width: 2
  }
}], {
  title: {
    text: "Market Probability vs. Realized Outcomes"
  },
  font: {
    family: "Commit Mono",
    size: 12
  },
  xaxis: {
    tickformat: ".0%",
    range: [0, 1]
  },
  yaxis: {
    tickformat: ".0%",
    range: [0, 1]
  }
});
</script>

Every bucket below 50c sits below the line, paying out less often than its
price implied, and every bucket above 50c sits above it. The error bars show
95% intervals, so any single bucket is noisy, but ten buckets in a row on each
side is no coincidence. This is a market level view rather than the study's
purchase level view, and it only looks a day ahead, but the shape is the same:
too optimistic on cheap contracts, too pessimistic on expensive ones.

In other words, boring expensive contracts carry a risk premium for whoever is
willing to hold them, while lottery ticket longshots are systematically
overpriced.

Fixed shares exploits this automatically. For a fixed share count, dollar
exposure is proportional to the price, so the bulk of your capital ends up in
the undervalued high-priced contracts. With fixed fraction sizing, a 5c
longshot and a 95c favorite receive the same capital, which means buying 19
times more shares of the longshot, massively overweighting the worst performing
part of the price distribution.

To be clear, this is a premium earned on average, not a free lunch on every
trade. The same study shows that longshot returns flip sign when related
contracts are grouped by parent event, and that the two-sided pattern is robust
in Crypto and Politics but surprisingly absent in Sports. Fixed shares simply
makes sure that the average dollar you wager sits on the right side of the bias.

## When to break the rules

Fixed share sizing is a default, not a religion. There are two situations where
I happily deviate from it.

**Markets where you have real conviction.** If you have done the work and
genuinely believe a market is mispriced, it is fine to bet larger than your
standard size. This is especially true when the edge is structural rather than
a matter of opinion, like
the [near-arbitrage on Musk net worth markets](/posts/near-arbitrage-on-net-worth-markets/)
I wrote about earlier. Standard fixed sizing treats a random market you have
never looked at and the trade of the year exactly the same way, which leaves
money on the table when you truly have an edge. The whole reason we avoid
sizing by estimated edge is that those estimates are usually unreliable; when
the estimate is trustworthy, there is nothing wrong with betting accordingly.

**Super long shot bets.** For super longshots, it is also fine to use larger
share counts. The return profile is greatly asymmetric: a 2c contract risks 2c
per share for the chance at $1, a 50x payout. Even a large share count keeps
the absolute dollars at risk small, while a single win pays for a great many
losses. If the longshot is genuinely mispriced in your favor, the upside dwarfs
the stake.

## A word of caution: bet correlations

One thing bet sizing rarely account for is correlation between bets.

Ten standard size bets that are all really the same bet is one bet of ten times
the size. Markets on the same theme, such as a cluster of "Trump does X by date
Y" markets or several Musk net worth markets, resolve together and lose
together. Size each of them as if they were independent and your true exposure
is much larger than your position list suggests.

Kelly theory at least has a portfolio version that handles dependence. Fixed
sizing has no theory at all, so you have to track aggregate exposure yourself:

* Cap your total exposure per theme or underlying risk factor.
* Treat contracts under the same parent event as one position. The Polymarket
  study I mentioned earlier finds that measured longshot returns change
  drastically depending on whether contracts are grouped by parent event, which
  is a good reminder that these contracts are linked.
* Correlated longshots are the most dangerous case: a dozen small cheap
  positions on the same underlying story can all expire worthless on the same
  day.

For more on how wrong independence assumptions can go, see my earlier post
on [examining parlays in prediction markets](/posts/stat-arb-on-polymarket/).

## Why the human touch is important

It is tempting to turn all of the above into a rigid process: always buy N
shares, never deviate, never think. I would argue against that. Developing a
rigid process ignores nuances such as trading dynamics, market structure, and
resolution mechanics, all of which can matter much more than your bet size.

A few examples:

* **Market structure.** A contract quoted at 5c might only be fillable at 7c
  with a bid at 3c. On a longshot, a spread like that can eat a large fraction
  of your entire expected edge. Thin order books also mean that your own order
  moves the price.
* **Trading dynamics.** How a market trades tells you things no formula can:
  who is on the other side, whether a price move is noise or information, and
  whether liquidity will still be there when you want to exit.
* **Resolution risk.** An edge is worthless if the market resolves against you
  for rules reasons. Reading the resolution criteria carefully is part of
  sizing a bet, even though no formula has a term for it.

## Conclusion

Kelly is a beautiful theoretical result and a dangerous practical tool. It
maximizes growth only when your probability estimates are right, and it punishes
you severely when they are not. Fractional Kelly dampens the punishment but does
not fix the underlying problem.

My answer is to stop estimating probabilities for sizing purposes at all and buy
a fixed number of shares instead. It is simple, it needs no edge estimates, and
it quietly exploits the risk premium in high-priced contracts. When you have
real conviction, bet bigger. On super long shots with wildly asymmetric payoffs,
buy more shares. Watch the correlations between your positions, and use your own
judgement.

Bet sizing is not about maximizing the growth rate on paper. It is about survival
and making enough repetitions for your edge to show up.


<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
{{< script "/js/kelly.min.js" >}}


