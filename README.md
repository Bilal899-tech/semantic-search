# Semantic Search — nexagaze project

> Built by Founder Bilal

Product search engine with keyword + AI semantic search. 20-product catalog, intent-based matching via Ollama.

## SEO Keywords
semantic search engine, AI product search, Ollama semantic search, intent-based matching, keyword search, nexagaze, open source search, Founder Bilal

## Tech Stack
- Node.js / Express
- Ollama AI (minimax-m2.1:cloud)
- 20-product demo catalog
- Dual-mode search (keyword + semantic)

## Setup
```bash
npm install
npm start
```

## Features
- Keyword matching for exact queries
- AI semantic search for intent-based matching
- 20 pre-loaded product catalog
- Example search buttons for quick testing
- Fallback mode when AI is unavailable
- Shows full catalog on demand

## 📖 Documentation

### Architecture
Express.js server (port 3002). Two search modes:
1. **Keyword/Exact** — matches product name, category, or tags (instant)
2. **AI Semantic** — Ollama understands intent and returns relevant products

### 20-Product Catalog
Pre-loaded catalog across categories: Clothing, Shoes, Accessories, Sports, Home, Kitchen, Office.

### API Endpoint
```
POST /search
Body: { query: "heavy clothes for snow" }
Response: { query, results: [...], match: "exact"|"semantic"|"fallback" }
```

### Prompt Engineering
Ollama receives product names + tags, asked to return IDs matching user intent. Temperature: 0.1 for consistency.

## License
MIT — see [LICENSE](LICENSE)

---

**Contact:** ai@nexagaze.com | **WhatsApp:** 03103860653

---

## 🤝 Hire Me

Need a more advanced version? Want this built in Python, Rust, Go, or another language?  
I build custom AI agents, automation tools, and full-stack applications.

**Founder Bilal** — nexagaze  
📧 **Email:** ai@nexagaze.com  
📱 **WhatsApp:** 03103860653  
🌐 **GitHub:** [github.com/your-profile](https://github.com/your-profile)

> *"I don't just build projects — I build solutions that scale."*
