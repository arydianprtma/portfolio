const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const keyMatch = env.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)/);
const apiKey = keyMatch ? keyMatch[1] : '';

const models = [
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest'
];

async function testModels() {
  for (const model of models) {
    const start = Date.now();
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Halo, perkenalkan dirimu dalam 1 kalimat.' }] }]
        })
      });
      const data = await res.json();
      const elapsed = Date.now() - start;
      if (data.error) {
        console.log(`❌ ${model}: ${data.error.message} (${elapsed}ms)`);
      } else {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        console.log(`✅ ${model}: ${elapsed}ms -> ${reply?.slice(0, 80)}...`);
      }
    } catch (e) {
      console.log(`❌ ${model}: ${e.message}`);
    }
  }
}

testModels();
