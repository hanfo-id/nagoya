/* One map per day, with matching numbered markers and place-list entries. */
let dayMap=null,mapTiles=null,mapMarkers=new Map();
function numberedPlaces(i){return getMapStops(state,i)}
function destroyDayMap(){
 if(dayMap){dayMap.remove();dayMap=null}
 mapTiles=null;mapMarkers.clear();
}
function coincidentStops(point,points){
 return points.filter(p=>p.location&&p.location.lat===point.location.lat&&p.location.lng===point.location.lng);
}
function popupContent(point,points){
 const same=coincidentStops(point,points);
 const details=p=>`<button class="btn btn-secondary" data-place-detail="${p.eventId}" data-detail-number="${p.number}">${p.number} · ${esc(p.time)} ${esc(EVENTS_BY_ID.get(p.eventId).title)}</button>`;
 return `<div class="placepopup"><strong>${point.number}. ${esc(point.name)}</strong><span lang="ja">${esc(point.jp)}</span>
 ${point.location.note?`<small>${esc(point.location.note)}</small>`:''}
 ${same.length>1?'<small>같은 위치의 일정</small>':''}<div class="pin-visits">${same.map(details).join('')}</div></div>`;
}
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
 const points=[...mapMarkers.values()].filter(({marker,point})=>(!REGION_IDS[extent]||REGION_IDS[extent].has(point.id)));
 if(!points.length)return;
 dayMap.closePopup();dayMap.fitBounds(L.latLngBounds(points.map(({point})=>[point.location.lat,point.location.lng])),{padding:[48,48],maxZoom:16,animate:false});
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapextent===extent)));
}
const GERO_IDS=new Set(['geroStation','geroTown','yushimaan','senda','ogawaya','geropudding']);
const NABANA_IDS=new Set(['nagashima','nabana','beerGarden']);
const REGION_IDS={gero:GERO_IDS,nabana:NABANA_IDS,
 city:new Set(Object.keys(MAP_LOCATIONS).filter(id=>!GERO_IDS.has(id)&&!NABANA_IDS.has(id)&&!['airport','flightOfDreams'].includes(id)))};
function initDayMap(){
 destroyDayMap();
 const container=document.querySelector('#numberedmap');if(!container)return;
 const status=document.querySelector('#maploadstatus');
 const points=numberedPlaces(active);
 const missing=points.filter(p=>!p.location||!Number.isFinite(p.location.lat)||!Number.isFinite(p.location.lng)).length;
 if(typeof L==='undefined'){status.textContent='지도를 불러오지 못했습니다. 아래 장소별 Google Maps 링크를 이용해 주세요.';return}
 dayMap=L.map(container,{scrollWheelZoom:false,zoomControl:true,keyboard:true,fadeAnimation:false,zoomAnimation:!matchMedia('(prefers-reduced-motion: reduce)').matches});
 mapTiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(dayMap);
 let tileFailed=false;
 mapTiles.on('tileerror',()=>{tileFailed=true;status.textContent='배경 지도를 불러오지 못한 부분이 있습니다. 다시 불러오거나 장소별 Google Maps 링크를 이용해 주세요.'});
 mapTiles.on('load',()=>{if(!tileFailed)status.textContent=missing?missing+'곳은 Google Maps에서 확인하세요.':''});
 points.forEach(point=>{
  if(!point.location||!Number.isFinite(point.location.lat)||!Number.isFinite(point.location.lng))return;
  const marker=L.marker([point.location.lat,point.location.lng],{icon:L.divIcon({className:'numberpin'+(point.optional?' is-optional':'')+(point.status==='skipped'?' is-skipped':''),html:`<span>${point.number}</span>`,iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-20]}),title:point.number+'번 '+point.name,alt:point.number+'번 '+point.name,keyboard:true,riseOnHover:true});
  marker.on('click',()=>{
   if(coincidentStops(point,points).length>1){
    routeFollowAfter=Date.now()+1200;
    selectPin(point);
    const choices=document.querySelector('#map-choices');
    choices.innerHTML=popupContent(point,points);
    choices.hidden=false;
    choices.scrollIntoView({block:'start',behavior:'instant'});
    choices.querySelector('button[data-place-detail]')?.focus({preventScroll:true});
    return;
   }
   showMapSelection({number:point.number});
   openPlace(point.eventId,point.number,{expand:true});
  });
  marker.addTo(dayMap);
  marker.getElement()?.setAttribute('aria-label',point.number+'번 '+point.name);
  mapMarkers.set(point.number,{marker,point});
 });
 if(mapMarkers.size)fitDayMap();else{dayMap.setView([35.17,136.90],12);status.textContent='표시할 좌표가 없습니다. 아래 Google Maps 링크를 이용하세요.'}
 if(missing)status.textContent=missing+'곳의 좌표가 없습니다. 해당 장소의 Google Maps 링크를 이용하세요.';
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.addEventListener('click',()=>fitDayMap(b.dataset.mapextent)));
}
function showMapSelection(target){
 const point=numberedPlaces(active).find(p=>target.eventId?p.eventId===target.eventId:target.number?p.number===target.number:p.id===target.id);
 if(!point)return;
 if(!target.fromScroll)document.querySelector('#map-choices').hidden=true;
 if(typeof routeFollowAfter!=='undefined'&&!target.fromScroll)routeFollowAfter=Date.now()+1200;
 selectPin(point);
 const animate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(dayMap&&point.location){
  dayMap.closePopup();
  dayMap.flyTo([point.location.lat,point.location.lng],Math.max(dayMap.getZoom(),16),{animate,duration:.55});
 }
 if(!target.fromScroll)document.querySelector('#mapstop-'+point.number)?.scrollIntoView({block:'nearest',behavior:animate?'smooth':'instant'});
}
