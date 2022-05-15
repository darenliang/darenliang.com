---
title: "The Basketball Tryout"
date: "2022-05-13"
showthedate: true
tags: ["statistics"]
---

Here's another interesting probability question that I've found in Adrian
Torchiana's [Probability Math Puzzles](https://github.com/atorch/probability_puzzles) app.

> You're trying out for a basketball team, and the coach gives you two options: you can take six shots, or you can take
> four. In both cases you have to make at least half of the shots, or you'll be cut from the team.

> Each shot you take has a fixed probability of succeeding. What is the probability of making a successful shot, in
> which it makes no difference what option you choose?

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

<p align="center">Blue :blue_square: represents four shots and orange :orange_square: represents six shots.</p>

I highly encourage you to try this question out before looking at the solution. It is possible to solve this problem
entirely by hand, but you may opt to solve this problem using an equation solver or graphing calculator.

## Solution

<details>
<summary>Reveal the Solution</summary>
<p>As you can see, it looks like \( 0.6 \) is the solution, but why?</p>

For fixed probabilities, the [binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution) is used.

<p>
\[
P_x = {n \choose x} p^x \left( 1-p \right)^{n-x}
\]
</p>

where:

* <p>\( P \): binomial probability</p>
* <p>\( p \): probability of success on a single trial</p>
* <p>\( x \): number of times for a specific outcome within \( n \) trials</p>
* <p>\( n \): number of trials</p>
* <p>\( {n \choose x} = \frac{n!}{x!\left(n-x\right)!} \)</p>

<p>Using the binomial distribution formula, we can calculate the probability of making the tryout given four shots, with
fixed probability \( p \).</p>

<p>
\begin{aligned}
P_4 + P_3 + P_2 &= {4 \choose 4} p^4 \left( 1-p \right)^0 + {4 \choose 3} p^3 \left( 1-p \right)^1 + {4 \choose 2} p^2 \left( 1-p \right)^2 
\\ &= p^4 + 4 p^3 \left( 1-p \right) + 6 p^2 \left( 1-p \right)^2
\\ &= 3 p^4 - 8 p^3 + 6 p^2
\end{aligned}
</p>

We can do the same for six shots.

<p>
\begin{aligned}
P_6 + P_5 + P_4 + P_3 &= {6 \choose 6} p^6 \left( 1-p \right)^0 + {6 \choose 5} p^5 \left( 1-p \right)^1 + {6 \choose 4} p^4 \left( 1-p \right)^2 + {6 \choose 3} p^3 \left( 1-p \right)^3
\\ &= p^6 + 6 p^5 \left( 1-p \right) + 15 p^4 \left( 1-p \right)^2 + 20 p^3 \left( 1-p \right)^3
\\ &= -10 p^6 + 36 p^5 - 45 p^4 + 20 p^3
\end{aligned}
</p>

<p>Now, we need to solve for \( p \),</p>

<p>
\[
3 p^4 - 8 p^3 + 6 p^2 = -10 p^6 + 36 p^5 - 45 p^4 + 20 p^3
\]
</p>

Move to one side,

<p>
\[
-10 p^6 + 36 p^5 - 48 p^4 + 28 p^3 - 6 p^2 = 0
\]
</p>

<p>Simplify a bit (we know that \( p = 0 \) is definitely not a valid solution),</p>

<p>
\[
\frac{-10 p^6 + 36 p^5 - 48 p^4 + 28 p^3 - 6 p^2}{-2 p^2} = \frac{0}{-2 p^2}
\]
\[
5 p^4 - 18 p^3 + 24 p^2 - 14 p + 3 = 0
\]
</p>

Using the [rational root theorem](https://en.wikipedia.org/wiki/Rational_root_theorem) we can brute-force possible
factors relatively easily.

We are left with,

<p>
\[
\left( p - 1 \right)^3 \left( 5p - 3 \right) = 0
\]
</p>

<p>We know that \( p = 1 \) is not a valid solution, hence we solve for \( 5p - 3 = 0 \)</p>

<p>
\[
p = \frac{3}{5} = 0.6
\]
</p>

### A Fun Little Sidenote

Have you noticed that depending on the rules of a game, lower or higher skilled players can be favored?

<p>For basketball shooters with a \( < 0.6 \) shooting percentage, it is more favorable to take four shots.</p>

<p>For basketball shooters with a \( > 0.6 \) shooting percentage, it is more favorable to take six shots.</p>

Parallels can be made to real-life sports, where upsets in hockey are much more common than upsets in basketball.

{{< youtube HNlgISa9Giw >}}

</details>

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script src="https://unpkg.com/function-plot/dist/function-plot.js"></script>
{{< script "/js/basketball.min.js" >}}
