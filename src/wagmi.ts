import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, optimism, sepolia, arbitrumSepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, optimism, arbitrumSepolia],
    connectors: [
      // injected({
        // target: 'metaMask',
        // target() {
        //   return {
        //     id: 'metaMask',
        //     name: 'metaMask',
        //     provider: () => (typeof window !== 'undefined' ? (window as any)._ethers : undefined),
        //   }
        // },
      // }),
      metaMask(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [optimism.id]: http(),
      [arbitrumSepolia.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}