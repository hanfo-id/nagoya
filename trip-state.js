/* Original travel facts live in trip-data.js. All personal changes live here. */
PLACE.kamimaezu={name:'가미마에즈역',jp:'上前津駅',query:'上前津駅 名古屋'};
const STORAGE_KEY='nagoya26-v2',STATE_VERSION=2;
const EVENT_STATUS={planned:'예정',progress:'진행 중',done:'완료',skipped:'건너뜀'};
const RES_STATUS={unconfirmed:'미확정',requested:'예약 요청 중',confirmed:'확정',walkin:'예약 불필요 / 현장 방문',cancelled:'취소'};
const DAY_IDS=[
 ['arrival','train-in','ramen','checkin','night-park','night-oasis','night-shop'],
 ['morning','park','lunch','shopping','oasis','rest','wings','tower','pack'],
 ['morning','outbound','entrance','warehouse','cafe','valley','extra','return','monja'],
 ['morning','old-town','osu-transfer','osu-lunch','osu','market-transfer','sushi','return'],
 ['checkout','keshiki','shopping','luggage','airport-transfer','departure-check','flight']
];
const PRIMARY_PLACES=[
 ['airport','station','ramen','hotel','hisaya','oasis','donki'],
 ['komeda','hisaya','ramuchi','lachic','oasis','hotel','mutsumi','tower','hotel'],
 ['komeda','parkstation','park','warehouse','cafe','valley','forest','hotel','monja'],
 ['hotel','shike','kannon','osu','osu','sushi','sushi','hotel'],
 ['hotel','keshiki','nagoya','hotel','airport','airport','airport']
];
days.forEach((d,i)=>d.events.forEach((e,j)=>{e.id='d'+(i+1)+'-'+DAY_IDS[i][j];e.placeId=PRIMARY_PLACES[i][j]}));
zooEvents.forEach((e,j)=>{e.id='d4-zoo-'+['transfer','visit','lunch'][j];e.placeId=j===2?'kamimaezu':'zoo'});
const RESERVATIONS=[
 {id:'ghibli-ticket',name:'지브리파크 티켓',day:2,plan:'11:00',event:'d3-warehouse',url:S.ghibli,required:true},
 ...['ramuchi','mutsumi','monja','sushi','keshiki'].map((id,j)=>({id,name:PLACE[id].name,day:[1,1,2,3,4][j],plan:['11:00','17:30','19:15','17:30','09:30'][j],food:id,url:restaurants.find(r=>r.id===id).book||'tel:+81'+restaurants.find(r=>r.id===id).phone.replace(/-/g,'').slice(1),required:true})),
 {id:'ramen',name:PLACE.ramen.name,day:0,plan:'19:00',food:'ramen',walkin:true},
 {id:'komeda',name:PLACE.komeda.name,day:1,plan:'07:30',food:'komeda',walkin:true},
 {id:'eel',name:PLACE.eel.name,day:1,plan:'',food:'eel',url:S.eel,optional:true}
];
const PREP_GROUPS={
 '출발 준비':{flight:'항공편 NGO·터미널·출발 시각 확인',passport:'여권·티켓 QR 준비',hotel:'숙소 예약·주소 확인',connect:'통신·교통카드·현금 준비',insurance:'여행자 보험 가입 여부 확인'},
 '현지 확인':{airport:'귀국일 공항 이동·항공사 마감 확인',opening:'관광지 휴관·입장 시각 재확인'}
};
function plainObject(v){return v!==null&&typeof v==='object'&&!Array.isArray(v)}
function freshState(){return {version:2,selectedDay:0,selectedView:'schedule',selectionMode:'auto',selectedEvent:'',filters:{foodOnly:false,optional:true,search:'',reserve:'all'},options:{zoo:false,fieldMode:false},events:{},reservations:{},overrides:{ramenMonday:false},expanded:{},checks:Object.fromEntries(Object.values(PREP_GROUPS).flatMap(Object.keys).map(id=>[id,false])),memo:'',updatedAt:''}}
function cleanText(v,max=2000){return typeof v==='string'?v.slice(0,max):''}
function validDate(v){return typeof v==='string'&&/^2026-12-(10|11|12|13|14)$/.test(v)}
function validTime(v){return typeof v==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(v)}
const EVENT_IDS=new Set([...days.flatMap(d=>d.events.map(e=>e.id)),...zooEvents.map(e=>e.id),'d5-ramen-alternative']);
function normalizeState(raw,strict=false){
 if(!plainObject(raw)||raw.version!==2)throw new Error('지원하는 나고야 여행 백업(version 2)이 아닙니다.');
 if(strict&&(!plainObject(raw.events)||!plainObject(raw.reservations)||!plainObject(raw.filters)||!plainObject(raw.options)||!plainObject(raw.overrides)||!plainObject(raw.checks)||typeof raw.memo!=='string'))throw new Error('백업 파일의 필수 데이터 구조가 올바르지 않습니다.');
 const s=freshState();
 if(Number.isInteger(raw.selectedDay)&&raw.selectedDay>=0&&raw.selectedDay<5)s.selectedDay=raw.selectedDay;
 s.selectedEvent=EVENT_IDS.has(raw.selectedEvent)?raw.selectedEvent:'';
 s.selectedView=raw.selectedView==='map'?'map':'schedule';s.selectionMode=raw.selectionMode==='manual'?'manual':'auto';
 if(plainObject(raw.filters)){s.filters.foodOnly=raw.filters.foodOnly===true;s.filters.optional=raw.filters.optional!==false;s.filters.search=cleanText(raw.filters.search,200);s.filters.reserve=['all','web','phone','walk'].includes(raw.filters.reserve)?raw.filters.reserve:'all'}
 s.options.zoo=raw.options?.zoo===true;s.options.fieldMode=raw.options?.fieldMode===true;s.overrides.ramenMonday=raw.overrides?.ramenMonday===true;
 for(const [id,v] of Object.entries(plainObject(raw.events)?raw.events:{}))if(EVENT_IDS.has(id)&&plainObject(v)&&Object.hasOwn(EVENT_STATUS,v.status))s.events[id]={status:v.status,updatedAt:cleanText(v.updatedAt,40)};
 for(const def of RESERVATIONS){const r=raw.reservations?.[def.id];if(plainObject(r)&&Object.hasOwn(RES_STATUS,r.status))s.reservations[def.id]={status:r.status,date:validDate(r.date)?r.date:'',time:validTime(r.time)?r.time:'',note:cleanText(r.note),updatedAt:cleanText(r.updatedAt,40)}}
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
 let list=days[i].events.map(e=>({...e}));
 if(i===3&&s.options.zoo)list=[{...list[0],time:'07:30',end:'08:10'},...zooEvents.map(e=>({...e})),{...list[4],time:'14:00'},...list.slice(5)];
 if(i===1)list=list.map(e=>e.id==='d2-park'?{...e,title:'히사야오도리 공원',desc:'호텔에서 남쪽으로 공원을 걸어 라무치 방향으로 이동합니다.',steps:['공원과 타워 외관을 보고 사카에 방향으로 이동.','호텔로 돌아가지 않고 지하상가 또는 근처 카페에서 쉬기.','예약된 점심 시각을 우선합니다.']}:e.id==='d2-rest'?{...e,placeId:'lachic',title:'사카에 카페 휴식',desc:'라시크·사카에 남쪽에서 쉬고 가까운 무츠미로 이동합니다.',steps:['라시크 주변 영업 중인 카페에서 휴식.','무츠미 예약과 본점 주소 확인.','17시경 무츠미 방향으로 출발. 호텔 휴식이 필요하면 선택적으로 복귀.']}:e);
 if(i===1){const by=Object.fromEntries(list.map(e=>[e.id,e]));list=[by['d2-morning'],{...by['d2-park'],end:'09:15'},{...by['d2-oasis'],time:'09:20',end:'10:15'},by['d2-lunch'],{...by['d2-shopping'],end:'15:15'},by['d2-rest'],by['d2-wings'],by['d2-tower'],by['d2-pack']]}
 if(i===3&&!s.options.zoo){
  const by=Object.fromEntries(list.map(e=>[e.id,e]));
  list=[by['d4-morning'],{...by['d4-osu-transfer'],time:'09:15',end:'09:45',title:'오스칸논으로 이동',desc:'히사야오도리에서 사카에·가미마에즈를 거쳐 오스 방면. 당일 지도에서 경로 확인.',steps:['오스칸논 주변에서 시작해 상점가로 걷기.','오전에는 아직 열지 않은 점포가 있어 사찰과 거리 풍경부터 관람.']},{...by['d4-osu'],time:'09:45',end:'12:00',title:'오스칸논·오스상점가',steps:['오스칸논 → 니오몬도리 → 반쇼지 주변 순서.','관심 있는 소품·전자제품 매장을 고르고 12시 개점하는 만다라케는 점심 뒤 선택.']},{...by['d4-osu-lunch'],time:'12:00',end:'13:15'}, {...by['d4-market-transfer'],time:'13:15',end:'14:00',placeId:'kokusai',title:'국제센터·시케미치로 이동',desc:'오스에서 국제센터 방면으로 한 번 이동한 뒤 골목 산책과 저녁을 나고야역 쪽에서 이어갑니다.',steps:['지하철 환승 또는 버스 경로를 당일 확인.','짐을 두러 호텔에 왕복하지 않고 시케미치·엔도지에서 휴식.']},{...by['d4-old-town'],time:'14:00',end:'16:45',desc:'오스 → 시케미치·엔도지 → 야나기바시 순으로 이동합니다.',steps:['시케미치 외관과 엔도지 상점가 구경.','카페 휴식을 포함하고 16:45경 야나기바시 방향으로 출발.','개인 주택 촬영과 점포 영업 방해에 주의.']},by['d4-sushi'],by['d4-return']];
 }
 if(i===4&&s.overrides.ramenMonday)list=list.map(e=>e.id==='d5-shopping'?{...days[0].events[2],id:'d5-ramen-alternative',time:'11:00',end:'12:00',title:'첫날 대신 / 시시마루 라멘',desc:'기존 10:30–12:20 기념품 자유시간을 대체한 수동 선택입니다. 13:15 짐 회수 원칙을 유지하세요.'}:e);
 return list.map(e=>({...e,optional:['d1-night-park','d1-night-oasis','d1-night-shop','d3-extra','d4-old-town','d4-zoo-transfer','d4-zoo-visit','d4-zoo-lunch','d4-return'].includes(e.id)}));
}
function getVisibleEvents(s=state,i=s.selectedDay,{unfiltered=false}={}){return baseEvents(i,s).filter(e=>unfiltered||(!s.filters.foodOnly||e.kind==='식사')&&(s.filters.optional||!e.optional))}
function eventPlace(e){return e?.placeId&&PLACE[e.placeId]?{id:e.placeId,...PLACE[e.placeId]}:null}
function getMapStops(s=state,i=s.selectedDay){
 const stops=[];
 for(const e of getVisibleEvents(s,i)){
  if(e.id==='d2-rest')continue; // Its stable status remains editable inside the shopping stop.
  let ids=[e.placeId];
  if(!s.filters.foodOnly){
   if(e.id==='d1-night-park')ids=['hisaya','tower'];
   if(e.id==='d3-outbound')ids=['sake','fuji','parkstation'];
   if(e.id==='d4-old-town')ids=['kokusai','shike','endoji'];
   if(e.id==='d4-osu')ids=['kannon','osu','bansho'];
   if(e.id==='d3-extra')ids=['forest','hill','mononoke'];
  }
  for(const id of ids.filter(Boolean)){if(!PLACE[id])continue;stops.push({id,...PLACE[id],eventId:e.id,eventIds:e.id==='d2-shopping'?['d2-shopping','d2-rest']:[e.id],time:e.time,end:e.end,kind:e.kind,optional:e.optional,status:s.events[e.id]?.status||'planned',number:stops.length+1,location:typeof MAP_LOCATIONS!=='undefined'?MAP_LOCATIONS[id]:null})}
  if(!s.filters.foodOnly&&s.filters.optional)for(const [shopId,shop] of Object.entries(SHOP_GUIDE)){
   const anchor=shopId==='parco'?'d2-lunch':shopId==='mandarake'?(s.options.zoo?'d4-osu':'d4-osu-lunch'):'d5-shopping';
   if(shop.day===i&&e.id===anchor){const id='shop-'+shopId;stops.push({id,...PLACE[id],shopId,eventId:e.id,eventIds:[e.id],time:shopId==='parco'?'12:10':shopId==='mandarake'?(s.options.zoo?'14:00':'12:30'):'10:45',kind:'쇼핑',optional:true,status:'planned',number:stops.length+1,location:typeof MAP_LOCATIONS!=='undefined'?MAP_LOCATIONS[id]:null})}
  }
 }
 return stops;
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
 if(['d3-entrance','d3-warehouse','d3-cafe','d3-valley','d3-extra'].includes(e.id))return '공원 안 도보 / 구역별 이동·대기 확인';
 if(e.id==='d1-checkin')return '사쿠라도리선 → 히사야오도리 / 짐 회수 포함';
 if(['d5-keshiki'].includes(e.id))return '사쿠라도리선 국제센터 → 도보';
 if(e.id==='d4-zoo-transfer')return '히가시야마선 → 히가시야마코엔 / 정문 도보';
 if(e.id==='d4-zoo-lunch')return '히가시야마선 ↔ 메이조선 / 환승 확인';
 if(e.id==='d3-outbound'||e.id==='d3-return')return '지하철 ↔ 리니모 / 후지가오카 환승';
 if(['d1-train-in','d5-airport-transfer'].includes(e.id))return '메이테츠·지하철 / 환승 확인';
 if(e.id==='d4-osu-transfer')return '지하철 → 가미마에즈 / 오스 방면';
 if(e.id==='d4-market-transfer')return state.options.zoo?'오스 → 야나기바시':'오스 → 국제센터 / 당일 교통편 확인';
 if(e.kind==='이동')return '대중교통·도보 / 상세 이동 안내 확인';
 if(prev?.placeId===e.placeId)return '같은 장소에서 이어서';
 return '도보·대중교통 중 현장 선택';
}
function validateBackup(text){if(text.length>1000000)throw new Error('1MB 이하의 JSON 백업을 선택하세요.');let raw;try{raw=JSON.parse(text)}catch{throw new Error('올바른 JSON 파일이 아닙니다.')}if(raw.app!=='nagoya-trip'||!plainObject(raw.state))throw new Error('나고야 여행에서 내보낸 백업 파일이 아닙니다.');return normalizeState(raw.state,true)}
function backupEnvelope(){return {app:'nagoya-trip',exportedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(state))}}
