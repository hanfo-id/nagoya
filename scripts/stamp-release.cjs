const fs=require('node:fs'),path=require('node:path');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const file=name=>path.join(root,name);
const release=fs.readFileSync(file('sw.js'),'utf8').match(/const RELEASE='([^']+)'/)[1];
const html=fs.readFileSync(file('index.html'),'utf8')
 .replace(/\?v=[\w-]+(?=")/g,'?v='+release)
 .replace(/<script src="([^"?]+)\?v=[^"]+"(?: integrity="[^"]+")?><\/script>/g,(_,src)=>{
  const content=fs.readFileSync(file(src));
  if(content.includes(13))throw new Error(src+' must use LF line endings.');
  const hash=createHash('sha256').update(content).digest('base64');
  return '<script src="'+src+'?v='+release+'" integrity="sha256-'+hash+'"></script>';
 });
fs.writeFileSync(file('index.html'),html);
