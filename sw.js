const VERSION="arpad-1.0.0";
const SHELL=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png","icons/favicon-32.png","fonts/manrope-latin-400-normal.woff2","fonts/manrope-latin-500-normal.woff2","fonts/manrope-latin-600-normal.woff2","fonts/manrope-latin-700-normal.woff2","fonts/manrope-latin-ext-400-normal.woff2","fonts/manrope-latin-ext-500-normal.woff2","fonts/manrope-latin-ext-600-normal.woff2","fonts/manrope-latin-ext-700-normal.woff2","fonts/plus-jakarta-sans-latin-500-normal.woff2","fonts/plus-jakarta-sans-latin-600-normal.woff2","fonts/plus-jakarta-sans-latin-700-normal.woff2","fonts/plus-jakarta-sans-latin-ext-500-normal.woff2","fonts/plus-jakarta-sans-latin-ext-600-normal.woff2","fonts/plus-jakarta-sans-latin-ext-700-normal.woff2","fonts/syne-latin-600-normal.woff2","fonts/syne-latin-700-normal.woff2","fonts/syne-latin-800-normal.woff2","fonts/syne-latin-ext-600-normal.woff2","fonts/syne-latin-ext-700-normal.woff2","fonts/syne-latin-ext-800-normal.woff2"];
// install: cache the whole app so it works offline
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
// activate: drop caches from older versions
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// fetch: same-origin only. Pages: network first (fresh updates), cache when offline. Other files: cache first.
self.addEventListener("fetch",e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=="GET"||url.origin!==location.origin)return;
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put("index.html",cp));return r}).catch(()=>caches.match("index.html")));
    return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp))}return r})));
});
