// 验证 500 彩票数据源：赛事列表 + 赛果比分 是否可解析
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function fetchGBK(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'zh-CN,zh;q=0.9' } });
  console.log('STATUS', url, r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  return new TextDecoder('gbk').decode(buf);
}

function extractMatches(html) {
  // 500: 每行 data-matchnum="周三001" ; 队名在 <div class="td-team"> ; 时间 data-time
  const rows = [...html.matchAll(/data-matchnum="([^"]+)"[\s\S]*?<\/tr>/g)].map(m => m[0]);
  const out = [];
  for (const row of rows) {
    const num = (row.match(/data-matchnum="([^"]+)"/) || [])[1] || '';
    const time = (row.match(/data-time="([^"]+)"/) || [])[1] || '';
    const teams = [...row.matchAll(/<div class="td-team">\s*<span>([^<]+)<\/span>/g)].map(m => m[1].trim());
    const league = (row.match(/<div class="td-league">\s*<a[^>]*>([^<]+)<\/a>/) || [])[1] || '';
    // 赛果：完场后会有比分，常见 <div class="td-score"> 或 data-score
    const score = (row.match(/data-score="([^"]+)"/) || [])[1]
               || (row.match(/<span class="score">([^<]+)<\/span>/) || [])[1] || '';
    out.push({ num, league: league.trim(), time, home: teams[0] || '', away: teams[1] || '', score: score.trim() });
  }
  return out;
}

(async () => {
  try {
    const url = 'https://trade.500.com/jczq/index.php?playid=271';
    const html = await fetchGBK(url);
    console.log('HTML length', html.length);
    const matches = extractMatches(html);
    console.log('PARSED matches:', matches.length);
    console.log(JSON.stringify(matches.slice(0, 12), null, 2));
    // 看是否含有"完场/比分"字样，判断赛果来源
    console.log('has 完场:', html.includes('完场'));
    console.log('has data-score:', html.includes('data-score'));
    // 打印前 1500 字符便于肉眼检查结构
    console.log('--- HTML HEAD SAMPLE ---');
    console.log(html.slice(0, 1500));
  } catch (e) {
    console.error('ERROR', e.message);
  }
})();
