/* Screen composition. Travel data, stable event IDs and storage remain in trip-state.js. */
let screenPage='home',selectedStopNumber=0,routeFollowAfter=0,inlinePlaceKey='';
function categoryBadge(key) {
 const {label,icon}=CATEGORY_VISUALS[key];
 return `<span class="category-badge" data-category="${key}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon}</svg>${label}</span>`;
}
function eventSlot(e){return e.time+(e.end?'–'+e.end:'')}
function stopDescription(p){return EVENTS_BY_ID.get(p.eventId).desc}
function stopKey(p){return p.id+'|'+p.eventIds.join(',')}
function stopDetailAttributes(p){return `data-place-detail="${p.eventId}" data-detail-number="${p.number}" aria-expanded="${inlinePlaceKey===stopKey(p)}"`}
function pointTime(p){return eventSlot(p)}
function routeDayHTML(i){
 const day=dayFor(i),points=numberedPlaces(i),done=day.events.filter(e=>eventStatus(e)==='done').length;
 const open=points.find(p=>p.eventId===state.selectedEvent&&state.expanded[p.eventId]);
 inlinePlaceKey=open?stopKey(open):'';
 const rows=points.map(p=>{
  const expanded=inlinePlaceKey===stopKey(p),event=EVENTS_BY_ID.get(p.eventId);
  const category=eventCategory(event);
  const visit=(event.booking||VISIT_REQUIREMENTS[event.id])?`<span class="route-visit">${esc(event.requirement)}</span>`:'';
  return `<li id="mapstop-${p.number}" data-event-id="${p.eventId}" data-category="${category}" class="route-item category-edge ${p.status==='skipped'?'is-skipped':''}">
   <button class="route-place" data-pin="${p.number}" aria-pressed="false"><span class="route-number">${p.number}</span><span class="route-copy">
    <span class="route-meta"><span class="route-time">${esc(pointTime(p))}</span>${categoryBadge(category)}
    ${p.optional?'<span class="optional-label">선택</span>':''}${p.status!=='planned'?`<span class="route-status">${EVENT_STATUS[p.status]}</span>`:''}${visit}</span>
    <strong>${esc(p.name)}</strong><small>${esc(stopDescription(p))}</small></span></button>
   <button class="route-more" ${stopDetailAttributes(p)} aria-label="${esc(event.title)} 상세">${expanded?'접기':'상세'}</button>
   ${expanded?`<div class="inline-stop-detail">${placeDetailsHTML(p,i)}</div>`:''}</li>`;
 }).join('');
 const region=i===SUNDAY?`<button data-mapextent="nabana" aria-pressed="false">나바나</button>`:'';
 return `<div class="route-layout"><div class="mapstage"><div id="numberedmap" class="numberedmap" role="region" aria-label="${day.date} 번호 핀 지도"></div>
  <div class="mapmodes"><button data-mapextent="all" aria-pressed="true">전체</button><button data-mapextent="city" aria-pressed="false">시내</button>${region}</div>
  <p id="maploadstatus" role="status"></p><span id="selectedmapplace" class="sr-only" tabindex="-1">장소를 선택하세요</span><span id="mapcaption" class="sr-only"></span></div>
  <div class="route-sheet"><button type="button" class="sheet-handle" aria-label="일정 펼치기" aria-expanded="false"><span aria-hidden="true"></span></button><div id="route-tabs-slot"></div>
  <div class="route-day-head"><h2>${day.date} ${day.dow} <span>${esc(day.short)}</span></h2><small>완료 ${done}/${day.events.length}</small></div>
  <div id="route-filters-slot"></div><div class="route-scroll" tabindex="0" aria-label="방문 순서">
  ${i===SUNDAY?`<details class="route-options"><summary>${esc(day.summary)}</summary><p>${esc(day.note)}</p></details>`:''}
  <section id="map-choices" class="pin-choices" aria-label="같은 위치의 일정" hidden></section><ol class="route-list">${rows||'<li class="empty">이 조건에 맞는 일정이 없습니다.</li>'}</ol><details class="route-options"><summary>일정 변경·하루 안내</summary>
  ${i!==SUNDAY?`<p>${esc(day.note||day.summary)}</p>`:''}${i===0?'<button class="btn btn-secondary" data-adjust="delay">항공 지연 시 밤 일정 생략</button>':''}
  <button class="btn btn-secondary" data-adjust="essential">선택 방문 제외</button><button class="btn btn-quiet" data-restore-day="${i}">이 날짜 진행 기록 복원</button></details></div>
  <div id="selected-actions" class="selected-actions" aria-live="polite"><span>목록에서 장소를 선택하세요</span></div></div></div>`;
}
function selectedActions(p){
 const box=document.querySelector('#selected-actions');if(!box)return;
 selectedStopNumber=p.number;const slot=pointTime(p);
 box.innerHTML=`<div><small>${p.number}번 <span>${esc(slot)}</span></small><strong>${esc(p.name)}</strong></div><div class="selected-buttons">${actionLink(directions(p.query,'transit'),'길찾기','primary')}<button class="btn btn-secondary" ${stopDetailAttributes(p)}>${inlinePlaceKey===stopKey(p)?'접기':'상세'}</button></div>`;
}
function renderHomeCompact(){
 document.body.classList.toggle('is-travelling',travelPhase()==='during'||state.options.fieldMode);
 const clock=japanClock(),today=dayIndexForDate(clock.date);if(state.selectionMode==='auto'&&today>=0)active=today;
 const e=nextEvent({...state,selectedEvent:''},active,clock).event,p=eventPlace(e),totals=reservationTotals();
 $('#todaypanel').innerHTML=`<div class="home-title"><h1>나고야 여행</h1><p>2026.12.10 목 – 12.14 월</p></div><div class="home-next"><span>${days[active].date} ${today===active?'오늘의 일정':'선택 일정'}</span><h2>${e?esc(p?.name||e.title):'일정을 모두 마쳤어요'}</h2>${e?`<p class="home-next-meta">${esc(confirmedTime(e)||e.time)} ${categoryBadge(eventCategory(e))}${e.optional?'<span class="optional-label">선택</span>':''}</p><div class="action-group"><button class="btn btn-primary" data-screen="plan">일정 보기</button></div>`:'<button class="btn btn-primary" data-screen="plan">전체 일정</button>'}</div><div class="home-days">${days.map((d,i)=>`<button data-home-day="${i}" aria-label="${d.date} ${d.dow} ${esc(d.short)} 일정 열기"><b>${d.date}</b><small>${d.dow[0]}</small></button>`).join('')}</div><div class="home-booking"><button data-screen="food"><strong>식당 찾기</strong><span>추천 메뉴·예약·후기</span><b aria-hidden="true">›</b></button><button data-screen="reservations"><strong>예약 현황</strong><span>확정 ${totals.confirmed} / 확인 필요 ${totals.attention}</span><b aria-hidden="true">›</b></button></div><details class="travel-facts"><summary>항공·호텔 정보</summary><p>입국 12.10 16:50 / 출국 12.14 17:50<br>출국일 공항 도착 계획 ${esc(baseEvents(4).find(e=>e.id==='d5-airport').end)}</p><p>니시테츠 호텔 크룸 나고야<br><span lang="ja">西鉄ホテル クルーム名古屋</span></p>${link(EVENTS_BY_ID.get('d1-checkin').place.mapUrl,'호텔 Google Maps')}</details>`;
}
function requestedScreen(){const u=new URL(location.href);return ['home','plan','reservations','prepare','food'].includes(u.searchParams.get('page'))?u.searchParams.get('page'):u.hash==='#reservations'?'reservations':u.hash==='#prepare'?'prepare':u.hash==='#food'?'food':u.searchParams.has('day')||u.searchParams.has('view')||u.hash==='#plan'?'plan':'home'}
function syncScreen(){
 const groups={home:['todaypanel'],plan:['plan'],reservations:['reservations'],food:['food'],prepare:['prepare','backup']};
 for(const id of ['todaypanel','reservation-summary','plan','reservations','food','prepare','backup']){const node=document.getElementById(id);if(node)node.hidden=!(groups[screenPage]||[]).includes(id)}
 document.querySelector('.sources').hidden=screenPage!=='prepare';
 document.body.dataset.screen=screenPage;document.body.dataset.routeView=view;
 const current=screenPage==='home'?'today':screenPage==='plan'?'plan':screenPage;
 markNav(current);document.querySelector('#screen-title').textContent=({home:'나고야 여행',plan:'여행 일정',reservations:'예약 현황',prepare:'여행 준비',food:'식당 찾기'})[screenPage];
}
function openScreen(page,{push=true}={}){screenPage=page;if(page==='home')renderHome();syncScreen();writeRoute(push);if(page==='plan'){renderDay();requestAnimationFrame(()=>dayMap?.invalidateSize())}window.scrollTo({top:0,behavior:'instant'});document.querySelector('#screen-title').focus({preventScroll:true})}
function activityHTML(e){return `<li><div><b>${esc(e.time)}${e.end?'–'+esc(e.end):''}</b><span>${esc(e.title)}</span></div><label>진행 상태<select data-event-status="${e.id}" aria-label="${esc(e.title)} 진행 상태">${Object.entries(EVENT_STATUS).map(([key,label])=>`<option value="${key}" ${eventStatus(e)===key?'selected':''}>${label}</option>`).join('')}</select></label></li>`}
function bookingLinks(links){return links.map(([label,url])=>link(url,label)).join('')}
function detailList(items){return `<ul class="info-bullets">${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`}
function eventInfo(e,{open=false}={}){
 const point=eventPlace(e),[kind,order,mealHours,menuSource]=e.meal||[],location=MAP_LOCATIONS[e.placeId];
 const venue=e.kind!=='이동'&&VENUE_VISITS[e.placeId],hours=venue?.hours||mealHours,walk=SHOP_WALKS[e.id];
 const sources=venue?.source?[venue.source,venue.extra]:[menuSource,e.source_url];
 const urls=[...e.booking?.links||[],...VISIT_LINKS[e.id]||[]];
 const sourceLinks=[...new Set(sources.flat().filter(url=>typeof url==='string'&&/^https:\/\//.test(url)))].map(url=>['공식·매장 정보',url]);
 const visit=e.card_notes?.visit_tip;
 const isCovered=text=>e.steps.some(step=>step.includes(text)||text.includes(step));
 const info=[
  ...(order?[['추천 메뉴',esc(order)]]:[]),
  ...(venue?.picks?[['추천 방문',esc(venue.picks)]]:[]),
  ...(hours?[['영업·이용',esc(hours)]]:[]),
  ...(e.requirement&&!['불필요','확인된 예약 조건 없음'].includes(e.requirement)?[['예약·방문',esc(e.requirement)]]:[]),
  ...(point.address?[['위치',`<span lang="ja">${esc(point.address)}</span>`]]:[]),
  ...(location?.note?[['지도 핀',esc(location.note)]]:[])
 ];
 return `<details class="inline-section" ${open?'open':''}><summary>${kind?'추천 메뉴·영업·예약':e.kind==='쇼핑'?'방문 포인트·영업 정보':'방문·이용 정보'}</summary>
  ${infoRows(info)}<div class="info-links">${bookingLinks([...urls,...sourceLinks.filter(([,url])=>!urls.some(([,other])=>other===url))])}</div>
 </details>
  <details class="inline-section" open><summary>교통·방문 메모</summary>
  ${walk?infoRows([['오는 길 · 계획',esc(walk[0])],['다음 장소 · 계획',esc(walk[1])]]):
  e.transport&&e.transport!=='전후 일정과 위치를 확인하고 이동'?`<p class="event-transport">${esc(e.transport)}</p>`:''}${detailList(e.steps)}${visit&&!isCovered(visit)?`<p>${esc(visit)}</p>`:''}</details>`;
}
function placeDetailsHTML(point,i){
 const e=EVENTS_BY_ID.get(point.eventId),def=reservationFor(e);
 const points=getMapStops(state,i),index=points.findIndex(p=>p.eventId===point.eventId);
 const previous=points.slice(0,index).reverse().find(p=>p.status!=='skipped'&&p.id!==point.id),next=points.slice(index+1).find(p=>p.status!=='skipped'&&p.id!==point.id);
 const walking=Boolean(SHOP_WALKS[e.id]);
 return `<p class="inline-jp" lang="ja">${esc(point.jp)}</p><ul class="activity-list">${activityHTML(e)}</ul>
  ${def?`<div class="inline-reservation">${reservationBadge(def)}${reservationTiming(def)}<button class="btn btn-secondary" data-res-jump="${def.id}">${def.record===false?'방문 안내':'예약 관리'}</button></div>`:''}
  ${eventInfo(e)}<details class="inline-section segment-options" data-segment-current="${esc(point.query)}" data-segment-previous="${esc(previous?.query||'')}" data-segment-next="${esc(next?.query||'')}">
  <summary>이전·다음 장소로 이동</summary><label>출발·도착<select data-route-choice="origin"><option value="current">현재 위치 → ${esc(point.name)}</option>
  ${previous?`<option value="previous">${esc(previous.name)} → ${esc(point.name)}</option>`:''}${next?`<option value="next">${esc(point.name)} → ${esc(next.name)}</option>`:''}</select></label>
  <label>이동 수단<select data-route-choice="mode"><option value="transit">대중교통</option><option value="walking" ${walking?'selected':''}>도보</option></select></label>
  ${actionLink(directions(point.query,walking?'walking':'transit'),'경로 열기','secondary').replace('<a ','<a data-segment-link ')}</details>`;
}
function openPlace(id,number,{expand=false}={}){
 const i=eventDayIndex(id);
 if(i!==active||screenPage!=='plan')return;
 const point=getMapStops(state,i).find(p=>p.eventId===id&&(!number||p.number===number));
 if(!point)return;
 const row=document.querySelector('#mapstop-'+point.number),close=!expand&&inlinePlaceKey===stopKey(point);
 if(!row)return;
 const old=document.querySelector('.inline-stop-detail')?.closest('[data-event-id]');
 if(old){state.expanded[old.dataset.eventId]=false;old.querySelector('.inline-stop-detail').remove()}
 inlinePlaceKey=close?'':stopKey(point);
 state.expanded[id]=!close;
 document.querySelectorAll('.route-more').forEach(b=>{b.textContent='상세';b.setAttribute('aria-expanded','false')});
 if(!close){
  const content=document.createElement('div'),button=row.querySelector('.route-more');
  content.className='inline-stop-detail';content.innerHTML=placeDetailsHTML(point,i);
  button.insertAdjacentElement('afterend',content);button.textContent='접기';button.setAttribute('aria-expanded','true');
 }
 routeFollowAfter=Date.now()+1200;selectedActions(point);styleActions(row);persist();
}
function initScreens(){
 screenPage=requestedScreen();syncScreen();
 if(screenPage==='plan'){
  const id=state.selectedEvent;
  renderDay();
  if(id)showMapSelection({eventId:id});
 }
 document.addEventListener('click',event=>{
  const t=event.target,page=t.closest('button[data-screen],[data-nav],.brand'),homeDay=t.closest('[data-home-day]'),detail=t.closest('[data-place-detail]');
  if(page){event.preventDefault();event.stopImmediatePropagation();if(page.hasAttribute('data-nav')){const nav=page.dataset.nav;if(nav==='map'||nav==='plan')view='schedule';openScreen(nav==='today'?'home':nav==='map'?'plan':nav)}else openScreen(page.dataset.screen||'home')}
  if(homeDay){event.preventDefault();event.stopImmediatePropagation();active=Number(homeDay.dataset.homeDay);state.selectionMode='manual';state.selectedEvent='';view='schedule';openScreen('plan')}
  if(t.closest('[data-close-pin-choices]')){
   document.querySelector('#map-choices').hidden=true;
   document.querySelector('#selected-actions [data-place-detail]')?.focus({preventScroll:true});
  }
  if(detail){event.preventDefault();event.stopImmediatePropagation();if(screenPage==='plan')showMapSelection(detail.dataset.detailNumber?{number:Number(detail.dataset.detailNumber)}:{eventId:detail.dataset.placeDetail});openPlace(detail.dataset.placeDetail,Number(detail.dataset.detailNumber)||undefined,{expand:Boolean(detail.closest('.pin-visits'))})}
 },true);
 document.addEventListener('change',event=>{if(!event.target.matches('[data-route-choice]'))return;const root=event.target.closest('.segment-options'),origin=root.querySelector('[data-route-choice=origin]').value,mode=root.querySelector('[data-route-choice=mode]').value;root.querySelector('[data-segment-link]').href=origin==='next'?directions(root.dataset.segmentNext,mode,root.dataset.segmentCurrent):directions(root.dataset.segmentCurrent,mode,origin==='previous'?root.dataset.segmentPrevious:undefined)});
}
function initRouteObserver(){
 const list=document.querySelector('.route-scroll');if(!list)return;
 const points=numberedPlaces(active),saved=points.find(p=>p.eventIds.includes(state.selectedEvent))||points[0];if(saved)selectPin(saved);initSheetDrag();
 let pending=false,last=selectedStopNumber;
 list.addEventListener('scroll',()=>{if(pending||!document.querySelector('#map-choices').hidden||Date.now()<routeFollowAfter)return;pending=true;requestAnimationFrame(()=>{pending=false;const top=list.getBoundingClientRect().top+12;const items=[...list.querySelectorAll('.route-item')];const candidate=items.find(n=>n.getBoundingClientRect().bottom>top+36);const number=Number(candidate?.querySelector('[data-pin]')?.dataset.pin);if(number&&number!==last){last=number;showMapSelection({number,fromScroll:true})}})},{passive:true});
}

function infoRows(rows){return '<dl class="info-rows">'+rows.map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${value}</dd></div>`).join('')+'</dl>'}
function restaurantCard(e){
 const point=eventPlace(e),def=reservationFor(e),[kind,order]=e.meal,category=eventCategory(e);
 return `<article class="restaurant food-card category-edge" id="restaurant-${e.id}" data-category="${category}"><header><span class="food-card-meta">${categoryBadge(category)}<span>${esc(kind)}</span>${e.optional?'<span class="optional-label">선택</span>':''}</span><small>${days[e.day].date} ${esc(e.time)}</small></header>
  <h3>${esc(point.name)}</h3><p class="jp" lang="ja">${esc(point.jp)}</p><p>${esc(e.desc)}</p>
  ${infoRows([['추천',esc(order)],['방문 방식',esc(e.requirement)]])}${def?`<div class="food-booking">${reservationBadge(def)}${reservationTiming(def)}</div>`:''}
  <div class="card-actions">${actionLink(directions(point.query,'transit'),'길찾기','primary')}${def?`<button class="btn btn-secondary" data-res-jump="${def.id}">${def.record===false?'방문 안내':'예약 관리'}</button>`:''}</div>
  <details class="restaurantdetail"><summary>메뉴·영업·방문 메모</summary>${eventInfo(e,{open:true})}${reviewLinks({name:point.name,blogs:BLOGS[e.placeId]})}</details></article>`;
}
let sheetLevel='balanced';
function sheetStops(height){
 const expanded=Math.min(64,height*.1);
 // Reserve space for the fixed controls and at least a short list on compact phones.
 return {expanded,balanced:Math.min(height*.32,Math.max(expanded,height-360)),map:Math.min(height*.5,Math.max(expanded,height-328))};
}
function nearestSheetLevel(height,pixels){return Object.entries(sheetStops(height)).reduce((best,pair)=>Math.abs(pair[1]-pixels)<Math.abs(best[1]-pixels)?pair:best)[0]}
function initSheetDrag(){
 const layout=document.querySelector('.route-layout'),sheet=document.querySelector('.route-sheet'),handle=sheet?.querySelector('.sheet-handle');if(!handle)return;
 const mobile=()=>matchMedia('(max-width:767px)').matches;
 const apply=(level=sheetLevel)=>{sheetLevel=level;const pixels=sheetStops(layout.clientHeight)[level];layout.style.setProperty('--map-height',pixels+'px');handle.setAttribute('aria-expanded',String(level==='expanded'));handle.setAttribute('aria-label',level==='expanded'?'지도 함께 보기':'일정 펼치기');dayMap?.invalidateSize({pan:false})};
 if(mobile())apply(view==='map'&&sheetLevel==='balanced'?'map':sheetLevel);
 let start=null,moved=false,ignoreClickUntil=0;
 sheet.addEventListener('pointerdown',e=>{if(!mobile()||e.button>0||e.target.closest('.route-scroll,.selected-actions,input,select,label'))return;start={id:e.pointerId,y:e.clientY,height:document.querySelector('.mapstage').getBoundingClientRect().height};moved=false;(e.target.closest('button')||sheet).setPointerCapture(e.pointerId)});
 sheet.addEventListener('pointermove',e=>{if(!start||e.pointerId!==start.id)return;const delta=e.clientY-start.y;if(Math.abs(delta)>5){moved=true;sheet.setPointerCapture(e.pointerId);e.preventDefault();const bounds=sheetStops(layout.clientHeight);const pixels=Math.max(bounds.expanded,Math.min(bounds.map,start.height+delta));layout.style.setProperty('--map-height',pixels+'px');dayMap?.invalidateSize({pan:false})}});
 const end=e=>{if(!start||e.pointerId!==start.id)return;if(moved){ignoreClickUntil=Date.now()+400;apply(nearestSheetLevel(layout.clientHeight,document.querySelector('.mapstage').getBoundingClientRect().height))}start=null};
 sheet.addEventListener('pointerup',end);sheet.addEventListener('pointercancel',end);
 sheet.addEventListener('click',e=>{if(Date.now()<ignoreClickUntil&&(e.target===sheet||e.target.closest('.sheet-handle'))){e.preventDefault();e.stopImmediatePropagation()}},true);
 handle.addEventListener('click',()=>{if(Date.now()>=ignoreClickUntil)apply(sheetLevel==='expanded'?'balanced':'expanded')});
 handle.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();apply(e.key==='ArrowUp'||e.key==='Home'?'expanded':'map')}});
}
