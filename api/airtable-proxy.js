// Vercel Serverless Function for Airtable API Proxy
// This keeps the API key secure and handles CORS

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Get environment variables
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return res.status(500).json({ 
      error: 'Missing Airtable configuration. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.' 
    });
  }

  // Extract table ID and any additional path from query
  const { table, ...queryParams } = req.query;
  
  if (!table) {
    return res.status(400).json({ error: 'Missing table parameter' });
  }

  try {
    // Build Airtable API URL
    let airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`;
    
    // Add query parameters for GET requests
    if (req.method === 'GET' && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      });
      airtableUrl += '?' + params.toString();
    }

    // Prepare headers for Airtable API
    const headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    };

    // Make request to Airtable
    const airtableResponse = await fetch(airtableUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await airtableResponse.json();

    if (!airtableResponse.ok) {
      return res.status(airtableResponse.status).json({
        error: data.error?.message || 'Airtable API error',
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Airtable proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}