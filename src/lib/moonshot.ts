export async function queryMoonshot(prompt: string, walletAddress: string, transactions: any[], balance: any) {
  const systemPrompt = `你是一个 Web3 智能助手，你知道1ETH=1e18WEI，
  当前用户钱包余额是 ${balance.formatted} ${balance.symbol}，
  当前用户钱包地址是 ${walletAddress}，
  当前用户钱包交易记录是 ${transactions.map((item: any) => `hash: ${item.hash} from: ${item.from} to: ${item.to} value: ${item.value} timeStamp: ${item.timeStamp}`).join(' \n ')}，
  请根据链上行为给予回答。
  `

  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-32k',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? '暂无回复'
}
