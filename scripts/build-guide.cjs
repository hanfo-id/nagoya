const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {root,loadItinerary} = require('./load-itinerary.cjs');

const context = loadItinerary();
context.guideRelease = fs.readFileSync(path.join(root,'sw.js'),'utf8').match(/const RELEASE='([^']+)'/)[1];
for (const file of ['screen.js','app.js']) {
 const code = fs.readFileSync(path.join(root,file),'utf8');
 vm.runInContext(file==='app.js'?code.slice(0,code.lastIndexOf('\napplyRoute();')):code,context,{filename:file});
}
const html = vm.runInContext(`
 function guideDay(day,anchor) {
  return \`<section class="section" id="\${anchor}"><h2>\${day.date} \${day.dow} · \${esc(day.title)}</h2>\<p>\${esc(day.summary)}</p>
   \${day.events.map(e=>{
    const place=eventPlace(e);
    return \`<article class="panel" data-guide-event="\${e.id}">
     <h3>\${esc(eventSlot(e))} · \${esc(e.title)}</h3><p><b>\${esc(place.name)}</b> · <span lang="ja">\${esc(place.jp)}</span></p>
     <p>\${esc(e.desc)}</p><p>\${esc(e.kind)}\${e.optional?' · 선택 방문':''} · \${link(place.mapUrl,'Google Maps')}</p>
     \${eventInfo(e,{open:true})}</article>\`;
   }).join('')}\${day.note?'<p>'+esc(day.note)+'</p>':''}</section>\`;
 }
 \`<!doctype html>
 <html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
 <title>나고야 전체 일정</title><link rel="stylesheet" href="style.css?v=\${guideRelease}"><link rel="stylesheet" href="controls.css?v=\${guideRelease}">
 <link rel="stylesheet" href="ux.css?v=\${guideRelease}"><link rel="stylesheet" href="screen.css?v=\${guideRelease}"></head>
 <body class="static-guide"><main><p><a href="index.html">여행 웹앱으로 돌아가기</a></p><h1>나고야 전체 일정</h1>
 <p>2026.12.10–14 · 일본 현지 시간</p>
 <nav aria-label="날짜별 일정">\${days.map((day,i)=>\`<a href="#day-\${i+1}">\${day.date} \${esc(day.short)}</a>\`).join(' · ')}</nav>
 \${days.map((day,i)=>(i===SUNDAY?'<span id="sunday-b"></span>':'')+guideDay(day,'day-'+(i+1))).join('')}

 </main></body></html>\`;
`,context);
fs.writeFileSync(path.join(root,'guide.html'),html+'\n');
console.log('Generated guide for all five days.');
