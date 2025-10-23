import * as fcl from "@onflow/fcl";

const appTitle = process.env.NEXT_PUBLIC_FLOW_APP_TITLE || "Intimacy Habit Tracker";
const appIcon = process.env.NEXT_PUBLIC_FLOW_APP_ICON || "https://avatars.githubusercontent.com/u/62387156?s=200&v=4";
const accessNode = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org";
const walletDiscovery = process.env.NEXT_PUBLIC_WALLET_DISCOVERY || "https://fcl-discovery.onflow.org/testnet/authn";
const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

fcl.config()
  .put("flow.network", network)
  .put("accessNode.api", accessNode)
  .put("discovery.wallet", walletDiscovery) // legacy key
  .put("discovery.wallet.method", "IFRAME/RPC")
  .put("discovery.authn.endpoint", walletDiscovery) // backward compat
  .put("app.detail.title", appTitle)
  .put("app.detail.icon", appIcon);

export {};