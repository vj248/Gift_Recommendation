import { useState, useEffect, useRef } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --saffron: #FF6B00;
    --marigold: #FFC107;
    --kumkum: #C0392B;
    --turmeric: #F5C842;
    --jasmine: #FFF8ED;
    --indigo: #1A1040;
    --lotus: #E8789A;
    --teal: #00897B;
    --gold: #B8860B;
    --cream: #FAF3E0;
    --ink: #1C1008;
    --muted: #7A6652;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 10% 0%, rgba(255,107,0,0.10) 0%, transparent 50%),
      radial-gradient(ellipse at 90% 100%, rgba(192,57,43,0.08) 0%, transparent 50%),
      var(--cream);
    position: relative;
  }

  /* ── Mandala bg ── */
  .mandala-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }
  .mandala-bg svg { position: absolute; opacity: 0.04; }
  .mandala-bg .m1 { top: -120px; right: -120px; width: 500px; }
  .mandala-bg .m2 { bottom: -80px; left: -80px; width: 380px; }

  /* ── Header ── */
  header {
    position: relative; z-index: 10;
    padding: 28px 40px 20px;
    display: flex; align-items: center; gap: 16px;
    border-bottom: 1px solid rgba(184,134,11,0.18);
  }
  .logo-mark {
    width: 44px; height: 44px;
    background: var(--saffron);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 16px rgba(255,107,0,0.35);
    flex-shrink: 0;
  }
  .logo-text h1 {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 800;
    color: var(--indigo); line-height: 1;
  }
  .logo-text span {
    font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--saffron); font-weight: 500;
  }

  /* ── Stepper ── */
  .stepper-wrap {
    position: relative; z-index: 10;
    padding: 28px 40px 0;
    display: flex; gap: 0; max-width: 680px;
  }
  .step-pill {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
    position: relative; cursor: pointer;
  }
  .step-pill::after {
    content: '';
    position: absolute; top: 16px; left: 50%; width: 100%; height: 2px;
    background: rgba(26,16,64,0.10);
    transition: background 0.4s;
  }
  .step-pill:last-child::after { display: none; }
  .step-pill.done::after { background: var(--saffron); }

  .step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; position: relative; z-index: 1;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 2px solid rgba(26,16,64,0.12);
    background: white; color: var(--muted);
  }
  .step-pill.active .step-circle {
    background: var(--saffron); color: white; border-color: var(--saffron);
    box-shadow: 0 0 0 5px rgba(255,107,0,0.15);
    transform: scale(1.18);
  }
  .step-pill.done .step-circle {
    background: var(--indigo); color: white; border-color: var(--indigo);
  }
  .step-label {
    font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted); font-weight: 500;
    transition: color 0.3s;
  }
  .step-pill.active .step-label { color: var(--saffron); font-weight: 700; }
  .step-pill.done .step-label { color: var(--indigo); }

  /* ── Card ── */
  .card {
    position: relative; z-index: 10;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(184,134,11,0.16);
    border-radius: 20px;
    padding: 36px 40px;
    margin: 28px 40px;
    max-width: 740px;
    box-shadow: 0 8px 40px rgba(26,16,64,0.07), 0 1px 0 rgba(255,255,255,0.9) inset;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 800;
    color: var(--indigo); margin-bottom: 6px;
  }
  .card-sub {
    font-size: 14px; color: var(--muted); margin-bottom: 28px; font-weight: 300;
  }

  /* ── Field ── */
  .field { margin-bottom: 22px; }
  .field label {
    display: block; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--muted); font-weight: 600; margin-bottom: 8px;
  }
  .field select, .field input[type="date"] {
    width: 100%; padding: 13px 16px;
    border: 1.5px solid rgba(26,16,64,0.12);
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 15px; background: rgba(255,255,255,0.9);
    color: var(--ink); outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8'%3E%3Cpath d='M1 1l6 6 6-6' stroke='%23B8860B' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 36px;
  }
  .field select:focus, .field input[type="date"]:focus {
    border-color: var(--saffron);
    box-shadow: 0 0 0 3px rgba(255,107,0,0.10);
  }

  /* ── Chip grid ── */
  .chip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip {
    padding: 8px 16px; border-radius: 100px;
    border: 1.5px solid rgba(26,16,64,0.14);
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: rgba(255,255,255,0.8); color: var(--ink);
    user-select: none;
  }
  .chip:hover { border-color: var(--saffron); color: var(--saffron); transform: translateY(-1px); }
  .chip.selected {
    background: var(--indigo); color: white; border-color: var(--indigo);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(26,16,64,0.20);
  }

  /* ── Budget slider ── */
  .budget-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  @media (max-width: 520px) { .budget-grid { grid-template-columns: repeat(2,1fr); } }
  .budget-chip {
    padding: 12px 10px; border-radius: 12px; text-align: center; cursor: pointer;
    border: 1.5px solid rgba(26,16,64,0.12);
    background: rgba(255,255,255,0.8); transition: all 0.22s;
  }
  .budget-chip .amount { font-size: 15px; font-weight: 700; color: var(--ink); }
  .budget-chip .label { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .budget-chip:hover { border-color: var(--saffron); }
  .budget-chip.selected {
    background: linear-gradient(135deg, var(--saffron), #e85d00);
    border-color: var(--saffron); color: white;
    box-shadow: 0 6px 20px rgba(255,107,0,0.30);
    transform: translateY(-2px);
  }
  .budget-chip.selected .amount, .budget-chip.selected .label { color: white; }

  /* ── Row ── */
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  @media (max-width: 520px) { .row { grid-template-columns: 1fr; } }

  /* ── Urgency ── */
  .urgency-row { display: flex; gap: 10px; }
  .urgency-chip {
    flex: 1; padding: 12px 8px; border-radius: 10px; text-align: center; cursor: pointer;
    border: 1.5px solid rgba(26,16,64,0.12); background: rgba(255,255,255,0.8);
    font-size: 13px; font-weight: 500; transition: all 0.22s;
  }
  .urgency-chip:hover { border-color: var(--teal); color: var(--teal); }
  .urgency-chip.selected {
    background: var(--teal); color: white; border-color: var(--teal);
    box-shadow: 0 4px 14px rgba(0,137,123,0.25);
  }

  /* ── Nav buttons ── */
  .nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; }
  .btn {
    padding: 13px 28px; border-radius: 12px; font-size: 15px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.25s; font-family: 'DM Sans', sans-serif;
  }
  .btn-ghost {
    background: transparent; color: var(--muted);
    border: 1.5px solid rgba(26,16,64,0.14);
  }
  .btn-ghost:hover { color: var(--ink); border-color: var(--ink); }
  .btn-primary {
    background: linear-gradient(135deg, var(--saffron) 0%, #e55c00 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(255,107,0,0.30);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,107,0,0.40); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Loading ── */
  .loading-wrap {
    text-align: center; padding: 60px 20px;
    position: relative; z-index: 10;
  }
  .diya-spin {
    font-size: 52px;
    display: inline-block;
    animation: diaSpin 1.4s ease-in-out infinite;
  }
  @keyframes diaSpin {
    0%,100% { transform: rotate(-10deg) scale(1); }
    50% { transform: rotate(10deg) scale(1.1); }
  }
  .loading-wrap p {
    font-family: 'Playfair Display', serif;
    font-size: 20px; color: var(--indigo); margin-top: 20px;
  }
  .loading-wrap small { color: var(--muted); font-size: 13px; }
  .loading-dots { display: inline-flex; gap: 6px; margin-top: 16px; }
  .loading-dots span {
    width: 8px; height: 8px; border-radius: 50%; background: var(--saffron);
    animation: dotBounce 1.2s ease-in-out infinite;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dotBounce {
    0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* ── Results ── */
  .results-header {
    position: relative; z-index: 10;
    padding: 32px 40px 0;
  }
  .results-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 28px; color: var(--indigo);
  }
  .results-header p { color: var(--muted); font-size: 14px; margin-top: 4px; }

  .gift-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px; padding: 24px 40px 40px; position: relative; z-index: 10;
  }

  .gift-card {
    background: rgba(255,255,255,0.92); border: 1px solid rgba(184,134,11,0.14);
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(26,16,64,0.07);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
    animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .gift-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(26,16,64,0.13); }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .gift-card:nth-child(1) { animation-delay: 0.05s; }
  .gift-card:nth-child(2) { animation-delay: 0.12s; }
  .gift-card:nth-child(3) { animation-delay: 0.19s; }
  .gift-card:nth-child(4) { animation-delay: 0.26s; }

  .gift-emoji-banner {
    height: 100px;
    display: flex; align-items: center; justify-content: center;
    font-size: 52px;
    position: relative; overflow: hidden;
  }
  .gift-body { padding: 20px; }
  .gift-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700; color: var(--indigo); line-height: 1.3;
    margin-bottom: 4px;
  }
  .gift-platform { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
  .gift-price-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .gift-price {
    font-size: 22px; font-weight: 800; color: var(--saffron);
  }
  .delivery-badge {
    font-size: 11px; padding: 3px 10px; border-radius: 100px;
    font-weight: 600; letter-spacing: 0.5px;
  }
  .badge-green { background: #E8F5E9; color: #2E7D32; }
  .badge-yellow { background: #FFF8E1; color: #F57F17; }
  .badge-red { background: #FFEBEE; color: #C62828; }

  /* Score bars */
  .score-bars { margin-bottom: 14px; }
  .score-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .score-label { font-size: 10px; color: var(--muted); width: 22px; font-weight: 600; }
  .score-track {
    flex: 1; height: 5px; background: rgba(26,16,64,0.07); border-radius: 3px; overflow: hidden;
  }
  .score-fill {
    height: 100%; border-radius: 3px;
    transition: width 1s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .fill-P { background: var(--lotus); }
  .fill-B { background: var(--teal); }
  .fill-D { background: var(--marigold); }
  .fill-N { background: var(--saffron); }
  .score-pct { font-size: 10px; color: var(--muted); width: 28px; text-align: right; }

  /* Explanation */
  .explanation {
    font-size: 13px; color: var(--ink); line-height: 1.65;
    background: rgba(255,248,237,0.7);
    border-left: 3px solid var(--marigold);
    padding: 10px 12px; border-radius: 0 8px 8px 0;
    margin-top: 10px; font-style: italic;
  }
  .explanation-loading {
    color: var(--muted); animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }

  .utility-total {
    text-align: right; font-size: 11px; color: var(--muted);
    margin-bottom: 8px;
  }
  .utility-total strong { color: var(--saffron); font-size: 14px; }

  /* ── Reset ── */
  .reset-row { position: relative; z-index: 10; padding: 0 40px 40px; }
  .btn-outline {
    background: transparent; color: var(--indigo);
    border: 1.5px solid rgba(26,16,64,0.20);
    font-size: 14px;
  }
  .btn-outline:hover { border-color: var(--indigo); background: rgba(26,16,64,0.04); }

  /* ── Festival badge ── */
  .festival-banner {
    position: relative; z-index: 10;
    margin: 0 40px;
    padding: 10px 16px;
    background: linear-gradient(90deg, rgba(255,193,7,0.15), rgba(255,107,0,0.10));
    border: 1px solid rgba(255,193,7,0.35);
    border-radius: 10px;
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: var(--gold); font-weight: 500;
    margin-bottom: 4px;
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const OCCASIONS = [
  "Diwali","Holi","Raksha Bandhan","Eid","Christmas","Birthday",
  "Wedding","Baby Shower","Graduation","Teacher's Day","Farewell",
  "House Warming","Navratri","Onam"
];

const RELATIONS = ["Parent","Sibling","Friend","Partner","Colleague","Teacher","Relative","Boss"];
const AGE_GROUPS = ["Under 12","13–20","21–35","36–55","56+"];
const GENDERS = ["Female","Male","Non-binary / Any"];

const BUDGETS = [
  { label: "Under ₹500", min: 0, max: 500, tag: "Thoughtful" },
  { label: "₹500–1,500", min: 500, max: 1500, tag: "Sweet spot" },
  { label: "₹1,500–5,000", min: 1500, max: 5000, tag: "Premium" },
  { label: "₹5,000–15,000", min: 5000, max: 15000, tag: "Luxe" },
  { label: "₹15,000+", min: 15000, max: 999999, tag: "Grand" },
];

const URGENCIES = [
  { label: "Same day", days: 0 },
  { label: "1–2 days", days: 2 },
  { label: "3–5 days", days: 5 },
  { label: "A week+", days: 10 },
];

const CITIES = [
  "Bengaluru","Mumbai","Delhi","Chennai","Hyderabad","Pune",
  "Kolkata","Jaipur","Ahmedabad","Lucknow","Kochi","Mangalore",
  "Mysore","Udupi","Indore","Nagpur","Bhopal","Patna","Coimbatore","Surat"
];

const INTERESTS = [
  { label: "🎵 Music", value: "music" },
  { label: "💻 Tech", value: "tech" },
  { label: "🍳 Cooking", value: "cooking" },
  { label: "✈️ Travel", value: "travel" },
  { label: "🕉️ Spirituality", value: "spirituality" },
  { label: "💪 Fitness", value: "fitness" },
  { label: "🎨 Art & Craft", value: "art" },
  { label: "👗 Fashion", value: "fashion" },
  { label: "📚 Books", value: "books" },
  { label: "🌿 Wellness", value: "wellness" },
  { label: "🎮 Gaming", value: "gaming" },
  { label: "🌱 Plants", value: "plants" },
];

// ─── Gift Knowledge Base (50 entries) ─────────────────────────────────────────
const GIFTS = [
  { id:"G001", name:"Handcrafted Madhubani Diary", category:"stationery", emoji:"📓",
    price:899, occasions:["Birthday","Farewell","Teacher's Day","Diwali"],
    relations:["friend","colleague","teacher","parent"], interests:["art","books","writing"],
    delivery:3, platform:"Amazon India", novelty:0.85, tier:[1,2] },
  { id:"G002", name:"Brass Diya Gift Set", category:"home_decor", emoji:"🪔",
    price:649, occasions:["Diwali","House Warming","Navratri","Wedding"],
    relations:["parent","relative","friend","colleague"], interests:["spirituality","art"],
    delivery:2, platform:"Craftsvilla", novelty:0.70, tier:[1,2,3] },
  { id:"G003", name:"Ayurvedic Skincare Hamper", category:"skincare", emoji:"🌿",
    price:1299, occasions:["Birthday","Diwali","Wedding","Onam"],
    relations:["partner","friend","parent","sibling"], interests:["wellness","fitness"],
    delivery:3, platform:"Amazon India", novelty:0.75, tier:[1,2] },
  { id:"G004", name:"Artisanal Mithai Box (Kesar Peda)", category:"sweets", emoji:"🍬",
    price:450, occasions:["Diwali","Holi","Eid","Birthday","Wedding","Navratri"],
    relations:["parent","relative","colleague","friend"], interests:["cooking","spirituality"],
    delivery:1, platform:"Swiggy Instamart", novelty:0.55, tier:[1,2,3] },
  { id:"G005", name:"Silk Scarf — Banarasi Weave", category:"apparel", emoji:"🧣",
    price:2200, occasions:["Wedding","Birthday","Diwali","Teacher's Day"],
    relations:["parent","teacher","partner","relative"], interests:["fashion","art"],
    delivery:4, platform:"Jaypore", novelty:0.80, tier:[1,2] },
  { id:"G006", name:"OTT Subscription Gift Card (1 Year)", category:"experiential", emoji:"📺",
    price:1499, occasions:["Birthday","Farewell","Graduation"],
    relations:["friend","sibling","colleague","partner"], interests:["music","gaming","books"],
    delivery:0, platform:"Amazon India", novelty:0.60, tier:[1,2,3] },
  { id:"G007", name:"Personalised Name Cushion", category:"personalised", emoji:"🛋️",
    price:799, occasions:["Birthday","House Warming","Baby Shower"],
    relations:["friend","sibling","partner","parent"], interests:["art","fashion"],
    delivery:5, platform:"Canvera / Zazzle India", novelty:0.72, tier:[1,2] },
  { id:"G008", name:"Indoor Terrarium Planter", category:"plants", emoji:"🌵",
    price:999, occasions:["Birthday","House Warming","Teacher's Day","Farewell"],
    relations:["friend","colleague","teacher","partner"], interests:["plants","wellness"],
    delivery:3, platform:"Ugaoo", novelty:0.82, tier:[1,2] },
  { id:"G009", name:"The Man Company Grooming Kit", category:"skincare", emoji:"🧴",
    price:1850, occasions:["Birthday","Diwali","Farewell","Graduation"],
    relations:["partner","sibling","friend","colleague"], interests:["fitness","wellness","fashion"],
    delivery:2, platform:"The Man Company", novelty:0.68, tier:[1,2,3] },
  { id:"G010", name:"Bluetooth Vintage Speaker", category:"electronics", emoji:"🔊",
    price:3200, occasions:["Birthday","Farewell","Graduation","Christmas"],
    relations:["friend","sibling","partner","colleague"], interests:["music","tech"],
    delivery:3, platform:"Flipkart", novelty:0.73, tier:[1,2] },
  { id:"G011", name:"Handloom Cotton Saree (Karnataka)", category:"apparel", emoji:"👘",
    price:4500, occasions:["Wedding","Onam","Birthday","Diwali"],
    relations:["parent","relative","partner"], interests:["fashion","art","spirituality"],
    delivery:5, platform:"Jaypore / Amazon India", novelty:0.77, tier:[1,2] },
  { id:"G012", name:"Spa Gift Voucher (Ayurveda)", category:"experiential", emoji:"💆",
    price:3500, occasions:["Birthday","Wedding","Farewell"],
    relations:["partner","friend","parent","sibling"], interests:["wellness","fitness","spirituality"],
    delivery:0, platform:"BookMyShow / Purplle", novelty:0.88, tier:[1] },
  { id:"G013", name:"Warli Art Wall Print", category:"home_decor", emoji:"🖼️",
    price:1200, occasions:["House Warming","Birthday","Diwali","Farewell"],
    relations:["friend","colleague","parent"], interests:["art","travel"],
    delivery:4, platform:"Jaypore / Etsy India", novelty:0.84, tier:[1,2] },
  { id:"G014", name:"Rakhi Hamper with Dry Fruits", category:"sweets", emoji:"🎁",
    price:750, occasions:["Raksha Bandhan","Birthday","Diwali"],
    relations:["sibling","relative","friend"], interests:["cooking","spirituality"],
    delivery:2, platform:"Amazon India", novelty:0.50, tier:[1,2,3] },
  { id:"G015", name:"Python for Everyone — Manas Sinha", category:"books", emoji:"📗",
    price:499, occasions:["Graduation","Birthday","Teacher's Day","Farewell"],
    relations:["friend","sibling","colleague"], interests:["tech","books"],
    delivery:3, platform:"Flipkart / Amazon India", novelty:0.58, tier:[1,2,3] },
  { id:"G016", name:"Sterling Silver Anklet", category:"jewellery", emoji:"💍",
    price:1800, occasions:["Birthday","Wedding","Diwali","Onam"],
    relations:["partner","sibling","friend","parent"], interests:["fashion","art"],
    delivery:4, platform:"Tanishq / Myntra", novelty:0.71, tier:[1,2] },
  { id:"G017", name:"Cold Brew Coffee Starter Kit", category:"kitchen", emoji:"☕",
    price:1100, occasions:["Birthday","Farewell","Graduation","Christmas"],
    relations:["friend","sibling","partner","colleague"], interests:["cooking","wellness"],
    delivery:3, platform:"Amazon India", novelty:0.80, tier:[1,2] },
  { id:"G018", name:"Yoga Mat Premium (Eco)", category:"fitness", emoji:"🧘",
    price:2100, occasions:["Birthday","New Year","Graduation"],
    relations:["partner","friend","sibling","parent"], interests:["fitness","wellness","spirituality"],
    delivery:3, platform:"Decathlon India", novelty:0.65, tier:[1,2] },
  { id:"G019", name:"Embroidered Phulkari Dupatta", category:"apparel", emoji:"🌸",
    price:1350, occasions:["Wedding","Birthday","Diwali","Navratri"],
    relations:["partner","sibling","friend","parent"], interests:["fashion","art"],
    delivery:5, platform:"Craftsvilla", novelty:0.79, tier:[1,2] },
  { id:"G020", name:"Smart Fitness Band", category:"electronics", emoji:"⌚",
    price:3999, occasions:["Birthday","Graduation","Christmas","Farewell"],
    relations:["sibling","friend","partner","colleague"], interests:["fitness","tech"],
    delivery:2, platform:"Flipkart", novelty:0.66, tier:[1,2,3] },
  { id:"G021", name:"Gond Painting (A3 Framed)", category:"home_decor", emoji:"🎨",
    price:2600, occasions:["House Warming","Birthday","Farewell","Diwali"],
    relations:["parent","friend","teacher","colleague"], interests:["art","travel","spirituality"],
    delivery:5, platform:"Jaypore / Etsy India", novelty:0.91, tier:[1,2] },
  { id:"G022", name:"Eidi/Eid Gift Attar Set", category:"skincare", emoji:"🧪",
    price:899, occasions:["Eid","Birthday","Diwali"],
    relations:["friend","relative","colleague","parent"], interests:["wellness","spirituality","fashion"],
    delivery:2, platform:"Amazon India", novelty:0.73, tier:[1,2,3] },
  { id:"G023", name:"Personalised Photo Mug", category:"personalised", emoji:"☕",
    price:349, occasions:["Birthday","Teacher's Day","Farewell"],
    relations:["friend","colleague","teacher","sibling"], interests:["art","travel"],
    delivery:3, platform:"Canvera / Zazzle India", novelty:0.48, tier:[1,2,3] },
  { id:"G024", name:"Himalayan Pink Salt Lamp", category:"home_decor", emoji:"💡",
    price:999, occasions:["House Warming","Diwali","Birthday","Navratri"],
    relations:["parent","friend","relative","partner"], interests:["wellness","spirituality"],
    delivery:3, platform:"Amazon India", novelty:0.70, tier:[1,2,3] },
  { id:"G025", name:"Premium Stainless Steel Lunch Box Set", category:"kitchen", emoji:"🍱",
    price:1499, occasions:["Farewell","House Warming","Baby Shower","Birthday"],
    relations:["colleague","parent","friend"], interests:["cooking","wellness","fitness"],
    delivery:2, platform:"Amazon India", novelty:0.55, tier:[1,2,3] },
];

// ─── Utilities ─────────────────────────────────────────────────────────────────
function cosineSim(a, b, universe) {
  const vec = (arr) => universe.map(x => arr.includes(x) ? 1 : 0);
  const u = vec(a); const g = vec(b);
  const dot = u.reduce((s,v,i) => s + v*g[i], 0);
  const magU = Math.sqrt(u.reduce((s,v) => s+v*v, 0));
  const magG = Math.sqrt(g.reduce((s,v) => s+v*v, 0));
  return (magU && magG) ? dot/(magU*magG) : 0;
}

function budgetScore(price, min, max) {
  if (price < min || price > max) return 0;
  const mid = (min + max) / 2;
  return 1 - Math.abs(price - mid) / Math.max(max - min, 1);
}

function deliveryScore(days, urgency) {
  if (days > urgency && urgency > 0) return 0;
  if (urgency === 0) return days === 0 ? 1.0 : 0;
  return 1 - days / urgency;
}

const ALL_INTERESTS = INTERESTS.map(i => i.value);

function score(gift, profile) {
  const P = cosineSim(profile.interests, gift.interests, ALL_INTERESTS);
  const B = budgetScore(gift.price, profile.budget.min, profile.budget.max);
  const D = deliveryScore(gift.delivery, profile.urgency.days);
  const N = gift.novelty;
  const total = 0.35*P + 0.30*B + 0.25*D + 0.10*N;
  return { P, B, D, N, total };
}

function recommend(profile, n=4) {
  const occasion = profile.occasion.toLowerCase();
  const rel = profile.relation.toLowerCase();

  const candidates = GIFTS
    .filter(g => {
      const occasionOk = g.occasions.some(o => o.toLowerCase() === occasion) ||
        g.occasions.includes(profile.occasion);
      return occasionOk;
    })
    .map(g => ({ gift: g, scores: score(g, profile) }))
    .filter(x => x.scores.total > 0.01)
    .sort((a,b) => b.scores.total - a.scores.total);

  // Fallback if no occasion match
  if (candidates.length < 2) {
    return GIFTS
      .map(g => ({ gift: g, scores: score(g, profile) }))
      .sort((a,b) => b.scores.total - a.scores.total)
      .slice(0, n);
  }
  return candidates.slice(0, n);
}

function deliveryBadge(days, urgency) {
  if (urgency === 0) {
    if (days === 0) return { text: "✓ Same day", cls: "badge-green" };
    return { text: "⚠ Slower", cls: "badge-red" };
  }
  if (days <= urgency * 0.6) return { text: `✓ ${days}d delivery`, cls: "badge-green" };
  if (days <= urgency) return { text: `⚡ ${days}d delivery`, cls: "badge-yellow" };
  return { text: `✗ ${days}d — too slow`, cls: "badge-red" };
}

function pct(v) { return Math.round(v * 100); }

// ─── Claude API call ──────────────────────────────────────────────────────────
async function fetchExplanation(gift, scores, profile) {
  const prompt = `You are a warm, knowledgeable Indian gift advisor.

Gift: ${gift.name} (₹${gift.price})
Occasion: ${profile.occasion}
Recipient: ${profile.relation}, age group ${profile.age}, interests: ${profile.interests.join(", ")}
Budget range: ₹${profile.budget.min}–₹${profile.budget.max}
Scores — Preference: ${scores.P.toFixed(2)}, Budget fit: ${scores.B.toFixed(2)}, Delivery: ${scores.D.toFixed(2)}, Novelty: ${scores.N.toFixed(2)}

Write exactly 2 warm, specific sentences explaining why this gift is perfect for this person and occasion. Mention Indian cultural context where genuinely relevant. No bullet points. Be heartfelt and concise.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "A thoughtful choice for this special occasion.";
}

// ─── MANDALA SVG ──────────────────────────────────────────────────────────────
const MandalaSVG = () => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    {[...Array(12)].map((_,i) => (
      <g key={i} transform={`rotate(${i*30} 200 200)`}>
        <ellipse cx="200" cy="80" rx="6" ry="30" fill="#FF6B00" />
        <circle cx="200" cy="55" r="8" fill="#FFC107" />
        <ellipse cx="200" cy="115" rx="4" ry="15" fill="#C0392B" />
      </g>
    ))}
    {[...Array(8)].map((_,i) => (
      <g key={i} transform={`rotate(${i*45} 200 200)`}>
        <line x1="200" y1="140" x2="200" y2="170" stroke="#B8860B" strokeWidth="2" />
        <circle cx="200" cy="175" r="5" fill="#B8860B" />
      </g>
    ))}
    <circle cx="200" cy="200" r="30" fill="none" stroke="#FF6B00" strokeWidth="2" />
    <circle cx="200" cy="200" r="50" fill="none" stroke="#FFC107" strokeWidth="1" />
    <circle cx="200" cy="200" r="70" fill="none" stroke="#C0392B" strokeWidth="1" />
    <circle cx="200" cy="200" r="12" fill="#FF6B00" />
    <circle cx="200" cy="200" r="6" fill="#FFF8ED" />
  </svg>
);

// ─── STEP COMPONENTS ──────────────────────────────────────────────────────────
function StepRecipient({ data, onChange }) {
  return (
    <div>
      <div className="row">
        <div className="field">
          <label>Relation to you</label>
          <select value={data.relation} onChange={e => onChange("relation", e.target.value)}>
            <option value="">Select…</option>
            {RELATIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Age Group</label>
          <select value={data.age} onChange={e => onChange("age", e.target.value)}>
            <option value="">Select…</option>
            {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Gender (helps with suitability)</label>
        <div className="chip-grid">
          {GENDERS.map(g => (
            <div key={g} className={`chip${data.gender === g ? " selected" : ""}`}
              onClick={() => onChange("gender", g)}>{g}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepOccasion({ data, onChange }) {
  return (
    <div>
      <div className="field">
        <label>Occasion</label>
        <div className="chip-grid">
          {OCCASIONS.map(o => (
            <div key={o} className={`chip${data.occasion === o ? " selected" : ""}`}
              onClick={() => onChange("occasion", o)}>{o}</div>
          ))}
        </div>
      </div>
      <div className="field" style={{ marginTop: 20 }}>
        <label>Date needed by</label>
        <input type="date" value={data.date} onChange={e => onChange("date", e.target.value)} />
      </div>
    </div>
  );
}

function StepBudget({ data, onChange }) {
  return (
    <div>
      <div className="field">
        <label>Budget Range</label>
        <div className="budget-grid">
          {BUDGETS.map((b,i) => (
            <div key={i} className={`budget-chip${data.budget?.label === b.label ? " selected" : ""}`}
              onClick={() => onChange("budget", b)}>
              <div className="amount">{b.label}</div>
              <div className="label">{b.tag}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="row" style={{ marginTop: 20 }}>
        <div className="field">
          <label>Your City</label>
          <select value={data.city} onChange={e => onChange("city", e.target.value)}>
            <option value="">Select city…</option>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Delivery Urgency</label>
          <div className="urgency-row">
            {URGENCIES.map((u,i) => (
              <div key={i} className={`urgency-chip${data.urgency?.label === u.label ? " selected" : ""}`}
                onClick={() => onChange("urgency", u)}>
                {u.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPreferences({ data, onChange }) {
  const toggle = (val) => {
    const cur = data.interests || [];
    const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
    onChange("interests", next);
  };
  return (
    <div>
      <div className="field">
        <label>Their Interests (pick all that apply)</label>
        <div className="chip-grid" style={{ marginTop: 4 }}>
          {INTERESTS.map(i => (
            <div key={i.value} className={`chip${(data.interests||[]).includes(i.value) ? " selected" : ""}`}
              onClick={() => toggle(i.value)}>{i.label}</div>
          ))}
        </div>
        {(data.interests||[]).length === 0 &&
          <p style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>
            Pick at least one interest for better recommendations.
          </p>
        }
      </div>
    </div>
  );
}

// ─── Score bars ───────────────────────────────────────────────────────────────
function ScoreBars({ scores }) {
  const bars = [
    { key:"P", label:"Pref", cls:"fill-P" },
    { key:"B", label:"Budget", cls:"fill-B" },
    { key:"D", label:"Delivery", cls:"fill-D" },
    { key:"N", label:"Novelty", cls:"fill-N" },
  ];
  return (
    <div className="score-bars">
      {bars.map(b => (
        <div className="score-row" key={b.key}>
          <span className="score-label">{b.label[0]}</span>
          <div className="score-track">
            <div className={`score-fill ${b.cls}`}
              style={{ width: `${pct(scores[b.key])}%` }} />
          </div>
          <span className="score-pct">{pct(scores[b.key])}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Gift Card ────────────────────────────────────────────────────────────────
function GiftCard({ item, profile }) {
  const [explanation, setExplanation] = useState(null);
  const { gift, scores } = item;
  const badge = deliveryBadge(gift.delivery, profile.urgency.days);

  const BANNER_COLORS = [
    "linear-gradient(135deg,#FFF3E0,#FFCCBC)",
    "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
    "linear-gradient(135deg,#EDE7F6,#D1C4E9)",
    "linear-gradient(135deg,#FFF8E1,#FFE0B2)",
  ];
  const colorIdx = gift.id.charCodeAt(1) % 4;

  useEffect(() => {
    let mounted = true;
    fetchExplanation(gift, scores, profile).then(txt => {
      if (mounted) setExplanation(txt);
    }).catch(() => {
      if (mounted) setExplanation("A delightful pick that blends thoughtfulness with cultural charm.");
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="gift-card">
      <div className="gift-emoji-banner"
        style={{ background: BANNER_COLORS[colorIdx] }}>
        <span style={{ fontSize: 54 }}>{gift.emoji}</span>
      </div>
      <div className="gift-body">
        <div className="gift-name">{gift.name}</div>
        <div className="gift-platform">{gift.platform}</div>
        <div className="gift-price-row">
          <span className="gift-price">₹{gift.price.toLocaleString("en-IN")}</span>
          <span className={`delivery-badge ${badge.cls}`}>{badge.text}</span>
        </div>
        <div className="utility-total">
          Utility score: <strong>{(scores.total * 100).toFixed(0)}%</strong>
        </div>
        <ScoreBars scores={scores} />
        <div className="explanation">
          {explanation
            ? explanation
            : <span className="explanation-loading">✨ Crafting your personal note…</span>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Festival detect ──────────────────────────────────────────────────────────
function upcomingFestival() {
  const now = new Date();
  const m = now.getMonth() + 1;
  if (m === 10 || m === 11) return "🪔 Diwali season is here! Great time to gift.";
  if (m === 8) return "🎀 Raksha Bandhan is around the corner!";
  if (m === 3) return "🌈 Holi vibes! Time to celebrate with colour & joy.";
  return null;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const STEPS = ["Recipient", "Occasion", "Budget", "Preferences"];

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [form, setForm] = useState({
    relation: "", age: "", gender: "",
    occasion: "", date: "",
    budget: null, city: "", urgency: null,
    interests: []
  });

  const festival = upcomingFestival();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.relation && form.age;
    if (step === 1) return form.occasion;
    if (step === 2) return form.budget && form.city && form.urgency;
    if (step === 3) return form.interests.length > 0;
    return true;
  };

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // UX breathing room
    const recs = recommend(form);
    setResults(recs);
    setLoading(false);
  };

  const reset = () => {
    setResults(null); setStep(0);
    setForm({ relation:"",age:"",gender:"",occasion:"",date:"",budget:null,city:"",urgency:null,interests:[] });
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="mandala-bg">
          <MandalaSVG />
          <div className="m2" style={{ position:"absolute", bottom:-80, left:-80 }}>
            <MandalaSVG />
          </div>
        </div>

        <header>
          <div className="logo-mark">🎁</div>
          <div className="logo-text">
            <h1>Uphar</h1>
            <span>India's intelligent gift advisor</span>
          </div>
        </header>

        {!results && !loading && (
          <>
            {festival && (
              <div className="festival-banner">
                <span>{festival}</span>
              </div>
            )}

            <div className="stepper-wrap">
              {STEPS.map((s, i) => (
                <div key={i}
                  className={`step-pill ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}
                  onClick={() => i < step && setStep(i)}>
                  <div className="step-circle">
                    {i < step ? "✓" : i + 1}
                  </div>
                  <div className="step-label">{s}</div>
                </div>
              ))}
            </div>

            <div className="card">
              {step === 0 && <>
                <div className="card-title">Who's the lucky one? 🎉</div>
                <div className="card-sub">Tell us about the person you're gifting.</div>
                <StepRecipient data={form} onChange={update} />
              </>}
              {step === 1 && <>
                <div className="card-title">What's the occasion? ✨</div>
                <div className="card-sub">Pick the celebration we're shopping for.</div>
                <StepOccasion data={form} onChange={update} />
              </>}
              {step === 2 && <>
                <div className="card-title">Budget & delivery 💰</div>
                <div className="card-sub">We'll match gifts that fit your wallet and timeline.</div>
                <StepBudget data={form} onChange={update} />
              </>}
              {step === 3 && <>
                <div className="card-title">Their personality 🌟</div>
                <div className="card-sub">Interests help us find something they'll truly love.</div>
                <StepPreferences data={form} onChange={update} />
              </>}

              <div className="nav-row">
                {step > 0
                  ? <button className="btn btn-ghost" onClick={() => setStep(s => s-1)}>← Back</button>
                  : <span />
                }
                {step < STEPS.length - 1
                  ? <button className="btn btn-primary" disabled={!canNext()}
                      onClick={() => setStep(s => s+1)}>Continue →</button>
                  : <button className="btn btn-primary" disabled={!canNext()} onClick={submit}>
                      Find my gifts 🎁
                    </button>
                }
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="loading-wrap">
            <div className="diya-spin">🪔</div>
            <p>Curating your perfect gifts…</p>
            <small>Matching preferences, budget & delivery across India</small>
            <div className="loading-dots">
              <span/><span/><span/>
            </div>
          </div>
        )}

        {results && (
          <>
            <div className="results-header">
              <h2>Your top picks for {form.occasion} 🎁</h2>
              <p>For your {form.relation.toLowerCase()} · {form.budget.label} · {form.city}</p>
            </div>
            <div className="gift-grid">
              {results.map((item, i) => (
                <GiftCard key={item.gift.id} item={item} profile={form} />
              ))}
            </div>
            <div className="reset-row">
              <button className="btn btn-outline" onClick={reset}>← Start over</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
