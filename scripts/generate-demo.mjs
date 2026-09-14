import { mkdir, writeFile } from 'node:fs/promises';

// Entirely synthetic transactions. No workbook values or distributions are used.
const states = [
  'Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];
const brands = ['Coca-Cola', 'Diet Coke', 'Sprite', 'Fanta', 'Powerade', 'Dasani Water'];
const retailers = ['Northstar Market', 'Metro Grocery', 'Cornerstone Foods', 'Summit Retail'];
const regions = {
  Northeast: ['Connecticut', 'Delaware', 'Maine', 'Maryland', 'Massachusetts', 'New Hampshire', 'New Jersey', 'New York', 'Pennsylvania', 'Rhode Island', 'Vermont'],
  South: ['Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky', 'Louisiana', 'Mississippi', 'North Carolina', 'Oklahoma', 'South Carolina', 'Tennessee', 'Texas', 'Virginia', 'West Virginia'],
  Midwest: ['Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota', 'Missouri', 'Nebraska', 'North Dakota', 'Ohio', 'South Dakota', 'Wisconsin'],
};
const regionFor = (state) => Object.entries(regions).find(([, members]) => members.includes(state))?.[0] ?? 'West';
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const records = [];

for (let month = 1; month <= 12; month++) {
  for (let stateIndex = 0; stateIndex < states.length; stateIndex++) {
    for (let slot = 0; slot < 2; slot++) {
      const brandIndex = (stateIndex * 2 + month + slot) % brands.length;
      const retailerIndex = (stateIndex + month + slot) % retailers.length;
      const pricePerUnit = Number((0.48 + brandIndex * 0.052 + ((stateIndex + month) % 4) * 0.013).toFixed(2));
      const season = 1 + 0.16 * Math.sin((month - 3) * Math.PI / 6);
      const stateFactor = 0.55 + ((stateIndex * 7) % 19) / 20;
      const unitsSold = Math.round((12000 + ((stateIndex * 137 + brandIndex * 311 + month * 229) % 7000)) * season * stateFactor / 100) * 100;
      records.push({
        retailer: retailers[retailerIndex],
        retailerId: 500000 + retailerIndex,
        date: `2025-${String(month).padStart(2, '0')}-${String(5 + slot * 8).padStart(2, '0')}`,
        month,
        monthName: monthNames[month - 1],
        region: regionFor(states[stateIndex]),
        state: states[stateIndex],
        beverageBrand: brands[brandIndex],
        pricePerUnit,
        unitsSold,
        revenue: Number((pricePerUnit * unitsSold).toFixed(2)),
      });
    }
  }
}

await mkdir('src/data', { recursive: true });
await writeFile('src/data/demoSalesData.json', `${JSON.stringify(records)}\n`);
console.log(`Generated ${records.length} synthetic records.`);
