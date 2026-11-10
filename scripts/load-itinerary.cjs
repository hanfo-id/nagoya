const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
function loadItinerary(globals = {}) {
 const context = vm.createContext({URL, URLSearchParams, Date, Intl, localStorage:{getItem:()=>null}, ...globals});
 for (const file of ['trip-details.js','data/itinerary.js','data/reservations.js','trip-data.js','map-locations.js','trip-state.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
 }
 return context;
}
module.exports = {root,loadItinerary};
