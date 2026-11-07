import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function serve(port=0){return new Promise(resolve=>{const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||pathname.split('/').some(x=>x.startsWith('.'))){res.writeHead(403).end();return;}const ext=path.extname(file);if(!['.html','.js','.css','.json','.png','.md'].includes(ext)){res.writeHead(404).end();return;}const data=await fs.readFile(file);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'})[ext]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(data);}catch{res.writeHead(404).end();}}).listen(port,'127.0.0.1',()=>resolve(server));});}
if(process.argv[1]===fileURLToPath(import.meta.url)){const server=await serve(Number(process.env.ATLAS_PORT)||43118);console.log('Preview: http://127.0.0.1:'+server.address().port);}
