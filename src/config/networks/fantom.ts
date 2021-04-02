import FTMLogo from 'src/config/assets/token_ftm.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, FEATURES, NetworkConfig, WALLETS } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'http://localhost:8001/v1',
  txServiceUrl: 'http://localhost:8000/api/v1',
  safeAppsUrl: 'http://localhost:3002',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://rpcapi.fantom.network/',
  networkExplorerName: 'FTMScan',
  networkExplorerUrl: 'https://ftmscan.com/',
  networkExplorerApiUrl: 'https://api.ftmscan.com/',
}

const fantom: NetworkConfig = {
  environment: {
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.FANTOM,
    backgroundColor: '#48A8A6',
    textColor: '#ffffff',
    label: 'Fantom',
    isTestNet: false,
    nativeCoin: {
      address: '0x000',
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
      logoUri: FTMLogo,
    },
  },
  disabledWallets: [
    WALLETS.TREZOR,
    WALLETS.LEDGER,
    WALLETS.COINBASE,
    WALLETS.FORTMATIC,
    WALLETS.OPERA,
    WALLETS.OPERA_TOUCH,
    WALLETS.TORUS,
    WALLETS.TRUST,
    WALLETS.WALLET_CONNECT,
    WALLETS.WALLET_LINK,
    WALLETS.AUTHEREUM,
    WALLETS.LATTICE,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP],
}

export default fantom
