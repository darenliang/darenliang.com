---
title: "Secret Sharing by Example"
date: "2022-01-20"
showthedate: true
---

<noscript>
  <p>
    A note to those who disable JavaScript: this article requires loading and executing JavaScript to load equations,
    graphs, and interactive examples.
  </p>
</noscript>

## 1. The Scenario

You are haphazardly appointed as the group in charge of authorizing the launch of your country's nuclear weapons. No
idea how you got appointed, maybe you were just unlucky :man_shrugging:.

Knowing that you are tasked with managing the launch code, you've decided that the only way to ensure no one abuses this
code is to share the code in such a way that you and your friends must come together to reveal the secret code.

![xkcd](/img/shamir/xkcd.png)

<p align="center"><a href="https://what-if.xkcd.com/47/">xkcd's what-if 47</a></p>

## 2. A Failed Attempt

<p>
    Let's suppose our hypothetical launch code is \( 857392 \) for simplicity's sake.
</p>

You might want to give each of your, say, five friends each a letter and a number.

<ul>
    <li>You get \( 81 \)</li>
    <li>Albert gets \( 52 \)</li>
    <li>Bernard gets \( 73 \)</li>
    <li>Cheryl gets \( 34 \)</li>
    <li>Denise gets \( 95 \)</li>
    <li>Edward gets \( 26 \)</li>
</ul>

To recover the secret, you'll need to spell out the launch code in order of increasing numbers. Simple enough.

<p>
    There's a catch, Bernard isn't too careful and ends up having his secret share (\( 73 \)) stolen. The thief is now in the fortunate
    position of having to guess fewer numbers in order to brute force the secret code. If it takes \( 10^6 \) tries to brute
    force a six-digit number, it'll take \( \frac{1}{10} \) the number of tries, hence \( 10^5 \), to brute force a five-digit number.
    This is not ideal.
</p>

### Interactive Example

<div style="margin: 10px 0">
    <label>Secret (digits only): <input type="text" id="input1" value="857392"></label>
    <button onclick="generateShares1()">Generate Shares</button>
</div>
<div style="margin: 10px 0">
    <label>Recover (one secret share per line):<br>
        <textarea id="output1" style="height: 150px; width: 400px;"></textarea>
    </label>
    <br>
    <button onclick="recoverSecret1()">Recover Secret</button>
</div>

## 3. A Somewhat Successful Attempt

Let's do something different to mitigate the risk of having an exposed secret share.

You'll give each of your friends a random six-digit number.

<ul>
    <li>Albert gets \( 397467 \)</li>
    <li>Bernard gets \( 645723 \)</li>
    <li>Cheryl gets \( 593239 \)</li>
    <li>Denise gets \( 305724  \)</li>
    <li>Edward gets \( 789942  \)</li>
</ul>

