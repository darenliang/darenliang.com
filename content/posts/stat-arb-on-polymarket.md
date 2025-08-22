---
title: "Examining Parlays in Prediction Markets"
description: "This blog post explores the ways to value a parlay using its component bets, and argue that the odds of such parlays on various prediction markets such as Polymarket are overvalued on the more likely/expensive contract."
date: "2025-08-11"
showthedate: true
tags: [ "perspectives", "probability" ]
---

It's been a while since I last wrote on this blog. 😅

I'd like to share a quick post on something I've been noticing on prediction
markets like [Polymarket](https://polymarket.com/) regarding parlay contracts.

## Overview of Prediction Markets

For those who don't know, here's a quick primer on how prediction markets work:

### A Prediction Market is an "Information Market"

A prediction market, similar to an option market, is a platform where
participants can buy and sell contracts that pay out based on the outcome of
future events. Rather than paying out based on the price of an underlying
asset, like a stock option, these contracts pay out based on a specific events,
such as the outcome of an election or a sports game. Ignoring the financial
incentives, prediction markets can be seen as a way to aggregate information
from a diverse group of participants to make predictions about future events.

["Wisdom of the crowd"](https://en.wikipedia.org/wiki/Wisdom_of_the_crowd)
expresses the notion that the collective opinion of a diverse group of people
yields a better judgment than that of a single expert.

### Event Contracts are Binary Options

In a prediction market, each contract represents a specific event with two
possible outcomes: "Yes" or "No" along with an expiration date. For example, a
contract might ask, "Will Candidate A win the election?" If the event occurs,
the contract pays out a fixed amount (usually $1), and if it does not occur,
the contract pays out nothing.

### Contract Price Implies the Probability

The price of a contract in a prediction market reflects the market's consensus
on the probability of the event occurring. For example, if a contract is priced
at $0.70, it implies a 70% probability that the event will occur since with
a probability of 70%, the expected payout is $0.70 (i.e., 70% of $1).

There might be other factors that might distort the price of a contract, such
as a high risk-free rate preventing long term contracts from being priced close
to $1. However, as the expiration date is not very far out, and the "Yes" and
"No" contract prices don't deviate too much, we can assume that the
probability implied by the contract price is a good estimate of the actual
probability of the event occurring.

### Liquidity

You may ask, who provides the liquidity for these contracts? In the case of
Polymarket, users can create one "Yes" and one "No" contract for each $1
deposited into the market. Since there are an equal number of "Yes" and
"No" contracts, a "Yes" contract and a "No" contract for the same event can be
combined to withdraw $1 from the market.

### Bid-Ask Spreads

When contracts are traded, a bid-ask spread forms for the contracts. For low
liquidity contracts or times of high volatility, the bid-ask spread can widen
giving an opportunity for participants providing liquidity to profit by
providing liquidity and submitting sell limit orders near the midpoint price.

### Market Resolution

Event contracts are resolved based on the outcome of the event or in
some cases, when an expiration date is reached. The market operator
determines the outcome based on the information available at the time of
resolution.

How the market operator determines the outcome can be a point of contention,
but let's not dive into that here. Polymarket currently uses the UMA protocol
to resolve contracts, which is a decentralized optimistic oracle. I might write
a post on how UMA works in the future and how Polymarket is looking to fix its
shortcomings, but for now, let's dive into valuing parlay contracts!

## Valuing Parlays: An Random Example

A parlay is a type of bet that combines multiple individual bets into one
single wager. In a prediction market, a parlay contract is a contract that pays
out if all the individual bets in the parlay win. For example, a parlay
contract might ask, "Will Team A win the game AND will Team B win the game?".

Assuming the individual bets are independent, the probability of winning a
parlay is the product of the probabilities of winning each individual bet.

<p>
    \[ P\left( A_1 \cap A_2 \cap A_3 \ldots A_n \right) = P\left( A_1 \right)P\left( A_2\right)P\left( A_3\right) \ldots P\left( A_n \right)\]
</p>

But in practice, the bets may be ever so slightly correlated, which can affect
the probability of winning the parlay.

> **Please note, I don't share views or opinions on the specific events
> mentioned in the example below. The examples are purely for illustrative
> purposes.**

Let's consider this Polymarket contract and its description, all prices are of
August 11, 2025:

<style>
table {
    width: 100%;
}
th {
  text-align: left;
}
</style>

| Event                                                                                    | "Yes"  | "No"   |
|------------------------------------------------------------------------------------------|--------|--------|
| [Nothing Ever Happens: August](https://polymarket.com/event/nothing-ever-happens-august) | $0.920 | $0.100 |

> This market will resolve to “No” if any of the following conditions are met
> by August 31, 2025, 11:59 PM ET:
>
> - Jerome Powell is out as Federal Reserve Chair
> - Israel withdraws its ground forces from Gaza
> - Donald Trump releases additional Epstein files
> - Donald Trump pardons Ghislaine Maxwell
>
> Otherwise, this market will resolve to “Yes”.

We can find the component bets (or very similar bets) on Polymarket:

| Event                                                                                                                                  | "Yes"  | "No"   |
|----------------------------------------------------------------------------------------------------------------------------------------|--------|--------|
| [Jerome Powell out as Fed Chair by August 31?](https://polymarket.com/event/jerome-powell-out-as-fed-chair-by-august-31)               | $0.011 | $0.992 |
| [Israel x Hamas ceasefire by August 31? (similar bet)](https://polymarket.com/event/israel-x-hamas-ceasefire-by-august-31)             | $0.130 | $0.880 |
| [Will Trump release more Epstein files by August 31?](https://polymarket.com/event/will-trump-release-more-epstein-files-by-august-31) | $0.080 | $0.930 |
| [Will Trump pardon Ghislaine Maxwell by August 31?](https://polymarket.com/event/will-trump-pardon-ghislaine-maxwell-by-august-31)     | $0.017 | $0.986 |

Let's assume independence (a very bad assumption, you'll see why), we can
calculate the implied probability of the parlay
contract as follows:

<script src="https://bossanova.uk/jspreadsheet/v5/jspreadsheet.js"></script>
<script src="https://jsuites.net/v5/jsuites.js"></script>
<link rel="stylesheet" href="https://jsuites.net/v5/jsuites.css" type="text/css" />
<link rel="stylesheet" href="https://bossanova.uk/jspreadsheet/v5/jspreadsheet.css" type="text/css" />

<style>
.jss_spreadsheet {
    color: #0D1117;
}
</style>

<div id="spreadsheet1"></div>

<script>
jspreadsheet(document.getElementById('spreadsheet1'), {
    worksheets: [
        {
            columns: [
                {title: "Event", width: 500},
                {title: "\"Yes\"", mask: "0.000"},
                {title: "\"No\"", mask: "0.000"}
            ],
            data: [
                ["Jerome Powell out as Fed Chair by August 31?", 0.011, 0.992],
                ["Israel x Hamas ceasefire by August 31?", 0.13, 0.88],
                ["Will Trump release more Epstein files by August 31?", 0.08, 0.93],
                ["Will Trump pardon Ghislaine Maxwell by August 31?", 0.017, 0.986],
                ["", "", ""],
                ["Parlay implied probability", "=(1-B1)*(1-B2)*(1-B3)*(1-B4)", "=1-C1*C2*C3*C4"],
                ["Parlay market probability", "0.920", "0.100"]
            ]
        }
    ]
});
</script>

where the parlay implied probability for "Yes" is

<p>
    \[ P\left( Y_i \right) = \left(1 - P\left( Y_1 \right)\right)\left(1 - P\left( Y_2 \right)\right)\left(1 - P\left( Y_3 \right)\right) \ldots \left(1 - P\left( Y_n \right)\right)\]
</p>

and the parlay implied probability for "No" is

<p>
    \[ P\left( N_i \right) = 1 - P\left( N_1 \right)P\left( N_2 \right)P\left( N_3 \right) \ldots P\left( N_n \right)\]
</p>

> **This spreadsheet is editable! Feel free to play around with the values.**

You might notice that the implied probability of 20% for the "No" contract is
much higher than the market probability of 10% for the "No" contract. We're
missing something very important here: **the correlation between the events**.

### Handling Correlated Events

Since the event contracts 3 and 4 are correlated, as a conservative
measure, we can assume that the probability of both events happening is the
probability of the more expensive contract.

<div id="spreadsheet2"></div>

<script>
jspreadsheet(document.getElementById('spreadsheet2'), {
    worksheets: [
        {
            columns: [
                {title: "Event", width: 500},
                {title: "\"Yes\"", mask: "0.000"},
                {title: "\"No\"", mask: "0.000"}
            ],
            data: [
                ["Jerome Powell out as Fed Chair by August 31?", 0.011, 0.992],
                ["Israel x Hamas ceasefire by August 31?", 0.13, 0.88],
                ["Events 3 & 4", 0.08, 0.93],
                ["", "", ""],
                ["Parlay implied probability", "=(1-B1)*(1-B2)*(1-B3)", "=1-C1*C2*C3"],
                ["Parlay market probability", "0.920", "0.100"]
            ]
        }
    ]
});
</script>

We're getting closer to the market probabilities but there's still a big
difference. There's still one more thing to consider: **similar bets might
not be as similar as we think**.

### Handling Inexact Component Bets

We used the "Israel x Hamas ceasefire by August 31?" contract as a proxy for
"Israel withdraws its ground forces from Gaza" however, the odds for both
contracts can differ significantly. In general, a withdrawal implies a
ceasefire, but a ceasefire does not necessarily imply a withdrawal. So we can
assume that the probability of a withdrawal is less than or equal to the
probability of a ceasefire.

We don't have a good way to estimate the probability of a withdrawal, but we
can use the contract prices we have right now to figure what probability would
need to be to match the parlay's market price.

<div id="spreadsheet3"></div>

<script>
jspreadsheet(document.getElementById('spreadsheet3'), {
    worksheets: [
        {
            columns: [
                {title: "Event", width: 500},
                {title: "\"Yes\"", mask: "0.000"},
                {title: "\"No\"", mask: "0.000"}
            ],
            data: [
                ["Jerome Powell out as Fed Chair by August 31?", 0.011, 0.992],
                ["Events 3 & 4", 0.08, 0.93],
                ["", "", ""],
                ["Parlay contract market probability", "0.920", "0.100"],
                ["", "", ""],
                ["Israel withdraws its ground forces from Gaza", "=(B4/((1-B1)*(1-B2)))-1", ""],
            ]
        }
    ]
});
</script>

We can see the theoretical contract price for "Yes" would have to be near zero
for the parlay contract to be correctly priced.

If we see other contracts such
as [Israel withdraws from Gaza in 2025?](https://polymarket.com/event/israel-withdraws-from-gaza-in-2025)
with a farther expiration date with a "Yes" price of $0.220, we can reasonably
assume that the real probability of a withdrawal by August 31 is much higher.

### Conclusion

In conclusion, the parlay contract seems to be underpriced on the "No" side.
That being said, this contract has low liquidity, so buying the "No" contract
can easily push the price up significantly.

To try to explain the underpricing, I believe people aren't properly valuing
the components, and when one of the contracts in the parlay is expensive, they
attribute it a pseudo-risk-free rate to park their funds for the month. Be
careful which positions you take, especially positions you believe can't lose.

**Update on August 22, 2025**: The parlay contract has since been resolved to
"No" as Donald Trump releases additional Epstein files before the end of
August.

<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
