const CACHE='agenda-v1';
const FILES=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(ch=>ch.put(e.request,c)).catch(()=>{});return r}).catch(()=>caches.match(e.request)));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const d=e.notification.data||{};const act=e.action||'open';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    if(list.length){list[0].postMessage({act,id:d.id});return list[0].focus()}
    return clients.openWindow('./index.html?act='+act+'&id='+encodeURIComponent(d.id||''));
  }));
});
