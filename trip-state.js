/* Local records and the active itinerary. V2 stays intact during migration. */
const STORAGE_KEY='nagoya26-v3', PREVIOUS_STORAGE_KEY='nagoya26-v2', STATE_VERSION=3;
const EVENT_STATUS={planned:'예정',progress:'진행 중',done:'완료',skipped:'건너뜀'};
const RES_STATUS={unconfirmed:'미확정',requested:'예약 요청 중',confirmed:'확정',walkin:'현장 방문',cancelled:'취소'};
const EVENT_IDS=new Set(ALL_EVENTS.map(event=>event.id));
const FRIDAY_MOVED_EVENTS=new Set(['s18','s20','s22']);
// Keep records for removed activities in v3 and JSON backups.
const RETIRED_ROUTE_EVENTS=['s02','s03','s04','s05','s06','s-coffee-transfer','s-coffee-buriko','s25','d5-morningtransfer','d5-return',
 's17','s19','s21','s23','s24','b03',
 'd4-breakfast','d4-train','d4-town','d4-beef','d4-lunch','d4-bath','d4-pudding','d4-returnwalk','d4-return','d4-hotel','d4-monja'];
const RETIRED_RESERVATIONS=['hida-outbound','ogawaya-ruri','hida-return','monja','ibushigin','sushi-lunch','keshiki'];
function migratedRouteDay(day,eventId){
 if(day===2&&FRIDAY_MOVED_EVENTS.has(eventId))return 1;
 if(day===4&&eventId==='d5-keshiki')return 2;
 return day;
}
const EVENTS_BY_ID=new Map(ALL_EVENTS.map(event=>[event.id,event]));
const RESERVATIONS=ALL_EVENTS.filter(event=>event.booking).map(event=>({
 ...event.booking,day:event.day,visit:event.time,plan:event.booking.time,event:event.id,
 optionalVisit:event.optional,required:['required','ticket'].includes(event.bookingClass)
}));
const PREP_GROUPS={
 '출발 준비':{flight:'항공편 NGO·터미널·출발 시각 확인',passport:'여권·티켓 QR 준비',hotel:'숙소 예약·주소 확인',connect:'통신·교통카드·현금 준비',insurance:'여행자 보험 가입 여부 확인'},
 '현지 확인':{airport:'귀국일 공항 이동·항공사 마감 확인',opening:'관광지 휴관·입장 시각 재확인'}
};
// Equivalent activities only. Old Saturday dinner and a nonspecific bath do not carry into the new bookings.
const V2_EVENT_MAP={
 'd1-arrival':'d1-arrival','d1-train-in':'d1-train-in','d1-checkin':'d1-checkin','d1-ramen':'d1-ramen','d1-night-park':'d1-night-park',
 'd2-morning':'f01','d2-park':'f03','d2-oasis':'f04','d2-lunch':'f06','d2-wings':'f22','d2-tower':'f24',
 'd4-morning':'s01','sun-gero-morning':'d4-breakfast','sun-gero-outbound':'d4-train','sun-gero-town-am':'d4-town','sun-gero-return':'d4-return','d3-monja':'d4-monja',
 'd5-breakfast-transfer':'d5-morningtransfer','d5-keshiki':'d5-keshiki','d5-hotel-return':'d5-return',
 'd5-checkout':'d5-checkout','d5-airport-transfer':'d5-airport','d5-departure-check':'d5-security','d5-flight':'d5-flight'
};
const V2_RES_IDS=['ramuchi','mutsumi','hida-outbound','hida-return','monja','keshiki'];
const plainObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const cleanText=(value,max=2000)=>typeof value==='string'?value.slice(0,max):'';
const validDate=value=>typeof value==='string'&&/^2026-12-(10|11|12|13|14)$/.test(value);
const validTime=value=>typeof value==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(value);
function freshState(){
 return {version:STATE_VERSION,selectedDay:0,selectedView:'schedule',selectionMode:'auto',selectedEvent:'',
  filters:{foodOnly:false,optional:true,search:'',reserve:'all'},options:{fieldMode:false},
  events:{},reservations:{},expanded:{},checks:Object.fromEntries(Object.values(PREP_GROUPS).flatMap(Object.keys).map(id=>[id,false])),
  memo:'',updatedAt:'',legacy:null};
}
function migrateV2(raw) {
 return {...raw,version:STATE_VERSION,legacy:raw,
  selectedEvent:Object.hasOwn(V2_EVENT_MAP,raw.selectedEvent)?V2_EVENT_MAP[raw.selectedEvent]:'',
  events:Object.fromEntries(Object.entries(V2_EVENT_MAP).filter(([id])=>Object.hasOwn(raw.events||{},id)).map(([from,to])=>[to,raw.events[from]])),
  expanded:Object.fromEntries(Object.entries(V2_EVENT_MAP).filter(([id])=>Object.hasOwn(raw.expanded||{},id)).map(([from,to])=>[to,raw.expanded[from]])),
  reservations:Object.fromEntries(V2_RES_IDS.filter(id=>Object.hasOwn(raw.reservations||{},id)).map(id=>[id,raw.reservations[id]]))};
}
function migrateLegacy(old) {
 const converted={...freshState(),version:2};
 converted.memo=cleanText(old.memo,20000);
 if(Number.isInteger(old.day)&&old.day>=0&&old.day<5){converted.selectedDay=old.day;converted.selectionMode='manual'}
 ['ghibli-ticket','mutsumi','ramuchi','monja','sushi','keshiki'].forEach((id,i)=>{
  if(old['c'+i]===true)converted.reservations[id]={status:'confirmed',note:'이전 체크리스트에서 옮긴 기록. 실제 날짜·시간을 확인하세요.'};
 });
 converted.checks.flight=old.c6===true;converted.checks.passport=old.c7===true;converted.checks.connect=old.c7===true;
 const migrated=migrateV2(converted);
 migrated.legacy={...converted,original:old};
 return migrated;
}
function normalizeState(raw,strict=false){
 if(!plainObject(raw)||![2,STATE_VERSION].includes(raw.version))throw new Error('지원하는 나고야 여행 백업(version 2 또는 3)이 아닙니다.');
 if(strict&&(!['events','reservations','filters','options','checks'].every(key=>plainObject(raw[key]))||typeof raw.memo!=='string'))throw new Error('백업 파일의 필수 데이터 구조가 올바르지 않습니다.');
 if(raw.version===2)raw=migrateV2(raw);
 const s=freshState();
 if(Number.isInteger(raw.selectedDay)&&raw.selectedDay>=0&&raw.selectedDay<5)s.selectedDay=raw.selectedDay;
 s.selectedDay=migratedRouteDay(s.selectedDay,raw.selectedEvent);
 if(eventDayIndex(raw.selectedEvent)===s.selectedDay)s.selectedEvent=raw.selectedEvent;
 s.selectedView=raw.selectedView==='map'?'map':'schedule';
 s.selectionMode=raw.selectionMode==='manual'?'manual':'auto';
 s.filters={foodOnly:raw.filters?.foodOnly===true,optional:raw.filters?.optional!==false,search:cleanText(raw.filters?.search,200),
  reserve:['all','web','phone','walk'].includes(raw.filters?.reserve)?raw.filters.reserve:'all'};
 s.options.fieldMode=raw.options?.fieldMode===true;
 for(const id of [...EVENT_IDS,...RETIRED_ROUTE_EVENTS]){
  const value=raw.events?.[id];
  if(plainObject(value)&&Object.hasOwn(EVENT_STATUS,value.status))s.events[id]={status:value.status,updatedAt:cleanText(value.updatedAt,40)};
  if(typeof raw.expanded?.[id]==='boolean')s.expanded[id]=raw.expanded[id];
 }
 for(const id of [...RESERVATIONS.map(def=>def.id),...RETIRED_RESERVATIONS]){
  const value=raw.reservations?.[id];
  if(plainObject(value)&&Object.hasOwn(RES_STATUS,value.status))s.reservations[id]={
   status:value.status,date:validDate(value.date)?value.date:'',time:validTime(value.time)?value.time:'',
   note:cleanText(value.note),updatedAt:cleanText(value.updatedAt,40),
   ...(Object.hasOwn(TICKET_KINDS,value.ticketKind)&&{ticketKind:value.ticketKind})
  };
 }
 for(const id of Object.keys(s.checks))s.checks[id]=raw.checks?.[id]===true;
 s.memo=cleanText(raw.memo,20000);s.updatedAt=cleanText(raw.updatedAt,40);
 if(plainObject(raw.legacy))s.legacy=raw.legacy;
 return s;
}
let storageMessage='';
function loadState(){
 try {
  const current=localStorage.getItem(STORAGE_KEY);
  if(current!==null){
   try{return normalizeState(JSON.parse(current))}
   catch{
    try{if(localStorage.getItem(STORAGE_KEY+'-unreadable')===null)localStorage.setItem(STORAGE_KEY+'-unreadable',current)}catch{}
    storageMessage='새 저장 기록을 읽지 못했습니다. 이전 기록이 있으면 가져옵니다.';
   }
  }
  const previous=localStorage.getItem(PREVIOUS_STORAGE_KEY);
  if(previous!==null){
   try{return normalizeState(JSON.parse(previous))}
   catch{storageMessage='이전 기록을 읽지 못했습니다. 저장된 원본은 보관됩니다.';return freshState()}
  }
  const old=localStorage.getItem('nagoya26');
  return old?normalizeState(migrateLegacy(JSON.parse(old))):freshState();
 }catch{storageMessage='브라우저 저장을 사용할 수 없습니다. 새로고침 전에 JSON 백업을 내려받으세요.';return freshState()}
}
let state=loadState(),undoState=null;
function persist(){
 state.updatedAt=new Date().toISOString();
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true}
 catch{storageMessage='브라우저 저장에 실패했습니다. 새로고침 전에 JSON 백업을 내려받으세요.';return false}
}
function remember(){undoState=JSON.parse(JSON.stringify(state))}
function eventDayIndex(id){return EVENTS_BY_ID.get(id)?.day??-1}
function dayFor(i){return days[i]}
function isoDay(i){return days[i].iso}
function dayIndexForDate(date){return days.findIndex(day=>day.iso===date)}
function activeReservations(){return RESERVATIONS.filter(def=>!def.optionalVisit||state.filters.optional)}
function reservationStatuses(def){
 if(def.type==='priority')return {...RES_STATUS,requested:'우선 안내 신청 중',confirmed:'우선 안내 신청 완료'};
 if(def.type==='ticket')return {...RES_STATUS,requested:'일본 도착 후 발권 예정',confirmed:'티켓 구매 완료',walkin:'현장 발권 예정'};
 if(def.type==='queue')return {...RES_STATUS,requested:'정리권 수령 예정',confirmed:'정리권 수령 완료'};
 if(def.type==='notice')return {...RES_STATUS,requested:'공지 확인 예정',confirmed:'신청 완료',walkin:'예약 불필요 확인'};
 return RES_STATUS;
}
function reservationComplete(def){
 const {status}=reservationValue(def);
 return status==='confirmed'||(status==='walkin'&&['restaurant','notice'].includes(def.type));
}
function reservationFor(event){return RESERVATIONS.find(def=>def.event===event.id)}
function reservationValue(def){return state.reservations[def.id]||{status:'unconfirmed',date:'',time:'',note:''}}
function eventStatus(event){return state.events[event.id]?.status||'planned'}
function baseEvents(i){return dayFor(i).events}
function getVisibleEvents(s=state,i=s.selectedDay,{unfiltered=false}={}){
 return baseEvents(i).filter(e=>unfiltered||(!s.filters.foodOnly||Boolean(e.meal))&&(s.filters.optional||!e.optional));
}
function eventPlace(event){
 if(!event)return null;
 const {place}=event;
 return {id:event.placeId,name:place.name,jp:place.japaneseName,address:place.address,
  query:new URL(place.mapUrl).searchParams.get('query'),mapUrl:place.mapUrl};
}
function getMapStops(s=state,i=s.selectedDay){
 return getVisibleEvents(s,i).map((event,index)=>{
  const place=eventPlace(event);
  return {...place,eventId:event.id,eventIds:[event.id],number:index+1,time:event.time,end:event.end,kind:event.kind,
   optional:event.optional,status:s.events[event.id]?.status||'planned',location:MAP_LOCATIONS[place.id]};
 });
}
function japanClock(now=new Date()){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
 return {date:parts.year+'-'+parts.month+'-'+parts.day,time:parts.hour+':'+parts.minute};
}
function travelPhase(clock=japanClock()){return clock.date<'2026-12-10'?'before':clock.date>'2026-12-14'?'after':'during'}
function nextEvent(s=state,i=s.selectedDay,clock=japanClock()){
 const visible=getVisibleEvents(s,i);
 const remaining=visible.filter(e=>!['done','skipped'].includes(s.events[e.id]?.status));
 const explicit=remaining.find(e=>s.events[e.id]?.status==='progress');
 if(explicit)return {event:explicit,label:'직접 선택한 진행 중 일정'};
 const selected=remaining.find(e=>e.id===s.selectedEvent);
 if(selected)return {event:selected,label:'직접 선택한 일정'};
 if(!remaining.length)return {event:null,label:visible.length?'표시 중인 일정을 모두 마쳤어요':'현재 필터에 맞는 일정이 없어요'};
 const next=isoDay(i)===clock.date?remaining.find(e=>(e.end||e.time)>=clock.time):remaining[0];
 return {event:next||remaining[0],label:next?'다음 미완료 일정':'계획 시각이 지난 미완료 일정'};
}
function routeBetween(from,to,mode='transit'){return directions(to.query,mode,from?.query)}
function transitHint(event){return event.transport}
function validateBackup(text){
 if(text.length>1000000)throw new Error('1MB 이하의 JSON 백업을 선택하세요.');
 let raw;
 try{raw=JSON.parse(text)}catch{throw new Error('올바른 JSON 파일이 아닙니다.')}
 if(raw?.app!=='nagoya-trip'||!plainObject(raw.state))throw new Error('나고야 여행 앱의 상태 백업 파일을 선택하세요.');
 return normalizeState(raw.state,true);
}
function backupEnvelope(){return {app:'nagoya-trip',exportedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(state))}}
