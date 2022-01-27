const width = 600;
const height = 500;
const tries = 200;

const plot = {
    target: "#plot",
    width,
    height,
    yAxis: {
        label: "Dollars",
        domain: [0, height / 5]
    },
    xAxis: {
        label: "Plays",
        domain: [0, width / 5]
    },
    grid: false,
    data: [],
    disableZoom: true
};
functionPlot(plot);

const redrawPlot = _ => {
    plot.data = [];
    const brokeLines = [];
    for (let i = 0; i < tries; i++) {
        const line = {
            points: [[0, 2]],
            fnType: "points",
            graphType: "polyline",
            color: "steelblue"
        };
        let broke = false;
        for (let j = 0; j < width / 2; j++) {
            const [x, y] = line.points[line.points.length - 1];
            if (y === 0) {
                broke = true;
                break;
            }
            switch (Math.floor(Math.random() * 4)) {
                case 0:
                    line.points.push([x + 1, y - 1]);
                    break;
                default:
                    line.points.push([x + 1, y + 1]);
                    break;
            }
        }
        if (broke) {
            line.color = "red";
            brokeLines.push(line);
        } else {
            plot.data.push(line);
        }
    }
    for (const line of brokeLines) {
        plot.data.push(line);
    }
    functionPlot(plot);
};
redrawPlot();

const plays1 = parseInt(document.getElementById("plays1").value);
const samples1 = parseInt(document.getElementById("samples1").value);
const result1 = document.getElementById("result1");
const accuracy1 = document.getElementById("accuracy1");

const simulate1 = _ => {
    if (isNaN(plays1) || isNaN(samples1)) {
        alert("Inputs should be numbers.");
        return;
    }

    if (plays1 <= 0 || samples1 <= 0) {
        alert("Inputs should be positive.");
        return;
    }

    let brokeCount = 0;
    for (let i = 0; i < samples1; i++) {
        let dollars = 2;
        for (let j = 0; j < plays1; j++) {
            // Broke
            if (dollars === 0) {
                brokeCount++;
                break;
            }
            // Cannot go broke
            if (dollars > plays1 - j) {
                break;
            }
            switch (Math.floor(Math.random() * 4)) {
                case 0:
                    dollars--;
                    break;
                default:
                    dollars++;
                    break;
            }
        }
    }

    result1.innerHTML = `Probability of going broke: ${Math.round(10000 * brokeCount / samples1) / 100}%`;
    accuracy1.innerHTML = `Error: ${Math.round(10000 * (brokeCount / samples1 - 1 / 9)) / 100}%`;
};

/**
 * https://stackoverflow.com/a/37319954
 * In-place filter
 */
function filterInPlace(a, condition) {
    let i = 0, j = 0;

    while (i < a.length) {
        const val = a[i];
        if (condition(val, i, a)) a[j++] = val;
        i++;
    }

    a.length = j;
    return a;
}

let running = false;
let brokeCount = 0;
let totalCount = 0;
let simulationInterval;
const simulationData = [];
const simulationSpeed = 1000;
const button2 = document.getElementById("button2");
const result2 = document.getElementById("result2");
const error2 = document.getElementById("error2");
const stats2 = document.getElementById("stats2");

const simulate2 = _ => {
    if (running) {
        button2.innerHTML = "Start Simulation";
        clearInterval(simulationInterval);
        running = false;
    } else {
        button2.innerHTML = "Stop Simulation";
        simulationInterval = setInterval(simulate2Iteration, 0);
        running = true;
    }
};

const simulate2Iteration = _ => {
    totalCount += simulationSpeed;
    simulationData.push(...Array(simulationSpeed).fill(2));
    simulationData.forEach((_, i) => {
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                simulationData[i]--;
                return;
            default:
                simulationData[i]++;
                return;
        }
    });
    const length = simulationData.length;
    filterInPlace(simulationData, val => val !== 0);
    brokeCount += length - simulationData.length;
    result2.innerHTML = `Probability of going broke: ${Math.round(10000 * brokeCount / totalCount) / 100}%`;
    error2.innerHTML = `Error: ${Math.round(10000 * (brokeCount / totalCount - 1 / 9)) / 100}%`;
    stats2.innerHTML = `Current number of samples: ${totalCount}`;
};
