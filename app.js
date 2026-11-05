'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(url,label)=>/^(https:\/\/|tel:)/.test(url||'')?`<a href="${esc(url)}" ${url.startsWith('tel:')||url.includes('google.com/maps')?'':'target="_blank" rel="noopener"'}>${esc(label)}</a>`:esc(label);
function actionLink(url,label,kind='secondary'){return link(url,label).replace('<a ',`<a class="btn btn-${kind}" `)}
function styleActions(root=document){root.querySelectorAll('button').forEach(b=>{if(b.closest('.top,.daytabs,.viewbar,.mapmodes')||b.matches('.placeheading,.numberpin,.placecluster,.route-place,.route-more,.shop-pick,[data-home-day],[data-screen],.brand,[data-close-place]'))return;b.classList.remove('textbutton');b.classList.add('btn',b.hasAttribute('data-res-jump')?'btn-primary':b.hasAttribute('data-event-map')||b.hasAttribute('data-focus-event')?'btn-secondary':'btn-quiet')});root.querySelectorAll('a:not(.btn)').forEach(a=>{if(a.closest('.top,.leaflet-control-attribution'))return;if(a.href.includes('google.com/maps/dir/'))a.classList.add('btn','btn-primary');else a.classList.add('link-inline')})}
let active=0,view='schedule',printing=false;
const $=selector=>document.querySelector(selector);
function badge(text,kind=''){return `<span class="statusbadge ${kind}">${esc(text)}</span>`}
function reservationBadge(def){if(!def)return '';const r=reservationValue(def);return badge(r.status==='walkin'?'현장 방문':r.status==='requested'?'예약 요청 중':'예약 '+RES_STATUS[r.status],r.status)}
function reservationTiming(def,planDay=def?.day,planTime=def?.plan){
 if(!def)return '';const r=reservationValue(def),changed=r.status==='confirmed'&&(r.date&&r.date!==isoDay(planDay)||r.time&&r.time!==planTime);
 return `<span class="reservation-plan">계획 ${days[planDay].date} ${planTime||'교체 선택'}</span>${r.status==='confirmed'?`<strong class="actualtime">확정 ${r.date?esc(r.date.slice(5).replace('-','.')):'날짜 미입력'} ${esc(r.time||'확정 시각 미입력')}</strong>`:''}${changed?'<span class="important">확정 기록이 원래 계획과 다릅니다. 주변 일정을 확인하세요. 시간표는 자동 변경하지 않았습니다.</span>':''}`;
}
function confirmedTime(e){const def=reservationFor(e);if(!def)return '';const r=reservationValue(def);return r.status==='confirmed'&&r.time?r.time:''}
function timeBlock(e){const actual=confirmedTime(e);return actual?`<b class="actual-slot">${esc(actual)}<small>확정 시각</small></b><small>계획 ${esc(e.time)}${e.end?'–'+esc(e.end):''}</small>`:`${esc(e.time)}<small>${e.end?'– '+esc(e.end):''}</small>`}
function importantFor(e){
 const def=reservationFor(e);
 if(def?.id==='ghibli-ticket')return '티켓 필요 / 실제 대창고 입장 시각 우선';
 if(e.id==='d5-luggage')return '13:15 짐 회수 목표 유지';
 if(e.id==='d5-airport-transfer')return '14:50 터미널 도착 목표';
 if(e.id==='d5-flight')return '17:50 출발 / 탑승 마감은 항공권 확인';
 if(e.id==='d1-night-oasis'||e.id==='d2-oasis')return '옥상 공사 폐쇄 / 지상 개방 구간만';
 if(e.id==='d2-lunch')return '11:00 개점 목표 / 현금 준비';
 if(e.id==='d2-wings')return '본점 주소·예약 확정 연락 확인';
 return e.optional?'체력·날씨에 따라 생략 가능':'';
}
function journeyContext(e,i,print=false){
 const list=print?baseEvents(i):getVisibleEvents(state,i),index=list.findIndex(x=>x.id===e.id);
 const prev=list.slice(0,index).reverse().find(x=>eventStatus(x)!=='skipped'&&eventPlace(x));
 const next=list.slice(index+1).find(x=>eventStatus(x)!=='skipped'&&eventPlace(x));
 return {prev,next,from:eventPlace(prev),to:eventPlace(e),nextPlace:eventPlace(next)};
}
function journeyLinks(e,i){
 const {prev,next,from,to,nextPlace}=journeyContext(e,i);if(!to)return '';
 return `<details class="journeydetail"><summary>구간별 길찾기</summary>${from?`<p>이전 장소 ${esc(from.name)} → ${esc(to.name)}</p><div class="compactlinks">${link(routeBetween(from,to,'transit'),'대중교통')}${link(routeBetween(from,to,'walking'),'도보')}</div>`:'<p>첫 표시 장소입니다. 현재 위치에서 목적지를 검색합니다.</p>'}${nextPlace?`<p>여기 ${esc(to.name)} → 다음 ${esc(nextPlace.name)}</p><div class="compactlinks">${link(routeBetween(to,nextPlace,'transit'),'대중교통')}${link(routeBetween(to,nextPlace,'walking'),'도보')}</div>`:''}<p class="muted">실제 운행·환승·소요 시간은 Google Maps에서 확인하세요.</p></details>`;
}
function eventHTML(e,i,print=false){
 const p=eventPlace(e),r=restaurants.find(x=>x.id===e.food),def=reservationFor(e),status=eventStatus(e),clock=japanClock();
 const past=isoDay(i)<clock.date||isoDay(i)===clock.date&&(e.end||e.time)<clock.time;
 const {prev,from}=journeyContext(e,i,print),open=print||state.expanded[e.id];
 return `<article class="stop travelstop ${status==='done'?'is-done':status==='skipped'?'is-skipped':''} ${state.selectedEvent===e.id?'is-target':''}" id="${print?'print-':''}event-${e.id}" data-event-id="${e.id}"><div class="time">${timeBlock(e)}</div><div class="eventrow"><details class="event" data-event-key="${e.id}" ${open?'open':''}><summary><div><div class="eventtags"><span class="tag ${e.kind==='식사'?'food':''}">${esc(e.kind)}</span>${badge(EVENT_STATUS[status],status)}${past&&status==='planned'?badge('계획 시각 지남 / 미완료','elapsed'):''}${e.optional?badge('선택 방문','optional'):''}</div><h4>${esc(e.title)}</h4>${p?`<span class="placename">${esc(p.name)} / <span lang="ja">${esc(p.jp)}</span></span>`:''}<span class="movement">${esc(transitHint(e,prev))}</span>${importantFor(e)?`<span class="important">${esc(importantFor(e))}</span>`:''}${def?`<div class="reservation-inline">${reservationBadge(def)}${reservationTiming(def,def.walkin?i:def.day,def.walkin?e.time:def.plan)}</div>`:''}${r?`<span class="dishshort">추천 ${esc(r.dish.order)}</span>`:''}<span class="detailhint">${open?'상세 접기':'상세 보기'}</span></div></summary><div class="detail"><p>${esc(e.desc)}</p><p class="staytime">계획 체류·이동: ${esc(e.time)}${e.end?'–'+esc(e.end):''} / 실제 소요 시간은 현장 기준</p><ul>${e.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>${experiencesForEvent(e)}${menuDetails(r)}${def?`<p><button class="textbutton" data-res-jump="${def.id}">예약 관리</button></p>`:''}${r?`<div class="tip"><strong>${esc(r.status)}</strong><br>${esc(r.booking)}<br>예산 ${esc(r.price)} / ${link('tel:+81'+r.phone.replace(/-/g,'').slice(1),r.phone)}</div>`:''}<div class="compactlinks">${p?link(appMap(p.query),'Google Maps'):''}${r?`<button class="textbutton" data-food-jump="${r.id}">식당 메뉴·후기</button>`:''}${r?.book?link(r.book,r.bookLabel):''}${def?.id==='ghibli-ticket'?link(S.ghibli,'공식 티켓'):''}${e.id==='d2-tower'?link(S.tower,'공식 시간·요금'):''}${e.placeId==='zoo'?link(S.zoo,'동물원 공식 안내'):''}${e.placeId==='cafe'?link('https://ghibli-park.jp/food/tairiku-menu.html','카페 공식 메뉴'):''}</div>${reviewLinks(r)}${journeyLinks(e,i)}</div></details><div class="eventactions">${p?link(directions(p.query,'transit'),'길찾기'):''}${p?`<button class="textbutton" data-event-map="${e.id}">지도</button>`:''}<label class="event-status-label">진행 상태<select data-event-status="${e.id}" aria-label="${esc(e.title)} 진행 상태">${Object.entries(EVENT_STATUS).map(([key,label])=>`<option value="${key}" ${status===key?'selected':''}>${label}</option>`).join('')}</select></label></div></div></article>`;
}
function scheduleViews(){return `<div class="viewbar" role="group" aria-label="일정 보기 방식"><button type="button" data-view="schedule" aria-pressed="${view==='schedule'}">시간별 일정</button><button type="button" data-view="map" aria-pressed="${view==='map'}">동선 지도</button><span>같은 필터·같은 방문 순서</span></div>`}
function detailedDayHTML(i,print=false){
 const d=days[i],events=print?baseEvents(i):getVisibleEvents(state,i),all=baseEvents(i),done=all.filter(e=>eventStatus(e)==='done').length,skipped=all.filter(e=>eventStatus(e)==='skipped').length;
 const briefs=['입국과 체크인, 가벼운 저녁','평일 맛집과 사카에 산책','든든한 아침 후 지브리의 세계로','주말 상점가와 취향대로 고르는 오전','텐무스 모닝과 여유 있는 귀국'];
 return `<article class="dayblock"><div class="dayhero"><p class="eyebrow">${i+1}일차 / ${d.date} ${d.dow}</p><h3>${esc(d.title)}</h3><p class="dayblurb">${briefs[i]}</p><div class="daystats"><div><span>예상 도보</span><b>${esc(d.walk.replace('도보 약 ',''))}</b></div><div><span>예상 지출 / 1인</span><b>${esc(d.cost.replace('약 ',''))}</b></div><div><span>완료${skipped?' / '+skipped+'개 건너뜀':''}</span><b>${done} / ${all.length}</b></div></div><details class="dayintro"><summary>하루 안내·예산 전제</summary><p>${esc(d.subtitle)}</p><p>예산은 쇼핑 제외 추정값입니다. 진행 기록은 선택 사항이며 시간이 지나도 자동 완료하지 않습니다.</p></details></div>${print?'':scheduleViews()}${!print&&view==='schedule'?'<div class="timeline-tools"><button class="btn btn-quiet" data-expand-all>상세 모두 펼치기</button></div>':''}${print||view==='schedule'?`<div class="timeline">${events.length?events.map(e=>eventHTML(e,i,print)).join(''):'<p class="empty">이 필터에 맞는 일정이 없습니다. 식사만 보기 또는 선택 방문 제외를 해제해 보세요.</p>'}</div>`:mapPanel(i,false)}<details class="daynote"><summary>일정 조정·대안 보기</summary><p>${esc(d.note)}</p><div class="adjustactions">${i===0?'<button data-adjust="delay">항공 지연 / 첫날 단축</button><p>첫날 라멘과 밤 산책·쇼핑을 건너뛴 상태로 기록합니다. 체크인으로 이동하고, 라멘은 월요일 대체안을 확인할 수 있습니다.</p>':''}${i===4?`<label><input type="checkbox" id="ramen-alternative" ${state.overrides.ramenMonday?'checked':''}> 11:00 시시마루로 자유시간 교체</label><p>기념품 자유시간과 교체됩니다. 케시키·13:15 짐 회수와 충돌하는지 직접 확인하세요.</p>`:''}<button data-adjust="essential">체력 부족 / 선택 방문 제외</button>${link(directions(PLACE.hotel.query,'transit'),'현재 위치에서 호텔 복귀')}<button data-restore-day="${i}">이 날짜의 원래 계획 복원</button></div></details></article>`;
}
function dayHTML(i,print=false){return print?detailedDayHTML(i,true):routeDayHTML(i)}
function renderDay(){
 document.body.dataset.routeView=view;
 const tabs=$('#daytabs'),tools=$('.toolbar');$('#plan').prepend(tabs,tools);routeObserver?.disconnect();
 if(typeof destroyDayMap==='function')destroyDayMap();
 $('#daycontent').innerHTML=dayHTML(active);$('#daycontent').setAttribute('aria-labelledby','tab'+active);
 $('#route-tabs-slot').append(tabs);$('#route-filters-slot').append(tools);
 document.querySelectorAll('#daytabs button').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===active));b.tabIndex=i===active?0:-1});
 $('#foodonly').checked=state.filters.foodOnly;$('#optional').checked=state.filters.optional;$('#zoo').checked=state.options.zoo;$('#zoo').closest('label').hidden=active!==3;
 $('#expand').hidden=true;refreshExpandControl();
 styleActions($('#daycontent'));if(screenPage==='plan')try{initDayMap();initRouteObserver()}catch(error){console.error('Map initialization failed',error);const status=$('#maploadstatus');if(status)status.textContent='지도 초기화에 실패했습니다. 장소 목록과 Google Maps 링크를 이용하세요.'}
}
function renderHome(){renderHomeCompact()}
function reservationTotals(){const defs=RESERVATIONS.filter(r=>r.required),confirmed=defs.filter(r=>reservationValue(r).status==='confirmed').length,requested=defs.filter(r=>reservationValue(r).status==='requested').length,attention=defs.filter(r=>['unconfirmed','cancelled'].includes(reservationValue(r).status)).length;return {total:defs.length,confirmed,requested,attention}}
function renderReservationSummary(){const t=reservationTotals();$('#reservation-summary').innerHTML=`<strong>예약 기록 ${t.confirmed} / ${t.total} 확정${t.requested?' / '+t.requested+'건 요청 중':''}</strong><p>직접 기록한 상태입니다. 실제 예약·티켓 확보와 외부 확정 연락을 확인하세요.</p><button class="textbutton" data-res-jump="ghibli-ticket">예약·티켓 기록 관리</button>`}
function renderReservations(){
 const totals=reservationTotals();$('#reservationstats').innerHTML=[['확정',totals.confirmed],['확인 필요',totals.attention],['요청 중',totals.requested]].map(([label,n])=>`<div><span>${label}</span><b>${n}건</b></div>`).join('');
 const opened=new Set([...document.querySelectorAll('.reservationcard')].filter(c=>c.querySelector('.resedit')?.open).map(c=>c.id.replace('reservation-','')));
 $('#reservationlist').innerHTML=RESERVATIONS.map(def=>{const r=reservationValue(def);return `<article class="reservationcard" id="reservation-${def.id}"><div class="rescardhead"><h3>${esc(def.name)}</h3>${reservationBadge(def)}</div>${def.optional?'<p class="muted">기본 일정에 포함되지 않은 교체 선택입니다.</p>':''}${reservationTiming(def)}<details class="resedit" ${opened.has(def.id)?'open':''}><summary>예약 정보 수정</summary><label>내 예약 상태<select data-res-status="${def.id}" aria-label="${esc(def.name)} 예약 상태">${Object.entries(RES_STATUS).map(([key,label])=>`<option value="${key}" ${key===r.status?'selected':''}>${label}</option>`).join('')}</select></label><div class="reswhen"><label>실제 확정 날짜<input type="date" min="2026-12-10" max="2026-12-14" data-res-date="${def.id}" value="${esc(r.date)}"></label><label>실제 확정 시각<input type="time" data-res-time="${def.id}" value="${esc(r.time)}"></label></div><label>예약 메모<textarea rows="2" maxlength="2000" data-res-note="${def.id}" aria-label="${esc(def.name)} 예약 메모">${esc(r.note)}</textarea></label><div class="compactlinks">${def.url?link(def.url,def.url.startsWith('tel:')?'매장 전화':'공식·외부 예약 안내'):''}<button class="textbutton" data-reset-res="${def.id}">이 예약 기록 초기화</button></div></details></article>`}).join('');styleActions($('#reservationlist'));
}
function renderFood(){
 const q=state.filters.search.trim().toLowerCase(),filter=state.filters.reserve;
 const list=restaurants.filter(r=>(filter==='all'||r.mode.includes(filter))&&[r.name,r.jp,r.type,r.menu,r.dish?.kind,r.dish?.order,r.status,r.booking].join(' ').toLowerCase().includes(q));
 $('#restaurants').innerHTML=list.length?list.map(r=>{const def=RESERVATIONS.find(x=>x.id===r.id),d=def&&reservationValue(def);return `<article class="restaurant" id="restaurant-${r.id}"><div class="rhead"><span class="tag food">${esc(r.type)}</span><small>${esc(r.day)}</small></div><h3>${esc(r.name)}</h3><p class="jp" lang="ja">${esc(r.jp)}</p><p class="dishshort">추천 ${esc(r.dish.order)}</p><p class="restaurant-price">1인 ${esc(r.price)}</p><p class="bookingmethod">매장 예약 방식: ${esc(r.status)}</p>${reservationBadge(def)}${def?reservationTiming(def):''}<div class="restaurantactions">${r.book?link(r.book,r.bookLabel):link('tel:+81'+r.phone.replace(/-/g,'').slice(1),r.phone)}${link(directions(PLACE[r.id].query,'transit'),'길찾기')}<button class="textbutton" data-res-jump="${r.id}">내 예약 기록</button></div><details class="restaurantdetail"><summary>영업 정보·추천 메뉴·후기</summary><p><strong>${esc(r.rating)}</strong></p><p>${esc(r.why)}</p><dl><div><dt>영업 안내</dt><dd>${esc(r.hours)}</dd></div><div><dt>주소</dt><dd>${esc(r.address)}</dd></div></dl>${menuDetails(r)}<p>${esc(r.booking)}</p><div class="compactlinks">${link('tel:+81'+r.phone.replace(/-/g,'').slice(1),r.phone)}${link(appMap(PLACE[r.id].query),'Google Maps')}${link(r.source,'타베로그')}${r.official?link(r.official,'공식 안내'):''}</div>${reviewLinks(r)}</details></article>`}).join(''):'<p class="empty" role="status">검색 결과가 없습니다. 식당명·메뉴를 바꾸거나 예약 방식 필터를 해제해 주세요.</p>';
 $('#foodcount').textContent=list.length+'곳';styleActions($('#restaurants'));
}
function renderChecklist(){
 $('#checklist').innerHTML=`<div class="checkgroup"><h4>예약 확인</h4>${RESERVATIONS.filter(d=>d.required).map(def=>`<div class="reservationcheck"><span>${esc(def.name)}</span>${reservationBadge(def)}<button class="textbutton" data-res-jump="${def.id}">관리</button></div>`).join('')}</div>`+Object.entries(PREP_GROUPS).map(([group,items])=>`<div class="checkgroup"><h4>${group}</h4>${Object.entries(items).map(([id,text])=>`<label><input type="checkbox" data-check="${id}" ${state.checks[id]?'checked':''}><span>${esc(text)}</span></label>`).join('')}</div>`).join('');
 const total=Object.values(PREP_GROUPS).flatMap(Object.keys);$('#progress').textContent=total.filter(id=>state.checks[id]).length+' / '+total.length;styleActions($('#checklist'));
}
function renderDependent({reservations=true}={}){renderDay();renderHome();renderReservationSummary();renderFood();renderChecklist();if(reservations)renderReservations();styleActions()}
let announcementTimer;
function announce(message){const el=$('#appstatus');el.textContent=message;el.hidden=false;clearTimeout(announcementTimer);announcementTimer=setTimeout(()=>{el.hidden=true},6000);$('#storagefeedback').textContent=storageMessage}
function commit(message,{reservations=true}={}){const ok=persist();renderDependent({reservations});announce(ok?message:storageMessage)}
function buildTabs(){ $('#daytabs').innerHTML=days.map((d,i)=>`<button role="tab" aria-label="${i+1}일차 ${d.date} ${d.dow} ${esc(d.short)}" id="tab${i}" aria-controls="daycontent" aria-selected="${i===active}" tabindex="${i===active?0:-1}" data-day="${i}"><small>${i+1}일차 ${d.dow[0]}</small><b>${d.date}</b><span>${esc(d.short)}</span></button>`).join('') }
function renderAll(){buildTabs();$('#search').value=state.filters.search;$('#reservefilter').value=state.filters.reserve;$('#memo').value=state.memo;renderDependent();if(storageMessage)announce(storageMessage)}
function renderSources(){ $('#sources').innerHTML='<ul>'+Object.entries({'지브리파크 티켓·입장 조건':S.ghibli,'지브리 운영 캘린더':S.calendar,'지브리 교통':S.access,'미라이타워 시간·요금':S.tower,'히가시야마 동물원':S.zoo,'공항 철도':S.airport,'니시테츠 호텔 크룸':S.hotel,'고메다 지점':S.komeda,'케시키 우선 안내 조건':S.keshikiBook,'무츠미 예약 창구':S.mutsumiBook,'키타로 장내 공식 예약·메뉴':S.sushi,'라무치 예약·영업':S.ramuchi,'시시마루 예약·영업':S.ramen,'오코게 예약·영업':S.monja,'하나오카 예약·영업':S.eel,'오아시스21 옥상 공사 안내':'https://db.nagoya-info.jp/spot/detail/23/','돈키호테 사카에 본점':'https://www.donki.com/store/shop_detail.php?shop_id=348','Google Maps 앱 연결 공식 문서':'https://developers.google.com/maps/documentation/urls/get-started'}).map(([n,u])=>'<li>'+link(u,n)+'</li>').join('')+'</ul>' }
function beforePrint(){if(printing)return;printing=true;destroyDayMap();document.body.classList.add('printing');$('#printcontent').innerHTML=days.map((_,i)=>dayHTML(i,true)).join('');$('#printcontent').hidden=false}
function afterPrint(){if(!printing)return;printing=false;document.body.classList.remove('printing');$('#printcontent').innerHTML='';$('#printcontent').hidden=true;if(screenPage==='plan')initDayMap()}
({active,view}=readRoute());state.selectedDay=active;state.selectedView=view;
renderAll();renderSources();initUx();initScreens();
