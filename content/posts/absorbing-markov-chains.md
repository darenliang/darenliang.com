---
title: "Solving Dice Problems with Markov Chains"
description: "Is it more likely to roll two 5's or a 5 followed by a 6?"
date: "2024-09-28"
showthedate: true
tags: [ "probability" ]
---

A colleague asked me an interesting probability problem. If you roll a die
continuously, are you more likely to roll two 5's or a 5 followed by a 6?

The state machine diagram for rolling two 5's:

<img alt="DFA 1" width="400" src="/img/markov/dfa1.svg" />

The state machine diagram for rolling a 5 followed by a 6:

<img alt="DFA 2" width="400" src="/img/markov/dfa2.svg" />

<p>
    Looking at the two state machine diagrams you can see that the second has a
    lower expected number of rolls to reach state \( q_2 \) since \( q_1 \)
    contains an additional transition into itself. However, can we compute how
    many fewer rolls are required?
</p>

### Absorbing Markov chains[^1]

<p>
    To calculate the expected number of rolls we can first calculate the
    expected number of visits to reach transient states \( q_0 \) and \( q_1 \)
    given by
</p>
<p>
    \begin{aligned}
    N &= \left( I - Q \right) ^ {-1} \\
      &= \left( \begin{bmatrix}
                1 & 0\\
                0 & 1\\
                \end{bmatrix} - 
                \begin{bmatrix}
                q_0 \rightarrow q_0 & q_0 \rightarrow q_1 \\
                q_1 \rightarrow q_0 & q_1 \rightarrow q_1 \\
                \end{bmatrix}
        \right) ^ {-1}
    \end{aligned}
</p>
<p>
    where \( I \) is the identity matrix and \( Q \) is the transition matrix between transient states.
</p>

<p>
The expected number of rolls is the sum of the first row of matrix \( N \) as
it is the sum of the expected number of visits from \( q_0 \) to transient
states \( q_0 \) and \( q_1 \).
</p>

For rolling two 5's:

<p>
    \begin{aligned}
    N &= \left( I - Q \right) ^ {-1} \\
      &= \left( \begin{bmatrix}
                1 & 0\\
                0 & 1\\
                \end{bmatrix} - 
                \begin{bmatrix}
                \frac{5}{6} & \frac{1}{6}\\
                \frac{5}{6} & 0\\
                \end{bmatrix}
        \right) ^ {-1} \\
      &= \begin{bmatrix}
                36 & 6\\
                30 & 6\\
                \end{bmatrix} \Rightarrow 36 + 6 = 42 \text{ rolls}
    \end{aligned}
</p>

For rolling a 5 followed by a 6:

<p>
    \begin{aligned}
    N &= \left( I - Q \right) ^ {-1} \\
      &= \left( \begin{bmatrix}
                1 & 0\\
                0 & 1\\
                \end{bmatrix} - 
                \begin{bmatrix}
                \frac{5}{6} & \frac{1}{6}\\
                \frac{4}{6} & \frac{1}{6}\\
                \end{bmatrix}
        \right) ^ {-1} \\
      &= \begin{bmatrix}
                30 & 6\\
                24 & 6\\
                \end{bmatrix} \Rightarrow 30 + 6 = 36 \text{ rolls}
    \end{aligned}
</p>

<p>
Hence it takes 6 fewer rolls to roll a 5 followed by a 6 compared to rolling two 5's.
</p>

[^1]: https://en.wikipedia.org/wiki/Absorbing_Markov_chain

<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>