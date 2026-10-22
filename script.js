"use strict";
const toggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav');
if(toggle&&nav){
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('open')}));
}
const year=document.getElementById('year'); if(year)year.textContent=new Date().getFullYear();

const filterButtons=[...document.querySelectorAll('[data-filter]')];
const timelineRows=[...document.querySelectorAll('.timeline-row[data-track]')];
const count=document.getElementById('timeline-count');
filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
 const selection=btn.dataset.filter;
 filterButtons.forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
 let visible=0;
 timelineRows.forEach(row=>{const match=selection==='todos'||row.dataset.track.split(' ').includes(selection);row.hidden=!match;if(match)visible++});
 if(count)count.textContent=visible+' '+(visible===1?'hito':'hitos')+' en el recorrido';
}));

const playBtn=document.querySelector('[data-video-reveal]');
const player=document.getElementById('film-player');
if(playBtn&&player){
 playBtn.addEventListener('click',()=>{
   if(!player.querySelector('iframe')){
     const frame=document.createElement('iframe');
     frame.src='https://www.youtube-nocookie.com/embed/_ss8rcgkn0o?autoplay=1';
     frame.title='No tengan miedo — reproducción en YouTube';
     frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
     frame.allowFullscreen=true;
     frame.loading='lazy';
     player.append(frame);
   }
   player.hidden=false;
   playBtn.setAttribute('aria-expanded','true');
   playBtn.textContent='Video cargado ↓';
   player.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
 });
}

// Enlarge gallery photos without leaving the page. Links remain usable if dialog is unsupported.
const galleryLinks=[...document.querySelectorAll('[data-lightbox]')];
if(galleryLinks.length && typeof HTMLDialogElement!=='undefined'){
 const dialog=document.createElement('dialog');
 dialog.className='v3-lightbox';
 dialog.innerHTML='<div class="v3-lightbox-shell"><button type="button" class="v3-lightbox-close" aria-label="Cerrar fotografía">✕</button><button type="button" class="v3-lightbox-prev" aria-label="Fotografía anterior">‹</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="v3-lightbox-next" aria-label="Fotografía siguiente">›</button></div>';
 document.body.append(dialog);
 const img=dialog.querySelector('img'),caption=dialog.querySelector('figcaption');
 let openedFrom=null, gallery=[],index=0;
 const draw=()=>{const item=gallery[index],im=item.querySelector('img');img.src=item.href;img.alt=im.alt;caption.textContent=item.closest('figure').querySelector('figcaption')?.textContent||''};
 const step=direction=>{if(!gallery.length)return;index=(index+direction+gallery.length)%gallery.length;draw()};
 galleryLinks.forEach(link=>link.addEventListener('click',event=>{
   event.preventDefault();openedFrom=link;gallery=[...link.closest('[data-gallery]').querySelectorAll('[data-lightbox]')];index=gallery.indexOf(link);draw();dialog.showModal();
 }));
 dialog.querySelector('.v3-lightbox-close').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.v3-lightbox-prev').addEventListener('click',()=>step(-1));
 dialog.querySelector('.v3-lightbox-next').addEventListener('click',()=>step(1));
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{img.removeAttribute('src');openedFrom?.focus()});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}else if(e.key==='ArrowRight'){e.preventDefault();step(1)}});
}
