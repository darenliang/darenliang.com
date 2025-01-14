---
title: "Real-time Ethereum Rollups Info"
description: "Get real-time information about Ethereum rollups"
date: "0006-01-01"
showthedate: false
---

Real-time information provided by public RPC APIs.

Note that some networks might be excluded, you can comment below to have them added.

<div id="grid"></div>
<script src="https://unpkg.com/js-spread-grid@latest/dist/index.js"></script>

<script type="module">
    let _last_timestamp = 0;

    function pushData(arr, entry) {
        arr.push(entry);
        if (arr.length > 100) {
            arr.shift();
        }
    }

    function getBlocktime(arr) {
          if (arr.length < 2) {
            return 0;
          }
        const blocktime_diff = arr[arr.length - 1] - arr[0];
        return blocktime_diff / (arr.length - 1);
    }

    function getAvg(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    const grid = document.getElementById('grid');

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
        ["wss://light-soft-film.zkevm-mainnet.quiknode.pro/594b6c1cb1bc9dd9c35ce37c4140e9b81e73b7e3", "Polygon zkEVM", "Polygon"],
        ["wss://arbitrum-nova.publicnode.com", "Arbitrum Nova", "Arbitrum"],
    ];

    const data = {};
    data["Σ"] = {
        "Chain": "Σ",
        "Stack": "-",
        "Block Number": "-",
        "TPS": [],
        "Mgas/s": [],
        "Block Time (s)": [],
        "Timestamp (s)": "-",
    };
    for (const [url, name, stack] of streams) {
        data[name] = {
            "Chain": name,
            "Stack": stack,
            "Block Number": "-",
            "TPS": [],
            "Mgas/s": [],
            "Block Time (s)": [],
            "Timestamp (s)": "-",
        };
    }

    for (const [url, name, stack] of streams) {
        const ws = new WebSocket(url);
        ws.onopen = () => {
            ws.send(JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "eth_subscribe",
                "params": ["newHeads"]
            }));
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.method !== "eth_subscription") {
                if ((message.id === 2) && ("result" in message) && ("transactions" in message.result)) {
                    pushData(data[name]["TPS"], message.result.transactions.length);
                }
                return;
            }

            const result = message.params.result;
            setTimeout(() => {
                ws.send(JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "eth_getBlockByNumber",
                    "params": [result.number, false]
                }));
            }, 1000);

            let timestamp = parseInt(result.timestamp, 16);
            pushData(data[name]["Block Time (s)"], timestamp);
            pushData(data[name]["Mgas/s"], parseInt(result.gasUsed, 16) / 1000000);

            let block_number = parseInt(result.number, 16);

            data[name] = {
                "Chain": name,
                "Stack": stack,
                "Block Number": block_number,
                "TPS": data[name]["TPS"],
                "Mgas/s": data[name]["Mgas/s"],
                "Block Time (s)": data[name]["Block Time (s)"],
                "Timestamp (s)": timestamp,
            };

            let sigma_tps = 0;
            let sigma_mgas_s = 0;
            for (const key in data) {
                if (key !== "Σ") {
                    sigma_tps += data[key]["TPS"] === "-" ? 0 : data[key]["TPS"];
                    sigma_mgas_s += data[key]["Mgas/s"] === "-" ? 0 : data[key]["Mgas/s"];
                }
            }
            data["Σ"] = {
                "Chain": "Σ",
                "Stack": "-",
                "Block Number": "-",
                "TPS": sigma_tps,
                "Mgas/s": sigma_mgas_s,
                "Block Time (s)": [],
                "Timestamp (s)": "-",
            };

            SpreadGrid(grid, {
                data: data,
                columns: [{
                    type: 'DATA-BLOCK',
                    width: "fit"
                }],
                formatting: [{
                        row: {
                            id: "Ethereum"
                        },
                        style: ({
                            value,
                            row,
                            data
                        }) => ({
                            background: '#d6f6d6',
                        })
                    },
                    {
                        font: '16px Space Mono'
                    },
                    {
                        column: { id: 'Block Number' },
                        style: { textAlign: 'right' } 
                    },
                   {
                        column: { id: 'TPS' },
                        style: { textAlign: 'right' },
                        text: ({ row, value }) => (value.length === 0) || (getBlocktime(data[row.id]["Block Time (s)"]) === 0) ? "-": (getAvg(value) / getBlocktime(data[row.id]["Block Time (s)"])).toFixed(2)
                    },
                    {
                        column: { id: 'Block Time (s)' },
                        style: { textAlign: 'right' },
                        text: ({ value }) => value.length < 2 ? "-": getBlocktime(value).toFixed(2)
                    },
                    {
                        column: { id: 'Timestamp (s)' },
                        style: { textAlign: 'right' },
                        text: ({ value }) => value === "-" ? "-": Math.round(value / 1000)
                    },
                    {
                        column: { id: 'Mgas/s' },
                        style: { textAlign: 'right' },
                        text: ({ row, value }) => (value.length === 0) || (getBlocktime(data[row.id]["Block Time (s)"]) === 0) ? "-": (getAvg(value) / getBlocktime(data[row.id]["Block Time (s)"])).toFixed(2)
                    }
                ]
            });
        };
    }
</script>
