/* Screen composition. Travel data, stable event IDs and storage remain in trip-state.js. */
let screenPage='home',routeObserver=null,selectedStopNumber=0,routeFollowAfter=0;
const DAY_NAMES=['도착','사카에','지브리파크','오스와 골목','귀국'];
function shopHTML(shop){return `<section class="shop-guide"><h3>${esc(shop.name)}</h3><p class="place-jp" lang="ja">${esc(shop.jp)}</p><section class="info-section"><h3>매장 정보</h3>${infoRows([['상품',esc(shop.tag)],['추천 시간',esc(shop.minutes)],['영업',esc(shop.hours)],['주소',`<span lang="ja">${esc(shop.address)}</span>`]])}</section><section class="info-section"><h3>추천 경험</h3><ul class="info-bullets">${shop.picks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section><section class="info-section"><h3>방문 안내</h3>${linesHTML(shop.note)}<div class="info-links">${link(shop.url,'공식 매장 안내')}<small>2026.11.06 확인</small></div></section></section>`}
function stopDescription(p,e,r){if(p.shopId)return '선택 매장 / '+SHOP_GUIDE[p.shopId].tag;if(e.id==='d2-shopping')return '쇼핑·카페 휴식';return r?r.dish.order:p.kind}
function stopDetailAttributes(p){return p.shopId?`data-shop="${p.shopId}"`:`data-place-detail="${p.eventId}" data-detail-number="${p.number}"`}
function routeDayHTML(i){
 const points=numberedPlaces(i),events=getVisibleEvents(state,i),done=baseEvents(i).filter(e=>eventStatus(e)==='done').length;
 const rows=points.map(p=>{const e=events.find(e=>e.id===p.eventId),r=p.shopId?null:restaurants.find(r=>r.id===e?.food);return `<li id="mapstop-${p.number}" class="route-item ${p.status==='skipped'?'is-skipped':''}"><button class="route-place" data-pin="${p.number}" aria-pressed="false"><span class="route-number">${p.number}</span><span class="route-copy"><span class="route-time">${p.shopId?'쇼핑 중 선택':esc(confirmedTime(e)||p.time)}${!p.shopId&&p.optional?' / 선택':''}${p.status!=='planned'?' / '+EVENT_STATUS[p.status]:''}</span><strong>${esc(p.name)}</strong><small>${esc(stopDescription(p,e,r))}</small></span></button><button class="route-more" ${stopDetailAttributes(p)} aria-label="${esc(p.name)} 상세 보기">상세</button></li>`}).join('');
 return `<div class="route-layout"><div class="mapstage"><div id="numberedmap" class="numberedmap" role="region" aria-label="${days[i].date} 번호 핀 지도"></div><div class="mapmodes"><button data-mapextent="all" aria-pressed="true">전체</button><button data-mapextent="city" aria-pressed="false">시내</button>${i===2?'<button data-mapextent="park" aria-pressed="false">지브리</button>':''}</div><p id="maploadstatus" role="status"></p><span id="selectedmapplace" class="sr-only" tabindex="-1">장소를 선택하세요</span><span id="mapcaption" class="sr-only"></span><span class="mapfallbackroutes" hidden></span></div><div class="route-sheet"><button type="button" class="sheet-handle" aria-label="일정 펼치기" aria-expanded="false"><span aria-hidden="true"></span></button><div id="route-tabs-slot"></div><div class="route-day-head"><h2>${days[i].date} ${days[i].dow} <span>${DAY_NAMES[i]}</span></h2><small>완료 ${done}/${baseEvents(i).length}</small></div><div id="route-filters-slot"></div><div class="route-scroll" tabindex="0" aria-label="방문 순서"><ol class="route-list">${rows||'<li class="empty">이 조건에 맞는 일정이 없습니다.</li>'}</ol><details class="route-options"><summary>일정 변경·하루 안내</summary><p>${esc(days[i].note)}</p><p>예상 도보 ${esc(days[i].walk.replace('도보 약 ',''))} / ${esc(days[i].cost)} (쇼핑 제외)</p>${i===0?'<button class="btn btn-secondary" data-adjust="delay">항공 지연 시 밤 일정 생략</button>':''}${i===4?`<label><input id="ramen-alternative" type="checkbox" ${state.overrides.ramenMonday?'checked':''}> 자유시간을 시시마루 라멘으로 교체</label>`:''}<button class="btn btn-secondary" data-adjust="essential">선택 방문 제외</button><button class="btn btn-quiet" data-restore-day="${i}">이 날짜 진행 기록 복원</button></details></div><div id="selected-actions" class="selected-actions" aria-live="polite"><span>목록에서 장소를 선택하세요</span></div></div></div>`;
}
function selectedActions(p){
 const box=document.querySelector('#selected-actions');if(!box)return;
 selectedStopNumber=p.number;const slot=p.shopId?p.time:confirmedTime(baseEvents(active).find(e=>e.id===p.eventId))||p.time;
 box.innerHTML=`<div><small>${p.number}번 <span>${p.shopId?'선택 매장':esc(slot)}</span></small><strong>${esc(p.name)}</strong></div><div class="selected-buttons">${actionLink(directions(p.query,'transit'),'길찾기','primary')}<button class="btn btn-secondary" ${stopDetailAttributes(p)}>상세</button></div>`;
}
function renderHomeCompact(){
 document.body.classList.toggle('is-travelling',travelPhase()==='during'||state.options.fieldMode);
 const clock=japanClock(),today=dayIndexForDate(clock.date);if(state.selectionMode==='auto'&&today>=0)active=today;
 const e=nextEvent({...state,selectedEvent:''},active,clock).event,p=eventPlace(e),def=e&&reservationFor(e),totals=reservationTotals();
 $('#todaypanel').innerHTML=`<div class="home-title"><h1>나고야 여행</h1><p>2026.12.10 목 – 12.14 월</p></div><div class="home-next"><span>${days[active].date} ${today===active?'오늘의 일정':'선택 일정'}</span><h2>${e?esc(p?.name||e.title):'일정을 모두 마쳤어요'}</h2>${e?`<p>${esc(confirmedTime(e)||e.time)} <span>${esc(e.kind)}</span></p><div class="action-group"><button class="btn btn-primary" data-screen="plan">일정 보기</button></div>`:'<button class="btn btn-primary" data-screen="plan">전체 일정</button>'}</div><div class="home-days">${days.map((d,i)=>`<button data-home-day="${i}"><b>${d.date}</b><span>${DAY_NAMES[i]}</span><small>${d.dow}</small></button>`).join('')}</div><div class="home-booking"><button data-screen="food"><strong>식당 찾기</strong><span>추천 메뉴·예약·후기</span><b aria-hidden="true">›</b></button><button data-screen="reservations"><strong>예약 현황</strong><span>확정 ${totals.confirmed} / 확인 필요 ${totals.attention}</span><b aria-hidden="true">›</b></button></div><details class="travel-facts"><summary>항공·호텔 정보</summary><p>입국 12.10 16:50 / 출국 12.14 17:50<br>출국일 공항 도착 목표 14:50</p><p>니시테츠 호텔 크룸 나고야<br><span lang="ja">西鉄ホテル クルーム名古屋</span></p>${link(appMap(PLACE.hotel.query),'호텔 Google Maps')}</details>`;
}
function requestedScreen(){const u=new URL(location.href);return ['home','plan','reservations','prepare','food'].includes(u.searchParams.get('page'))?u.searchParams.get('page'):u.hash==='#reservations'?'reservations':u.hash==='#prepare'?'prepare':u.hash==='#food'?'food':u.searchParams.has('day')||u.searchParams.has('view')||u.hash==='#plan'?'plan':'home'}
function syncScreen(){
 const groups={home:['todaypanel'],plan:['plan'],reservations:['reservations'],food:['food'],prepare:['prepare','backup']};
 for(const id of ['todaypanel','reservation-summary','plan','reservations','food','prepare','backup']){const node=document.getElementById(id);if(node)node.hidden=!(groups[screenPage]||[]).includes(id)}
 document.querySelector('.sources').hidden=screenPage!=='prepare';
 document.body.dataset.screen=screenPage;document.body.dataset.routeView=view;
 const current=screenPage==='home'?'today':screenPage==='plan'?(view==='map'?'map':'plan'):screenPage;
 markNav(current);document.querySelector('#screen-title').textContent=({home:'나고야 여행',plan:'여행 일정',reservations:'예약 현황',prepare:'여행 준비',food:'식당 찾기'})[screenPage];
}
function openScreen(page,{push=true}={}){screenPage=page;if(page==='home')renderHome();syncScreen();writeRoute(push);if(page==='plan'){renderDay();requestAnimationFrame(()=>dayMap?.invalidateSize())}window.scrollTo({top:0,behavior:'instant'});document.querySelector('#screen-title').focus({preventScroll:true})}
function openPlace(id,number){
 const i=Number(id[1])-1,e=baseEvents(i).find(e=>e.id===id);if(!e)return;
 const dialog=$('#place-dialog'),p=(number&&i===active?numberedPlaces(i).find(p=>p.number===number&&p.eventId===id):null)||eventPlace(e),r=restaurants.find(r=>r.id===e.food),def=reservationFor(e),context=journeyContext(e,i);
 dialog.classList.remove('shop-detail');
 const fragment=document.createElement('template');fragment.innerHTML=eventHTML(e,i);const full=fragment.content.querySelector('.detail');
 full?.querySelectorAll('.journeydetail,.compactlinks,.tip').forEach(n=>n.remove());
 if(p&&p.id!==e.placeId&&EXPERIENCES[p.id]){full?.querySelectorAll('.experience,.experiencechoice').forEach(n=>n.remove());full?.insertAdjacentHTML('afterbegin',experienceHTML(p.id))}
 full?.querySelectorAll('[data-res-jump]').forEach(n=>n.closest('p')?.remove());
 const notes=[...full?.children||[]].filter(n=>n.tagName==='UL'||n.tagName==='P');
 if(full&&notes.length){const disclosure=document.createElement('details');disclosure.className='visit-notes';disclosure.innerHTML='<summary>교통·방문 메모</summary>';notes.forEach(n=>disclosure.append(n));full.append(disclosure)}

 dialog.querySelector('.place-body').innerHTML=`<h2 id="place-dialog-title">${esc(p?.name||e.title)}</h2>${p?`<p class="place-jp" lang="ja">${esc(p.jp)}</p>`:''}<p class="place-meta">${esc(e.time)}${e.end?'–'+esc(e.end):''} / ${esc(e.kind)}</p>${def&&!def.walkin?`<div class="place-reservation">${reservationBadge(def)}${reservationTiming(def)}</div>`:''}${r?`<p class="dishshort">추천 ${esc(r.dish.order)}</p>`:''}<div class="place-tools"><label>진행 상태<select data-event-status="${e.id}">${Object.entries(EVENT_STATUS).map(([key,label])=>`<option value="${key}" ${eventStatus(e)===key?'selected':''}>${label}</option>`).join('')}</select></label>${def&&!def.walkin?`<button class="btn btn-secondary" data-res-jump="${def.id}">예약 관리</button>`:''}</div>${r?`<details class="restaurant-facts"><summary>영업·예약·가격</summary><p>${esc(r.hours)}</p><p>${esc(r.booking)}</p><p>${esc(r.price)}</p><div class="compactlinks">${r.book?link(r.book,r.bookLabel):''}${link('tel:+81'+r.phone.replace(/-/g,'').slice(1),r.phone)}${link(r.source,'타베로그')}${r.official?link(r.official,'공식 안내'):''}</div></details>`:''}${id==='d2-shopping'?lachicActivities():''}${full?.innerHTML||''}<details class="segment-routes"><summary>구간별 이동</summary><label>출발지<select id="route-origin"><option value="current">현재 위치</option>${context.from?`<option value="previous">이전: ${esc(context.from.name)}</option>`:''}${context.nextPlace?`<option value="next">다음: ${esc(context.nextPlace.name)}</option>`:''}</select></label><label>이동 수단<select id="route-mode"><option value="transit">대중교통</option><option value="walking">도보</option></select></label><a id="segment-link" class="btn btn-secondary" href="${p?esc(directions(p.query,'transit')):'#'}">경로 열기</a></details>`;
 const update=()=>{const choice=$('#route-origin').value,mode=$('#route-mode').value;$('#segment-link').href=choice==='previous'?routeBetween(context.from,p,mode):choice==='next'?routeBetween(p,context.nextPlace,mode):directions(p.query,mode)};
 $('#route-origin').onchange=update;$('#route-mode').onchange=update;
 dialog.querySelector('.place-footer').innerHTML=p?actionLink(directions(p.query,'transit'),'길찾기','primary'):'';
 if(id==='d2-shopping')dialog.querySelector('.place-tools')?.remove();
 if(r){dialog.querySelectorAll('.menudetail,.restaurant-facts').forEach(n=>n.remove());dialog.querySelector('.place-tools').insertAdjacentHTML('afterend',restaurantInformation(r))}
 styleActions(dialog);if(!dialog.open)dialog.showModal();dialog.querySelector('.place-body').scrollTop=0;
}
function openShop(id){
 const s=SHOP_GUIDE[id];if(!s)return;const point=numberedPlaces(active).find(p=>p.shopId===id);if(point)showMapSelection({number:point.number});
 const dialog=$('#place-dialog');dialog.classList.add('shop-detail');dialog.querySelector('.place-body').innerHTML=shopHTML(s).replace('<h3>','<h2 id="place-dialog-title">').replace('</h3>','</h2>');dialog.querySelector('.place-footer').innerHTML=actionLink(directions(s.query,'transit'),'길찾기','primary');if(!dialog.open)dialog.showModal();dialog.querySelector('.place-body').scrollTop=0;
}
function initScreens(){
 screenPage=requestedScreen();syncScreen();if(screenPage==='plan')renderDay();
 document.addEventListener('click',event=>{
  const t=event.target,page=t.closest('button[data-screen],[data-nav],.brand'),homeDay=t.closest('[data-home-day]'),detail=t.closest('[data-place-detail]'),shop=t.closest('[data-shop]');
  if(page){event.preventDefault();event.stopImmediatePropagation();if(page.hasAttribute('data-nav')){const nav=page.dataset.nav;if(nav==='map'||nav==='plan')view=nav==='map'?'map':'schedule';openScreen(nav==='today'?'home':nav==='map'?'plan':nav)}else openScreen(page.dataset.screen||'home')}
  if(homeDay){event.preventDefault();event.stopImmediatePropagation();active=Number(homeDay.dataset.homeDay);state.selectionMode='manual';state.selectedEvent='';view='schedule';openScreen('plan')}
  if(detail){event.preventDefault();event.stopImmediatePropagation();if(screenPage==='plan')showMapSelection(detail.dataset.detailNumber?{number:Number(detail.dataset.detailNumber)}:{eventId:detail.dataset.placeDetail});openPlace(detail.dataset.placeDetail,Number(detail.dataset.detailNumber)||undefined)}
  if(shop){event.preventDefault();event.stopImmediatePropagation();openShop(shop.dataset.shop)}
  const restaurant=t.closest('[data-restaurant-detail]');if(restaurant){event.preventDefault();event.stopImmediatePropagation();const e=days.flatMap((_,i)=>baseEvents(i)).find(e=>e.food===restaurant.dataset.restaurantDetail);if(e)openPlace(e.id)}
  if(t.closest('[data-close-place]'))$('#place-dialog').close();
 },true);
 window.addEventListener('popstate',()=>{$('#place-dialog')?.close();screenPage=requestedScreen();syncScreen();if(screenPage==='plan')renderDay()});
 window.addEventListener('hashchange',()=>{screenPage=requestedScreen();syncScreen()});
 document.querySelector('#place-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
}
function initRouteObserver(){
 const list=document.querySelector('.route-scroll');if(!list)return;
 const points=numberedPlaces(active),saved=points.find(p=>p.eventIds.includes(state.selectedEvent))||points[0];if(saved){selectPin(saved);spreadMapPins()}initSheetDrag();
 let pending=false,last=selectedStopNumber;
 list.addEventListener('scroll',()=>{if(pending||Date.now()<routeFollowAfter)return;pending=true;requestAnimationFrame(()=>{pending=false;const top=list.getBoundingClientRect().top+12;const items=[...list.querySelectorAll('.route-item')];const candidate=items.find(n=>n.getBoundingClientRect().bottom>top+36);const number=Number(candidate?.querySelector('[data-pin]')?.dataset.pin);if(number&&number!==last){last=number;showMapSelection({number,fromScroll:true})}})},{passive:true});
}

function linesHTML(text){return '<ul class="info-bullets">'+String(text).split(/(?<=[.!?])\s+|\n+/).filter(Boolean).map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'}
function infoRows(rows){return '<dl class="info-rows">'+rows.map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${value}</dd></div>`).join('')+'</dl>'}
function restaurantInformation(r){return `<section class="info-section"><h3>추천 메뉴</h3>${infoRows([['주문',esc(r.dish.order)],['일본어',`<span lang="ja">${esc(r.dish.jp)}</span>`],['맛·주문 팁',linesHTML(r.dish.explain)]])}</section><section class="info-section"><h3>영업·예산</h3>${infoRows([['영업',linesHTML(r.hours)],['1인 예산',esc(r.price)]])}</section><section class="info-section"><h3>예약·방문</h3>${infoRows([['방식',esc(r.status)],['이용 안내',linesHTML(r.booking)]])}<div class="info-links">${r.book?link(r.book,r.bookLabel):''}${link('tel:+81'+r.phone.replace(/-/g,'').slice(1),r.phone)}</div></section><section class="info-section"><h3>위치·출처</h3>${infoRows([['주소',`<span lang="ja">${esc(r.address)}</span>`]])}<div class="info-links">${link(appMap(PLACE[r.id].query),'Google Maps')}${link(r.source,'타베로그')}${r.official?link(r.official,'공식 안내'):''}</div></section>`}
function restaurantCard(r){const def=RESERVATIONS.find(d=>d.id===r.id);return `<article class="restaurant food-card" id="restaurant-${r.id}"><header><span>${esc(r.dish.kind)}</span><small>${esc(r.day)}</small></header><h3>${esc(r.name)}</h3><p class="jp" lang="ja">${esc(r.jp)}</p>${infoRows([['추천',esc(r.dish.order)],['예산',esc(r.price)],['방문 방식',esc(r.status)]])}${def&&!def.walkin?`<div class="food-booking">${reservationBadge(def)}${reservationTiming(def)}</div>`:''}<div class="card-actions">${actionLink(directions(PLACE[r.id].query,'transit'),'길찾기','primary')}${def&&!def.walkin?`<button class="btn btn-secondary" data-res-jump="${def.id}">예약 관리</button>`:`<button class="btn btn-secondary" data-restaurant-detail="${r.id}">식당 상세</button>`}</div><details class="restaurantdetail"><summary>메뉴·영업·예약·후기</summary>${restaurantInformation(r)}${reviewLinks(r)}</details></article>`}
function lachicActivities(){return `<section class="info-section"><h3>쇼핑·휴식</h3><ul class="activity-list">${['d2-shopping','d2-rest'].map(id=>{const e=baseEvents(1).find(e=>e.id===id);return `<li><div><b>${esc(e.time)}–${esc(e.end)}</b><span>${id==='d2-rest'?'사카에 카페에서 휴식':'라시크 쇼핑'}</span></div><label>진행 상태<select data-event-status="${id}">${Object.entries(EVENT_STATUS).map(([key,label])=>`<option value="${key}" ${eventStatus(e)===key?'selected':''}>${label}</option>`).join('')}</select></label></li>`}).join('')}</ul></section>`}
let sheetLevel='balanced';
function sheetStops(height){return {expanded:Math.min(64,height*.1),balanced:height*.32,map:height*.5}}
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
