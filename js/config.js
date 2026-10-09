/* ==========================================================================
   QUANTUM INU ($QI) - SITE CONFIG
   Blue cosmic star-Shiba on Ethereum.
   No emojis anywhere in copy.
   ========================================================================== */

// Official X account.
const X_URL = "https://x.com/quantuminucoin";

// Ethereum contract address (CA). Leave "" until launch.
// Once set, DexScreener chart + Uniswap buy links switch on.
// Until then the site shows this placeholder.
const CA = "";
const CA_DISPLAY = CA || "0xcomingsoon";

window.SITE = {
  name: "Quantum Inu",
  symbol: "QI",
  description: "Tiny paws. Infinite possibilities. One quantum leap to the moon.",
  aboutLong: "Quantum Inu is a blue-star Shiba born from collapsed waveforms and cosmic dust. On Ethereum it vaults across realities, leaving trails of light where other dogs leave footprints. Hold $QI and ride the superposition all the way up.",
  chain: "ethereum",
  chainName: "Ethereum",
  contract: CA_DISPLAY,
  launched: Boolean(CA),
  domain: "quantuminu.si",
  links: {
    x: X_URL,
    telegram: "",
    buy: CA ? `https://app.uniswap.org/swap?chain=ethereum&outputCurrency=${CA}` : "",
    dexscreener: CA ? `https://dexscreener.com/ethereum/${CA}` : ""
  },
  dexName: "Uniswap",
  dexscreenerEmbed: CA ? `https://dexscreener.com/ethereum/${CA}?embed=1&theme=dark&trades=0&info=0` : "",
  icons: {
    chain: "assets/icons/ethereum.svg",
    dex: "assets/icons/uniswap.svg",
    wallet: "assets/icons/metamask.svg"
  },
  wallet: "MetaMask",
  gasToken: "ETH",
  steps: [
    {
      title: "Create a Wallet",
      icon: "assets/icons/metamask.svg",
      img: "assets/gen/scene-howto.webp",
      text: "Install MetaMask and create a wallet. Ethereum is the default network. Keep your recovery phrase offline."
    },
    {
      title: "Get ETH",
      icon: "assets/icons/ethereum.svg",
      img: "assets/gen/scene-launch.webp",
      text: "Ethereum uses ETH for gas. Buy or send ETH to your wallet so you can trade and pay fees."
    },
    {
      title: "Go to Uniswap",
      icon: "assets/icons/uniswap.svg",
      img: "assets/gen/about-scene.webp",
      text: "Open app.uniswap.org, switch the network to Ethereum, connect your wallet, and paste the {symbol} contract address."
    },
    {
      title: "Swap for {symbol}",
      icon: "assets/icons/dexscreener.svg",
      img: "assets/gen/scene-community.webp",
      text: "Enter your ETH amount, confirm the swap, and join {name} on Ethereum."
    }
  ],
  marquee: ["Quantum Inu", "$QI", "Ethereum", "Tiny Paws", "Infinite Possibilities", "Quantum Leap", "To The Moon"],
  stats: [
    { label: "Ticker", value: "$QI" },
    { label: "Chain", value: "Ethereum" },
    { label: "Tax", value: "0/0" },
    { label: "Possibilities", value: "Infinite" }
  ],
  gallery: [
    { src: "assets/gen/about-scene.webp", caption: "Star Shiba", text: "Born from blue stardust and a single collapsed waveform." },
    { src: "assets/gen/scene-launch.webp", caption: "The Leap", text: "One quantum vault across the void toward the moon." },
    { src: "assets/gen/scene-community.webp", caption: "The Pack", text: "Holders synced across overlapping realities." },
    { src: "assets/gen/scene-howto.webp", caption: "Warp Gate", text: "Bridge in, swap, and ride the superposition." },
    { src: "assets/gen/scene-lore.webp", caption: "Cosmic Lore", text: "Tiny paws print light across infinite timelines." },
    { src: "assets/gen/scene-pose.webp", caption: "Ready State", text: "Observed or not, $QI is already mid-leap." }
  ],
  floaters: [],
  slots: { about: "assets/gen/about-scene.webp" },
  particles: { count: 90, shape: "star", linkDistance: 100, speed: 0.28 }
};
