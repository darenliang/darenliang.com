---
title: "Real-time Ethereum Rollups Info"
description: "Get real-time information about Ethereum rollups"
date: "0006-01-01"
showthedate: false
---

Real-time information provided by public RPC APIs.

Note that some networks might be excluded, you can comment below to have them
added.

<div id="grid"></div>
<script src="https://unpkg.com/js-spread-grid@latest/dist/index.js"></script>

<script type="module">
function pushData(arr, entry) {
    arr.push(entry);
    if (arr.length > 100) {
        arr.shift();
    }
}

function getAvg(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function getBlocktime(block_numbers, block_times) {
    if (block_times.length < 2) {
        return -1;
    }
    const number_diff =
        block_numbers[block_numbers.length - 1] - block_numbers[0];
    const time_diff = block_times[block_times.length - 1] - block_times[0];
    return time_diff / number_diff;
}

const grid = document.getElementById("grid");

const streams = [
    ["wss://eth.drpc.org", "Ethereum", "-"],
    ["wss://base.drpc.org", "Base", "Optimism"],
    ["wss://arbitrum.drpc.org", "Arbitrum One", "Arbitrum"],
    ["wss://polygon.drpc.org", "Polygon POS", "Polygon"],
    ["wss://optimism.drpc.org", "OP Mainnet", "Optimism"],
    ["wss://mainnet.era.zksync.io/ws", "zkSync Era", "-"],
    ["wss://immutable.gateway.tenderly.co", "Immutable", "-"],
    ["wss://blast.drpc.org", "Blast", "Optimism"],
    ["wss://linea.drpc.org", "Linea", "-"],
    ["wss://scroll.drpc.org", "Scroll", "-"],
    ["wss://metis-rpc.publicnode.com", "Metis", "OVM"],
    ["wss://worldchain.drpc.org", "World Chain", "Optimism"],
    ["wss://zircuit-mainnet.drpc.org", "Zircuit", "Optimism"],
    ["wss://mode.drpc.org", "Mode", "Optimism"],
    ["wss://bob.drpc.org", "Build On Bitcoin", "Optimism"],
    ["wss://rpc.redstonechain.com", "Redstone", "Optimism"],
    ["wss://fraxtal.drpc.org", "Fraxtal", "Optimism"],
    ["wss://lisk.drpc.org", "Lisk", "Optimism"],
    ["wss://rpc.cyber.co", "Cyber", "Optimism"],
    ["wss://rpc.zora.energy", "Zora", "Optimism"],
    ["wss://ink.drpc.org", "Ink", "Optimism"],
    ["wss://gnosis.drpc.org", "Gnosis", "-"],
    [
        "wss://polygon-zkevm-mainnet.blastapi.io/f532a60e-286a-44b9-8455-e1aebc8bc21d",
        "Polygon zkEVM",
        "Polygon",
    ],
    ["wss://arbitrum-nova.publicnode.com", "Arbitrum Nova", "Arbitrum"],
];

const data = {};
const display_data = {};

display_data["Σ"] = {
    Chain: "Σ",
    Stack: "-",
    "Block Number": 0,
    TPS: -1,
    "Mgas/s": -1,
    "KB/s": -1,
    "Block Time": -1,
    Timestamp: -1,
};

for (const [url, name, stack] of streams) {
    data[name] = {
        block_numbers: [],
        transactions: [],
        gas: [],
        data: [],
        block_times: [],
    };
    display_data[name] = {
        Chain: name,
        Stack: stack,
        "Block Number": -1,
        TPS: -1,
        "Mgas/s": -1,
        "KB/s": -1,
        "Block Time": -1,
        Timestamp: -1,
    };
}

for (const [url, name, stack] of streams) {
    const ws = new WebSocket(url);
    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_subscribe",
                params: ["newHeads"],
            }),
        );
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.method !== "eth_subscription") {
            if (
                message.id === 2 &&
                "result" in message &&
                "transactions" in message.result && 
                "size" in message.result
            ) {
                pushData(
                    data[name].transactions,
                    message.result.transactions.length,
                );
                pushData(data[name].data, parseInt(message.result.size, 16));
            }
            return;
        }

        const result = message.params.result;
        setTimeout(() => {
            ws.send(
                JSON.stringify({
                    jsonrpc: "2.0",
                    id: 2,
                    method: "eth_getBlockByNumber",
                    params: [result.number, false],
                }),
            );
        }, 1000);

        let skipped = false;

        const block_number = parseInt(result.number, 16);
        if (data[name].block_numbers.length !== 0) {
            const last_block_number =
                data[name].block_numbers[data[name].block_numbers.length - 1];
            if (block_number - last_block_number > 1) {
                skipped = true;
            }
        }
        pushData(data[name].block_numbers, block_number);

        const timestamp = parseInt(result.timestamp, 16);
        pushData(data[name].block_times, timestamp);

        pushData(data[name].gas, parseInt(result.gasUsed, 16));

        display_data[name]["Block Number"] = block_number;
        display_data[name]["Timestamp"] = timestamp;

        const block_time = getBlocktime(
            data[name].block_numbers,
            data[name].block_times,
        );
        if (block_time !== -1) {
            if (data[name].transactions.length !== 0) {
                display_data[name]["TPS"] =
                    getAvg(data[name].transactions) / block_time;
            }
            if (data[name].gas.length !== 0) {
                display_data[name]["Mgas/s"] =
                    getAvg(data[name].gas) / 1e6 / block_time;
            }
            if (data[name].data.length !== 0) {
                display_data[name]["KB/s"] = getAvg(data[name].data) / 1024;
            }
            display_data[name]["Block Time"] = block_time;
        }

        let sigma_tps = 0;
        let sigma_mgas = 0;
        let sigma_kbs = 0;
        let sigma_block_time = 0;
        for (const key in display_data) {
            const item = display_data[key];
            if (item["Chain"] === "Σ") {
                continue;
            }
            if (item["TPS"] !== -1) {
                sigma_tps += item["TPS"];
            }
            if (item["Mgas/s"] !== -1) {
                sigma_mgas += item["Mgas/s"];
            }
            if (item["KB/s"] !== -1) {
                sigma_kbs += item["KB/s"];
            }
            if (item["Block Time"] !== -1) {
                sigma_block_time += 1 / item["Block Time"];
            }
        }

        display_data["Σ"]["Block Number"]++;
        display_data["Σ"]["TPS"] = sigma_tps;
        display_data["Σ"]["Mgas/s"] = sigma_mgas;
        display_data["Σ"]["KB/s"] = sigma_kbs;
        display_data["Σ"]["Block Time"] = 1 / sigma_block_time;
        display_data["Σ"]["Timestamp"] = Math.round(Date.now() / 1000);

        const formatting = [
            {
                row: {
                    id: "Ethereum",
                },
                style: ({ value, row, data }) => ({
                    background: "#d6f6d6",
                }),
            },
            {
                font: "16px Space Mono",
            },
            {
                column: { id: "Block Number" },
                style: { textAlign: "right" },
                text: ({ value }) => (value === -1 ? "-" : value),
            },
            {
                column: { id: "TPS" },
                style: { textAlign: "right" },
                text: ({ value }) => (value === -1 ? "-" : value.toFixed(2)),
            },
            {
                column: { id: "Block Time" },
                style: { textAlign: "right" },
                text: ({ value }) => (value === -1 ? "-" : value.toFixed(2)),
            },
            {
                column: { id: "Timestamp" },
                style: { textAlign: "right" },

                text: ({ value }) => (value === -1 ? "-" : value),
            },
            {
                column: { id: "Mgas/s" },
                style: { textAlign: "right" },
                text: ({ value }) => (value === -1 ? "-" : value.toFixed(2)),
            },
            {
                column: { id: "KB/s" },
                style: { textAlign: "right" },
                text: ({ value }) => (value === -1 ? "-" : value.toFixed(2)),
            },
        ];

        if (skipped) {
            formatting.push({
                row: {
                    id: name,
                },
                style: ({ value, row, data }) => ({
                    background: "#f6d6d6",
                }),
            });
        }

        SpreadGrid(grid, {
            data: display_data,
            columns: [
                {
                    type: "DATA-BLOCK",
                    width: "fit",
                },
            ],
            formatting: formatting,
        });
    };
}
</script>
