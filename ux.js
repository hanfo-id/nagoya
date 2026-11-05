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
function mapGroups(i,points){
 return i===2?[
  {label:'시내에서 공원',points:points.slice(0,5)},
  {label:'공원 핵심 구역',points:points.filter(p=>['park','warehouse','cafe','valley'].includes(p.id))},
  {label:'공원에서 저녁',points:[points.find(p=>p.id==='parkstation'),points.find(p=>p.id==='monja'),points.find(p=>p.id==='hotel')]}
 ]:[{label:'하루 위치 개요',points:points.filter(p=>!p.optional)}];
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
  if(e.target.closest('[data-map-retry]'))initDayMap();
 });
 document.addEventListener('toggle',e=>{if(e.target.matches?.('.event')&&e.target.isConnected){detailState.set(e.target.dataset.eventKey,e.target.open);refreshExpandControl()}},true);
 window.addEventListener('popstate',()=>{({active,view}=readRoute(saved));renderDay()});
 document.querySelector('#search').value=saved.search||'';
 const select=document.querySelector('#reservefilter');select.value=['all','web','phone','walk'].includes(saved.reserve)?saved.reserve:'all';
 const saveFilters=()=>{saved.search=document.querySelector('#search').value;saved.reserve=select.value;save()};
 document.querySelector('#search').addEventListener('input',saveFilters);select.addEventListener('change',saveFilters);
 writeRoute(false);renderFood();
}
