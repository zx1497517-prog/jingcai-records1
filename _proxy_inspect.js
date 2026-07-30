const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
(async () => {
  const r = await fetch('https://trade.500.com/jczq/index.php?playid=271', { headers: { 'User-Agent': UA } });
  const buf = Buffer.from(await r.arrayBuffer());
  const html = new TextDecoder('gbk').decode(buf);
  const i = html.indexOf('周四001');
  console.log('--- around 周四001 ---');
  console.log(html.slice(i - 200, i + 1400));
  // 找完场区域
  const j = html.indexOf('完场');
  console.log('\n--- around 完场 ---');
  console.log(html.slice(j - 100, j + 1200));
})();
