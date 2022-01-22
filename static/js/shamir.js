/**
 * Yes, I know. The code below is a mess.
 */

const width = 400;
const height = 400;

functionPlot({
    target: "#plot1",
    width,
    height,
    yAxis: {domain: [-2, 6]},
    xAxis: {domain: [-2, 6]},
    grid: false,
    data: [{
        fn: "-x+4"
    }, {
        points: [
            [0, 4],
        ],
        fnType: "points",
        graphType: "scatter"
    }],
    annotations: [{
        x: 0,
        text: "x = 0"
    }]
});

functionPlot({
    target: "#plot2",
    width,
    height,
    yAxis: {domain: [-1, 7]},
    xAxis: {domain: [-2, 6]},
    grid: false,
    data: [{
        fn: "x^2-4x+4"
    }, {
        points: [
            [0, 4],
        ],
        fnType: "points",
        graphType: "scatter"
    }],
    annotations: [{
        x: 0,
        text: "x = 0"
    }]
});

const plot3Options = {
    target: "#plot3",
    width,
    height,
    yAxis: {domain: [-1, 7]},
    xAxis: {domain: [-2, 6]},
    grid: false,
    data: [{
        fn: "x^2-4x+4"
    }, {
        points: [
            [2, 0],
            [4, 4]
        ],
        fnType: "points",
        graphType: "scatter"
    }],
};

const round = num => Math.round(100 * num) / 100;
const sliderLabel = document.getElementById("sliderLabel");

functionPlot(plot3Options);
const updateGraph = input => {
    const a = input.target.value;
    const b = -6 * a + 2;
    const c = 8 * a - 4;
    sliderLabel.innerHTML = `a = ${round(a)}<br>b = ${round(b)}<br>c = ${round(c)}`;
    plot3Options.data[0].fn = `(${a})x^2+(${b})x+(${c})`;
    functionPlot(plot3Options);
};

document.getElementById("slider").oninput = updateGraph;

const onlyDigits = text => {
    return /^\d+$/.test(text);
};
window.onlyDigits = onlyDigits;

const generateShares1 = _ => {
    const input = document.getElementById("input1");
    if (!onlyDigits(input.value)) {
        alert("Secret should only include digits.");
        return;
    }

    const output = document.getElementById("output1");
    output.value = "";

    let i = 1;
    for (const chr of input.value) {
        output.value += `${chr}${i}\n`;
        i++;
    }
};
window.generateShares1 = generateShares1;

const recoverSecret1 = _ => {
    const input = document.getElementById("input1");
    const output = document.getElementById("output1");
    input.value = "";

    const shares = output.value.split("\n");
    const sharesMap = new Map;
    for (let share of shares) {
        share = share.trim();

        if (share === "") {
            continue;
        }

        if (!onlyDigits(share)) {
            alert("Shares should only include digits.");
            return;
        }

        try {
            const i = Number.parseInt(share.substring(1));
            sharesMap.set(i, share.charAt(0));
        } catch {
            alert("Invalid share.");
            return;
        }
    }

    for (let i = 1; i < sharesMap.size + 1; i++) {
        if (sharesMap.has(i)) {
            input.value += sharesMap.get(i);
        } else {
            alert("Invalid share.");
            return;
        }
    }
};
window.recoverSecret1 = recoverSecret1;

const generateShares2 = _ => {
    let inputEl = document.getElementById("input2");
    if (!onlyDigits(inputEl.value)) {
        alert("Secret should only include digits.");
        return;
    }
    const inputLength = inputEl.value.length;
    const input = inputEl.value;

    let numEl = document.getElementById("num2");
    if (!onlyDigits(numEl.value)) {
        alert("Number of shares must be a whole number.");
        return;
    }
    const num = parseInt(numEl.value);
    if (num < 2) {
        alert("Number of shares must be at least 2.");
        return;
    }

    const output = document.getElementById("output2");
    output.value = "";

    const secretShares = [];
    for (let i = 0; i < num - 1; i++) {
        secretShares.push(`${Math.floor(Math.random() * (10 ** inputLength))}`.padStart(inputLength, "0"));
    }

    addition = (secret, share) => {
        let newStr = "";

        let length = 1;
        while (length <= secret.length) {
            const n1 = parseInt(secret.charAt(secret.length - length));
            const n2 = parseInt(share.charAt(share.length - length));
            const n3 = (n1 + n2) % 10;
            newStr = `${n3}` + newStr;
            length++;
        }

        return newStr;
    };

    let randomSecret = input;
    for (const share of secretShares) {
        randomSecret = addition(randomSecret, share);
    }

    output.value += `${randomSecret}\n`;

    for (const share of secretShares) {
        output.value += `${share}\n`;
    }
};
window.generateShares2 = generateShares2;

const recoverSecret2 = _ => {
    const input = document.getElementById("input2");
    const output = document.getElementById("output2");
    input.value = "";

    subtraction = (secret, share) => {
        let newStr = "";

        let length = 1;
        while (length <= secret.length) {
            const n1 = parseInt(secret.charAt(secret.length - length));
            const n2 = parseInt(share.charAt(share.length - length));
            const n3 = (n1 - n2 + 10) % 10;
            newStr = `${n3}` + newStr;
            length++;
        }

        return newStr;
    };

    const shares = output.value.split("\n");
    let randomSecret = shares.shift();
    for (let share of shares) {
        share = share.trim();

        if (share === "") {
            continue;
        }

        if (!onlyDigits(share)) {
            alert("Shares should only include digits.");
            return;
        }

        randomSecret = subtraction(randomSecret, share);
    }

    input.value = randomSecret;
};
window.recoverSecret2 = recoverSecret2;

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

const generateShares3 = _ => {
    const inputEl = document.getElementById("input3");
    if (!onlyDigits(inputEl.value)) {
        alert("Secret should only include digits.");
        return;
    }
    const input = parseInt(inputEl.value);

    let numEl = document.getElementById("num3");
    if (!onlyDigits(numEl.value)) {
        alert("Number of shares must be a whole number.");
        return;
    }
    const num = parseInt(numEl.value);
    if (num < 2) {
        alert("Number of shares must be at least 2.");
        return;
    }

    let minEl = document.getElementById("min3");
    if (!onlyDigits(minEl.value)) {
        alert("Minimum number of shares must be a whole number.");
        return;
    }
    const min = parseInt(minEl.value);
    if (min < 2) {
        alert("Minimum number of shares must be at least 2.");
        return;
    }

    if (min > num) {
        alert("Minimum number of shares cannot be bigger than the number of shares.");
        return;
    }

    const output = document.getElementById("output3");
    output.value = "";

    const points = makeRandomShares(input, min, num);
    for (const point of points) {
        output.value += `${point[0]} ${point[1]}\n`;
    }
};
window.generateShares3 = generateShares3;

const recoverSecret3 = _ => {
    const input = document.getElementById("input3");
    const output = document.getElementById("output3");
    input.value = "";

    const sharesParsed = [];
    const shares = output.value.split("\n");
    for (let share of shares) {
        share = share.trim();

        if (share === "") {
            continue;
        }

        const [x, y] = share.split(" ");

        if (!onlyDigits(x) || !onlyDigits(y)) {
            alert("Shares should only have digit points.");
            return;
        }

        sharesParsed.push([BigInt(x), BigInt(y)]);
    }

    const secret = recoverSecret(sharesParsed);
    input.value = `${secret}`;
};
window.recoverSecret3 = recoverSecret3;
