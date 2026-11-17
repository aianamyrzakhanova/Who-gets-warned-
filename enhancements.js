/* Visual storytelling, separate from core content and the original interactive chart. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('#top,#problem,#data,#research,#solution,#verdict')];
  const links = [...document.querySelectorAll('.chapter-rail a')];
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('js-motion');
    const items = [...document.querySelectorAll('.story-photograph,.warning-path,.satellite-break,.analysis-panel,.research-theme,.case-card,.cost-grid article')];
    items.forEach(el => el.classList.add('reveal'));
    const appear = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('is-visible'); appear.unobserve(entry.target);}
    }),{threshold:.06,rootMargin:'0px 0px 90px 0px'});
    items.forEach(el=>appear.observe(el));
  }
  const track=()=>{
    const active=sections.reduce((current,el)=>el.getBoundingClientRect().top<window.innerHeight*.48?el.id:current,'top');
    links.forEach(a=>{const selected=a.dataset.chapter===active; a.classList.toggle('is-active',selected); if(selected)a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');});
    document.querySelector('.site-header')?.classList.toggle('is-scrolled',window.scrollY>90);
  };
  window.addEventListener('scroll',track,{passive:true});track();
  const stages={
    forecast:['WHAT WE CAN MEASURE','The river is rising','Gauges and forecasts can measure physical conditions. They cannot tell us whether someone has heard the warning.'],
    delivery:['WHAT WE STILL NEED TO KNOW','Did the message arrive?','A warning may be sent by SMS, app, siren or a local messenger. Counting sent messages cannot prove that every household received or understood them.'],
    action:['THE HUMAN QUESTION','Could the household respond?','Even a timely warning may not lead to evacuation without transport, trusted information and practical support. This is what the proposed pilot must investigate.']
  };
  document.querySelectorAll('[data-path]').forEach(btn=>btn.addEventListener('click',()=>{
    const [tag,title,copy]=stages[btn.dataset.path] || stages.forecast;
    document.querySelectorAll('[data-path]').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    const panel=document.querySelector('.path-reading');
    if(!panel)return;
    const change=()=>{document.querySelector('#path-tag').textContent=tag;document.querySelector('#path-title').textContent=title;document.querySelector('#path-copy').textContent=copy;panel.classList.remove('is-changing')};
    if(reduce)change();else {panel.classList.add('is-changing');setTimeout(change,160)}
  }));
})();
