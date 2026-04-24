// Vercel Serverless Function — Wise Comparison API Proxy
// Endpoint: GET /api/comparison?sourceCurrency=USD&targetCurrency=INR&sendAmount=1000
//
// Proxies to Wise's v4 comparison endpoint and returns provider rates.
// Requires WISE_API_TOKEN environment variable set in Vercel dashboard.

const WISE_API_BASE = process.env.WISE_API_ENV === "sandbox"
  ? "https://api.sandbox.transferwise.tech"
  : "https://api.wise.com";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sourceCurrency, targetCurrency, sendAmount } = req.query;

  // Validate required parameters
  if (!sourceCurrency || !targetCurrency || !sendAmount) {
    return res.status(400).json({
      error: "Missing required parameters",
      required: ["sourceCurrency", "targetCurrency", "sendAmount"],
      example: "/api/comparison?sourceCurrency=USD&targetCurrency=INR&sendAmount=1000",
    });
  }

  const token = process.env.WISE_API_TOKEN;
  if (!token) {
    return res.status(500).json({
      error: "WISE_API_TOKEN not configured",
      hint: "Add WISE_API_TOKEN to your Vercel environment variables",
    });
  }

  try {
    const params = new URLSearchParams({
      sourceCurrency: sourceCurrency.toUpperCase(),
      targetCurrency: targetCurrency.toUpperCase(),
      sendAmount: String(sendAmount),
    });

    const wiseUrl = `${WISE_API_BASE}/v4/comparisons?${params.toString()}`;

    const response = await fetch(wiseUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "1StopRemittance/1.0",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Wise API error ${response.status}:`, errorText);
      return res.status(response.status).json({
        error: "Wise API request failed",
        status: response.status,
        details: errorText,
      });
    }

    const data = await response.json();

    // Transform the Wise response into a clean format for our frontend
    const transformed = transformComparison(data, sendAmount);

    // Cache for 60 seconds (rates update ~hourly on Wise's side)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return res.status(200).json(transformed);
  } catch (error) {
    console.error("Comparison API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

/**
 * Transform Wise v4 comparison response into our frontend format.
 *
 * Wise v4 response structure:
 * {
 *   sourceCurrency, targetCurrency, sourceCountry, targetCountry,
 *   providerCountry, providerTypes, amount, amountType,
 *   providers: [
 *     {
 *       id, alias, name, type, partner,
 *       logos: { normal, small },
 *       quotes: [
 *         {
 *           rate, fee, receivedAmount, sourceAmount, targetAmount,
 *           markup, estimatedDelivery, formattedEstimatedDelivery,
 *           isConsideredMidMarketRate, ...
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
function transformComparison(data, sendAmount) {
  const providers = (data.providers || [])
    .filter((p) => p.quotes && p.quotes.length > 0)
    .map((provider) => {
      const quote = provider.quotes[0]; // Use first (best) quote

      return {
        id: provider.id,
        name: provider.name,
        alias: provider.alias || provider.name.toLowerCase().replace(/\s+/g, ""),
        type: provider.type, // "bank" | "moneyTransferProvider"
        isPartner: provider.partner === true,
        logo: provider.logos?.normal || provider.logos?.small || null,
        rate: quote.rate || 0,
        fee: quote.fee || 0,
        sourceAmount: quote.sourceAmount || parseFloat(sendAmount),
        receivedAmount: quote.receivedAmount || quote.targetAmount || 0,
        markup: quote.markup || 0,
        isMidMarketRate: quote.isConsideredMidMarketRate || false,
        estimatedDelivery: quote.estimatedDelivery || null,
        formattedDelivery: quote.formattedEstimatedDelivery || "Unknown",
      };
    })
    // Sort by receivedAmount descending (best deal first)
    .sort((a, b) => b.receivedAmount - a.receivedAmount);

  // Calculate mid-market rate (from the provider flagged as mid-market, or Wise)
  const midMarketProvider = providers.find((p) => p.isMidMarketRate);
  const midMarketRate = midMarketProvider?.rate || providers[0]?.rate || 0;

  // Savings: best provider vs worst
  const bestReceived = providers[0]?.receivedAmount || 0;
  const worstReceived = providers[providers.length - 1]?.receivedAmount || 0;

  return {
    sourceCurrency: data.sourceCurrency,
    targetCurrency: data.targetCurrency,
    sendAmount: parseFloat(sendAmount),
    midMarketRate,
    providerCount: providers.length,
    maxSavings: +(bestReceived - worstReceived).toFixed(2),
    bestProvider: providers[0]?.name || null,
    worstProvider: providers[providers.length - 1]?.name || null,
    lastUpdated: new Date().toISOString(),
    providers,
  };
}
