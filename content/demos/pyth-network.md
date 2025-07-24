---
title: "Real-time Prices with Pyth Network"
description: "Get real-time prices from the Pyth Network"
date: "0007-01-01"
showthedate: false
---

Real-time prices provided by the Pyth Network.

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
  "8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221": {
    name: "Chainlink",
    symbol: "LINK",
  },
  "93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7": {
    name: "Avalanche",
    symbol: "AVAX",
  },
  b7a8eba68a997cd0210c2e1e4ee811ad2d174b3611c22d9ebf16f4cb7e9ba850: {
    name: "Stellar Lumen",
    symbol: "XLM",
  },
  f0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a: {
    name: "Shiba Inu",
    symbol: "SHIB",
  },
  "3dd2b63686a450ec7290df3a1e0b583c0481f651351edfa7636f39aed55cf8a3": {
    name: "Bitcoin Cash",
    symbol: "BCH",
  },
  "6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54": {
    name: "Litecoin",
    symbol: "LTC",
  },
  ca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b: {
    name: "Polkadot",
    symbol: "DOT",
  },
  d69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4: {
    name: "Pepe",
    symbol: "PEPE",
  },
  "78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501": {
    name: "Uniswap",
    symbol: "UNI",
  },
  "03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5": {
    name: "Aptos",
    symbol: "APT",
  },
  c415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750: {
    name: "Near",
    symbol: "NEAR",
  },
  "2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445": {
    name: "Aave",
    symbol: "AAVE",
  },
  "7f5cc8d963fc5b3d2ae41fe5685ada89fd4f14b435f8050f28c7fd409f40c2d8": {
    name: "Ethereum Classic",
    symbol: "ETC",
  },
  "3d4a2bd9535be6ce8059d75eadeba507b043257321aa544717c56fa19b49e35d": {
    name: "Render Network",
    symbol: "RENDER",
  },
  c9907d786c5821547777780a1e4f89484f3417cb14dd244f2b0a34ea7a554d67: {
    name: "Internet Computer",
    symbol: "ICP",
  },
  ffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472: {
    name: "Polygon",
    symbol: "POL",
  },
  "7da003ada32eabbac855af3d22fcf0fe692cc589f0cfd5ced63cf0bdcc742efe": {
    name: "Artificial Superintelligence Alliance",
    symbol: "FET",
  },
  fa17ceaf30d19ba51112fdcc750cc83454776f47fb0112e4af07f15f4bb1ebc0: {
    name: "Algorand",
    symbol: "ALGO",
  },
  b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819: {
    name: "Cosmos",
    symbol: "ATOM",
  },
  "9375299e31c0deb9c6bc378e6329aab44cb48ec655552a70d4b9050346a30378": {
    name: "Maker",
    symbol: "MKR",
  },
  "72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419": {
    name: "Bonk",
    symbol: "BONK",
  },
  "19ab139032007c8bd7d1fd3842ef392a5434569a72b555504a5aee47df2a0a35": {
    name: "Quant",
    symbol: "QNT",
  },
  ec7a775f46379b5e943c3526b1c8d54cd49749176b0b98e02dde68d1bd335c17: {
    name: "Stacks",
    symbol: "STX",
  },
  "2cffc28ec4268805dbcb315bb122616059a1c200dda3d56f06ac150db8dfc370": {
    name: "Vaulta",
    symbol: "A",
  },
  "7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592": {
    name: "Injective",
    symbol: "INJ",
  },
  a19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8: {
    name: "Curve DAO",
    symbol: "CRV",
  },
  "4d1f8dae0d96236fb98e8f47471a366ec3b1732b47041781934ca3a9bb2f35e7": {
    name: "The Graph",
    symbol: "GRT",
  },
  "2b386bdca7fda5cf3c3975f70318593bf144104cb00742592ecff60dd798972f": {
    name: "JasmyCoin",
    symbol: "JASMY",
  },
  c63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad: {
    name: "Lido DAO",
    symbol: "LDO",
  },
  cb7a1d45139117f8d3da0a4b67264579aa905e3b124efede272634f094e1e9d1: {
    name: "The Sandbox",
    symbol: "SAND",
  },
  "649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756": {
    name: "Helium",
    symbol: "HNT",
  },
  "1dfffdcbc958d732750f53ff7f06d24bb01364b3f62abea511a390c74b8d16a5": {
    name: "Decentraland",
    symbol: "MANA",
  },
  "0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03": {
    name: "Tezos",
    symbol: "XTZ",
  },
  "4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc": {
    name: "dogwifhat",
    symbol: "WIF",
  },
  be9b59d178f0d6a97ab4c343bff2aa69caa1eaae3e9048a65788c529b125bb24: {
    name: "Zcash",
    symbol: "ZEC",
  },
  "9db37f4d5654aad3e37e2e14ffd8d53265fb3026d1d8f91146539eebaa2ef45f": {
    name: "Aerodrome Finance",
    symbol: "AERO",
  },
  "15add95022ae13563a11992e727c91bdb6b55bc183d9d747436c80a483d8c864": {
    name: "ApeCoin",
    symbol: "APE",
  },
  b7e3904c08ddd9c0c10c6d207d390fd19e87eb6aab96304f571ed94caebdefa0: {
    name: "Axie Infinity",
    symbol: "AXS",
  },
  e799f456b358a2534aa1b45141d454ac04b444ed23b1440b778549bb758f2b5c: {
    name: "Chiliz",
    symbol: "CHZ",
  },
  "4a8e42861cabc5ecb50996f92e7cfa2bce3fd0a2423b0c44c9b423fb2bd25478": {
    name: "Compound",
    symbol: "COMP",
  },
  "63f341689d98a12ef60a5cff1d7f85c70a9e17bf1575f0e7c0b2512d48b1c8b3": {
    name: "1inch",
    symbol: "1INCH",
  },
  "39d020f60982ed892abbcd4a06a276a9f9b7bfbce003204c110b6e488f502da3": {
    name: "Synthetix Network",
    symbol: "SNX",
  },
  "488f59877d3950ca12c5529d3ec6d4904666b2ec2d37616e61ecc88e3d23d51c": {
    name: "Oasis",
    symbol: "ROSE",
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
