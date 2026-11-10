'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(url,label)=>/^(https:\/\/|tel:)/.test(url||'')?`<a href="${esc(url)}" ${url.startsWith('tel:')||url.includes('google.com/maps')?'':'target="_blank" rel="noopener"'}>${esc(label)}</a>`:esc(label);
function actionLink(url,label,kind='secondary'){return link(url,label).replace('<a ',`<a class="btn btn-${kind}" `)}
function styleActions(root=document){root.querySelectorAll('button').forEach(b=>{if(b.classList.contains('btn'))return;if(b.closest('.top,.daytabs,.viewbar,.mapmodes')||b.matches('.placeheading,.numberpin,.placecluster,.route-place,.route-more,.sheet-handle,[data-area-filter],[data-home-day],[data-screen],.brand,[data-close-place]'))return;b.classList.remove('textbutton');b.classList.add('btn',b.hasAttribute('data-res-jump')?'btn-primary':b.hasAttribute('data-event-map')||b.hasAttribute('data-focus-event')?'btn-secondary':'btn-quiet')});root.querySelectorAll('a:not(.btn)').forEach(a=>{if(a.closest('.top,.leaflet-control-attribution'))return;if(a.href.includes('google.com/maps/dir/'))a.classList.add('btn','btn-primary');else a.classList.add('link-inline')})}
let active=0,view='schedule',printing=false;
const $=selector=>document.querySelector(selector);
function badge(text,kind=''){return `<span class="statusbadge ${kind}">${esc(text)}</span>`}
function reservationBadge(def){
 if(!def||def.record===false)return '';
 const {status}=reservationValue(def);
 const label=status==='unconfirmed'?'예약 미확정':status==='confirmed'&&def.type==='restaurant'?'예약 확정':reservationStatuses(def)[status];
 return badge(label,status);
}
function reservationTiming(def){
 if(!def)return '';
 const r=reservationValue(def),done=r.status==='confirmed';
 const changed=done&&(r.date&&r.date!==isoDay(def.day)||r.time&&r.time!==def.plan);
 const planned=`<span class="reservation-plan">계획 ${days[def.day].date} ${def.visit}${def.visit!==def.plan?' 도착 · 예약 목표 '+def.plan:''}</span>`;
 const actual=done&&(r.date||r.time)?`<strong class="actualtime">${def.type==='priority'?'안내 신청':def.type==='restaurant'?'확정':'기록'} ${r.date?esc(r.date.slice(5).replace('-','.')):''} ${esc(r.time)}</strong>`:'';
 const ticket=r.ticketKind?`<span class="reservation-plan">티켓 종류 ${esc(TICKET_KINDS[r.ticketKind])}</span>`:'';
 return planned+actual+ticket+(changed?'<span class="important">기록한 날짜·시각이 계획과 다릅니다. 일정과 대조하세요.</span>':'');
}
function confirmedTime(e){
 const def=reservationFor(e);if(def?.type!=='restaurant')return '';
 const r=reservationValue(def);return r.status==='confirmed'&&r.date===isoDay(def.day)?r.time:'';
}
function printedEvent(e){
 const point=eventPlace(e),def=reservationFor(e);
 return `<article class="event panel" data-printed-event="${e.id}"><h3>${esc(eventSlot(e))} · ${esc(e.title)}</h3>
  <p><b>${esc(point.name)}</b> · <span lang="ja">${esc(point.jp)}</span></p><p>${esc(e.desc)}</p>
  <p class="print-event-meta">${categoryBadge(eventCategory(e))} ${esc(EVENT_STATUS[eventStatus(e)])}${e.optional?' · 선택 방문':''}</p>
  ${def?reservationBadge(def)+reservationTiming(def):''}${eventInfo(e,{open:true})}</article>`;
}
function printedDay(i){
 const day=dayFor(i);
 return `<section class="print-day"><h2>${day.date} ${day.dow} · ${esc(day.title)}</h2>
  <p>${esc(day.summary)}</p>${day.events.map(printedEvent).join('')}${day.note?`<p>${esc(day.note)}</p>`:''}</section>`;
}
function renderDay(){
 document.body.dataset.routeView=view;
 const oldScroll=$('.route-scroll'),oldScrollKey=oldScroll?.dataset.scrollKey,oldScrollTop=oldScroll?.scrollTop;
 const tabs=$('#daytabs'),tools=$('.toolbar');$('#plan').prepend(tabs,tools);
 if(typeof destroyDayMap==='function')destroyDayMap();
 $('#daycontent').innerHTML=routeDayHTML(active);$('#daycontent').setAttribute('aria-labelledby','tab'+active);
 $('#route-tabs-slot').append(tabs);$('#route-filters-slot').append(tools);
 document.querySelectorAll('#daytabs button').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===active));b.tabIndex=i===active?0:-1});
 $('#foodonly').checked=state.filters.foodOnly;$('#optional').checked=state.filters.optional;
 const list=$('.route-scroll');list.dataset.scrollKey=String(active);
 if(oldScrollKey===list.dataset.scrollKey)list.scrollTop=oldScrollTop;
 if(!list.querySelector('[data-event-id]'))$('#selected-actions').hidden=true;
 styleActions($('#daycontent'));if(screenPage==='plan')try{initDayMap();initRouteObserver()}catch(error){console.error('Map initialization failed',error);const status=$('#maploadstatus');if(status)status.textContent='지도 초기화에 실패했습니다. 장소 목록과 Google Maps 링크를 이용하세요.'}
}
function renderHome(){renderHomeCompact()}
function reservationTotals(){
 const defs=activeReservations().filter(def=>def.group==='advance');
 const confirmed=defs.filter(reservationComplete).length;
 const requested=defs.filter(def=>!reservationComplete(def)&&reservationValue(def).status==='requested').length;
 return {total:defs.length,confirmed,requested,attention:defs.length-confirmed};
}
function renderReservationSummary(){
 const t=reservationTotals();
 $('#reservation-summary').innerHTML=`<strong>사전 조치 ${t.confirmed} / ${t.total} 완료</strong><button class="textbutton" data-res-jump="mutsumi">예약·티켓 기록 관리</button>`;
}
function reservationMethod(method,{primary=false}={}){
 const meta=[method.service,method.fee,method.verification,method.selection].filter(Boolean);
 return `<div class="res-method">${primary?actionLink(method.url,method.label,'primary'):link(method.url,method.label)}
  <small>${esc(meta.join(' · '))}</small>${method.note?`<small>${esc(method.note)}</small>`:''}</div>`;
}
function reservationEditor(def,opened){
 if(def.record===false)return '';
 const r=reservationValue(def),timeLabel=({priority:'우선 안내 신청',ticket:'실제 이용',queue:'정리권 안내'})[def.type]||'실제 확정';
 const kinds=def.id==='nabana-ticket'?`<label>보유·예정 티켓 종류<select data-res-ticket-kind="${def.id}"><option value="">선택 안 함</option>${Object.entries(TICKET_KINDS).map(([id,label])=>`<option value="${id}" ${r.ticketKind===id?'selected':''}>${label}</option>`).join('')}</select></label>`:'';
 return `<details class="resedit" ${opened?'open':''}><summary>예약 정보 수정</summary><label>내 기록 상태<select data-res-status="${def.id}" aria-label="${esc(def.name)} 예약 상태">${Object.entries(reservationStatuses(def)).map(([key,label])=>`<option value="${key}" ${key===r.status?'selected':''}>${label}</option>`).join('')}</select></label>${kinds}
 <div class="reswhen"><label>${timeLabel} 날짜<input type="date" min="2026-12-10" max="2026-12-14" data-res-date="${def.id}" value="${esc(r.date)}"></label><label>${timeLabel} 시각<input type="time" data-res-time="${def.id}" value="${esc(r.time)}"></label></div>
 <label>${def.type==='ticket'?'티켓 조건·메모':'예약 메모'}<textarea rows="2" maxlength="2000" data-res-note="${def.id}" aria-label="${esc(def.name)} 예약 메모">${esc(r.note)}</textarea></label>
 <button class="btn btn-quiet" data-reset-res="${def.id}">이 기록 초기화</button></details>`;
}
function reservationCard(def,opened){
 const [primary,...more]=def.methods;
 return `<article class="reservationcard" id="reservation-${def.id}">
 <div class="rescardhead"><h3>${esc(def.name)}</h3>${reservationBadge(def)}</div>
 ${reservationTiming(def)}
 <p class="res-requirement">${esc(def.requirement)}${def.optionalVisit?' · 선택 방문':''}</p>
 ${reservationMethod(primary,{primary:true})}
 <p class="res-note">${esc(def.note)}</p>
 <details class="res-methods" ${opened.has(def.id+'-methods')?'open':''}><summary>다른 경로·확인 근거</summary>
 ${more.map(method=>reservationMethod(method)).join('')}
 <ul class="info-bullets">${def.methods.map(method=>`<li>${link(method.source,method.service+' 확인 근거')} · ${esc(method.verifiedAt)}</li>`).join('')}</ul></details>
 ${reservationEditor(def,opened.has(def.id+'-edit'))}</article>`;
}
function renderReservations(){
 const totals=reservationTotals();
 $('#reservationstats').innerHTML=[['사전 조치 완료',totals.confirmed],['남은 사전 조치',totals.attention],['그중 요청·발권 예정',totals.requested]].map(([label,n])=>`<div><span>${label}</span><b>${n}건</b></div>`).join('');
 $('#res-optional').checked=state.filters.optional;
 const date=$('#res-date-filter').value,group=$('#res-group-filter').value,status=$('#res-status-filter').value;
 const visible=activeReservations().filter(def=>(!date||isoDay(def.day)===date)&&(!group||def.group===group)&&(!status||def.record!==false&&reservationComplete(def)===(status==='done')));
 const opened=new Set();
 document.querySelectorAll('.reservationcard details[open]').forEach(details=>{
  const id=details.closest('.reservationcard').id.replace('reservation-','');
  opened.add(id+(details.matches('.resedit')?'-edit':'-methods'));
 });
 const groups=Object.entries(RESERVATION_GROUPS).map(([id,label])=>{
  const cards=visible.filter(def=>def.group===id);
  return cards.length?`<section class="res-group" aria-label="${label}"><h3>${label} <small>${cards.length}건</small></h3><div class="reservationgrid">${cards.map(def=>reservationCard(def,opened)).join('')}</div></section>`:'';
 }).join('');
 $('#reservationlist').innerHTML=(groups||'<p class="empty">조건에 맞는 예약 안내가 없습니다.</p>')+archivedReservations();
 styleActions($('#reservationlist'));
}
function archivedReservations(){
 const records=Object.entries(state.legacy?.reservations||{}).filter(([id,r])=>!V2_RES_IDS.includes(id)&&id!=='ogawaya-bath'&&plainObject(r));
 for(const id of ['sushi-lunch','keshiki']){
  if(state.reservations[id])records.push([id,state.reservations[id]]);
 }
 if(!records.length)return '';
 const names={sushi:'키타로 · 이전 저녁 일정','sushi-lunch':'키타로 · 이전 토요일 점심',keshiki:'케시키 · 이전 월요일 우선 안내','ghibli-ticket':'지브리파크 · 이전 일정'};
 return `<details class="panel reservation-archive"><summary>이전 일정에서 보관한 예약 기록</summary><ul class="info-bullets">
  ${records.map(([id,r])=>`<li><b>${esc(names[id]||id)}</b><br>${esc([Object.hasOwn(RES_STATUS,r.status)?RES_STATUS[r.status]:'',cleanText(r.date,20),cleanText(r.time,20),cleanText(r.note)].filter(Boolean).join(' · '))}</li>`).join('')}
 </ul></details>`;
}
function renderFood(){
 const q=state.filters.search.trim().toLowerCase(),filter=state.filters.reserve;
 const list=ALL_EVENTS.filter(e=>{
  if(!e.meal)return false;
  const modes=e.booking?.modes||['walk',...(VISIT_LINKS[e.id]?.some(([,url])=>url.startsWith('tel:'))?['phone']:[])];
  return (filter==='all'||modes.includes(filter))&&[e.place.name,e.place.japaneseName,e.title,e.desc,...e.meal,e.requirement].join(' ').toLowerCase().includes(q);
 });
 $('#restaurants').innerHTML=list.length?list.map(restaurantCard).join(''):'<p class="empty" role="status">검색 결과가 없습니다.</p>';
 $('#foodcount').textContent=list.length+'개 식사·카페 일정';styleActions($('#restaurants'));
}
function renderChecklist(){
 $('#checklist').innerHTML=`<div class="checkgroup"><h4>예약 확인</h4>${activeReservations().filter(d=>d.group==='advance').map(def=>`<div class="reservationcheck"><span>${esc(def.name)}</span>${reservationBadge(def)}<button class="textbutton" data-res-jump="${def.id}">관리</button></div>`).join('')}</div>`+Object.entries(PREP_GROUPS).map(([group,items])=>`<div class="checkgroup"><h4>${group}</h4>${Object.entries(items).map(([id,text])=>`<label><input type="checkbox" data-check="${id}" ${state.checks[id]?'checked':''}><span>${esc(text)}</span></label>`).join('')}</div>`).join('');
 const total=Object.values(PREP_GROUPS).flatMap(Object.keys);$('#progress').textContent=total.filter(id=>state.checks[id]).length+' / '+total.length;styleActions($('#checklist'));
}
function renderDependent({reservations=true}={}){renderDay();renderHome();renderReservationSummary();renderFood();renderChecklist();if(reservations)renderReservations();styleActions()}
let announcementTimer;
function announce(message){const el=$('#appstatus');el.textContent=message;el.hidden=false;clearTimeout(announcementTimer);announcementTimer=setTimeout(()=>{el.hidden=true},6000);$('#storagefeedback').textContent=storageMessage}
function commit(message,{reservations=true}={}){const ok=persist();renderDependent({reservations});announce(ok?message:storageMessage)}
function buildTabs(){ $('#daytabs').innerHTML=days.map((d,i)=>`<button role="tab" aria-label="${i+1}일차 ${d.date} ${d.dow} ${esc(d.short)}" id="tab${i}" aria-controls="daycontent" aria-selected="${i===active}" tabindex="${i===active?0:-1}" data-day="${i}"><small>${i+1}일차 ${d.dow[0]}</small><b>${d.date}</b><span>${esc(d.short)}</span></button>`).join('') }
function renderAll(){buildTabs();$('#search').value=state.filters.search;$('#reservefilter').value=state.filters.reserve;$('#memo').value=state.memo;renderDependent();renderSources();if(storageMessage)announce(storageMessage)}
function renderSources(){
 const sources=new Map(activeReservations().flatMap(def=>def.links).filter(([,url])=>url.startsWith('https:')).map(([label,url])=>[url,label]));
 for(const [label,url] of [['긴테쓰 임시 정차 시간표','https://www.kintetsu.co.jp/railway/Dia/dia_nabana_20261017.html'],['직통버스','https://www.sanco.co.jp/shuttle_20261001/'],['12월 13일 점등·운영 안내','https://www.nagashima-onsen.co.jp/nabana/fee/calendar/20261213.html']])sources.set(url,label);
 $('#sources').innerHTML='<ul>'+[...sources].map(([url,label])=>'<li>'+link(url,label)+'</li>').join('')+'</ul>';
}
function beforePrint(){
 if(printing)return;
 printing=true;destroyDayMap();document.body.classList.add('printing');
 $('#printcontent').innerHTML=`<h1>나고야 여행</h1>`+days.map((_,i)=>printedDay(i)).join('');
 $('#printcontent').hidden=false;
}
function afterPrint(){if(!printing)return;printing=false;document.body.classList.remove('printing');$('#printcontent').innerHTML='';$('#printcontent').hidden=true;if(screenPage==='plan')initDayMap()}
applyRoute();
renderAll();initUx();initScreens();writeRoute(false);
