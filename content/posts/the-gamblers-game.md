---
title: "The Gambler's Game"
date: "2022-01-26"
showthedate: true
---

Here's an interesting probability question that I've found in Adrian
Torchiana's [Probability Math Puzzles](https://github.com/atorch/probability_puzzles) app (highly recommended!) back in
high school.

> You find $2 in your pocket and decide to go gambling. Fortunately, the game you're playing has very favorable odds: each time you play, you gain $1 with probability 3/4 and lose $1 with probability 1/4.

> Suppose you continue playing so long as you have money in your pocket. If you lose your first two bets, you go broke and go home after only two rounds; but if you win forever, you'll play forever.

> What's the probability you'll eventually go broke?

At first glance, it seems like everyone will eventually go broke given that people have to play the game forever.

Surprisingly, this is not the case!

<style>
@media (prefers-color-scheme: dark) {
    .y.axis-label {
        stroke: white;
    }
    .x.axis-label {
        stroke: white;
    }
}
</style>

<div id="plot" style="text-align: center; height: 500px;"></div>
<div style="text-align: center;">
  <button onclick="redrawPlot()">Refresh</button>
</div>

This is a very tricky problem! I wasn't able to solve the problem at the time without this hint given in the app.

<details>
<summary>Reveal the Hint</summary>
Starting at any positive initial wealth \( x \), think about the probability of ever reaching state \( \left( x - 1 \right) \).
The answer you're looking for is just the square of the probability: to go broke you have to at some point reach a wealth of \( $1 \),
and then, having gotten there, at some point reach a wealth of \( $0 \).
</details>

Let's look at two ways in which we can solve the problem. Starting with the "dumb" method of simulating the gambler's
outcomes through code.

## "Solve" using Simulations

We can attempt to simulate plays similar to the graph above. Given the max number of plays and the number of samples, we
can estimate the probability to a degree of accuracy.

<div class="boxed">
<h3 id="interactive-example-1">Interactive Example</h3>
<div style="margin: 10px 0">
    <label>Max number of plays: <input type="text" id="plays1" value="50"></label>
    <br>
    <label>Number of samples: <input type="text" id="samples1" value="100000"></label>
    <br>
    <button onclick="simulate1()">Simulate</button>
</div>
<div style="margin: 10px 0">
<p id="result1"><br></p>
<p id="error1"><br></p>
</div>
</div>

To increase the accuracy of our estimate we have to increase the max number of plays and the number of samples, however,
we must restart the simulation when we change our parameters. Fortunately, we have a better approach that automagically
increases the accuracy by increasing the max number of plays and the number of samples the longer the script runs.

Running an arbitrarily large number of samples, all potentially running infinitely long, can cause issues. A technique
we can use is called "[dovetailing](https://en.wikipedia.org/wiki/Dovetailing_(computer_science))" which involves
running the first step of the first sample, and then running the second step of the first sample and the first step of
the second sample, and then running the third step of the first sample, the second step of the second sample and the
first step of the third sample. This pattern continues indefinitely.

<div class="boxed">
<h3 id="interactive-example-2">Interactive Example using Dovetailing</h3>
<div style="margin: 10px 0">
    <button id="button2" onclick="simulate2()">Start Simulation</button>
</div>
<div style="margin: 10px 0">
<p id="result2"><br></p>
<p id="error2"><br></p>
<p id="stats2"><br></p>
</div>
</div>

## Solve using Algebra

<p>
Let \( p \left( n \right) \) be the probability of going broke starting with \( n \) dollars.
</p>

We have the following equation,

<p>
\[
p \left( n \right) = p \left( 1 \right) ^ n
\]
</p>

<p>
This may seem unintuitive, but by understanding \( p \left( n \right) \) as doing \( p \left( 1 \right) \) \( n \) times might make a bit more sense.
</p>

Additionally, we need to come up with a recurrence relation.

We have the following base case,

<p>
\[
p \left( 0 \right) = 1
\]
</p>

And our recursive step is,

<p>
\[
p \left( n \right) = \frac{3}{4} p \left( n+1 \right) + \frac{1}{4} p \left( n-1 \right)
\]
</p>

<p>
The \( \frac{3}{4} p \left( n+1 \right) \) part represents the probability of going broke after winning a dollar and the 
\( \frac{1}{4} p \left( n-1 \right) \) part represents the probability of going broke after losing a dollar.
</p>

<p>
Since finding \( p \left( 1 \right) \) will allow us to find \( p \left( n \right) \) and by extension \( p \left( 2 \right) \), we have the following equation that we need to solve,
</p>

<p>
\[
p \left( 1 \right) = \frac{3}{4} p \left( 2 \right) + \frac{1}{4} p \left( 0 \right)
\]
</p>

<p>
Substituting \( p \left( 2 \right) \) with \( p \left( 1 \right) ^ 2 \) and \( p \left( 0 \right) \) with \( 1 \),
</p>

<p>
\[
p \left( 1 \right) = \frac{3}{4} p \left( 1 \right) ^ 2 + \frac{1}{4}
\]
\[
3 p \left( 1 \right) ^ 2 - 4 p \left( 1 \right) + 1 = 0
\]
\[
\left( 3 p \left( 1 \right) - 1 \right) \left( p \left( 1 \right) - 1 \right) = 0
\]
</p>

<p>Ignoring the \( p \left( 1 \right) - 1 = 0 \) case,</p>

<p>
\[
3 p \left( 1 \right) - 1 = 0
\]
\[
p \left( 1 \right) = \frac{1}{3}
\]
</p>

<p>Using \( p \left( n \right) = p \left( 1 \right) ^ n \), we can find \( p \left( 2 \right) \),</p>

<p>
\[
p \left( 2 \right) = p \left( 1 \right)^2 = \left( \frac{1}{3} \right) ^ 2 = \frac{1}{9}
\]
</p>

<p>
We can conclude that the exact odds of going broke is \( \frac{1}{9} \). Looks like the casino will quickly run out of business.
</p>

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script src="https://unpkg.com/function-plot/dist/function-plot.js"></script>
{{< script "/js/gamblers.min.js" >}}
