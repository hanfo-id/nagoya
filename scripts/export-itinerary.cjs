const fs = require('node:fs');
const vm = require('node:vm');
const {loadItinerary} = require('./load-itinerary.cjs');

const args = process.argv.slice(2);
const plan = args.find(arg=>arg.startsWith('--plan='))?.slice(7);
const paths = args.filter(arg=>!arg.startsWith('--plan='));
if ((plan!==undefined&&plan!=='B')||paths.length>1||paths[0]?.startsWith('-')) {
 console.error('Usage: node scripts/export-itinerary.cjs [output.json]');
 process.exit(1);
}
const output = vm.runInContext('JSON.stringify(exportItinerary(),null,2)',loadItinerary())+'\n';
if (paths[0]) fs.writeFileSync(paths[0],output);
else process.stdout.write(output);
