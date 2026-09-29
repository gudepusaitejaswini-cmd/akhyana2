async function main() {
  const res = await fetch('https://akhyana2.vercel.app/');
  const html = await res.text();
  const matches = html.match(/assets\/[^\s"'<>\)]+/g) || [];
  console.log('Matches with assets/:', [...new Set(matches)]);

  for (const asset of new Set(matches)) {
    const url = 'https://akhyana2.vercel.app/' + asset;
    const r = await fetch(url);
    console.log(asset, '->', r.status, r.headers.get('content-type'));
  }
}
main();
