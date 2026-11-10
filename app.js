'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(url,label)=>/^(https:\/\/|tel:)/.test(url||'')?`<a href="${esc(url)}" ${url.startsWith('tel:')||url.includes('google.com/maps')?'':'target="_blank" rel="noopener"'}>${esc(label)}</a>`:esc(label);
function actionLink(url,label,kind='secondary'){return link(url,label).replace('<a ',`<a class="btn btn-${kind}" `)}
function styleActions(root=document){root.querySelectorAll('button').forEach(b=>{if(b.classList.contains('btn'))return;if(b.closest('.top,.daytabs,.viewbar,.mapmodes')||b.matches('.placeheading,.numberpin,.placecluster,.route-place,.route-more,.sheet-handle,[data-area-filter],[data-home-day],[data-screen],.brand,[data-close-place]'))return;b.classList.remove('textbutton');b.classList.add('btn',b.hasAttribute('data-res-jump')?'btn-primary':b.hasAttribute('data-event-map')||b.hasAttribute('data-focus-event')?'btn-secondary':'btn-quiet')});root.querySelectorAll('a:not(.btn)').forEach(a=>{if(a.closest('.top,.leaflet-control-attribution'))return;if(a.href.includes('google.com/maps/dir/'))a.classList.add('btn','btn-primary');else a.classList.add('link-inline')})}
let active=0,view='schedule',printing=false;
const $=selector=>document.querySelector(selector);
function badge(text,kind=''){return `<span class="statusbadge ${kind}">${esc(text)}</span>`}
function reservationBadge(def){if(!def)return '';const r=reservationValue(def);return badge(r.status==='walkin'?'현장 방문':r.status==='requested'?'예약 요청 중':'예약 '+RES_STATUS[r.status],r.status)}
function reservationTiming(def,planDay=def?.day,planTime=def?.plan){
 if(!def)return '';const r=reservationValue(def),changed=r.status==='confirmed'&&(r.date&&r.date!==isoDay(planDay)||r.time&&r.time!==planTime);
 return `<span class="reservation-plan">계획 ${days[planDay].date} ${planTime||'교체 선택'}</span>${r.status==='confirmed'?`<strong class="actualtime">확정 ${r.date?esc(r.date.slice(5).replace('-','.')):'날짜 미입력'} ${esc(r.time||'확정 시각 미입력')}</strong>`:''}${changed?'<span class="important">확정 기록이 원래 계획과 다릅니다. 주변 일정을 확인하세요. 시간표는 자동 변경하지 않았습니다.</span>':''}`;
}
function confirmedTime(e){const def=reservationFor(e);if(!def)return '';const r=reservationValue(def);return r.status==='confirmed'&&r.time?r.time:''}
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
function reservationTotals(){const defs=activeReservations(),confirmed=defs.filter(r=>reservationValue(r).status==='confirmed').length,requested=defs.filter(r=>reservationValue(r).status==='requested').length,attention=defs.filter(r=>['unconfirmed','cancelled'].includes(reservationValue(r).status)).length;return {total:defs.length,confirmed,requested,attention}}
function renderReservationSummary(){const t=reservationTotals();$('#reservation-summary').innerHTML=`<strong>예약 기록 ${t.confirmed} / ${t.total} 확정${t.requested?' / '+t.requested+'건 요청 중':''}</strong><p>직접 기록한 상태입니다. 실제 예약·티켓 확보와 외부 확정 연락을 확인하세요.</p><button class="textbutton" data-res-jump="mutsumi">예약·티켓 기록 관리</button>`}
function renderReservations(){
 const totals=reservationTotals();$('#reservationstats').innerHTML=[['확정',totals.confirmed],['확인 필요',totals.attention],['요청 중',totals.requested]].map(([label,n])=>`<div><span>${label}</span><b>${n}건</b></div>`).join('');
 const opened=new Set([...document.querySelectorAll('.reservationcard')].filter(c=>c.querySelector('.resedit')?.open).map(c=>c.id.replace('reservation-','')));
 $('#reservationlist').innerHTML=activeReservations().map(def=>{const r=reservationValue(def);return `<article class="reservationcard" id="reservation-${def.id}"><div class="rescardhead"><h3>${esc(def.name)}</h3>${reservationBadge(def)}</div><p class="muted">${esc(def.requirement)}</p>${reservationTiming(def)}<details class="resedit" ${opened.has(def.id)?'open':''}><summary>예약 정보 수정</summary><label>내 예약 상태<select data-res-status="${def.id}" aria-label="${esc(def.name)} 예약 상태">${Object.entries(RES_STATUS).map(([key,label])=>`<option value="${key}" ${key===r.status?'selected':''}>${label}</option>`).join('')}</select></label><div class="reswhen"><label>실제 확정 날짜<input type="date" min="2026-12-10" max="2026-12-14" data-res-date="${def.id}" value="${esc(r.date)}"></label><label>실제 확정 시각<input type="time" data-res-time="${def.id}" value="${esc(r.time)}"></label></div><label>예약 메모<textarea rows="2" maxlength="2000" data-res-note="${def.id}" aria-label="${esc(def.name)} 예약 메모">${esc(r.note)}</textarea></label><div class="compactlinks">${bookingLinks(def.links)}<button class="textbutton" data-reset-res="${def.id}">이 예약 기록 초기화</button></div></details></article>`}).join('')+archivedReservations();styleActions($('#reservationlist'));
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
 $('#checklist').innerHTML=`<div class="checkgroup"><h4>예약 확인</h4>${activeReservations().filter(d=>d.required).map(def=>`<div class="reservationcheck"><span>${esc(def.name)}</span>${reservationBadge(def)}<button class="textbutton" data-res-jump="${def.id}">관리</button></div>`).join('')}</div>`+Object.entries(PREP_GROUPS).map(([group,items])=>`<div class="checkgroup"><h4>${group}</h4>${Object.entries(items).map(([id,text])=>`<label><input type="checkbox" data-check="${id}" ${state.checks[id]?'checked':''}><span>${esc(text)}</span></label>`).join('')}</div>`).join('');
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
