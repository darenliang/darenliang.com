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

const plays = parseInt(document.getElementById("plays").value);
const samples = parseInt(document.getElementById("samples").value);
const result = document.getElementById("result");

const simulate1 = _ => {
    if (isNaN(plays) || isNaN(samples)) {
        alert("Inputs should be numbers.");
        return;
    }

    if (plays <= 0 || samples <= 0) {
        alert("Inputs should be positive.");
        return;
    }

    let brokeCount = 0;
    for (let i = 0; i < samples; i++) {
        let dollars = 2;
        for (let j = 0; j < plays; j++) {
            // Broke
            if (dollars === 0) {
                brokeCount++;
                break;
            }
            // Cannot go broke
            if (dollars > plays - j) {
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

    result.innerHTML = `Probability of going broke: ${Math.round(10000 * brokeCount / samples) / 100}%`;
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
const button = document.getElementById("simulate2Button");
const simulationResult = document.getElementById("result2");
const simulationStats = document.getElementById("result2Stats");

const simulate2 = _ => {
    if (running) {
        button.innerHTML = "Start Simulation";
        clearInterval(simulationInterval);
        running = false;
    } else {
        button.innerHTML = "Stop Simulation";
        simulationInterval = setInterval(simulate2Interation, 0);
        running = true;
    }
};

const simulate2Interation = _ => {
    totalCount++;
    simulationData.push(2);
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
    simulationResult.innerHTML = `Probability of going broke: ${Math.round(10000 * brokeCount / totalCount) / 100}%`;
    simulationStats.innerHTML = `Current number of samples: ${totalCount}`;
};
