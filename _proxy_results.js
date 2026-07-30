const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
(async () => {
  const r = await fetch('https://trade.500.com/jczq/index.php?playid=271', { headers: { 'User-Agent': UA } });
  const buf = Buffer.from(await r.arrayBuffer());
  const html = new TextDecoder('gbk').decode(buf);
  // 找所有 jczq 相关链接
  const links = [...new Set([...html.matchAll(/href="([^"]*jczq[^"]*)"/g)].map(m => m[1]))];
  console.log('JZCQ LINKS:'); links.slice(0, 30).forEach(l => console.log(' ', l));
  // 找"已完场/完场"相关文本与附近链接
  const m = html.match(/已完场[\s\S]{0,400}/);
  console.log('\n--- 已完场 context ---'); console.log(m ? m[0] : 'NOT FOUND');
  // 找 score 类标记
  console.log('\nhas score class:', /class="score"/.test(html));
  console.log('has data-score:', html.includes('data-score'));
  // 尝试竞彩结果专用页
  for (const u of ['https://trade.500.com/jczq/index.php?playid=271&order=1',
                   'https://live.500.com/']) {
    try {
      const rr = await fetch(u, { headers: { 'User-Agent': UA } });
      console.log('\nTRY', u, '->', rr.status);
    } catch (e) { console.log('TRY', u, 'ERR', e.message); }
  }
})();
