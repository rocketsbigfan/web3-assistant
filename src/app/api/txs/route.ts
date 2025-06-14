import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const chainId = searchParams.get('chainId');
  const address = searchParams.get('address');
  const referer = searchParams.get('referer') ?? '';
  const userAgent = req.headers.get('User-Agent') ?? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36';
  if (!chainId) {
    return Response.json({
      error: 'chainId is null',
    }, {
      status: 400,
    })
  }
  if (!address) {
    return Response.json({
      error: 'address is null',
    }, {
      status: 400,
    })
  }
  const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': userAgent,
        'Referer': referer,
      },
    });


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json({
      data
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    }, { status: 500 });
  }
}