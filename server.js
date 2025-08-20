const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Makcorps API proxy
app.post('/api/hotels', async (req, res) => {
  try {
    const { city, checkIn, checkOut, guests, limit } = req.body;
    
    console.log('Proxying request to Makcorps:', { city, checkIn, checkOut, guests, limit });
    
    const response = await fetch('https://api.makcorps.com/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '68a35ceeee2f869ff1da0384',
        'Authorization': 'Bearer 68a35ceeee2f869ff1da0384'
      },
      body: JSON.stringify({
        destination: city,
        checkIn,
        checkOut,
        guests,
        limit: limit || 10
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Makcorps API error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log('Successfully fetched from Makcorps:', data);
    
    res.json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hotel API proxy is running' });
});

app.listen(PORT, () => {
  console.log(`Hotel API proxy server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
