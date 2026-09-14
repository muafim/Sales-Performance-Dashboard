import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import readExcelFile from 'read-excel-file/node';

const input = resolve(process.argv[2] ?? 'dataset sales dashboard.xlsx');
const output = resolve('local-data/salesData.json');
const [headers, ...rows] = await readExcelFile(input, { sheet: 'Data' });
const requiredColumns = ['Retailer', 'Retailer ID', 'Date', 'Region', 'State', 'Beverage Brand', 'Price per Unit', 'Units Sold'];
for (const name of requiredColumns) {
  if (!headers.includes(name)) throw new Error(`Missing required Data column: ${name}.`);
}
const column = (row, name) => row[headers.indexOf(name)];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const records = rows.map((row, index) => {
  const rawDate = column(row, 'Date');
  const rawPrice = column(row, 'Price per Unit');
  const rawUnits = column(row, 'Units Sold');
  const rawRetailerId = column(row, 'Retailer ID');
  const date = rawDate == null ? new Date(NaN) : rawDate instanceof Date ? rawDate : new Date(rawDate);
  const pricePerUnit = rawPrice == null || rawPrice === '' ? NaN : Number(rawPrice);
  const unitsSold = rawUnits == null || rawUnits === '' ? NaN : Number(rawUnits);
  const retailerId = rawRetailerId == null || rawRetailerId === '' ? NaN : Number(rawRetailerId);
  if (Number.isNaN(date.getTime()) || !Number.isFinite(pricePerUnit) || !Number.isFinite(unitsSold) || !Number.isFinite(retailerId)) {
    throw new Error(`Invalid numeric/date field in Data row ${index + 2}.`);
  }
  if (pricePerUnit < 0 || unitsSold < 0) throw new Error(`Negative sale in Data row ${index + 2}.`);
  for (const name of ['Retailer', 'Region', 'State', 'Beverage Brand']) {
    if (!String(column(row, name) ?? '').trim()) throw new Error(`Missing ${name} in Data row ${index + 2}.`);
  }
  const month = date.getUTCMonth() + 1;
  return {
    retailer: String(column(row, 'Retailer') ?? ''),
    retailerId,
    date: date.toISOString().slice(0, 10),
    month,
    monthName: monthNames[month - 1],
    region: String(column(row, 'Region') ?? ''),
    state: String(column(row, 'State') ?? ''),
    beverageBrand: String(column(row, 'Beverage Brand') ?? ''),
    pricePerUnit,
    unitsSold,
    revenue: Number((pricePerUnit * unitsSold).toFixed(2)),
  };
});

await mkdir('local-data', { recursive: true });
await writeFile(output, `${JSON.stringify(records)}\n`);
console.log(`Prepared ${records.length} local records at ${output}. This file is ignored by Git.`);
