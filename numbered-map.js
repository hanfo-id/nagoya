/* One map per day, with matching numbered markers and place-list entries. */
let dayMap=null,mapTiles=null,mapMarkers=new Map(),mapClusters=[];
function numberedPlaces(i){return getMapStops(state,i)}
function destroyDayMap(){
 if(dayMap){dayMap.remove();dayMap=null}
 mapTiles=null;mapMarkers.clear();mapClusters=[];
}
function popupContent(p){return `<div class="placepopup"><strong>${p.number}. ${esc(p.name)}</strong><span lang="ja">${esc(p.jp)}</span><button class="btn btn-secondary" data-place-detail="${p.eventId}">상세 보기</button></div>`}
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
 const points=[...mapMarkers.values()].filter(({marker,point})=>(extent==='park'?PARK_IDS.has(point.id):extent==='city'?CITY_IDS.has(point.id):true));
 if(!points.length)return;
 dayMap.closePopup();dayMap.fitBounds(L.latLngBounds(points.map(({point})=>[point.location.lat,point.location.lng])),{padding:[48,48],maxZoom:16,animate:false});
 document.querySelectorAll('[data-mapextent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapextent===extent)));
 spreadMapPins();
}
// Clusters are anchored to a member's true location. Place markers never move.
const PARK_IDS=new Set(['parkstation','park','warehouse','cafe','valley','forest','hill','mononoke']);
const CITY_IDS=new Set(['hotel','station','nagoya','sake','komeda','ramen','ramuchi','mutsumi','monja','sushi','keshiki','hisaya','tower','oasis','donki','lachic','osu','kannon','bansho','shike','endoji','kokusai','kamimaezu']);
function nearbyGroups(entries,project,radius=28){
 const groups=[];
 for(const entry of entries){const xy=project(entry.point.location);const matches=groups.filter(g=>g.some(e=>project(e.point.location).distanceTo(xy)<radius));if(!matches.length)groups.push([entry]);else{const group=matches[0];group.push(entry);for(const other of matches.slice(1)){group.push(...other);groups.splice(groups.indexOf(other),1)}}}
 return groups;
}
function spreadMapPins(){
 if(!dayMap)return;
 mapClusters.forEach(c=>c.remove());mapClusters=[];
 const entries=[...mapMarkers.values()];
 for(const entry of entries)if(!dayMap.hasLayer(entry.marker))entry.marker.addTo(dayMap);
 for(const group of nearbyGroups(entries,p=>dayMap.latLngToLayerPoint([p.lat,p.lng]))){
  if(group.length<2)continue;
  group.forEach(e=>e.marker.remove());
  const first=group[0].point;
  const current=typeof selectedStopNumber==='number'?selectedStopNumber:0;
  const width=Math.min(group.length,4)*27+8,rows=Math.ceil(group.length/4);
  const cluster=L.marker([first.location.lat,first.location.lng],{icon:L.divIcon({className:'placecluster numeric-cluster',html:`<div class="cluster-numbers" style="grid-template-columns:repeat(${Math.min(group.length,4)},27px)">${group.map(({point:p})=>`<span class="${p.number===current?'selected-number':''}">${p.number}</span>`).join('')}</div>`,iconSize:[width,rows*27+8],iconAnchor:[width/2,rows*27/2+4]}),title:'방문 번호 '+group.map(e=>e.point.number).join(', '),keyboard:true});
  cluster.bindPopup(`<div class="clusterchoices"><strong>방문 지점 선택</strong>${group.map(({point:p})=>`<button class="btn btn-secondary" data-pin="${p.number}">${p.number}. ${esc(p.name)} <small>${esc(p.time)}</small></button>`).join('')}</div>`,{maxWidth:280});
  cluster.addTo(dayMap);mapClusters.push(cluster);
 }
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