By adding each number to the original secret code, and
using [modulus 10](https://en.wikipedia.org/wiki/Modulo_operation) in case of a "carry over", we can generate a random
secret.

<p>
    \[
        \begin{array}{c c c c}
        &8&5&7&3&9&2&\text{Original Secret}\\
        &3&9&7&4&6&7&\text{Albert's Secret}\\
        &6&4&5&7&2&3&\text{Bernard's Secret}\\
        &5&9&3&2&3&9&\text{Cheryl's Secret}\\
        &3&0&5&7&2&4&\text{Denise's Secret}\\
        +&7&8&9&9&4&2&\text{Edward's Secret}\\ \hline
        &2&5&6&2&6&7&\text{Random Secret}\\
        \end{array}
    \]
</p>

<p>
    You'll then keep the random secret \( 256267 \) to yourself.
</p>

To recover the secret you'll need to perform the "reverse" of what you did to generate the random secret.

Note that we can subtract your friend's secrets from the random secret in any order due to addition's commutative
properties.

<p>
    \[
        \begin{array}{c c c c}
        &2&5&6&2&6&7&\text{Random Secret}\\
        -&3&9&7&4&6&7&\text{Albert's Secret}\\
        -&6&4&5&7&2&3&\text{Bernard's Secret}\\
        -&5&9&3&2&3&9&\text{Cheryl's Secret}\\
        -&3&0&5&7&2&4&\text{Denise's Secret}\\
        -&7&8&9&9&4&2&\text{Edward's Secret}\\ \hline
        &8&5&7&3&9&2&\text{Original Secret}\\
        \end{array}
    \]
</p>

<p>
    When we compare this method of generating secret shares to our first attempt. We can see that in the case that a secret
    share is exposed, an attacker is still required to brute force all \( 10^6 \) combinations since a random secret share 
    doesn't narrow down the brute force search area in any meaningful way.
</p>

However, there's another catch. Edward is also not very careful about his secret share and ends up losing it! Without
Edward's secret share, recovering the secret code is just as hard as brute-forcing it. Somehow, this doesn't seem ideal.

### Interactive Example

<div style="margin: 10px 0">
    <label>Secret (digits only): <input type="text" id="input2" value="857392"></label>
    <br>
    <label>Number of shares: <input type="text" id="num2" value="6"></label>
    <br>
    <button onclick="generateShares2()">Generate Shares</button>
</div>
<div style="margin: 10px 0">
    <label>Recover (one secret share per line with random secret on the first line):<br>
        <textarea id="output2" style="height: 150px; width: 400px;"></textarea>
    </label>
    <br>
    <button onclick="recoverSecret2()">Recover Secret</button>
</div>

## 4. A Clever Geometric Example

Now let's address the problems with our previous methods. Rather than representing shares as single numbers, let's
represent shares as points on a graph.

<p>For simplicity, let's assume that the secret is \( 4 \).</p>

### The 2 Shares Case

<p>Let's find an arbitrary line that results in a <a href="https://en.wikipedia.org/wiki/Y-intercept">y-intercept</a> of \( 4 \).</p>

<p>
    \[
        y = -x+4
    \]
</p>

<div id="plot1" style="text-align: center;"></div>

<p>Taking any two points where \( x \neq 0 \), gives us the ability to recover the line hence finding the y-intercept.</p>

We could for example create shares in the following configuration:

<ul>
    <li>You get \( (1, 3) \)</li>
    <li>Albert gets \( (2, 2) \)</li>
    <li>Bernard gets \( (3, 1) \)</li>
    <li>Cheryl gets \( (4, 0) \)</li>
    <li>Denise gets \( (5, -1) \)</li>
    <li>Edward gets \( (6, -2) \)</li>
</ul>

You will note that this type of secret sharing scheme has two significant advantages over our previous methods.

* Knowing a share doesn't improve your chances of knowing the original secret (the y-intercept can still be any
  arbitrary number).
* Shares can be lost and the original secret can still be recovered.

However, you'll note that allowing two shares to recover the original secret might not be considered secure. Remember,
Bernard's share was leaked to the public and Edward's share was lost. If someone happened to find Edward's share, they
could recover the original secret. We'll need to think of a way to secure the original secret through +3 shares.

### The 3 Shares Case

Instead of using a line, what if we use a quadratic?

Let's consider the following quadratic function:

<p>
    \[
        y = x^2-4x+4
    \]
</p>

<div id="plot2" style="text-align: center;"></div>

### Question! (I promise it's the only question I'll ask you)

Can picking any two points recover the y-intercept in the 3 shares case?

<p>What if we picked the points \( (2, 0) \) and \( (4, 4) \)? Can you find a quadratic function that fits these two points that is not \( x^2-4x+4 \)?</p>

<details>
    <summary>Reveal the Answer</summary>
    Let's solve it using a system of equations.
    \[
        2^2a+2b+c=0
    \]
    \[
        4^2a+4b+c=4
    \]
    Simplifying,
    \[
        4a+2b+c=0
    \]
    \[
        16a+4b+c=4
    \]
    Solve the system of equations,
    \[
        b=-6a+2
    \]
    \[
        c=8a-4
    \]
    Assuming \( a = 2 \),
    \[
        b=-10
    \]
    \[
        c=12
    \]
    We can verify that it is indeed a solution,
    \[
        2^2(2)+2(-10)+12=0
    \]
    \[
        4^2(2)+4(-10)+12=4
    \]
    Here is an interactive visualization of some possible solutions,
    <div id="plot3" style="text-align: center;"></div>
    <div style="text-align: center;">
      <label>
        <span id="sliderLabel">a = 1<br>b = -4<br>c = 4</span><br>
        <input type="range" step="0.01" min="-10" max="10" value="1" class="slider" id="slider">
      </label>
    </div>
</details>

## 5. Introducing Shamir's Secret Sharing

The beauty of this secret sharing scheme is that you can extend the cases by introducing higher and higher order
polynomials.

<p>The 2 shares case is known as a \( (2, n) \) scheme and the 3 shares case is known as a \( (3, n) \) scheme.</p>

### Interactive Example (using the code below)

<div style="margin: 10px 0">
    <label>Secret (digits only): <input type="text" id="input3" value="857392"></label>
    <br>
    <label>Minimum number of shares: <input type="text" id="min3" value="4"></label>
    <br>
    <label>Number of shares: <input type="text" id="num3" value="6"></label>
    <br>
    <button onclick="generateShares3()">Generate shares</button>
</div>

<div style="margin: 10px 0">
    <label>Recover (one secret share per line):<br>
        <textarea id="output3" style="height: 150px; width: 400px;"></textarea>
    </label>
    <br>
    <button onclick="recoverSecret3()">Recover Secret</button>
</div>

## 6. A Full Shamir's Secret Sharing Implementation in JavaScript

We've talked about how previous secret sharing schemes have specific disadvantages, and we've also talked about the
basis of how Shamir's Secret Sharing works. But what does an actual implementation of Shamir's Secret Sharing look
like?

Note that actual implementation of Shamir's Secret Sharing use polynomials over
a [finite field](https://en.wikipedia.org/wiki/Finite_field) and are not representable on a 2D plane. For the
mathematical formulation of scheme, here is a [good overview](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing).

The following code is ported from
Wikipedia's Shamir's Secret Sharing Python Implementation.

**Note that this implementation is not to be used in production! I am not responsible for any liabilities caused by
following code.**

```js
/**
 * The following JavaScript implementation of Shamir's Secret Sharing is
 * released into the Public Domain under the terms of CC0 and OWFa:
 * https://creativecommons.org/publicdomain/zero/1.0/
 * http://www.openwebfoundation.org/legal/the-owf-1-0-agreements/owfa-1-0
 */

/**
 * The 12th Mersenne prime.
 * This is comparable to a security level of 128-bits.
 */
const PRIME = 2n ** 127n - 1n;

/**
 * Generates BigInts between low (inclusive) and high (exclusive)
 * https://devimalplanet.com/how-to-generate-random-number-in-range-javascript
 */
const generateRandomBigInt = (lowBigInt, highBigInt) => {
    if (lowBigInt >= highBigInt) {
        throw "lowBigInt must be smaller than highBigInt.";
    }

    const difference = highBigInt - lowBigInt;
    const differenceLength = difference.toString().length;
    let multiplier = "";
    while (multiplier.length < differenceLength) {
        multiplier += Math.random()
            .toString()
            .split(".")[1];
    }
    multiplier = multiplier.slice(0, differenceLength);
    const divisor = "1" + "0".repeat(differenceLength);

    const randomDifference = (difference * BigInt(multiplier)) / BigInt(divisor);

    return lowBigInt + randomDifference;
};

/**
 * BigInt floor divide
 * Note: This is needed because BigInt divides are truncated instead of floored.
 */
const bigIntfloorDivide = (a, b) => {
    if (b === 0n) {
        throw "Divide by zero.";
    }
    if (a === 0n) {
        return 0n;
    }

    if ((a > 0n && b > 0n) || (a < 0n && b < 0n)) {
        return a / b;
    }

    const quotient = a / b;
    const remainder = a % b;

    if (remainder === 0n) {
        return quotient;
    }

    return quotient - 1n;
};

/**
 * Evaluates polynomial (coefficient tuple) at x, used to generate a
 * shamir pool in makeRandomShares below.
 */
const evalAt = (poly, x, prime) => {
    let accum = 0n;

    for (let i = poly.length - 1; i >= 0; i--) {
        accum *= x;
        accum += poly[i];
        accum %= prime;
    }

    return accum;
};

/**
 * Generates a random shamir pool for a given secret, returns share points.
 */
const makeRandomShares = (secret, minimum, shares, prime = PRIME) => {
    if (minimum > shares) {
        throw "Pool secret would be irrecoverable.";
    }

    const poly = [BigInt(secret)].concat(
        [...Array(minimum - 1).keys()].map(
            _ => generateRandomBigInt(0n, PRIME - 1n)
        )
    );

    return [...Array(shares).keys()].map(
        i => [BigInt(i + 1), evalAt(poly, BigInt(i + 1), prime)]
    );
};

/**
 * Division in integers modulus p means finding the inverse of the
 * denominator modulo p and then multiplying the numerator by this
 * inverse (Note: inverse of A is B such that A*B % p == 1) this can
 * be computed via extended Euclidean algorithm
 * http://en.wikipedia.org/wiki/Modular_multiplicative_inverse#Computation
 */
const extendedGCD = (a, b) => {
    let x = 0n;
    let lastX = 1n;
    let y = 1n;
    let lastY = 0n;

    while (b !== 0n) {
        const quot = bigIntfloorDivide(a, b);
        [a, b] = [b, (a + b) % b];
        [x, lastX] = [lastX - quot * x, x];
        [y, lastY] = [lastY - quot * y, y];
    }

    return [lastX, lastY];
};

/**
 * Compute num / den modulo prime p
 * To explain what this means, the return value will be such that
 * the following is true: den * _divmod(num, den, p) % p == num
 */
const divMod = (num, den, p) => {
    const inv = extendedGCD(den, p)[0];
    return num * inv;
};

/**
 * Find the y-value for the given x, given n (x, y) points;
 * k points will define a polynomial of up to kth order.
 */
const lagrangeInterpolate = (x, xs, ys, p) => {
    const k = xs.length;

    const PI = vals => {
        let accum = 1n;
        for (const val of vals) {
            accum *= val;
        }
        return accum;
    };

    const nums = [];
    const dens = [];
    for (let i = 0; i < k; i++) {
        const others = xs.slice();
        const cur = BigInt(others.splice(i, 1));
        nums.push(PI(others.map(o => x - o)));
        dens.push(PI(others.map(o => cur - o)));
    }

    const den = PI(dens);
    const num = [...Array(k).keys()]
        .map(i => divMod(nums[i] * den * ys[i] % p, dens[i], p))
        .reduce((total, el) => total + el, 0n);

    let secret = divMod(num, den, p);
    if (secret > 0n) {
        return secret % p;
    }

    // Sometimes the secret is a huge negative number.
    // We need to multiples of p to ensure that our result is
    // positive when we take modulus p.
    return (secret + ((-1n * secret / p + 1n) * p)) % p;
};

/**
 * Recover the secret from share points
 * (x, y points on the polynomial).
 */
const recoverSecret = (shares, prime = PRIME) => {
    if (shares.length < 2) {
        throw "Need at least 2 shares";
    }

    const xs = [];
    const ys = [];
    for (const share of shares) {
        xs.push(share[0]);
        ys.push(share[1]);
    }

    return lagrangeInterpolate(0n, xs, ys, prime);
};

/**
 * Generate shares.
 */
const secret = 857392;
const shares = makeRandomShares(secret, 4, 6);
console.log("Shares:");
console.log(shares);

/**
 * Recover the secret with the first two shares missing.
 */
console.log("Recovered Secret:");
console.log(recoverSecret(shares.splice(0, 2)));
```

## 7. Now What?

Whew! We are done! :tada:

I hope this gave you a somewhat brief introduction to the world of secret sharing schemes.

We've haven't covered all the secret sharing schemes out there! However, Shamir's is widely considered one of the best secret sharing schemes.
Here are a few alternative secret sharing schemes:

* Blakley's Secret Sharing ([arxiv.org](https://arxiv.org/abs/1901.02802))
* Secret sharing using the Chinese remainder theorem ([wikipedia.org](https://en.m.wikipedia.org/wiki/Secret_sharing_using_the_Chinese_remainder_theorem))

With the rise of the Internet, secret sharing schemes are becoming increasingly prevalent and are used in all sorts of
applications such as blockchain and cloud computing.

If you find any issues with this article, please let me know at [daren@darenliang.com](mailto:daren@darenliang.com).

## 8. Credits

This article is made possible by the following great resources and JS libraries:

* Art of the Problem's [Secret Sharing Explained Visually](https://www.youtube.com/watch?v=iFY5SyY3IMQ)
* Wikipedia's [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing) article
* [MathJax](https://www.mathjax.org/) for math notation
* Mauricio Poppe's [Function Plot](https://mauriciopoppe.github.io/function-plot/) for graph plots

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script src="https://unpkg.com/function-plot/dist/function-plot.js"></script>
<script src="/js/shamir.js"></script>
