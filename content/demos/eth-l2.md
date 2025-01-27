---
title: "Real-time Ethereum Rollups Info"
description: "Get real-time information about Ethereum rollups"
date: "0007-01-01"
showthedate: false
---

Real-time information provided by public RPC APIs.

* Yellow indicates that the chain has yet to report two blocks.
* Red indicates that the chain has not reported blocks for a while.

Many more chains are missing, you can comment below to have them added.

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
  return (time_diff / number_diff);
}

const grid = document.getElementById("grid");

const streams = {
  Ethereum: {
    rpc: "wss://eth.drpc.org",
    stack: "-",
    url: "https://ethereum.org",
    explorer: "https://etherscan.io/block/",
  },
  Base: {
    rpc: "wss://base.drpc.org",
    stack: "Optimism",
    url: "https://www.base.org",
    explorer: "https://basescan.org/block/",
  },
  "Arbitrum One": {
    rpc: "wss://arbitrum.drpc.org",
    stack: "Arbitrum",
    url: "https://arbitrum.io/rollup",
    explorer: "https://arbiscan.io/block/",
  },
  "OP Mainnet": {
    rpc: "wss://optimism.drpc.org",
    stack: "Optimism",
    url: "https://optimism.io",
    explorer: "https://optimistic.etherscan.io/block/",
  },
  "Polygon POS": {
    rpc: "wss://polygon.drpc.org",
    stack: "Polygon",
    url: "https://polygon.technology/polygon-pos",
    explorer: "https://polygonscan.com/block/",
  },
  "zkSync Era": {
    rpc: "wss://mainnet.era.zksync.io/ws",
    stack: "-",
    url: "https://zksync.io",
    explorer: "https://explorer.zksync.io/batch/",
  },
  Blast: {
    rpc: "wss://rpc.blast.io",
    stack: "Optimism",
    url: "https://blast.io",
    explorer: "https://blastscan.io/block/",
  },
  Linea: {
    rpc: "wss://linea.drpc.org",
    stack: "-",
    url: "https://linea.build",
    explorer: "https://lineascan.build/block/",
  },
  "World Chain": {
    rpc: "wss://worldchain.drpc.org",
    stack: "Optimism",
    url: "https://world.org/world-chain",
    explorer: "https://worldscan.org/block/",
  },
  Scroll: {
    rpc: "wss://scroll.drpc.org",
    stack: "-",
    url: "https://scroll.io",
    explorer: "https://scrollscan.com/block/",
  },
  Zircuit: {
    rpc: "wss://zircuit-mainnet.drpc.org",
    stack: "Optimism",
    url: "https://www.zircuit.com",
    explorer: "https://explorer.zircuit.com/blocks/",
  },
  "Build On Bitcoin": {
    rpc: "wss://bob.drpc.org",
    stack: "Optimism",
    url: "https://www.gobob.xyz",
    explorer: "https://3xpl.com/bob/block/",
  },
  Mode: {
    rpc: "wss://mainnet.mode.network",
    stack: "Optimism",
    url: "https://mode.network",
    explorer: "https://explorer.mode.network/block/",
  },
  Taiko: {
    rpc: "wss://taiko.drpc.org",
    stack: "-",
    url: "https://taiko.xyz",
    explorer: "https://taikoscan.io/block/",
  },
  Fraxtal: {
    rpc: "wss://fraxtal.drpc.org",
    stack: "Optimism",
    url: "https://frax.com",
    explorer: "https://fraxscan.com/block/",
  },
  Metis: {
    rpc: "wss://metis-mainnet.blastapi.io/f532a60e-286a-44b9-8455-e1aebc8bc21d",
    stack: "-",
    url: "https://metis.io",
    explorer: "https://explorer.metis.io/batch/",
  },
  Lisk: {
    rpc: "wss://ws.api.lisk.com",
    stack: "Optimism",
    url: "https://lisk.com",
    explorer: "https://blockscout.lisk.com/block/",
  },
  Ink: {
    rpc: "wss://ws-gel.inkonchain.com",
    stack: "Optimism",
    url: "https://inkonchain.com",
    explorer: "https://explorer.inkonchain.com/block/",
  },
  Soneium: {
    rpc: "wss://rpc.soneium.org",
    stack: "Optimism",
    url: "https://soneium.org",
    explorer: "https://soneium.blockscout.com/block/",
  },
  Morph: {
    rpc: "wss://rpc-quicknode.morphl2.io",
    stack: "Optimism",
    url: "https://www.morphl2.io",
    explorer: "https://explorer.morphl2.io/block/",
  },
  Zora: {
    rpc: "wss://rpc.zora.energy",
    stack: "Optimism",
    url: "https://zora.energy",
    explorer: "https://explorer.zora.energy/block/",
  },
  Mint: {
    rpc: "wss://rpc.mintchain.io",
    stack: "Optimism",
    url: "https://mintchain.io",
    explorer: "https://explorer.mintchain.io/block/",
  },
  Redstone: {
    rpc: "wss://rpc.redstonechain.com",
    stack: "Optimism",
    url: "https://redstone.xyz",
    explorer: "https://explorer.redstone.xyz/block/",
  },
  Xai: {
    rpc: "wss://xai-mainnet.rpc.quicknode.com",
    stack: "Arbitrum",
    url: "https://xai.games",
    explorer: "https://xaiscan.io/block/",
  },
  Cyber: {
    rpc: "wss://rpc.cyber.co",
    stack: "Optimism",
    url: "https://cyber.co",
    explorer: "https://cyberscan.co/block/",
  },
  Gnosis: {
    rpc: "wss://rpc.gnosischain.com/wss",
    stack: "-",
    url: "https://www.gnosischain.com/",
    explorer: "https://gnosisscan.io/block/",
  },
  ApeChain: {
    rpc: "wss://apechain.calderachain.xyz/ws",
    stack: "Arbitrum",
    url: "https://apechain.com",
    explorer: "https://apescan.io/block/",
  },
  "Immutable zkEVM": {
    rpc: "wss://stylish-hardworking-dinghy.imx-mainnet.quiknode.pro/0166596fe26132eb6c819355aad99d72299e8d79",
    stack: "-",
    url: "https://www.immutable.com/",
    explorer: "https://explorer.immutable.com/block/",
  },
  "Polygon zkEVM": {
    rpc: "wss://polygon-zkevm-mainnet.blastapi.io/f532a60e-286a-44b9-8455-e1aebc8bc21d",
    stack: "Polygon",
    url: "https://polygon.technology/polygon-zkevm",
    explorer: "https://zkevm.polygonscan.com/block/",
  },
  "Arbitrum Nova": {
    rpc: "wss://arbitrum-nova.blastapi.io/f532a60e-286a-44b9-8455-e1aebc8bc21d",
    stack: "Arbitrum",
    url: "https://arbitrum.io/anytrust",
    explorer: "https://nova.arbiscan.io/block/",
  },
};

