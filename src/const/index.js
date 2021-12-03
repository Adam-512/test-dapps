const ChainId = 256
export const ChainParam = {
  chainId: `0x${ChainId.toString(16)}`,
  chainName: 'Huobi ECO Chain Testnet',
  nativeCurrency: {
    name: 'HT',
    symbol: 'HT',
    decimals: 18,
  },
  rpcUrls: ['https://http-testnet.hecochain.com/'],
  blockExplorerUrls: ['https://testnet.hecoinfo.com/'],
}