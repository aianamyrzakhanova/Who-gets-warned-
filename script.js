/* Who Gets Warned? Accessible interactions. No live or simulated flood-risk API calls. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const menuButton = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    mobileNav.hidden = expanded;
  });
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));
  const progressBar = $('#scroll-progress');
  let scrollBusy = false;
  function updateProgress() {
    const max = Math.max(1,document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.width = `${Math.min(100, Math.max(0, 100 * window.scrollY / max))}%`;
    scrollBusy = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollBusy) { requestAnimationFrame(updateProgress); scrollBusy = true; }
  }, {passive:true});
  updateProgress();

  // Source data copied faithfully from the dated Ministry of Emergency Situations reports.
  // Same values and links are available in data/official-flood-updates-april-2024.csv.
  const records = [
    {day: '16 Apr', value: 113693, source: '02'},
    {day: '17 Apr', value: 116949, source: '03'},
    {day: '18 Apr', value: 117800, source: '04'},
    {day: '19 Apr', value: 118180, source: '05'},
    {day: '20 Apr', value: 118507, source: '06'}
  ];
  let mode = 'total';
  const chart = $('#evidence-chart');
  const format = n => n.toLocaleString('en-US');
  const NS = 'http://www.w3.org/2000/svg';
  function addSvg(type, attributes, parent=chart, value='') {
    const el = document.createElementNS(NS,type);
    for (const [key,val] of Object.entries(attributes||{})) el.setAttribute(key,String(val));
    if(value) el.textContent=value;
    parent.appendChild(el);
    return el;
  }
  function plotChart() {
    if(!chart) return;
    chart.replaceChildren();
    const max = mode === 'total' ? 120000 : 5000;
    const min = mode === 'total' ? 112000 : 0;
    const values = records.map(r=>mode === 'total'?r.value:r.value-records[0].value);
    const x = i=>68+i*(625/4);
    const y = v=>270-(v-min)/(max-min)*215;
    const root = addSvg('g',{});
    for (let i=0;i<=4;i++) {
      const v=min+(max-min)*i/4, gy=y(v);
      addSvg('line',{x1:68,y1:gy,x2:694,y2:gy,stroke:'#dce8e5','stroke-width':1},root);
      addSvg('text',{x:53,y:gy+4,'text-anchor':'end','font-family':'DM Sans,Arial,sans-serif','font-size':13,fill:'#728b90'},root,format(Math.round(v)));
    }
    const defs=addSvg('defs',{},root);
    const gradient=addSvg('linearGradient',{id:'chart-fill',x1:'0%',y1:'0%',x2:'0%',y2:'100%'},defs);
    addSvg('stop',{offset:'0%','stop-color':'#2e9698','stop-opacity':'.24'},gradient);
    addSvg('stop',{offset:'100%','stop-color':'#2e9698','stop-opacity':'.01'},gradient);
    const pts=values.map((v,i)=>[x(i),y(v)]);
    const line=pts.map((p,i)=>`${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ');
    addSvg('path',{d:`${line} L ${pts[4][0]} 270 L ${pts[0][0]} 270 Z`,fill:'url(#chart-fill)'},root);
    addSvg('path',{d:line,fill:'none',stroke:'#238a94','stroke-width':3.5,'stroke-linecap':'round','stroke-linejoin':'round'},root);
    pts.forEach(([px,py],i)=>{
      addSvg('text',{x:px,y:307,'text-anchor':'middle','font-family':'DM Sans,Arial,sans-serif','font-size':13,fill:'#6f8388'},root,records[i].day);
      addSvg('circle',{cx:px,cy:py,r:15,fill:'transparent',tabindex:'0',role:'button','aria-label':`${records[i].day} 2024, ${format(values[i])}${mode==='change'?' more than 16 April':' reported rescued and evacuated'}`},root).addEventListener('focus',()=>focusPoint(i));
      addSvg('circle',{cx:px,cy:py,r:5.4,fill:'#238a94',stroke:'#fff','stroke-width':2.6,'pointer-events':'none'},root);
    });
    // transparent mouse/touch target per x partition, keyboard focus already on circles
    pts.forEach(([px,py],i)=>{
      addSvg('rect',{x:px-55,y:32,width:110,height:254,fill:'transparent'},root).addEventListener('pointerenter',()=>focusPoint(i));
    });
    chart.setAttribute('aria-label', mode==='total'?'Cumulative ministry-reported rescued and evacuated people nationally, 16 to 20 April 2024. Values 113693, 116949, 117800, 118180 and 118507.':'Change in cumulative ministry-reported national count relative to 16 April: 0, 3256, 4107, 4487 and 4814.');
    $('#chart-big-num').textContent=format(mode==='total'?118507:4814);
    $('#chart-big-caption').textContent=mode==='total'?'Reported by 20 April 2024':'Additional reported since 16 April';
    $('#chart-delta').textContent=mode==='total'?'+4,814 since 16 April':'Based on ministry reports';
    $('#chart-detail').textContent='Select a point to inspect a dated report.';
  }
  function focusPoint(i){
    if(!records[i])return;
    const r=records[i];
    $('#chart-detail').textContent=`${r.day}: ${format(mode==='total'?r.value:r.value-records[0].value)} · Source [${r.source}]`;
  }
  $$('.chart-option').forEach(btn=>btn.addEventListener('click',()=>{
    mode=btn.dataset.chartMode;
    $$('.chart-option').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    plotChart();
  }));
  plotChart();

  const warningMessages={
    en:{title:'DEMONSTRATION — NOT AN ACTIVE WARNING.',body:'River levels may rise. Check official updates, prepare essential documents, and follow emergency-service instructions.'},
    kk:{title:'ҮЛГІ — БҰЛ НАҚТЫ ЕСКЕРТУ ЕМЕС.',body:'Өзен деңгейі көтерілуі мүмкін. Ресми ақпаратты тексеріңіз, қажетті құжаттарыңызды дайындаңыз және төтенше жағдайлар қызметінің нұсқауларын орындаңыз.'},
    ru:{title:'ПРИМЕР — ЭТО НЕ ДЕЙСТВУЮЩЕЕ ОПОВЕЩЕНИЕ.',body:'Уровень воды в реке может повыситься. Следите за официальными сообщениями, подготовьте необходимые документы и выполняйте указания экстренных служб.'}
  };
  $$('.language-control button').forEach(btn=>btn.addEventListener('click',()=>{
    const msg=warningMessages[btn.dataset.lang];
    if (!msg)return;
    $$('.language-control button').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    const target=$('#warning-text');target.replaceChildren();
    const title=document.createElement('strong');title.textContent=msg.title;
    const body=document.createElement('p');body.textContent=msg.body;
    target.append(title,body);
  }));
  const scenarioContent={
    digital:{title:'One alert is sent.',description:'A digital notification may arrive quickly for connected subscribers. It does not, by itself, establish receipt, comprehension or ability to evacuate.',active:[true,false,false,false]},
    layered:{title:'A community follows through.',description:'Officials review the forecast, authorize a bilingual alert, and coordinate additional trusted channels for households that may be hard to reach digitally. Whether this works must be evaluated.',active:[true,true,true,true]}
  };
  $$('.scenario-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const scenario=scenarioContent[btn.dataset.scenario];
    $$('.scenario-btn').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $('#scenario-heading').textContent=scenario.title;
    $('#scenario-description').textContent=scenario.description;
    $$('#scenario-channels li').forEach((li,i)=>li.classList.toggle('dimmed',!scenario.active[i]));
  }));
})();
