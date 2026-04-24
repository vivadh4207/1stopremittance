// Vercel Serverless Function — Wise Exchange Rate API Proxy
// Endpoint: GET /api/rates?source=USD&target=INR
//
// Fetches live mid-market exchange rates from Wise.
// Requires WISE_API_TOKEN environment variable.

const WISE_API_BASE = process.env.WISE_API_ENV === "sandbox"
  ? "https://api.sandbox.transferwise.tech"
  : "https://api.wise.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { source, target } = req.query;

  if (!source || !target) {
    return res.status(400).json({
      error: "Missing required parameters",
      required: ["source", "target"],
      example: "/api/rates?source=USD&target=INR",
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
      source: source.toUpperCase(),
      target: target.toUpperCase(),
    });

    const response = await fetch(`${WISE_API_BASE}/v1/rates?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "1StopRemittance/1.0",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "Wise Rate API request failed",
        status: response.status,
        details: errorText,
      });
    }

    const data = await response.json();

    // Wise returns an array of rate objects
    const rateObj = Array.isArray(data) ? data[0] : data;

    const result = {
      source: rateObj?.source || source.toUpperCase(),
      target: rateObj?.target || target.toUpperCase(),
      rate: rateObj?.rate || 0,
      time: rateObj?.time || new Date().toISOString(),
    };

    // Cache for 60 seconds
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return res.status(200).json(result);
  } catch (error) {
    console.error("Rate API error:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
}
