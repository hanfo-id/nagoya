/* One map per day, with matching numbered markers and place-list entries. */
let dayMap=null,mapTiles=null,mapMarkers=new Map(),mapConnectors=[];
function numberedPlaces(i){
 const points=placesForDay(i);
 return [...points.filter(p=>!p.optional),...points.filter(p=>p.optional)].map((p,n)=>({...p,number:n+1,location:MAP_LOCATIONS[p.id]}));
}
function mapPanel(i,print){
 const points=numberedPlaces(i);
 if(print)return `<p class="print-map">지도: ${points.map(p=>p.number+'. '+p.name).join(' / ')}</p>`;
 const row=p=>`<li><button type="button" class="pinselect" data-pin="${p.id}" aria-pressed="false" aria-label="${p.number}번 ${esc(p.name)} 지도에서 보기"><span class="pinindex ${p.optional?'is-optional':''}">${p.number}</span><span>${esc(p.name)}<small lang="ja">${esc(p.jp)}</small></span></button><div class="pinlinks">${link(appMap(p.query),'맵 열기')}${link(directions(p.query,'transit'),'대중교통')}${link(directions(p.query,'walking'),'도보')}</div></li>`;
 const optional=points.filter(p=>p.optional);
 return `<section class="daymap" aria-label="${days[i].date} 번호 핀 지도"><div class="maphead"><h4>하루의 장소를 한 지도에</h4><div class="mapmodes"><button type="button" data-mapextent="all" aria-pressed="true">전체 보기</button><button type="button" data-mapextent="city" aria-pressed="false">시내 확대</button>${i===2?'<button type="button" data-mapextent="park" aria-pressed="false">지브리 확대</button>':''}</div></div><div class="mapstage"><h5 id="selectedmapplace" tabindex="-1">${days[i].date} / ${points.length}곳</h5><div class="maplegend"><span><b class="legendpin">1</b> 장소 목록과 같은 번호</span>${optional.length?'<label><input type="checkbox" id="mapoptional" checked> 테두리 핀: 선택 장소</label>':''}</div><div id="numberedmap" class="numberedmap" role="region" aria-label="${days[i].date} 장소별 번호 핀 지도"></div><p id="maploadstatus" class="mapcaption" role="status">번호 핀 지도를 불러오는 중입니다.</p><p class="mapcaption" id="mapcaption" aria-live="polite">핀을 누르면 장소명과 Google Maps 바로가기가 나옵니다. 번호는 아래 목록과 일치하며 이동 경로나 소요 시간을 뜻하지 않습니다.</p><div class="mapfallback"><span class="mapfallbackroutes">${link(appMap(points[0].query),'Google Maps에서 열기')}</span><button type="button" data-map-retry>지도 다시 불러오기</button></div></div><ol class="pinlist">${points.filter(p=>!p.optional).map(row).join('')}</ol>${optional.length?`<details class="optional-places"><summary>선택 장소 ${optional.length}곳 보기</summary><p>번호는 지도와 동일합니다. 일정과 체력에 맞춰 골라보세요.</p><ol class="pinlist">${optional.map(row).join('')}</ol></details>`:''}<p class="mapcaption">지도 배경: OpenStreetMap. 식당 핀은 주소 기준이며 건물 출입구와 차이가 있을 수 있습니다. 길찾기는 Google Maps로 연결되며 기기 설정에 따라 앱 또는 웹에서 열립니다.</p></section>`;
}
function destroyDayMap(){
 if(dayMap){dayMap.remove();dayMap=null}
 mapTiles=null;mapMarkers.clear();mapConnectors=[];
}
function popupContent(p){
 return `<div class="placepopup"><span class="popupnumber">${p.number}번${p.optional?' / 선택':''}</span><strong>${esc(p.name)}</strong><span lang="ja">${esc(p.jp)}</span>${p.location.kind==='address'?'<small>주소 기준 위치 / 출입구는 현장 확인</small>':''}<div>${link(appMap(p.query),'Google Maps 열기')}${link(directions(p.query,'transit'),'대중교통 길찾기')}${link(directions(p.query,'walking'),'도보 길찾기')}</div></div>`;
}
function selectPin(p){
 document.querySelector('#selectedmapplace').textContent=p.number+'번 / '+p.name;
 document.querySelector('#mapcaption').textContent=p.optional?'선택 장소입니다. 일정과 입장권 조건을 확인하고 방문하세요.':'같은 지도에서 선택한 장소를 확인하고 있습니다.';
 document.querySelector('.mapfallbackroutes').innerHTML=link(appMap(p.query),'Google Maps에서 '+esc(p.name)+' 열기');
 document.querySelectorAll('[data-pin]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pin===p.id)));
 mapMarkers.forEach(({marker,point})=>marker.getElement()?.classList.toggle('is-selected',point.id===p.id));
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
 if(typeof L==='undefined'){status.textContent='지도를 불러오지 못했습니다. 아래 장소별 Google Maps 링크를 이용해 주세요.';return}
 dayMap=L.map(container,{scrollWheelZoom:false,zoomControl:true,keyboard:true});
 mapTiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(dayMap);
 let tileFailed=false;
 mapTiles.on('tileerror',()=>{tileFailed=true;status.textContent='배경 지도를 불러오지 못한 부분이 있습니다. 다시 불러오거나 장소별 Google Maps 링크를 이용해 주세요.'});
 mapTiles.on('load',()=>{if(!tileFailed)status.textContent='번호 핀을 눌러 장소를 확인하세요. 확대·축소 버튼과 드래그로 지도를 이동할 수 있습니다.'});
 numberedPlaces(active).forEach(point=>{
  if(!point.location)return;
  const marker=L.marker([point.location.lat,point.location.lng],{icon:L.divIcon({className:'numberpin'+(point.optional?' is-optional':''),html:`<span>${point.number}</span>`,iconSize:[44,44],iconAnchor:[22,22],popupAnchor:[0,-20]}),title:point.number+'번 '+point.name,alt:point.number+'번 '+point.name,keyboard:true,riseOnHover:true});
  marker.bindPopup(popupContent(point),{maxWidth:280,minWidth:200,autoPanPaddingTopLeft:[16,32],autoPanPaddingBottomRight:[16,24]});
  marker.on('popupopen',()=>selectPin(point));marker.addTo(dayMap);marker.getElement()?.setAttribute('aria-label',point.number+'번 '+point.name);mapMarkers.set(point.id,{marker,point});
 });
 dayMap.on('zoomend',spreadMapPins);fitDayMap();
 document.querySelector('#mapoptional')?.addEventListener('change',e=>{
  mapMarkers.forEach(({marker,point})=>{if(point.optional)e.target.checked?marker.addTo(dayMap):marker.remove()});
  dayMap.closePopup();spreadMapPins();
  status.textContent=e.target.checked?'선택 장소 핀도 표시했습니다.':'선택 장소 핀을 숨겼습니다. 기본 일정의 핀은 그대로 표시합니다.';
 });
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.addEventListener('click',()=>fitDayMap(b.dataset.mapextent)));
}
function showMapSelection(point){
 const entry=mapMarkers.get(point?.id);if(!entry||!dayMap)return;
 if(!dayMap.hasLayer(entry.marker)){entry.marker.addTo(dayMap);const check=document.querySelector('#mapoptional');if(check){check.checked=true;mapMarkers.forEach(({marker,point:p})=>{if(p.optional)marker.addTo(dayMap)})}}
 dayMap.setView([entry.point.location.lat,entry.point.location.lng],Math.max(dayMap.getZoom(),16),{animate:false});spreadMapPins();entry.marker.openPopup();
 document.querySelector('.mapstage').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 document.querySelector('#selectedmapplace').focus({preventScroll:true});
}
