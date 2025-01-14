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
    const grid = document.getElementById('grid');

    const streams = [
        ["wss://eth.drpc.org", "Ethereum", "-"],
        ["wss://base.drpc.org", "Base", "Optimism"],
        ["wss://arbitrum.drpc.org", "Arbitrum One", "Arbitrum"],
        ["wss://polygon.drpc.org", "Polygon POS", "Polygon"],
        ["wss://optimism.drpc.org", "OP Mainnet", "Optimism"],
        ["wss://mainnet.era.zksync.io/ws", "zkSync Era", "-"],
        ["wss://blast.drpc.org", "Blast", "Optimism"],
        ["wss://linea.drpc.org", "Linea", "-"],
        ["wss://scroll.drpc.org", "Scroll", "-"],
        ["wss://metis-rpc.publicnode.com", "Metis", "OVM"],
        ["wss://worldchain.drpc.org", "World Chain", "Optimism"],
        ["wss://zircuit-mainnet.drpc.org", "Zircuit", "Optimism"],
        ["wss://mode.drpc.org", "Mode", "Optimism"],
        ["wss://taiko.drpc.org", "Taiko", "-"],
        ["wss://bob.drpc.org", "Build On Bitcoin", "Optimism"],
        ["wss://rpc.redstonechain.com", "Redstone", "Optimism"],
        ["wss://fraxtal.drpc.org", "Fraxtal", "Optimism"],
        ["wss://lisk.drpc.org", "Lisk", "Optimism"],
        ["wss://rpc.cyber.co", "Cyber", "Optimism"],
        ["wss://rpc.zora.energy", "Zora", "Optimism"],
        ["wss://ink.drpc.org", "Ink", "Optimism"],
        ["wss://gnosis.drpc.org", "Gnosis", "-"],
        ["wss://api.blockeden.xyz/polygon_zkevm/67nCBdZQSH9z3YqDDjdm", "Polygon zkEVM", "Polygon"],
        ["wss://arbitrum-nova.publicnode.com", "Arbitrum Nova", "Arbitrum"],
    ];

    const data = {};
    for (const [url, name, stack] of streams) {
        data[name] = {
            "Chain": name,
            "Stack": stack,
            "Block Number": "-",
            "Mgas/s": "-",
            "Block Time (s)": "-",
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
                return;
            }
            const result = message.params.result;

            let timestamp = Date.now();
            let last_timestamp = 0;
            let mgas_s = "-";
            let block_time = "-";
            if (data[name]["Timestamp (s)"] !== "-") {
                last_timestamp = data[name]["Timestamp (s)"];
                mgas_s = (parseInt(result.gasUsed, 16) / 1000000) / ((timestamp - last_timestamp) / 1000);
                block_time = (timestamp - last_timestamp) / 1000;
            }
            data[name] = {
                "Chain": name,
                "Stack": stack,
                "Block Number": parseInt(result.number, 16),
                "Mgas/s": mgas_s,
                "Block Time (s)": block_time,
                "Timestamp (s)": timestamp,
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
                        column: { id: 'Block Time (s)' },
                        style: { textAlign: 'right' },
                        value: ({ value }) => value === "-" ? "-": value.toFixed(2)
                    },
                    {
                        column: { id: 'Timestamp (s)' },
                        style: { textAlign: 'right' },
                        value: ({ value }) => value === "-" ? "-": Math.round(value / 1000)
                    },
                    {
                        column: { id: 'Mgas/s' },
                        style: { textAlign: 'right' },
                        value: ({ value }) => value === "-" ? "-": value.toFixed(2)
                    }
                ]
            });
        };
    }
</script>
