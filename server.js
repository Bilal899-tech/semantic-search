import express from 'express';
import ollama from 'ollama';

const app = express();
app.use(express.json());
app.use(express.static('.'));

const MODEL = 'minimax-m2.1:cloud';

const PRODUCTS = [
  { id: 1, name: 'Winter Jacket', category: 'Clothing', price: 89, tags: ['heavy', 'warm', 'snow', 'cold', 'outerwear'] },
  { id: 2, name: 'Running Shoes', category: 'Shoes', price: 120, tags: ['light', 'sports', 'jogging', 'gym', 'comfort'] },
  { id: 3, name: 'Sunglasses', category: 'Accessories', price: 25, tags: ['sun', 'summer', 'uv', 'beach', 'style'] },
  { id: 4, name: 'Umbrella', category: 'Accessories', price: 15, tags: ['rain', 'water', 'storm', 'wet'] },
  { id: 5, name: 'Leather Boots', category: 'Shoes', price: 180, tags: ['tough', 'heavy', 'winter', 'durable', 'outdoor'] },
  { id: 6, name: 'Cotton T-Shirt', category: 'Clothing', price: 29, tags: ['light', 'summer', 'casual', 'breathable'] },
  { id: 7, name: 'Wool Scarf', category: 'Accessories', price: 35, tags: ['warm', 'winter', 'soft', 'neck'] },
  { id: 8, name: 'Backpack', category: 'Bags', price: 65, tags: ['travel', 'school', 'outdoor', 'storage'] },
  { id: 9, name: 'Swim Trunks', category: 'Clothing', price: 22, tags: ['beach', 'summer', 'swim', 'light'] },
  { id: 10, name: 'Hiking Sandals', category: 'Shoes', price: 55, tags: ['outdoor', 'summer', 'trail', 'light'] },
  { id: 11, name: 'Down Vest', category: 'Clothing', price: 75, tags: ['warm', 'light', 'winter', 'layer'] },
  { id: 12, name: 'Yoga Mat', category: 'Fitness', price: 30, tags: ['exercise', 'gym', 'flexible', 'workout'] },
  { id: 13, name: 'Raincoat', category: 'Clothing', price: 60, tags: ['rain', 'waterproof', 'wet', 'storm'] },
  { id: 14, name: 'Cycling Helmet', category: 'Sports', price: 45, tags: ['bike', 'safety', 'outdoor', 'protection'] },
  { id: 15, name: 'Fleece Blanket', category: 'Home', price: 40, tags: ['warm', 'soft', 'cozy', 'winter', 'bed'] },
  { id: 16, name: 'Espresso Maker', category: 'Kitchen', price: 150, tags: ['coffee', 'morning', 'hot', 'brew'] },
  { id: 17, name: 'Desk Lamp', category: 'Office', price: 35, tags: ['work', 'light', 'study', 'led'] },
  { id: 18, name: 'Water Bottle', category: 'Sports', price: 18, tags: ['hydration', 'gym', 'outdoor', 'reusable'] },
  { id: 19, name: 'Ski Gloves', category: 'Clothing', price: 45, tags: ['winter', 'snow', 'cold', 'ski', 'heavy'] },
  { id: 20, name: 'Cooler Bag', category: 'Bags', price: 28, tags: ['picnic', 'summer', 'beach', 'travel', 'cold'] },
];

app.post('/search', async (req, res) => {
  const query = (req.body.query || '').trim();
  if (!query) return res.json({ query, results: [], match: 'exact' });

  const lower = query.toLowerCase();
  const exactResults = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower) ||
    p.tags.some(t => t.includes(lower))
  );

  if (exactResults.length > 0) {
    const sorted = exactResults.sort((a, b) => {
      const aExact = a.name.toLowerCase() === lower ? 2 : a.tags.some(t => t === lower) ? 1 : 0;
      const bExact = b.name.toLowerCase() === lower ? 2 : b.tags.some(t => t === lower) ? 1 : 0;
      return bExact - aExact;
    });
    return res.json({ query, results: sorted.slice(0, 6), match: 'exact' });
  }

  const namesStr = PRODUCTS.map(p => `${p.name} (${p.tags.join(', ')})`).join('; ');
  const prompt = `A user searched for: "${query}"

Our products: ${namesStr}

Return ONLY a JSON array of product IDs (from the list above) that BEST match the user's INTENT, sorted by relevance. Consider synonyms and semantic meaning. Max 4 results.

Example for query "heavy clothes for snow": [1, 5, 19, 11]
Example for query "something to drink coffee from": [16]
Example for query "protect from rain": [4, 13]

Return ONLY a valid JSON array. No explanation.`;

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      options: { temperature: 0.1 }
    });

    const raw = response.message.content;
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    let ids = [];
    try { ids = JSON.parse(cleaned); } catch {
      try { ids = JSON.parse(`[${cleaned}]`); } catch {}
    }

    const results = (Array.isArray(ids) ? ids : [])
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 6);

    res.json({ query, results, match: 'semantic' });
  } catch {
    res.json({ query, results: PRODUCTS.slice(0, 4), match: 'fallback' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n[semantic-search] http://localhost:${PORT}`);
  console.log(`nexagaze project — built by Founder Bilal`);
  console.log(`Contact: ai@nexagaze.com | WhatsApp: 03103860653\n`);
});
