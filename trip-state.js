/* Original travel facts live in trip-data.js. All personal changes live here. */
PLACE.kamimaezu={name:'가미마에즈역',jp:'上前津駅',query:'上前津駅 名古屋'};
const STORAGE_KEY='nagoya26-v2',STATE_VERSION=2;
const EVENT_STATUS={planned:'예정',progress:'진행 중',done:'완료',skipped:'건너뜀'};
const RES_STATUS={unconfirmed:'미확정',requested:'예약 요청 중',confirmed:'확정',walkin:'예약 불필요 / 현장 방문',cancelled:'취소'};
const LEGACY_EVENT_IDS=[
 'd3-morning','d3-outbound','d3-entrance','d3-warehouse','d3-cafe','d3-valley','d3-extra','d3-return',
 'd1-night-oasis','d1-night-shop','d5-shopping','d5-luggage','d5-ramen-alternative'
];
const SHISHIMARU_STOP=itineraryEvent(
 'd1-shishimaru','ramen','19:25','20:20','역에서 시시마루 라멘 / 저녁 교체','식사',
 '메이테츠 나고야에 19:00까지 도착하고 짐을 바로 맡길 수 있을 때 선택합니다.',
 ['다이코도리구치 방향으로 20–35분을 잡습니다.','20:15까지 매장 도착이 어렵거나 줄이 길면 호텔 먼저 일정으로 돌아갑니다.','식사 뒤 짐을 찾아 호텔로 이동합니다. 주문 마감 21:00.'],
 {food:'ramen'}
);
zooEvents.forEach((event,index)=>{
 event.id='d4-zoo-'+['transfer','visit','lunch'][index];
 event.placeId=index===2?'kamimaezu':'zoo';
});
const EXCURSION_DAY=days.findIndex(day=>day.events.some(event=>event.id==='sun-gero-private-bath'));
const CITY_DAY=days.findIndex(day=>day.events.some(event=>event.id==='d4-osu'));
function eventDayIndex(id){
 if(id===SHISHIMARU_STOP.id)return 0;
 if(zooEvents.some(event=>event.id===id))return CITY_DAY;
 return days.findIndex(day=>day.events.some(event=>event.id===id));
}
const RESERVATIONS=[
 {id:'hida-outbound',name:'특급 히다 3호 · 나고야 → 게로',day:EXCURSION_DAY,plan:'08:43',event:'sun-gero-outbound',url:GERO_LINKS.rail,required:true},
 {id:'ogawaya-bath',name:'오가와야 별관 유라기 대절탕',day:EXCURSION_DAY,plan:'12:30',event:'sun-gero-private-bath',url:GERO_LINKS.bath,required:true},
 {id:'hida-return',name:'특급 히다 14호 · 게로 → 나고야',day:EXCURSION_DAY,plan:'15:32',event:'sun-gero-return',url:GERO_LINKS.rail,required:true},
 ...['ramuchi','mutsumi','monja','sushi','keshiki'].map((id,j)=>({id,name:PLACE[id].name,day:days.findIndex(d=>d.events.some(e=>e.food===id)),plan:['11:00','17:30','19:15','17:30','09:30'][j],food:id,url:restaurants.find(r=>r.id===id).book||'tel:+81'+restaurants.find(r=>r.id===id).phone.replace(/-/g,'').slice(1),required:true})),
 {id:'shoraku',name:PLACE.shoraku.name,day:0,plan:'19:55',food:'shoraku',walkin:true},
 {id:'ramen',name:PLACE.ramen.name,day:0,plan:SHISHIMARU_STOP.time,food:'ramen',walkin:true,optional:true},
 {id:'komeda',name:PLACE.komeda.name,day:1,plan:'08:25',food:'komeda',walkin:true},
 {id:'eel',name:PLACE.eel.name,day:1,plan:'',food:'eel',url:S.eel,optional:true}
];
const PREP_GROUPS={
 '출발 준비':{flight:'항공편 NGO·터미널·출발 시각 확인',passport:'여권·티켓 QR 준비',hotel:'숙소 예약·주소 확인',connect:'통신·교통카드·현금 준비',insurance:'여행자 보험 가입 여부 확인'},
 '현지 확인':{airport:'귀국일 공항 이동·항공사 마감 확인',opening:'관광지 휴관·입장 시각 재확인'}
};
function plainObject(v){return v!==null&&typeof v==='object'&&!Array.isArray(v)}
function freshState(){return {version:2,selectedDay:0,selectedView:'schedule',selectionMode:'auto',selectedEvent:'',filters:{foodOnly:false,optional:true,search:'',reserve:'all'},options:{zoo:false,fieldMode:false},events:{},reservations:{},overrides:{ramenMonday:false,shishimaruThursday:false},expanded:{},checks:Object.fromEntries(Object.values(PREP_GROUPS).flatMap(Object.keys).map(id=>[id,false])),memo:'',updatedAt:''}}
function cleanText(v,max=2000){return typeof v==='string'?v.slice(0,max):''}
function validDate(v){return typeof v==='string'&&/^2026-12-(10|11|12|13|14)$/.test(v)}
function validTime(v){return typeof v==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(v)}
const EVENT_IDS=new Set([...LEGACY_EVENT_IDS,...days.flatMap(d=>d.events.map(e=>e.id)),...zooEvents.map(e=>e.id),SHISHIMARU_STOP.id]);
function normalizeState(raw,strict=false){
 if(!plainObject(raw)||raw.version!==2)throw new Error('지원하는 나고야 여행 백업(version 2)이 아닙니다.');
 if(strict&&(!plainObject(raw.events)||!plainObject(raw.reservations)||!plainObject(raw.filters)||!plainObject(raw.options)||!plainObject(raw.overrides)||!plainObject(raw.checks)||typeof raw.memo!=='string'))throw new Error('백업 파일의 필수 데이터 구조가 올바르지 않습니다.');
 const s=freshState();
 if(Number.isInteger(raw.selectedDay)&&raw.selectedDay>=0&&raw.selectedDay<5)s.selectedDay=raw.selectedDay;
 s.selectedEvent=EVENT_IDS.has(raw.selectedEvent)&&eventDayIndex(raw.selectedEvent)>=0?raw.selectedEvent:'';
 s.selectedView=raw.selectedView==='map'?'map':'schedule';s.selectionMode=raw.selectionMode==='manual'?'manual':'auto';
 if(plainObject(raw.filters)){s.filters.foodOnly=raw.filters.foodOnly===true;s.filters.optional=raw.filters.optional!==false;s.filters.search=cleanText(raw.filters.search,200);s.filters.reserve=['all','web','phone','walk'].includes(raw.filters.reserve)?raw.filters.reserve:'all'}
 s.options.zoo=raw.options?.zoo===true;s.options.fieldMode=raw.options?.fieldMode===true;s.overrides.ramenMonday=raw.overrides?.ramenMonday===true;s.overrides.shishimaruThursday=raw.overrides?.shishimaruThursday===true;
 for(const [id,v] of Object.entries(plainObject(raw.events)?raw.events:{}))if(EVENT_IDS.has(id)&&plainObject(v)&&Object.hasOwn(EVENT_STATUS,v.status))s.events[id]={status:v.status,updatedAt:cleanText(v.updatedAt,40)};
 for(const def of [...RESERVATIONS,{id:'ghibli-ticket'}]){const r=raw.reservations?.[def.id];if(plainObject(r)&&Object.hasOwn(RES_STATUS,r.status))s.reservations[def.id]={status:r.status,date:validDate(r.date)?r.date:'',time:validTime(r.time)?r.time:'',note:cleanText(r.note),updatedAt:cleanText(r.updatedAt,40)}}
 for(const [id,v] of Object.entries(plainObject(raw.expanded)?raw.expanded:{}))if(EVENT_IDS.has(id)&&typeof v==='boolean')s.expanded[id]=v;
 for(const id of Object.values(PREP_GROUPS).flatMap(Object.keys))s.checks[id]=raw.checks?.[id]===true;
 s.memo=cleanText(raw.memo,20000);s.updatedAt=cleanText(raw.updatedAt,40);return s;
}
function migrateLegacy(old){
 const s=freshState();if(!plainObject(old))return s;
 s.memo=cleanText(old.memo,20000);s.options.zoo=old.zoo===true;
 if(Number.isInteger(old.day)&&old.day>=0&&old.day<5){s.selectedDay=old.day;s.selectionMode='manual'}
 s.filters.search=cleanText(old.search,200);s.filters.reserve=['all','web','phone','walk'].includes(old.reserve)?old.reserve:'all';
 ['ghibli-ticket','mutsumi','ramuchi','monja','sushi','keshiki'].forEach((id,j)=>{if(old['c'+j]===true)s.reservations[id]={status:'confirmed',date:'',time:'',note:'이전 체크리스트에서 가져온 수동 기록. 확정 날짜·시간을 재확인하세요.',updatedAt:''}});
 s.checks.flight=old.c6===true;for(const id of ['passport','connect'])s.checks[id]=old.c7===true;return s;
}
let storageMessage='';
function loadState(){
 try{const raw=localStorage.getItem(STORAGE_KEY);if(raw!==null){try{return normalizeState(JSON.parse(raw))}catch{try{localStorage.setItem(STORAGE_KEY+'-unreadable',raw)}catch{}storageMessage='저장 데이터 형식을 읽지 못해 기본 화면을 열었습니다. 읽지 못한 원본은 가능한 경우 별도 보존했습니다.';return freshState()}}
 const old=localStorage.getItem('nagoya26');if(old){try{const s=migrateLegacy(JSON.parse(old));storageMessage='기존 메모·체크리스트·옵션을 가져왔습니다. 이전 저장본도 보존했습니다.';return s}catch{storageMessage='기존 저장 데이터가 손상되었습니다. 기본 일정은 계속 볼 수 있습니다.'}}return freshState();
 }catch{storageMessage='브라우저 저장을 사용할 수 없습니다. 현재 화면에서는 사용할 수 있지만, 새로고침 전 JSON 백업을 내려받으세요.';return freshState()}
}
let state=loadState(),undoState=null;
function persist(){state.updatedAt=new Date().toISOString();try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true}catch{storageMessage='브라우저 저장에 실패했습니다. 새로고침 전 JSON 백업을 내려받으세요.';return false}}
function remember(){undoState=JSON.parse(JSON.stringify(state))}
function eventStatus(e){return state.events[e.id]?.status||'planned'}
function reservationFor(e){return RESERVATIONS.find(r=>r.event===e.id||r.food&&r.food===e.food)}
function reservationValue(def){return state.reservations[def.id]||{status:def.walkin?'walkin':'unconfirmed',date:'',time:'',note:''}}
function isoDay(i){return '2026-'+days[i].date.replace('.','-')}
function japanClock(now=new Date()){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
 return {date:p.year+'-'+p.month+'-'+p.day,time:p.hour+':'+p.minute};
}
function travelPhase(clock=japanClock()){return clock.date<'2026-12-10'?'before':clock.date>'2026-12-14'?'after':'during'}
function dayIndexForDate(date){return days.findIndex((_,i)=>isoDay(i)===date)}
function baseEvents(i,s=state){
 const list=days[i].events.map(event=>({...event}));
 if(i===0&&s.overrides.shishimaruThursday){
  const [arrival,train,checkin,,walk]=list;
  return [
   arrival,train,{...SHISHIMARU_STOP},
   {...checkin,time:'20:20',end:'21:05',desc:'라멘을 먹고 짐을 찾아 사쿠라도리선 히사야오도리역을 거쳐 호텔로 갑니다.',steps:['역에서 캐리어를 찾아 호텔에 체크인합니다.']},
   {...walk,time:'21:05',end:'21:30',desc:'체력이 남으면 체크인 후 공원 북쪽을 잠깐 걷습니다.'}
  ];
 }
 if(i===CITY_DAY&&s.options.zoo){
  const byId=Object.fromEntries(list.map(event=>[event.id,event]));
  return [
   {...byId['d4-morning'],time:'07:30',end:'08:10'},
   ...zooEvents.map(event=>({...event,optional:true})),
   {...byId['d4-osu'],time:'14:00',end:'15:50'},
   {...byId['d4-market-transfer'],time:'15:50',end:'16:25',steps:['가미마에즈역에서 메이조선을 타고 숙소로 돌아갑니다.']},
   {...byId['d4-old-town'],time:'16:25',end:'16:50',steps:['호텔에서 잠시 쉰 뒤 16:50에 식당으로 출발합니다.']},
   byId['d4-sushi-transfer'],byId['d4-sushi'],byId['d4-return']
  ];
 }
 return list;
}
function getVisibleEvents(s=state,i=s.selectedDay,{unfiltered=false}={}){return baseEvents(i,s).filter(e=>unfiltered||(!s.filters.foodOnly||e.kind==='식사')&&(s.filters.optional||!e.optional))}
function eventPlace(e){return e?.placeId&&PLACE[e.placeId]?{id:e.placeId,...PLACE[e.placeId],query:e.mapQuery||PLACE[e.placeId].query}:null}
function getMapStops(s=state,i=s.selectedDay){
 const stops=[];
 for(const e of getVisibleEvents(s,i)){
  if(e.id==='d2-rest')continue; // Its stable status remains editable inside the shopping stop.
  let ids=[e.placeId];
  if(!s.filters.foodOnly){
   if(e.id==='d5-airport-transfer')ids=['kanayama','airport'];
   if(e.id==='sun-gero-outbound')ids=['jrNagoya','geroStation'];
   if(e.id==='sun-gero-return')ids=['geroStation','jrNagoya'];
   if(e.id==='d4-osu')ids=['kannon','osu','bansho'];
  }
  for(const id of ids.filter(Boolean)){if(!PLACE[id])continue;stops.push({id,...PLACE[id],eventId:e.id,eventIds:e.id==='d2-shopping'?['d2-shopping','d2-rest']:[e.id],time:e.time,end:e.end,kind:e.kind,optional:e.optional,status:s.events[e.id]?.status||'planned',number:stops.length+1,location:typeof MAP_LOCATIONS!=='undefined'?MAP_LOCATIONS[id]:null})}

 }
 const merged=[];
 for(const point of stops){const candidateIndex=merged.findLastIndex((prior,index)=>prior.id===point.id&&merged.slice(index+1).every(item=>item.eventIds.every(id=>prior.eventIds.includes(id))));const previous=candidateIndex>=0?merged[candidateIndex]:null;if(previous){previous.eventIds=[...new Set([...previous.eventIds,...point.eventIds])];if(previous.kind==='이동'&&point.kind!=='이동'){previous.eventId=point.eventId;previous.kind=point.kind}previous.optional=previous.optional&&point.optional;previous.end=[previous.end||previous.time,point.end||point.time].sort().at(-1)}else merged.push({...point,eventIds:[...point.eventIds]})}
 const all=baseEvents(i,s);
 return merged.map((point,index)=>{const activities=all.filter(e=>point.eventIds.includes(e.id));const statuses=activities.map(e=>s.events[e.id]?.status||'planned');return {...point,number:index+1,activities:activities.map(e=>e.id),time:activities.map(e=>e.time).sort()[0]||point.time,end:activities.map(e=>e.end||e.time).sort().at(-1)||point.end,status:statuses.every(v=>v==='skipped')?'skipped':statuses.every(v=>v==='done')?'done':statuses.includes('progress')?'progress':'planned'}});
}
function nextEvent(s=state,i=s.selectedDay,clock=japanClock()){
 const list=getVisibleEvents(s,i),remaining=list.filter(e=>!['done','skipped'].includes(s.events[e.id]?.status));
 const explicit=remaining.find(e=>s.events[e.id]?.status==='progress');if(explicit)return {event:explicit,label:'직접 선택한 진행 중 일정'};
 const selected=remaining.find(e=>e.id===s.selectedEvent);if(selected)return {event:selected,label:'직접 선택한 일정 / 시간 추천과 구분'};
 if(!remaining.length)return {event:null,label:list.length?'표시 중인 일정을 모두 마쳤어요':'현재 필터에 맞는 일정이 없어요'};
 if(isoDay(i)!==clock.date)return {event:remaining[0],label:'선택한 날짜의 첫 미완료 일정'};
 const relevant=remaining.find(e=>(e.end||e.time)>=clock.time);
 return {event:relevant||remaining[0],label:relevant?'일본 현재 시각에 따른 추천 / 완료 추정 아님':'계획 시각이 지난 미완료 일정 확인'};
}
function routeBetween(from,to,mode='transit'){return directions(to.query,mode,from?.query)}
function transitHint(e,prev){
 if(['sun-gero-outbound','sun-gero-return'].includes(e.id))return 'JR 특급 히다 / 지정석과 실제 출발 시각 확인';
 if(['geroTown','geroLunch','ogawaya','geroRiver'].includes(e.placeId))return '게로 온천마을 안 도보';
 if(e.id==='d1-checkin')return '사쿠라도리선 → 히사야오도리 / 호텔 체크인';
 if(['d5-breakfast-transfer','d5-hotel-return'].includes(e.id))return '사쿠라도리선 국제센터 → 도보';
 if(e.id==='d4-zoo-transfer')return '히가시야마선 → 히가시야마코엔 / 정문 도보';
 if(e.id==='d4-zoo-lunch')return '히가시야마선 ↔ 메이조선 / 환승 확인';
 if(e.id==='d1-train-in')return '메이테츠 공항선 / 메이테츠 나고야역';
 if(e.id==='d5-airport-transfer')return '메이조선 → 가나야마 → 메이테츠 공항행';
 if(e.id==='d4-osu-transfer')return '마루노우치 환승 → 쓰루마이선 오스칸논';
 if(e.id==='d4-market-transfer')return '가미마에즈 → 메이조선 히사야오도리';
 if(e.id==='d4-sushi-transfer')return '사쿠라도리선 국제센터 → 야나기바시 도보';
 if(e.kind==='이동')return '대중교통·도보 / 상세 이동 안내 확인';
 if(prev?.placeId===e.placeId)return '같은 장소에서 이어서';
 return '도보·대중교통 중 현장 선택';
}
function validateBackup(text){if(text.length>1000000)throw new Error('1MB 이하의 JSON 백업을 선택하세요.');let raw;try{raw=JSON.parse(text)}catch{throw new Error('올바른 JSON 파일이 아닙니다.')}if(raw.app!=='nagoya-trip'||!plainObject(raw.state))throw new Error('나고야 여행에서 내보낸 백업 파일이 아닙니다.');return normalizeState(raw.state,true)}
function backupEnvelope(){return {app:'nagoya-trip',exportedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(state))}}
