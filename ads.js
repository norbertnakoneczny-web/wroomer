let memoryAds = [
  { id: 1, title: "BMW 320d F30 2018 - ASO", brand: "BMW", model: "3 Series", year: 2018, price: 65900, mileage: 89000, fuel: "Diesel", gearbox: "Automatyczna", power: 190, location: "Warszawa", voivodeship: "Mazowieckie", description: "Zadbany, ASO.", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600", images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"], owner: "Marek K.", ownerEmail: "marek@example.com", ownerId: 9991, phone: "600 123 456", whatsapp: "600 123 456", allowCall: true, allowSms: true, allowWhatsapp: true, contactEmail: "marek@example.com", preferredContact: "telefon", createdAt: "2h temu", createdAtTs: Date.now()-2*3600000 }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      // Try Vercel Blob if available
      try {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const { list } = await import('@vercel/blob');
          const { blobs } = await list({ prefix: 'wroomer-ads' });
          if (blobs.length > 0) {
            const latest = blobs.sort((a,b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
            const r = await fetch(latest.url);
            if (r.ok) {
              const data = await r.json();
              if (Array.isArray(data) && data.length > 0) {
                memoryAds = data;
                return res.status(200).json(data);
              }
            }
          }
        }
      } catch(e) {
        console.log('Blob GET fallback', e.message);
      }
      return res.status(200).json(memoryAds);
    }

    if (req.method === 'POST') {
      let body = req.body;
      // Vercel may give string
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) {}
      }
      let newAds = body.ads || body;
      if (!Array.isArray(newAds)) {
        return res.status(400).json({ error: 'ads must be array', received: typeof newAds });
      }
      
      memoryAds = newAds;

      // Try save to Blob
      try {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const { put } = await import('@vercel/blob');
          await put('wroomer-ads.json', JSON.stringify(newAds), {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
            allowOverwrite: true
          });
        }
      } catch(e) {
        console.log('Blob PUT fallback', e.message);
      }

      return res.status(200).json({ success: true, count: newAds.length, saved: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error', err);
    return res.status(200).json(memoryAds);
  }
}
