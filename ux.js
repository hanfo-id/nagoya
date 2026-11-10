/* URL navigation, focused updates and user-triggered local changes. */
function readRoute(s=state,href=location.href,clock=japanClock()){
 const params=new URL(href).searchParams,explicit=dayIndexForDate('2026-'+params.get('day'));
 const today=dayIndexForDate(clock.date),day=explicit>=0?explicit:s.selectionMode==='auto'&&today>=0?today:s.selectedDay;
 const wanted=params.get('view'),mode=wanted==='map'||wanted==='schedule'?wanted:s.selectedView;
 return {active:explicit>=0?migratedRouteDay(day,params.get('event')):day,view:mode,explicit:explicit>=0};
}
function applyRoute({history=false}={}){
 const route=readRoute();
 ({active,view}=route);
 if(route.explicit||history)state.selectionMode=route.explicit?'manual':'auto';
 const params=new URL(location.href).searchParams,requested=params.get('event');
 const legacyId=!params.has('plan')&&Object.hasOwn(V2_EVENT_MAP,requested)?V2_EVENT_MAP[requested]:requested;
 const id=legacyId??(history?'':state.selectedEvent);
 state.selectedEvent=eventDayIndex(id)===active?id:'';
 state.selectedDay=active;state.selectedView=view;
}
function writeRoute(push=true){
 state.selectedDay=active;state.selectedView=view;
 const url=new URL(location.href);
 if(typeof screenPage!=='undefined')url.searchParams.set('page',screenPage);
 if(state.selectionMode==='manual')url.searchParams.set('day',days[active].date.replace('.','-'));else url.searchParams.delete('day');
 url.searchParams.set('view',view);url.searchParams.delete('plan');
 if(state.selectedEvent)url.searchParams.set('event',state.selectedEvent);else url.searchParams.delete('event');
 if(url.href!==location.href)history[push?'pushState':'replaceState']({},'',url);persist();
}
function chooseDay(index){if(index<0||index>4)return;active=index;state.selectionMode='manual';state.selectedEvent='';writeRoute();renderDay();renderHome();markNav(view==='map'?'map':'plan')}
function scrollTarget(selector,focus=true){const el=document.querySelector(selector);if(!el)return;el.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});if(focus){el.setAttribute('tabindex','-1');el.focus({preventScroll:true})}}
function focusEvent(id){
 const day=eventDayIndex(id);if(day<0||day>4||!EVENT_IDS.has(id))return;
 active=day;state.selectionMode='manual';state.selectedEvent=id;
 if(!getVisibleEvents(state,day).some(e=>e.id===id)){state.filters.foodOnly=false;state.filters.optional=true}
 openScreen('plan');showMapSelection({eventId:id});openPlace(id,undefined,{expand:true});
}
function markNav(name){if(name==='map')name='plan';document.querySelectorAll('.top nav [data-nav]').forEach(b=>{if(b.dataset.nav===name)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current')})}
function openReservation(id){
 const def=RESERVATIONS.find(r=>r.id===id);if(!def)return;
 if(def.optionalVisit)state.filters.optional=true;
 for(const selector of ['#res-date-filter','#res-group-filter','#res-status-filter'])$(selector).value='';
 renderReservations();
 openScreen('reservations');
 const card=$('#reservation-'+id),editor=card?.querySelector('.resedit');
 if(editor)editor.open=true;
 scrollTarget('#reservation-'+id);
}
function dialogConfirm(message,callback){
 const dialog=$('#confirmdialog');$('#confirmtext').textContent=message;dialog.returnValue='cancel';dialog.showModal();
 const finish=e=>{dialog.removeEventListener('close',finish);if(dialog.returnValue==='confirm')callback()};dialog.addEventListener('close',finish);
}
function downloadJSON(data,name){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportBackup(){
 downloadJSON(backupEnvelope(),'nagoya-trip-'+japanClock().date+'.json');
 announce('JSON 백업 다운로드를 요청했습니다. 다운로드 목록을 확인하세요.');
}
async function importBackup(file){
 if(!file)return;
 try{if(file.size>1000000)throw new Error('1MB 이하의 JSON 백업을 선택하세요.');const imported=validateBackup(await file.text());
  dialogConfirm('현재 기기의 진행·예약·메모·옵션을 이 백업으로 덮어씁니다. 먼저 현재 데이터를 내보내는 것을 권장합니다. 복원할까요?',()=>{remember();state=imported;$('#backupfeedback').textContent='백업을 복원했습니다.';({active,view}=readRoute(state,location.origin+location.pathname));writeRoute();renderAll();announce(persist()?'백업을 복원했습니다. 직전 변경 되돌리기로 복원 전 상태를 되돌릴 수 있습니다.':storageMessage)});
 }catch(error){$('#backupfeedback').textContent=error.message;announce(error.message)}finally{$('#backupfile').value=''}
}
function changeReservation(id,field,value){
 const def=activeReservations().find(d=>d.id===id);if(!def||def.record===false)return;
 if(field==='ticketKind'&&value&&!Object.hasOwn(TICKET_KINDS,value))return;
 if(field==='status'&&!Object.hasOwn(RES_STATUS,value)||field==='date'&&value&&!validDate(value)||field==='time'&&value&&!validTime(value)){announce('여행 기간 내 날짜와 올바른 시각을 입력하세요.');return}
 if(field!=='note')remember();
 state.reservations[id]={...reservationValue(def),[field]:value,updatedAt:new Date().toISOString()};
 if(field==='note'){announce(persist()?'예약 메모를 저장했습니다.':storageMessage);return}
 commit('예약 기록을 저장했습니다. 관련 일정·식당·준비 화면에 반영했습니다.');
 document.querySelector(`[data-res-${field==='ticketKind'?'ticket-kind':field}="${id}"]`)?.focus({preventScroll:true});
}
function initUx(){
 const header=$('.top'),dates=$('#daytabs');
 if(typeof ResizeObserver!=='undefined'){new ResizeObserver(()=>document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px')).observe(header);new ResizeObserver(()=>document.documentElement.style.setProperty('--date-height',dates.getBoundingClientRect().height+'px')).observe(dates)}
 persist();
 $('#daytabs').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(b)chooseDay(Number(b.dataset.day))});
 $('#daytabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?4:(active+(e.key==='ArrowRight'?1:4))%5;chooseDay(next);$('#tab'+next).focus()}});
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-export-itinerary]'))downloadJSON(exportItinerary(),'nagoya-itinerary.json');

  if(e.target.closest('[data-fieldmode]')){state.options.fieldMode=!state.options.fieldMode;persist();renderHome();scrollTarget('#todaypanel')}
  const nav=e.target.closest('[data-nav]');if(nav){markNav(nav.dataset.nav);if(nav.dataset.nav==='plan'){view='schedule';writeRoute();renderDay()}}
  const mode=e.target.closest('[data-view]');if(mode){view=mode.dataset.view;markNav(view==='map'?'map':'plan');writeRoute();renderDay();$(`.viewbar [data-view="${view}"]`)?.focus({preventScroll:true});if(view==='schedule'&&state.selectedEvent)scrollTarget('#event-'+state.selectedEvent);if(view==='map'&&state.selectedEvent)showMapSelection({eventId:state.selectedEvent})}
  const today=e.target.closest('[data-today]');if(today){const n=dayIndexForDate(japanClock().date);if(n>=0){active=n;state.selectionMode='auto';state.selectedEvent='';view='schedule';writeRoute();renderDay();renderHome()}openScreen('home')}
  if(e.target.closest('[data-home-map]')){view='map';openScreen('plan');markNav('map');writeRoute();renderDay();scrollTarget('#daycontent')}
  const focus=e.target.closest('[data-focus-event]');if(focus)focusEvent(focus.dataset.focusEvent);
  const map=e.target.closest('[data-event-map]');if(map){state.selectedEvent=map.dataset.eventMap;view='map';openScreen('plan');writeRoute();renderDay();showMapSelection({eventId:state.selectedEvent});scrollTarget('#selectedmapplace')}
  const pin=e.target.closest('[data-pin]');if(pin)showMapSelection({number:Number(pin.dataset.pin)});
  if(e.target.closest('[data-map-retry]'))try{initDayMap()}catch{announce('지도를 불러오지 못했습니다. 장소별 Google Maps 링크를 이용하세요.')}
  const reservation=e.target.closest('[data-res-jump]');if(reservation)openReservation(reservation.dataset.resJump);
  const food=e.target.closest('[data-food-jump]');if(food){openScreen('food');state.filters.search='';state.filters.reserve='all';$('#search').value='';$('#reservefilter').value='all';persist();renderFood();scrollTarget('#restaurant-'+food.dataset.foodJump)}
  const reset=e.target.closest('[data-reset-res]');if(reset)dialogConfirm('이 예약의 수동 기록만 초기화할까요? 외부 예약은 취소되지 않습니다.',()=>{remember();delete state.reservations[reset.dataset.resetRes];commit('예약 기록을 초기화했습니다.')});
  const adjust=e.target.closest('[data-adjust]');if(adjust){remember();if(adjust.dataset.adjust==='delay'){for(const id of ['d1-ramen','d1-night-park'])state.events[id]={status:'skipped',updatedAt:new Date().toISOString()};state.selectedEvent='d1-checkin'}else{state.filters.optional=false;}commit(adjust.dataset.adjust==='delay'?'첫날 라멘과 밤 산책을 건너뜀으로 기록했습니다. 호텔 체크인으로 이동합니다.':'선택 방문을 제외했습니다. 원할 때 다시 포함할 수 있습니다.');if(adjust.dataset.adjust==='delay')focusEvent('d1-checkin')}
  const restore=e.target.closest('[data-restore-day]');if(restore)dialogConfirm('이 날짜의 진행·건너뜀 기록을 지우고 원래 계획으로 되돌릴까요? 예약·메모는 유지합니다.',()=>{remember();const i=Number(restore.dataset.restoreDay);for(const event of baseEvents(i))delete state.events[event.id];state.filters.optional=true;commit('선택 날짜의 원래 계획을 복원했습니다.')});
  if(e.target.closest('#undolast')){if(!undoState){announce('되돌릴 직전 변경이 없습니다. 각 상태 선택으로도 수정할 수 있습니다.');return}const previous=state;state=undoState;undoState=previous;active=state.selectedDay;view=state.selectedView;writeRoute(false);renderAll();announce(persist()?'직전 변경을 되돌렸습니다.':storageMessage)}
  if(e.target.closest('#exportbackup'))exportBackup();
  if(e.target.closest('#importbackup'))$('#backupfile').click();
  if(e.target.closest('#resetdata'))dialogConfirm('이 기기의 모든 여행 기록을 초기화할까요? 먼저 JSON 백업을 권장합니다. 직전 변경 되돌리기로 복구할 수 있습니다.',()=>{remember();state=freshState();active=dayIndexForDate(japanClock().date);if(active<0)active=0;view='schedule';writeRoute();renderAll();announce(persist()?'여행 기록을 초기화했습니다.':storageMessage)});
  if(e.target.closest('#print'))window.print();
  if(e.target.closest('#applyupdate')){if(window.waitingWorker){navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});window.waitingWorker.postMessage({type:'SKIP_WAITING'})}else location.reload()}
 });
 document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('[data-event-status]')){remember();state.events[t.dataset.eventStatus]={status:t.value,updatedAt:new Date().toISOString()};commit('일정을 '+EVENT_STATUS[t.value]+' 상태로 기록했습니다.');document.querySelector(`[data-event-status="${t.dataset.eventStatus}"]`)?.focus({preventScroll:true})}
  if(['foodonly','optional'].includes(t.id)){remember();state.filters[t.id==='foodonly'?'foodOnly':'optional']=t.checked;commit('일정과 지도에 같은 선택 조건을 반영했습니다.',{reservations:t.id==='optional'})}
  if(t.matches('[data-res-filter]'))renderReservations();
  if(t.id==='res-optional'){state.filters.optional=t.checked;commit('선택 방문 표시를 갱신했습니다.')}
  if(t.matches('[data-res-ticket-kind]'))changeReservation(t.dataset.resTicketKind,'ticketKind',t.value);
  for(const field of ['status','date','time'])if(t.matches('[data-res-'+field+']'))changeReservation(t.dataset['res'+field[0].toUpperCase()+field.slice(1)],field,t.value);
  if(t.matches('[data-check]')){state.checks[t.dataset.check]=t.checked;announce(persist()?'준비 체크를 저장했습니다.':storageMessage);renderChecklist()}
  if(t.id==='reservefilter'){state.filters.reserve=t.value;persist();renderFood()}
  if(t.id==='backupfile')importBackup(t.files[0]);
 });
 document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='search'){state.filters.search=t.value.slice(0,200);persist();renderFood()}
  if(t.id==='memo'){state.memo=t.value;const ok=persist();$('#savestatus').textContent=ok?'메모를 이 브라우저에 저장했습니다.':storageMessage;if(!ok)announce(storageMessage)}
  if(t.matches('[data-res-note]'))changeReservation(t.dataset.resNote,'note',t.value);
 });
 window.addEventListener('popstate',()=>{applyRoute({history:true});screenPage=requestedScreen();syncScreen();renderAll();persist()});
 window.addEventListener('hashchange',()=>{const page=requestedScreen();if(page!==screenPage)openScreen(page,{push:false})});
 window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',afterPrint);
 const network=()=>{$('#networkstatus').textContent=navigator.onLine?'외부 지도·예약 페이지는 인터넷 연결이 필요합니다.':'오프라인입니다. 저장된 일정·기록은 볼 수 있으며, 외부 지도·예약은 연결 후 이용하세요.'};network();window.addEventListener('online',network);window.addEventListener('offline',network);
 if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').then(reg=>{const offer=()=>{window.waitingWorker=reg.waiting;$('#updateavailable').hidden=false};if(reg.waiting)offer();reg.addEventListener('updatefound',()=>reg.installing?.addEventListener('statechange',()=>{if(reg.waiting&&navigator.serviceWorker.controller)offer()}));navigator.serviceWorker.ready.then(()=>{$('#offlinestatus').textContent='핵심 일정의 오프라인 저장이 준비되었습니다. 지도 타일과 외부 페이지는 제외됩니다.'})}).catch(()=>{$('#offlinestatus').textContent='오프라인 저장을 사용할 수 없습니다. 전체 일정 문서를 미리 저장하거나 인쇄하세요.'})}
 let last=japanClock().date+' '+japanClock().time;setInterval(()=>{const c=japanClock(),key=c.date+' '+c.time;if(key===last)return;last=key;const n=dayIndexForDate(c.date);if(state.selectionMode==='auto'&&n>=0&&active!==n&&!readRoute().explicit){active=n;state.selectedDay=n;renderDay();persist()}renderHome()},30000);

}
