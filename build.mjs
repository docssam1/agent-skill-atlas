import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const files=['index.html','atlas-current.js','atlas-ui.js','atlas-ui.css','atlas-history.js','atlas-history-ui.js','references/previous-map-v9.html','references/ui-ux-reference-guide.md','references/integration-20261022.md','references/impeccable-20261106.md'];
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',md:'text/markdown; charset=utf-8'};
const assets=Object.fromEntries(files.map(name=>['/'+name,{body:readFileSync(new URL('./'+name,import.meta.url),'utf8'),type:types[name.split('.').at(-1)]}]));
const worker=`const assets=${JSON.stringify(assets)};\nexport default {async fetch(request){const url=new URL(request.url);if(url.pathname==='/favicon.ico')return new Response(null,{status:204});if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{allow:'GET, HEAD'}});const asset=assets[url.pathname==='/'?'/index.html':url.pathname];if(!asset)return new Response('Not found',{status:404});return new Response(request.method==='HEAD'?null:asset.body,{headers:{'content-type':asset.type,'x-content-type-options':'nosniff','cache-control':'no-cache'}});}};\n`;
mkdirSync(new URL('./dist/server/',import.meta.url),{recursive:true});writeFileSync(new URL('./dist/server/index.js',import.meta.url),worker);
console.log(JSON.stringify({assets:files.length,indexSha256:createHash('sha256').update(assets['/index.html'].body).digest('hex')}));
