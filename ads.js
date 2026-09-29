import { put, del } from '@vercel/blob';

let memoryAds = null;

const MOCK_ADS = [
  { id: 1, title: "BMW 320d F30 2018 - ASO", brand: "BMW", model: "3 Series", year: 2018, price: 65900, mileage: 89000, fuel: "Diesel", gearbox: "Automatyczna", power: 190, location: "Warszawa", voivodeship: "Mazowieckie", description: "Zadbany, ASO.", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600", images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"], owner: "Marek K.", ownerEmail: "marek@example.com", ownerId: 9991, phone: "600 123 456", whatsapp: "600 123 456", allowCall: true, allowSms: true, allowWhatsapp: true, contactEmail: "marek@example.com", preferredContact: "telefon", createdAt: "2h temu", createdAtTs: Date.now()-2*3600000 },
  { id: 6, title: "Toyota Corolla Hybrid 2022", brand: "Toyota", model: "Corolla", year: 2022, price: 79900, mileage: 22000, fuel: "Hybryda", gearbox: "Automatyczna", power: 122, location: "Katowice", voivodeship: "Śląskie", description: "Gwarancja.", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600", images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"], owner: "Salon Toyota", ownerEmail: "toyota@example.com", ownerId: 9992, phone: "32 123 45 67", whatsapp: "600 777 888", allowCall: true, allowSms: false, allowWhatsapp: true, contactEmail: "kontakt@toyota-katowice.pl", preferredContact: "whatsapp", createdAt: "3 dni temu", createdAtTs: Date.now()-72*3600000 }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  try {
    if (req.method === 'GET') {
      // Try Blob first
      if (token) {
        try {
          const response = await fetch(`https://blob.vercel-storage.com/wroomer-ads.json?token=${token}`);
          // Actually we need to list blobs - simpler: try to fetch via list API
          // For now fallback to memory + try to fetch from blob URL if we have it stored
          // We'll use put with random access - list blobs
          const { blobs } = await import('@vercel/blob').then(m => m.list({ prefix: 'wroomer-ads' }).catch(()=>({blobs:[]})));
          if (blobs && blobs.length > 0) {
            const latest = blobs.sort((a,b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
            const dataRes = await fetch(latest.url);
            const data = await dataRes.json();
            return res.status(200).json(data);
          }
        } catch(e) {
          console.log('Blob GET error, fallback to memory', e.message);
        }
      }
      // Fallback: memory or mock
      return res.status(200).json(memoryAds || MOCK_ADS);
    }

    if (req.method === 'POST') {
      const body = req.body;
      let adsToSave = body.ads || body;

      if (!Array.isArray(adsToSave)) {
        return res.status(400).json({ error: 'ads must be array' });
      }

      memoryAds = adsToSave;

      if (token) {
        try {
          await put('wroomer-ads.json', JSON.stringify(adsToSave), {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
            allowOverwrite: true
          });
        } catch(e) {
          console.log('Blob PUT error', e.message);
        }
      }

      return res.status(200).json({ success: true, count: adsToSave.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message, fallback: memoryAds || MOCK_ADS });
  }
}
