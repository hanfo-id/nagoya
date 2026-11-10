const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {root,loadItinerary} = require('./load-itinerary.cjs');

const context = loadItinerary();
for (const file of ['screen.js','app.js']) {
 const code = fs.readFileSync(path.join(root,file),'utf8');
 vm.runInContext(file==='app.js'?code.slice(0,code.lastIndexOf('\napplyRoute();')):code,context,{filename:file});
}
const html = vm.runInContext(`
 function guideDay(day,anchor) {
  return \`<section class="section" id="\${anchor}"><h2>\${day.date} \${day.dow} · \${esc(day.title)}</h2><p>\${esc(day.summary)}</p>
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
 <title>나고야 전체 일정</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="controls.css">
 <link rel="stylesheet" href="ux.css"><link rel="stylesheet" href="screen.css"></head>
 <body><main><p><a href="index.html">여행 웹앱으로 돌아가기</a></p><h1>나고야 전체 일정</h1>
 <p>2026.12.10–14 · 일본 현지 시간 · 12월 13일만 A/B 중 하나를 선택합니다.</p>
 <nav aria-label="날짜별 일정"><a href="#day-1">12.10</a> · <a href="#day-2">12.11</a> · <a href="#day-3">12.12</a> ·
  <a href="#sunday-a">12.13 A 게로 온천</a> · <a href="#sunday-b">12.13 B 나바나노사토</a> · <a href="#day-5">12.14</a></nav>
 \${commonDays.slice(0,3).map((day,i)=>guideDay(day,'day-'+(i+1))).join('')}
 \${guideDay(sundayDays.A,'sunday-a')}\${guideDay(sundayDays.B,'sunday-b')}\${guideDay(commonDays[3],'day-5')}
 </main></body></html>\`;
`,context);
fs.writeFileSync(path.join(root,'guide.html'),html+'\n');
console.log('Generated guide for both Sunday plans and four shared days.');
