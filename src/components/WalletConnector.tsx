'use client'
import { injected, useAccount, useBalance, useChainId, useChains, useConnect, useDisconnect, useEnsName, useSwitchChain, useTransaction } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { WalletOptions } from './WalletOptions'
import { useTransactionCount } from 'wagmi'
import { arbitrumSepolia } from 'viem/chains'
import { createPublicClient, formatEther, getAddress, http } from 'viem'
import { ForwardedRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
// import { InjectedConnector } from 'wagmi/connect'


type Token = `0x$string}`
// todo 切换链，切换token switchchain token
export function WalletConnector({ ref }: { ref?: ForwardedRef<any> }) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { chains, switchChain } = useSwitchChain()
  const transactions = useTransactions(address, arbitrumSepolia.id)
  const [token, setToken] = useState<Token>()
  const inputRef = useRef<HTMLInputElement>(null)
  const result = useBalance({
    address,
    chainId,
    token
    // token: '0xa'
  })
  useImperativeHandle(ref, () => ({
    transactions,
    balance: result.data ? {
      formatted: result.data.formatted,
      symbol: result.data.symbol,
      value: result.data.value,
      decimals: result.data.decimals,
    } : null,
    getDatas: () => {
      return {
        transactions,
        balance: result.data ? {
          formatted: result.data.formatted,
          symbol: result.data.symbol,
          value: result.data.value,
        } : null,
      }
    }
  }))

  return (
    <div className="mb-4">
      {isConnected ? (
        <div>
          <div className='flex justify-between'>
            <div className={`flex-1`}>
              余额：{result.data?.formatted} {result.data?.symbol}
            </div>
            
            <button onClick={() => disconnect()} className={`text-red-500 underline cursor-pointer`}>
              断开钱包（{address?.slice(0, 6)}...{address?.slice(-4)}）
              {/* {ensAvatar && <img className="w-6 h-6 rounded-full inline-block ml-2" src={ensAvatar} alt="" />} */}
              {/* {ensName && <span className="ml-2">{ensName}</span>} */}
            </button>
          </div>
          <div className='my-4 flex gap-4'>
            {
              chains.map(chain => {
                return (
                  <div 
                    key={chain.id}
                    onClick={() => {
                      inputRef.current!.value = ''
                      switchChain({
                        chainId: chain.id
                      })
                      setToken(undefined)
                    }}
                    className={`py-2 px-4 bg-amber-600 text-white rounded-full opacity-60 cursor-pointer ${chainId === chain.id ? 'opacity-100' : ''}`}
                  >{chain.name}</div>
                )
              })
            }
          </div>
          <div>
            token:
            <input ref={inputRef} className='ml-4 border px-2 py-1 rounded' />
            <button onClick={() => setToken(inputRef.current?.value as Token)} className='p-1 rounded text-black bg-transparent'>查询</button>
          </div>
        </div>
      ) : (
        <WalletOptions />
      )}
    </div>
  )
}
