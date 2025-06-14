import { useEffect, useState } from "react"

export function useTransactions(address?: string, chainId?: number) {
  const [transactions, setTransactions] = useState<any[]>([])
  useEffect(() => {
    if (address) {
      // fetch(`/api/txs?address=${address}&chainId=${arbitrumSepolia.id}`, {
      //   method: 'get',
      // })
      fetch(`https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "1") {
            setTransactions(data.result)
          }
        })
    }
  }, [address, chainId])

  return transactions
}