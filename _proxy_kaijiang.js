const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
(async () => {
  const r = await fetch('https://zx.500.com/jczq/kaijiang.php', { headers: { 'User-Agent': UA } });
  console.log('STATUS', r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  const html = new TextDecoder('gbk').decode(buf);
  console.log('LEN', html.length);
  const i = html.indexOf('周三001') >= 0 ? html.indexOf('周三001') : (html.indexOf('周二') >= 0 ? html.indexOf('周二') : html.indexOf('周一'));
  console.log('first match idx', i);
  if (i >= 0) console.log(html.slice(i - 100, i + 900));
  else console.log(html.slice(0, 1500));
})();
