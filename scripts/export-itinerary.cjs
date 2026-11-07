// Export the resolved app itinerary, not the historical trip-data.js inputs alone.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),c=vm.createContext({Intl,Date,localStorage:{getItem:()=>null}});
for(const f of ['trip-details.js','trip-data.js','trip-state.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const data=JSON.parse(vm.runInContext(`JSON.stringify({destination:'나고야',timezone:'Asia/Tokyo',days:days.map((d,i)=>({date:isoDay(i),weekday:d.dow,title:d.short,summary:d.subtitle,note:d.note,events:baseEvents(i).map(e=>{const p=eventPlace(e)||PLACE.airport;return {id:e.id,start:e.time,end:e.end||null,title:e.title,category:e.kind,place:{name:p.name,japaneseName:p.jp,mapUrl:appMap(p.query)},description:e.desc,details:e.steps,optional:e.optional}})}))})`,c));
const output=JSON.stringify(data,null,2)+'\n';
if(process.argv[2]){
 fs.writeFileSync(path.resolve(process.argv[2]),output,'utf8');
}else{
 process.stdout.write(output);
}