const stacks = {
  Optimism: "https://www.optimism.io",
  Arbitrum: "https://arbitrum.io/orbit",
  Polygon: "https://polygon.technology",
};

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

for (const [name, stream] of Object.entries(streams)) {
  data[name] = {
    block_numbers: [],
    transactions: [],
    gas: [],
    data: [],
    block_times: [],
  };
  display_data[name] = {
    Chain: name,
    Stack: stream.stack,
    "Block Number": -1,
    TPS: -1,
    "Mgas/s": -1,
    "KB/s": -1,
    "Block Time": -1,
    Timestamp: -1,
  };
}

for (const [name, stream] of Object.entries(streams)) {
  const ws = new WebSocket(stream.rpc);
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
        pushData(data[name].transactions, message.result.transactions.length);
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

    const block_number = parseInt(result.number, 16);
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
    if (block_time > 0) {
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
    display_data["Σ"]["Timestamp"] = Date.now() / 1000;

    const formatting = [
      {
        rows: {},
        style: ({ row }) => {
          if (row.id === "Σ") {
            return {};
          }
          const block_time = getBlocktime(
            data[row.id].block_numbers,
            data[row.id].block_times,
          );
          if (block_time === -1) {
            return {};
          }
          const current_time = Math.round(Date.now() / 1000);
          const last_block_time =
            data[row.id].block_times[data[row.id].block_times.length - 1];
          if (current_time - last_block_time > block_time + 20) {
            return { background: "#f6d6d6" };
          }
        },
      },
      {
        rows: {},
        style: ({ row }) => {
          if (display_data[row.id]["TPS"] !== -1) {
            return {};
          }
          return { background: "#f6f6d6" };
        },
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
        column: { id: "Block Time" },
        draw: ({ ctx, value, column, row }) => {
          if ((value === -1) || (row.id === "Σ")) {
            return;
          }
          const lag = (
            display_data["Σ"]["Timestamp"] - display_data[row.id]["Timestamp"]
          );
          const lag_percent = Math.max(0, Math.min(1, lag / value));
          const width = column.width - 4;
          const height = row.height - 4;
          const barWidth = width * lag_percent;
          ctx.fillStyle = '#d6e6f6';
          ctx.fillRect(2, 2, barWidth, height);
        }
      },
      {
        column: { id: "Timestamp" },
        style: { textAlign: "right" },
        text: ({ value }) => (value === -1 ? "-" : value.toFixed(0)),
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

    SpreadGrid(grid, {
      data: display_data,
      columns: [
        {
          type: "DATA-BLOCK",
          width: "fit",
        },
      ],
      rows: [
        {
          type: "HEADER",
          height: 20,
        },
        {
          type: "DATA-BLOCK",
          height: 20,
        },
      ],
      formatting: formatting,
      onCellClick: ({ columnId, rowId }) => {
        if (columnId === "Chain" && rowId in streams) {
          window.open(streams[rowId].url, "_blank");
        }
        if (columnId === "Stack" && display_data[rowId]["Stack"] in stacks) {
          window.open(stacks[display_data[rowId]["Stack"]], "_blank");
        }
        if (
          columnId === "Block Number" &&
          rowId in streams &&
          display_data[rowId]["Block Number"] !== -1
        ) {
          window.open(
            streams[rowId].explorer + display_data[rowId]["Block Number"],
            "_blank",
          );
        }
      },
    });
  };
}
</script>
