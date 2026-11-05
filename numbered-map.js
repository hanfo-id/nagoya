/* One map per day, with matching numbered markers and place-list entries. */
let dayMap=null,mapTiles=null,mapMarkers=new Map(),mapConnectors=[];
function numberedPlaces(i){return getMapStops(state,i)}
function mapPanel(i,print){
 const points=numberedPlaces(i);
 if(print)return '<p>'+points.map(p=>p.number+'. '+esc(p.name)).join(' / ')+'</p>';
 if(!points.length)return '<p class="empty">현재 필터에 맞는 장소가 없습니다. 일정 필터를 변경해 주세요.</p>';
 const rows=points.map(p=>`<li class="mapstop ${p.status==='skipped'?'is-skipped':''}" id="mapstop-${p.number}"><button type="button" class="pinselect" data-pin="${p.number}" aria-pressed="false" aria-label="${p.number}번 ${esc(p.name)} 지도에서 보기"><span class="pinindex ${p.optional?'is-optional':''}">${p.number}</span><span><span class="mapstoptime">${esc(p.time)} / ${esc(p.kind)} / ${EVENT_STATUS[p.status]}</span>${esc(p.name)}<small lang="ja">${esc(p.jp)}</small>${!p.location?'<small>좌표 미확인 / 아래 Google Maps 이용</small>':''}</span></button><div class="pinlinks"><button class="textbutton" data-focus-event="${p.eventId}">일정 보기</button>${link(appMap(p.query),'맵 열기')}</div><div class="mapleg">${mapLegLinks(p)}</div></li>`).join('');
 return `<section class="daymap" aria-label="${days[i].date} 번호 핀 지도"><div class="maphead"><h4>같은 지도, 방문 순서대로</h4><div class="mapmodes"><button type="button" data-mapextent="all" aria-pressed="true">전체 보기</button><button type="button" data-mapextent="city" aria-pressed="false">시내 확대</button>${i===2?'<button type="button" data-mapextent="park" aria-pressed="false">지브리 확대</button>':''}</div></div><div class="mapstage"><h5 id="selectedmapplace" tabindex="-1">${days[i].date} / ${points.length}개 방문 지점</h5><div class="maplegend"><span><b class="legendpin">1</b> 아래 목록의 방문 순서</span><span>테두리 핀: 선택 방문 / 건너뜀도 글자로 표시</span></div><div id="numberedmap" class="numberedmap" role="region" aria-label="${days[i].date} 장소별 번호 핀 지도"></div><p id="maploadstatus" class="mapcaption" role="status">번호 핀 지도를 불러오는 중입니다.</p><p class="mapcaption" id="mapcaption" aria-live="polite">장소 위치 개요입니다. 가는 선은 겹친 핀과 실제 좌표를 연결할 뿐, 이동 경로가 아닙니다. 실제 교통편·시간은 구간별 Google Maps에서 확인하세요.</p><div class="mapfallback"><span class="mapfallbackroutes">${link(appMap(points[0].query),'Google Maps에서 첫 장소 열기')}</span><button type="button" data-map-retry>지도 다시 불러오기</button></div></div><ol class="pinlist journeylist">${rows}</ol><p class="mapcaption">지도 배경: OpenStreetMap. 위치 자료: ${link('https://maps.gsi.go.jp/','국토지리원 주소 검색')} 결과 가공 및 OpenStreetMap. 주소·구역 중심점은 실제 출입구와 차이가 있습니다.</p></section>`;
}
function mapLegLinks(p){
 const points=numberedPlaces(active),index=points.findIndex(s=>s.number===p.number),from=points.slice(0,index).reverse().find(s=>s.status!=='skipped'),next=points.slice(index+1).find(s=>s.status!=='skipped');
 const event=baseEvents(active).find(e=>e.id===p.eventId);
 return `<span>${esc(event?transitHint(event):'도보·대중교통 / Google Maps 확인')}</span>${from?`<details><summary>이전 ${from.number}번 → 여기 ${p.number}번</summary><p>${esc(from.name)} → ${esc(p.name)}</p><div class="compactlinks">${link(routeBetween(from,p),'대중교통')}${link(routeBetween(from,p,'walking'),'도보')}</div></details>`:`<div class="compactlinks">${link(directions(p.query,'transit'),'현재 위치 → 여기')}</div>`}${next?`<details><summary>여기 ${p.number}번 → 다음 ${next.number}번</summary><p>${esc(p.name)} → ${esc(next.name)}</p><div class="compactlinks">${link(routeBetween(p,next),'대중교통')}${link(routeBetween(p,next,'walking'),'도보')}</div></details>`:''}`;
}
function destroyDayMap(){
 if(dayMap){dayMap.remove();dayMap=null}
 mapTiles=null;mapMarkers.clear();mapConnectors=[];
}
function popupContent(p){
 return `<div class="placepopup"><span class="popupnumber">${p.number}번 / ${esc(p.time)} / ${EVENT_STATUS[p.status]}${p.optional?' / 선택':''}</span><strong>${esc(p.name)}</strong><span lang="ja">${esc(p.jp)}</span>${p.location?.kind==='address'?'<small>주소 기준 위치 / 출입구는 현장 확인</small>':''}<div><button class="textbutton" data-focus-event="${p.eventId}">이 일정 카드 보기</button>${link(appMap(p.query),'Google Maps 열기')}${link(directions(p.query,'transit'),'현재 위치에서 길찾기')}</div></div>`;
}
function selectPin(p){
 document.querySelector('#selectedmapplace').textContent=p.number+'번 / '+p.time+' / '+p.name;
 document.querySelector('#mapcaption').textContent=EVENT_STATUS[p.status]+' / '+(p.optional?'선택 방문입니다.':'표시 중인 일정 순서입니다.')+' 아래 구간별 길찾기에서 출발지와 도착지를 확인하세요.';
 document.querySelector('.mapfallbackroutes').innerHTML=link(appMap(p.query),'선택 장소 Google Maps');
 document.querySelectorAll('[data-pin]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pin)===p.number)));
 mapMarkers.forEach(({marker,point})=>marker.getElement()?.classList.toggle('is-selected',point.number===p.number));
 if(!p.eventIds.includes(state.selectedEvent))state.selectedEvent=p.eventId;writeRoute(false);
}
function fitDayMap(extent='all'){
 if(!dayMap)return;
 const points=[...mapMarkers.values()].filter(({marker,point})=>dayMap.hasLayer(marker)&&(extent==='park'?point.location.lat>35.16&&point.location.lng>137.08:extent==='city'?point.location.lat>35.1&&point.location.lng<136.96:true));
 if(!points.length)return;
 dayMap.closePopup();dayMap.fitBounds(L.latLngBounds(points.map(({point})=>[point.location.lat,point.location.lng])),{padding:[48,48],maxZoom:16,animate:false});
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapextent===extent)));
 spreadMapPins();
}
/* Separate close markers in screen pixels; thin leaders retain their true locations. */
function spreadMapPins(){
 if(!dayMap)return;
 mapConnectors.forEach(line=>line.remove());mapConnectors=[];
 const placed=[],color=getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();
 mapMarkers.forEach(({marker,point})=>{
  if(!dayMap.hasLayer(marker))return;
  const actual=L.latLng(point.location.lat,point.location.lng),screen=dayMap.latLngToLayerPoint(actual);
  let offset=L.point(0,0),candidate=screen;
  for(let n=0;n<160;n++){
   const radius=n===0?0:22+Math.floor((n-1)/12)*19,angle=(n%12)*Math.PI/6;
   offset=L.point(Math.cos(angle)*radius,Math.sin(angle)*radius);candidate=screen.add(offset);
   if(placed.every(p=>p.distanceTo(candidate)>=46))break;
  }
  placed.push(candidate);
  const shown=dayMap.layerPointToLatLng(candidate);marker.setLatLng(shown);
  if(offset.distanceTo(L.point(0,0))>2)mapConnectors.push(L.polyline([actual,shown],{color,weight:1,opacity:.75,interactive:false}).addTo(dayMap));
 });
}
function initDayMap(){
 destroyDayMap();
 const container=document.querySelector('#numberedmap');if(!container)return;
 const status=document.querySelector('#maploadstatus');
 const missing=numberedPlaces(active).filter(p=>!p.location||!Number.isFinite(p.location.lat)||!Number.isFinite(p.location.lng)).length;
 if(typeof L==='undefined'){status.textContent='지도를 불러오지 못했습니다. 아래 장소별 Google Maps 링크를 이용해 주세요.';return}
 dayMap=L.map(container,{scrollWheelZoom:false,zoomControl:true,keyboard:true,fadeAnimation:false,zoomAnimation:!matchMedia('(prefers-reduced-motion: reduce)').matches});
 mapTiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(dayMap);
 let tileFailed=false;
 mapTiles.on('tileerror',()=>{tileFailed=true;status.textContent='배경 지도를 불러오지 못한 부분이 있습니다. 다시 불러오거나 장소별 Google Maps 링크를 이용해 주세요.'});
 mapTiles.on('load',()=>{if(!tileFailed)status.textContent='번호 핀을 눌러 장소를 확인하세요. 확대·축소 버튼과 드래그로 지도를 이동할 수 있습니다.'+(missing?' '+missing+'곳은 좌표가 없어 목록의 Google Maps를 이용하세요.':'')});
 numberedPlaces(active).forEach(point=>{
  if(!point.location||!Number.isFinite(point.location.lat)||!Number.isFinite(point.location.lng))return;
  const marker=L.marker([point.location.lat,point.location.lng],{icon:L.divIcon({className:'numberpin'+(point.optional?' is-optional':'')+(point.status==='skipped'?' is-skipped':''),html:`<span>${point.number}</span>`,iconSize:[44,44],iconAnchor:[22,22],popupAnchor:[0,-20]}),title:point.number+'번 '+point.name,alt:point.number+'번 '+point.name,keyboard:true,riseOnHover:true});
  marker.bindPopup(popupContent(point),{maxWidth:280,minWidth:200,autoPanPaddingTopLeft:[16,32],autoPanPaddingBottomRight:[16,24]});
  marker.on('popupopen',()=>selectPin(point));marker.addTo(dayMap);marker.getElement()?.setAttribute('aria-label',point.number+'번 '+point.name);mapMarkers.set(point.number,{marker,point});
 });
 dayMap.on('zoomend',spreadMapPins);if(mapMarkers.size)fitDayMap();else{dayMap.setView([35.17,136.90],12);status.textContent='표시할 좌표가 없습니다. 아래 Google Maps 링크를 이용하세요.'}
 if(missing)status.textContent=missing+'곳의 좌표가 없습니다. 해당 장소의 Google Maps 링크를 이용하세요.';
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.addEventListener('click',()=>fitDayMap(b.dataset.mapextent)));
}
function showMapSelection(target){
 const entries=[...mapMarkers.values()],event=target.eventId&&baseEvents(active).find(e=>e.id===target.eventId);
 const entry=target.eventId?(entries.find(({point})=>point.eventIds.includes(target.eventId)&&point.id===event?.placeId)||entries.find(({point})=>point.eventIds.includes(target.eventId))):entries.find(({point})=>target.number?point.number===target.number:point.id===target.id);
 if(!entry||!dayMap){const status=document.querySelector('#maploadstatus');if(status)status.textContent='선택 장소의 지도를 표시할 수 없습니다. 아래 목록의 Google Maps 링크를 이용하세요.';return}
 dayMap.setView([entry.point.location.lat,entry.point.location.lng],Math.max(dayMap.getZoom(),16),{animate:false});spreadMapPins();entry.marker.openPopup();
 document.querySelector('.mapstage').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 document.querySelector('#selectedmapplace').focus({preventScroll:true});
}
