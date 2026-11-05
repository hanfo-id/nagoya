const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const dom={textContent:'',innerHTML:'',setAttribute(){},focus(){},scrollIntoView(){}};
const c=vm.createContext({URL,URLSearchParams,Intl,Date,localStorage:{getItem:()=>null},document:{querySelector:()=>dom,querySelectorAll:()=>[]},matchMedia:()=>({matches:true}),esc:String,link:()=>'',actionLink:()=>'',writeRoute(){},markNav(){}});
for(const file of ['trip-details.js','trip-data.js','map-locations.js','trip-state.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
c.active=0;c.scale=1000;
const created=[];
c.L={map(){return {layers:new Set(),remove(){},on(){},hasLayer(m){return this.layers.has(m)},fitBounds(){},closePopup(){},getZoom(){return 12},setView(){return this},flyTo(coords){this.center=coords;return this},latLngToLayerPoint(p){const x=p[1]*c.scale,y=p[0]*c.scale;return {x,y,distanceTo(o){return Math.hypot(x-o.x,y-o.y)}}}}},tileLayer(){return {addTo(){return this},on(){return this}}},divIcon(o){return o},latLngBounds:a=>a,marker(coords,opts){const marker={coords:[...coords],opts,addTo(map){this.map=map;map.layers.add(this);return this},remove(){this.map?.layers.delete(this);return this},bindPopup(html){this.popup=html;return this},on(){return this},getElement(){return {setAttribute(){},classList:{toggle(){}}}},setLatLng(){throw Error('Coordinates must never be changed')},openPopup(){return this}};created.push(marker);return marker}};
vm.runInContext(fs.readFileSync('numbered-map.js','utf8'),c);
for(let day=0;day<5;day++)for(const foodOnly of [false,true])for(const optional of [false,true]){
 c.active=day;vm.runInContext(`state.selectedDay=${day};state.filters.foodOnly=${foodOnly};state.filters.optional=${optional};initDayMap()`,c);
 vm.runInContext("showMapSelection({number:1,fromScroll:true})",c);
 const focused=JSON.parse(vm.runInContext('JSON.stringify({center:dayMap.center,expected:[numberedPlaces(active)[0].location.lat,numberedPlaces(active)[0].location.lng]})',c));assert.deepEqual(focused.center,focused.expected);
 for(const scale of [100,1000,10000,100000]){c.scale=scale;for(const extent of ['all','city','all',...(day===2?['park','all']:[])]){
 vm.runInContext(`fitDayMap('${extent}');spreadMapPins()`,c);
 const points=JSON.parse(vm.runInContext('JSON.stringify([...mapMarkers.values()].map(e=>({coord:e.marker.coords,expected:[e.point.location.lat,e.point.location.lng]})))',c));for(const p of points)assert.deepEqual(p.coord,p.expected);
 }}
 const count=vm.runInContext('mapMarkers.size',c);assert.equal(count,vm.runInContext('numberedPlaces(active).length',c));assert.ok(vm.runInContext('[...mapMarkers.values()].every(e=>dayMap.hasLayer(e.marker))',c));

}
assert.ok(!fs.readFileSync('numbered-map.js','utf8').includes('.setLatLng('));
console.log('PASS 5 days × 4 filters × 4 zoom scales: every marker equals MAP_LOCATIONS, every stop remains an individual visible marker; no coordinate mutation, no route polylines.');
