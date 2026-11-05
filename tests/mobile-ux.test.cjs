const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const dom={innerHTML:''};
const c=vm.createContext({Intl,Date,URL,localStorage:{getItem:()=>null},document:{body:{classList:{toggle(){}}},querySelector:()=>dom},esc:s=>String(s??''),link:(u,t)=>t,$:()=>dom,confirmedTime:()=>'',reservationTotals:()=>({confirmed:0,attention:6})});
for(const f of ['trip-details.js','trip-data.js','map-locations.js','trip-state.js','screen.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
run('state=freshState();active=1;state.selectedDay=1');
const points=json('getMapStops(state,1)');assert.equal(points.filter(p=>p.id==='lachic').length,1);assert.ok(points.find(p=>p.id==='lachic').eventIds.includes('d2-rest'));
assert.equal(points.filter(p=>p.shopId==='parco').length,1);assert.ok(points.find(p=>p.shopId).optional);
run('state.filters.optional=false');assert.equal(run('getMapStops(state,1).some(p=>p.shopId)'),false);
run('state.filters.optional=true;state.filters.foodOnly=true');assert.equal(run('getMapStops(state,1).some(p=>p.shopId)'),false);
run("state.filters.foodOnly=false;state.events['d2-rest']={status:'done'}");assert.equal(run("eventStatus(baseEvents(1).find(e=>e.id==='d2-rest'))"),'done');assert.equal(run("validateBackup(JSON.stringify(backupEnvelope())).events['d2-rest'].status"),'done');
run("state.selectedEvent='d2-oasis';renderHomeCompact()");assert.ok(!dom.innerHTML.includes('data-place-detail'));assert.ok(!dom.innerHTML.includes('장소 상세'));assert.ok(dom.innerHTML.includes('고메다'));
for(const height of [500,722,900]){assert.equal(run(`nearestSheetLevel(${height},sheetStops(${height}).expanded)`),'expanded');assert.equal(run(`nearestSheetLevel(${height},sheetStops(${height}).map)`),'map');assert.ok(run(`sheetStops(${height}).expanded<sheetStops(${height}).balanced&&sheetStops(${height}).balanced<sheetStops(${height}).map`));}
console.log('PASS single Lachic stop with both legacy activity IDs; optional shops follow filters; old rest status and backup retained; home is independent of browsed place; sheet snap boundaries.');
