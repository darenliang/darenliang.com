---
title: "Real-time Prices with Pyth Network"
description: "Get real-time prices from the Pyth Network"
date: "0007-01-01"
showthedate: false
---

Real-time prices for the [MarketVector Coinbase 50 Index (COIN50)](https://www.marketvector.com/factsheets/download/COIN50.d.pdf) provided by the [Pyth Network](https://pythdata.app/explore).

<div id="grid"></div>
<script src="https://unpkg.com/js-spread-grid@latest/dist/index.js"></script>

<script type="module">
const grid = document.getElementById("grid");

const streams = {
  e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43: {
    name: "Bitcoin",
    symbol: "BTC",
  },
  ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace: {
    name: "Ethereum",
    symbol: "ETH",
  },
  ec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8: {
    name: "XRP",
    symbol: "XRP",
  },
  ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d: {
    name: "Solana",
    symbol: "SOL",
  },
  dcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c: {
    name: "Dogecoin",
    symbol: "DOGE",
  },
  "2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d": {
    name: "Cardano",
    symbol: "ADA",
  },
  "3dd2b63686a450ec7290df3a1e0b583c0481f651351edfa7636f39aed55cf8a3": {
    name: "Bitcoin Cash",
    symbol: "BCH",
  },
  "8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221": {
    name: "Chainlink",
    symbol: "LINK",
  },
  b7a8eba68a997cd0210c2e1e4ee811ad2d174b3611c22d9ebf16f4cb7e9ba850: {
    name: "Stellar",
    symbol: "XLM",
  },
  "6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54": {
    name: "Litecoin",
    symbol: "LTC",
  },
  "93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7": {
    name: "Avalanche",
    symbol: "AVAX",
  },
  "3728e591097635310e6341af53db8b7ee42da9b3a8d918f9463ce9cca886dfbd": {
    name: "Hedera",
    symbol: "HBAR",
  },
  f0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a: {
    name: "Shiba Inu",
    symbol: "SHIB",
  },
  "410f41de235f2db824e562ea7ab2d3d3d4ff048316c61d629c0b93f58584e1af": {
    name: "Bittensor",
    symbol: "TAO",
  },
  "78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501": {
    name: "Uniswap",
    symbol: "UNI",
  },
  ca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b: {
    name: "Polkadot",
    symbol: "DOT",
  },
  "4e3037c822d852d79af3ac80e35eb420ee3b870dca49f9344a38ef4773fb0585": {
    name: "Mantle",
    symbol: "MNT",
  },
  c415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750: {
    name: "Near",
    symbol: "NEAR",
  },
  d69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4: {
    name: "Pepe",
    symbol: "PEPE",
  },
  "a483243eed64ca27a1f6e26385b7d1e0d07e9fe264bb6903efb3efc4689d3fe7": {
    name: "Sky",
    symbol: "SKY",
  },
  c9907d786c5821547777780a1e4f89484f3417cb14dd244f2b0a34ea7a554d67: {
    name: "Internet Computer",
    symbol: "ICP",
  },
  "2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445": {
    name: "Aave",
    symbol: "AAVE",
  },
  "7f5cc8d963fc5b3d2ae41fe5685ada89fd4f14b435f8050f28c7fd409f40c2d8": {
    name: "Ethereum Classic",
    symbol: "ETC",
  },
  fa17ceaf30d19ba51112fdcc750cc83454776f47fb0112e4af07f15f4bb1ebc0: {
    name: "Algorand",
    symbol: "ALGO",
  },
  b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819: {
    name: "Cosmos",
    symbol: "ATOM",
  },
  ffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472: {
    name: "Polygon",
    symbol: "POL",
  },
  "b7910ba7322db020416fcac28b48c01212fd9cc8fbcbaf7d30477ed8605f6bd4": {
    name: "Ethena",
    symbol: "ENA",
  },
  "3d4a2bd9535be6ce8059d75eadeba507b043257321aa544717c56fa19b49e35d": {
    name: "Render",
    symbol: "RENDER",
  },
  "19ab139032007c8bd7d1fd3842ef392a5434569a72b555504a5aee47df2a0a35": {
    name: "Quant",
    symbol: "QNT",
  },
  "03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5": {
    name: "Aptos",
    symbol: "APT",
  },
  "3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5": {
    name: "Arbitrum",
    symbol: "ARB",
  },
  "035aa8d0a2d74e19438f2c1440edff9f3b95f915ca65f681a25ed0bad3dc228d": {
    name: "Flare",
    symbol: "FLR",
  },
  "1722176f738aa1aafea170f8b27724042c5ac6d8cb9cf8ae02d692b0927e0681": {
    name: "VeChain",
    symbol: "VET",
  },
  "72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419": {
    name: "Bonk",
    symbol: "BONK",
  },
  "7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592": {
    name: "Injective",
    symbol: "INJ",
  },
  ec7a775f46379b5e943c3526b1c8d54cd49749176b0b98e02dde68d1bd335c17: {
    name: "Stacks",
    symbol: "STX",
  },
  "7da003ada32eabbac855af3d22fcf0fe692cc589f0cfd5ced63cf0bdcc742efe": {
    name: "Artificial Superintelligence Alliance",
    symbol: "FET",
  },
  "53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb": {
    name: "Sei",
    symbol: "SEI",
  },
  e799f456b358a2534aa1b45141d454ac04b444ed23b1440b778549bb758f2b5c: {
    name: "Chiliz",
    symbol: "CHZ",
  },
  "09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723": {
    name: "Celestia",
    symbol: "TIA",
  },
  "941320a8989414874de5aa2fc340a75d5ed91fdff1613dd55f83844d52ea63a2": {
    name: "Immutable X",
    symbol: "IMX",
  },
  "0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03": {
    name: "Tezos",
    symbol: "XTZ",
  },
  a19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8: {
    name: "Curve DAO",
    symbol: "CRV",
  },
  "b27578a9654246cb0a2950842b92330e9ace141c52b63829cc72d5c45a5a595a": {
    name: "Ether.fi",
    symbol: "ETHFI",
  },
  c63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad: {
    name: "Lido DAO",
    symbol: "LDO",
  },
  "2b386bdca7fda5cf3c3975f70318593bf144104cb00742592ecff60dd798972f": {
    name: "JasmyCoin",
    symbol: "JASMY",
  },
  "4d1f8dae0d96236fb98e8f47471a366ec3b1732b47041781934ca3a9bb2f35e7": {
    name: "The Graph",
    symbol: "GRT",
  },
  cb7a1d45139117f8d3da0a4b67264579aa905e3b124efede272634f094e1e9d1: {
    name: "The Sandbox",
    symbol: "SAND",
  },
  "1dfffdcbc958d732750f53ff7f06d24bb01364b3f62abea511a390c74b8d16a5": {
    name: "Decentraland",
    symbol: "MANA",
  },
  "649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756": {
    name: "Helium",
    symbol: "HNT",
  },
};

const data = {};

for (const [id, obj] of Object.entries(streams)) {
  data[id] = {
    Name: obj.name,
    Symbol: obj.symbol,
    "Price USD": 0,
  };
}

const ws = new WebSocket("wss://hermes.pyth.network/ws");
ws.onopen = () => {
  ws.send(
    JSON.stringify({
      ids: Object.keys(streams),
      type: "subscribe",
    })
  );
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type !== "price_update") {
    return;
  }

  const id = message.price_feed.id;
  data[id]["Price USD"] =
    parseInt(message.price_feed.price.price) *
    Math.pow(10, message.price_feed.price.expo);

  SpreadGrid(grid, {
    data: data,
    columns: [
      {
        type: "DATA-BLOCK",
        width: 200,
      },
    ],
  });
};
</script>
