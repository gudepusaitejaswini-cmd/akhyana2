const fs = require('fs');

const eventsFile = fs.readFileSync('src/data/daily-history/events.ts', 'utf8');

// Parse the events array using regex or evaluating TS
const eventBlocks = eventsFile.split(/\{\s*id:\s*'/).slice(1);

const events = [];
for (const b of eventBlocks) {
  const block = "{ id: '" + b.split(/\n\s*\},/)[0] + ' }';
  const idMatch = block.match(/id:\s*'([^']+)'/);
  const dateMatch = block.match(/date:\s*'([^']+)'/);
  const displayDateMatch = block.match(/displayDate:\s*'([^']+)'/);
  const yearMatch = block.match(/year:\s*(-?\d+)/);
  const titleMatch = block.match(/title:\s*'([^']+)'/) || block.match(/title:\s*\"([^\"]+)\"/);
  const categoryMatch = block.match(/category:\s*'([^']+)'/);
  const sourceIdMatch = block.match(/sourceId:\s*'([^']+)'/);
  const sourceNameMatch = block.match(/sourceName:\s*'([^']+)'/) || block.match(/sourceName:\s*\"([^\"]+)\"/);

  if (idMatch && dateMatch) {
    events.push({
      id: idMatch[1],
      date: dateMatch[1],
      displayDate: displayDateMatch ? displayDateMatch[1] : '',
      year: yearMatch ? parseInt(yearMatch[1], 10) : 0,
      title: titleMatch ? titleMatch[1] : '',
      category: categoryMatch ? categoryMatch[1] : '',
      sourceId: sourceIdMatch ? sourceIdMatch[1] : '',
      sourceName: sourceNameMatch ? sourceNameMatch[1] : '',
    });
  }
}

console.log('=== CURRENT AAJ KA AKHYANA DATASET AUDIT ===');
console.log('Total Events:', events.length);

const dateMap = new Map();
const categorySet = new Set();
const sourceSet = new Set();

for (const e of events) {
  dateMap.set(e.date, (dateMap.get(e.date) || []).concat(e));
  categorySet.add(e.category);
  sourceSet.add(`${e.sourceId} (${e.sourceName})`);
}

const uniqueDates = Array.from(dateMap.keys()).sort();
console.log('Unique Dates Count:', uniqueDates.length);
console.log('\nDates currently covered:');
console.log(uniqueDates.join(', '));

console.log('\nDates with multiple events:');
for (const [date, list] of dateMap.entries()) {
  if (list.length > 1) {
    console.log(`- ${date} (${list.length} events): ${list.map(e => e.title).join(' | ')}`);
  }
}

console.log('\nCategories represented:');
for (const c of categorySet) {
  console.log(`- ${c}`);
}

console.log('\nSources represented:');
for (const s of sourceSet) {
  console.log(`- ${s}`);
}
