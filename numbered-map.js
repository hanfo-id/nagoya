/* One map per day, with matching numbered markers and place-list entries. */
let dayMap=null,mapTiles=null,mapMarkers=new Map();
function numberedPlaces(i){return getMapStops(state,i)}
function destroyDayMap(){
 if(dayMap){dayMap.remove();dayMap=null}
 mapTiles=null;mapMarkers.clear();
}
function popupContent(p){return `<div class="placepopup"><strong>${p.number}. ${esc(p.name)}</strong><span lang="ja">${esc(p.jp)}</span><button class="btn btn-secondary" data-place-detail="${p.eventId}" data-detail-number="${p.number}">상세 보기</button></div>`}
function selectPin(p){
 document.querySelector('#selectedmapplace').textContent=p.number+'번 '+p.name;
 document.querySelector('#mapcaption').textContent=p.name;
 document.querySelectorAll('[data-pin]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pin)===p.number)));
 document.querySelectorAll('.route-item').forEach(c=>c.classList.toggle('is-selected',c.id==='mapstop-'+p.number));
 mapMarkers.forEach(({marker,point})=>{marker.getElement()?.classList.toggle('is-selected',point.number===p.number);marker.setZIndexOffset?.(point.number===p.number?1000:0)});
 if(typeof selectedActions==='function')selectedActions(p);
 if(!p.eventIds.includes(state.selectedEvent))state.selectedEvent=p.eventId;writeRoute(false);
}
function fitDayMap(extent='all'){
 if(!dayMap)return;
 const points=[...mapMarkers.values()].filter(({marker,point})=>(extent==='gero'?GERO_IDS.has(point.id):extent==='city'?CITY_IDS.has(point.id):true));
 if(!points.length)return;
 dayMap.closePopup();dayMap.fitBounds(L.latLngBounds(points.map(({point})=>[point.location.lat,point.location.lng])),{padding:[48,48],maxZoom:16,animate:false});
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapextent===extent)));
 spreadMapPins();
}
const GERO_IDS=new Set(['geroStation','geroTown','geroLunch','ogawaya','geroRiver']);
const CITY_IDS=new Set(Object.keys(MAP_LOCATIONS).filter(id=>!GERO_IDS.has(id)&&!['airport','zoo'].includes(id)));
function spreadMapPins(){if(dayMap)mapMarkers.forEach(({marker})=>{if(!dayMap.hasLayer(marker))marker.addTo(dayMap)})}
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
 mapTiles.on('load',()=>{if(!tileFailed)status.textContent=missing?missing+'곳은 Google Maps에서 확인하세요.':''});
 numberedPlaces(active).forEach(point=>{
  if(!point.location||!Number.isFinite(point.location.lat)||!Number.isFinite(point.location.lng))return;
  const marker=L.marker([point.location.lat,point.location.lng],{icon:L.divIcon({className:'numberpin'+(point.optional?' is-optional':'')+(point.status==='skipped'?' is-skipped':''),html:`<span>${point.number}</span>`,iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-20]}),title:point.number+'번 '+point.name,alt:point.number+'번 '+point.name,keyboard:true,riseOnHover:true});
  marker.bindPopup(popupContent(point),{maxWidth:280,minWidth:200,autoPanPaddingTopLeft:[16,32],autoPanPaddingBottomRight:[16,24]});
  marker.on('popupopen',()=>{if(typeof routeFollowAfter!=='undefined')routeFollowAfter=Date.now()+1200;selectPin(point);document.querySelector('#mapstop-'+point.number)?.scrollIntoView({block:'nearest',behavior:'smooth'})});marker.addTo(dayMap);marker.getElement()?.setAttribute('aria-label',point.number+'번 '+point.name);mapMarkers.set(point.number,{marker,point});
 });
 if(mapMarkers.size)fitDayMap();else{dayMap.setView([35.17,136.90],12);status.textContent='표시할 좌표가 없습니다. 아래 Google Maps 링크를 이용하세요.'}
 dayMap.on('zoomend',spreadMapPins);
 if(missing)status.textContent=missing+'곳의 좌표가 없습니다. 해당 장소의 Google Maps 링크를 이용하세요.';
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.addEventListener('click',()=>fitDayMap(b.dataset.mapextent)));
}
function showMapSelection(target){
 const entries=[...mapMarkers.values()],event=target.eventId&&baseEvents(active).find(e=>e.id===target.eventId);
 const entry=target.eventId?(entries.find(({point})=>point.eventIds.includes(target.eventId)&&point.id===event?.placeId)||entries.find(({point})=>point.eventIds.includes(target.eventId))):entries.find(({point})=>target.number?point.number===target.number:point.id===target.id);
 if(!entry||!dayMap)return;
 if(typeof routeFollowAfter!=='undefined'&&!target.fromScroll)routeFollowAfter=Date.now()+1200;
 selectPin(entry.point);dayMap.closePopup();
 const animate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 dayMap.flyTo([entry.point.location.lat,entry.point.location.lng],Math.max(dayMap.getZoom(),16),{animate,duration:.55});
 spreadMapPins();
 if(!target.fromScroll)document.querySelector('#mapstop-'+entry.point.number)?.scrollIntoView({block:'nearest',behavior:animate?'smooth':'instant'});
}
