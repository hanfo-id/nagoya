/* Browser-local navigation and map feedback for the travel itinerary. */
function readRoute(savedState={}){
 const params=new URL(location.href).searchParams;
 const index=days.findIndex(d=>d.date.replace('.','-')===params.get('day'));
 return {active:index>=0?index:Number.isInteger(savedState.day)&&savedState.day>=0&&savedState.day<5?savedState.day:0,view:params.get('view')==='map'?'map':'schedule'};
}
function writeRoute(push=true){
 const url=new URL(location.href);
 url.searchParams.set('day',days[active].date.replace('.','-'));
 if(view==='map')url.searchParams.set('view','map');else url.searchParams.delete('view');
 if(url.href!==location.href)history[push?'pushState':'replaceState']({},'',url);
 saved.day=active;save();
}
function chooseDay(index){active=index;writeRoute();renderDay()}
function scheduleViews(){
 return `<div class="viewbar" role="group" aria-label="일정 보기 방식"><button type="button" data-view="schedule" aria-pressed="${view==='schedule'}">시간별 일정</button><button type="button" data-view="map" aria-pressed="${view==='map'}">동선 지도</button><span>${view==='map'?'장소를 선택해 위치 확인':'시간 순서대로 확인하고 바로 길찾기'}</span></div>`;
}
function stopActions(p){return p?`<div class="stopactions" aria-label="${esc(p.name)} 길찾기">${link(directions(p.query,'transit'),'대중교통 길찾기')}${link(directions(p.query,'walking'),'도보 길찾기')}${link(appMap(p.query),'Google Maps')}</div>`:''}
const detailState=new Map();
function allEventsOpen(){const events=[...document.querySelectorAll('#daycontent .event')];return events.length>0&&events.every(d=>d.open)}
function refreshExpandControl(){document.querySelector('#expand').textContent=allEventsOpen()?'상세 모두 접기':'상세 모두 펼치기'}
function eventKey(day,event){return day+':'+event.time+':'+event.title}
function isEventOpen(day,event){return detailState.get(eventKey(day,event))||false}
function mapRouteLinks(points){
 const segments=[];
 for(let i=0;i<points.length-1;i+=4)segments.push(points.slice(i,i+5));
 if(!segments.length)return link(appMap(points[0].query),'Google Maps에서 장소 열기');
 return segments.map((segment,i)=>{
  const params=new URLSearchParams({api:'1',origin:segment[0].query,destination:segment[segment.length-1].query});
  if(segment.length>2)params.set('waypoints',segment.slice(1,-1).map(p=>p.query).join('|'));
  return link('https://www.google.com/maps/dir/?'+params.toString(),'Google Maps에서 동선 열기'+(segments.length>1?' ('+(i+1)+'/'+segments.length+')':''));
 }).join(' ');
}
let mapWaitTimer;
function initDayMap(){
 clearTimeout(mapWaitTimer);
 const frame=document.querySelector('#daymapframe');if(!frame)return;
 const status=document.querySelector('#maploadstatus');
 const waiting=()=>{
  status.textContent='지도를 불러오는 중입니다.';frame.setAttribute('aria-busy','true');
  clearTimeout(mapWaitTimer);mapWaitTimer=setTimeout(()=>{if(status.isConnected)status.textContent='지도가 늦게 표시되면 아래 Google Maps 링크로 직접 열어주세요.'},12000);
 };
 frame.addEventListener('load',()=>{clearTimeout(mapWaitTimer);frame.setAttribute('aria-busy','false');status.textContent='지도가 보이지 않으면 Google Maps에서 직접 확인할 수 있습니다.'});
 frame.addEventListener('error',()=>{clearTimeout(mapWaitTimer);status.textContent='지도를 불러오지 못했습니다. Google Maps에서 열거나 다시 시도해 주세요.';frame.setAttribute('aria-busy','false')});
 frame.addEventListener('map-loading',waiting);waiting();
}
function mapGroups(i,points){
 return i===2?[
  {label:'시내에서 공원',points:points.slice(0,5)},
  {label:'공원 핵심 구역',points:points.filter(p=>['park','warehouse','cafe','valley'].includes(p.id))},
  {label:'공원에서 저녁',points:[points.find(p=>p.id==='parkstation'),points.find(p=>p.id==='monja'),points.find(p=>p.id==='hotel')]}
 ]:[{label:'하루 위치 개요',points:points.filter(p=>!p.optional)}];
}
function showMapSelection(point,groupIndex){
 const frame=document.querySelector('#daymapframe');if(!frame)return;
 const groups=mapGroups(active,placesForDay(active));
 const group=groups[groupIndex];
 const heading=document.querySelector('#selectedmapplace');
 heading.textContent=point?point.name:group.label;
 document.querySelector('#mapcaption').textContent=point?point.jp+' / 선택한 장소의 위치입니다.':'파란 선은 위치를 살펴보기 위한 참고 경로입니다. 실제 이동 수단과 순서는 시간별 일정을 확인하세요.';
 const target=point||group.points[0];
 document.querySelector('.mapfallbackroutes').innerHTML=point?link(appMap(target.query),'Google Maps에서 장소 열기'):mapRouteLinks(group.points);
 frame.dispatchEvent(new Event('map-loading'));
 frame.src=point?singleEmbed(point):mapEmbed(group.points);
 document.querySelectorAll('[data-mapgroup]').forEach(b=>b.setAttribute('aria-pressed',!point&&Number(b.dataset.mapgroup)===groupIndex?'true':'false'));
 document.querySelectorAll('[data-pin]').forEach(b=>b.setAttribute('aria-pressed',point&&b.dataset.pin===point.id?'true':'false'));
 if(point){
  heading.focus({preventScroll:true});
  document.querySelector('.mapstage').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
}
function initUx(){
 const header=document.querySelector('.top');
 new ResizeObserver(()=>document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px')).observe(header);
 const dates=document.querySelector('#daytabs');
 new ResizeObserver(()=>document.documentElement.style.setProperty('--date-height',dates.getBoundingClientRect().height+'px')).observe(dates);
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-view]');
  if(button){view=button.dataset.view;writeRoute();renderDay();document.querySelector(`[data-view="${view}"]`).focus({preventScroll:true})}
  const pin=e.target.closest('[data-pin]'),group=e.target.closest('[data-mapgroup]');
  if(pin)showMapSelection(placesForDay(active).find(p=>p.id===pin.dataset.pin));
  if(group)showMapSelection(null,Number(group.dataset.mapgroup));
  if(e.target.closest('[data-map-retry]')){const frame=document.querySelector('#daymapframe');frame.dispatchEvent(new Event('map-loading'));frame.src=frame.src}
 });
 document.addEventListener('toggle',e=>{if(e.target.matches?.('.event')&&e.target.isConnected){detailState.set(e.target.dataset.eventKey,e.target.open);refreshExpandControl()}},true);
 window.addEventListener('popstate',()=>{({active,view}=readRoute(saved));renderDay()});
 document.querySelector('#search').value=saved.search||'';
 const select=document.querySelector('#reservefilter');select.value=['all','web','phone','walk'].includes(saved.reserve)?saved.reserve:'all';
 const saveFilters=()=>{saved.search=document.querySelector('#search').value;saved.reserve=select.value;save()};
 document.querySelector('#search').addEventListener('input',saveFilters);select.addEventListener('change',saveFilters);
 writeRoute(false);renderFood();
}
