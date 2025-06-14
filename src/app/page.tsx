'use client'
import { useRef, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { queryMoonshot } from '../lib/moonshot'
import { WalletConnector } from '../components/WalletConnector'
import { arbitrumSepolia } from 'viem/chains'

export default function HomePage() {
  const { address } = useAccount()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const walletConnectorRef = useRef<any>(null)
  const handleAsk = async () => {
    if (!address) return alert('请先连接钱包')
    setLoading(true)
    const { transactions, balance } = walletConnectorRef.current.getDatas()
    const res = await queryMoonshot(question, address, transactions, balance)
    setAnswer(res)
    setLoading(false)
  }



  return (
    <main className="max-w-2xl mx-auto p-6">
      <WalletConnector ref={walletConnectorRef} />
      <h1 className="text-2xl font-bold mb-4">🧠 Web3 智能助理</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="请输入你的问题，例如：我这周花了多少钱？"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
      <button
        onClick={handleAsk}
        disabled={!address || loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded ${!address || loading ? 'opacity-80 cursor-not-allowed' : ''}`}
      >
        {loading ? '处理中...' : '提问'}
      </button>
      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </main>
  )
}
