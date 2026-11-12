const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={a:1,b:0,c:0,current:null,xp:0,completed:new Set(),attempts:0,hints:0,explorations:0};
const missions=[
{id:1,title:'Atingindo o Alvo',desc:'O lançador está errando. Construa uma trajetória que passe pelo ponto (10, 5) e tenha concavidade para baixo.',obj:'Faça f(10) = 5 e use a < 0.',hint:['Comece pensando no valor de f(10).','A concavidade para baixo exige a negativo.','Uma solução simples é a = -0,1, b = 1,4, c = 1.'],check:s=>s.a<0&&Math.abs(s.a*100+s.b*10+s.c-5)<.12,speech:'Temos um problema, explorador! O lançador não está atingindo o alvo. Experimente alterar os coeficientes e observe a trajetória.'},
{id:2,title:'O Poder de c',desc:'O laboratório precisa posicionar o fundo da parábola em y = 4. Descubra o papel de c.',obj:'Use a = 1, b = 0 e faça o vértice ficar em (0, 4).',hint:['Fixe a e b para isolar o efeito de c.','Quando x = 0, f(0) = c.','Você procura uma parábola com vértice em y = 4.'],check:s=>Math.abs(s.a-1)<.05&&Math.abs(s.b)<.1&&Math.abs(s.c-4)<.12,speech:'Observe o que acontece quando apenas c muda. Não vou dizer o que ele faz; descubra pelo gráfico.'},
{id:3,title:'O Misterioso b',desc:'Um eixo de simetria precisa passar exatamente por x = 3.',obj:'Faça o eixo de simetria ser x = 3, usando a = -1 e c = 0.',hint:['O eixo depende de a e b.','Use xᵥ = -b/(2a).','Com a = -1, qual b produz xᵥ = 3?'],check:s=>Math.abs(s.a+1)<.05&&Math.abs(s.c)<.1&&Math.abs((-s.b)/(2*s.a)-3)<.08,speech:'Agora não queremos apenas uma parábola qualquer. Quero que você controle onde ela encontra seu eixo de simetria.'},
{id:4,title:'A Caça ao Vértice',desc:'O ponto máximo da trajetória deve ser exatamente V(2, 4).',obj:'Construa uma parábola com vértice V = (2, 4) e concavidade para baixo.',hint:['O eixo precisa passar por x = 2.','Depois ajuste a altura do vértice.','Uma solução é f(x) = -x² + 4x.'],check:s=>{let vx=-s.b/(2*s.a),vy=s.a*vx*vx+s.b*vx+s.c;return s.a<0&&Math.abs(vx-2)<.08&&Math.abs(vy-4)<.12},speech:'O alvo agora é invisível no gráfico. Use as propriedades da função para descobrir onde está o ponto máximo.'},
{id:5,title:'Atravessando os Portais',desc:'A trajetória deve cruzar o eixo x exatamente nos portais x = 2 e x = 6.',obj:'Construa raízes x₁ = 2 e x₂ = 6.',hint:['As raízes são os pontos em que a parábola cruza o eixo x.','Use a forma fatorada a(x-2)(x-6).','Escolha a = 1 para obter uma solução simples.'],check:s=>Math.abs(s.a-1)<.08&&Math.abs(s.b+8)<.15&&Math.abs(s.c-12)<.15,speech:'Duas portas foram abertas no eixo x. Sua tarefa é fazer a trajetória atravessar exatamente as duas.'},
{id:6,title:'O Enigma do Discriminante',desc:'Crie uma parábola que toque o eixo x uma única vez.',obj:'Faça Δ = 0 usando a = 1 e b = -6.',hint:['Observe quantas raízes aparecem.','Quando a parábola toca o eixo x em um único ponto, há uma raiz real dupla.','Calcule Δ = b² - 4ac.'],check:s=>Math.abs(s.a-1)<.05&&Math.abs(s.b+6)<.12&&Math.abs(s.c-9)<.12,speech:'Quero uma trajetória que beije o eixo x sem atravessá-lo. O discriminante pode ajudar a investigar isso.'},
{id:7,title:'A Parábola Invisível',desc:'Reconstrua uma função cujo vértice seja V(3,5) e que passe pelo ponto (1,1).',obj:'Encontre uma função que satisfaça as duas condições.',hint:['Comece pela forma de vértice: a(x-3)² + 5.','Substitua o ponto (1,1).','Depois transforme para ax² + bx + c.'],check:s=>{let vx=-s.b/(2*s.a),vy=s.a*vx*vx+s.b*vx+s.c;return Math.abs(vx-3)<.08&&Math.abs(vy-5)<.12&&Math.abs(s.a+1)<.08&&Math.abs(s.b-6)<.15&&Math.abs(s.c+4)<.15},speech:'Agora vou esconder a fórmula. Você terá apenas informações geométricas. Reconstrua a função.'},
{id:8,title:'Engenharia de Trajetórias',desc:'Projete uma trajetória com concavidade para baixo, passando por (0,1) e com vértice em (2,5).',obj:'Construa uma função compatível com as duas condições.',hint:['Como a parábola passa por (0,1), c = 1.','O eixo de simetria deve estar em x = 2.','Use o valor do vértice para determinar a abertura.'],check:s=>{let vx=-s.b/(2*s.a),vy=s.a*vx*vx+s.b*vx+s.c;return s.a<0&&Math.abs(s.c-1)<.12&&Math.abs(vx-2)<.08&&Math.abs(vy-5)<.12},speech:'Chegamos à engenharia. Você não está mais procurando uma resposta; está projetando uma função a partir de condições.'}
];
const achievements=[['🔭','Primeira Observação','Altere os coeficientes pela primeira vez.','explore'],['🎯','Alvo Atingido','Conclua a primeira missão.','m1'],['🧭','Investigador','Conclua 3 missões.','m3'],['🧠','Arquiteto','Conclua 6 missões.','m6'],['∞','Além da Fórmula','Conclua todas as 8 missões.','all'],['⚗','Laboratório Aberto','Use o modo livre.','lab']];
function fmt(n){if(Math.abs(n)<.005)n=0;return Number(n).toFixed(2).replace('.',',')}
function setView(id){$$('.view').forEach(v=>v.classList.remove('active-view'));$('#'+id).classList.add('active-view');$$('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='lab')resizeCanvas();}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$('#startBtn').onclick=()=>openMission(Math.max(1,[...state.completed].length+1));
function renderMissions(){const g=$('#missionGrid');g.innerHTML='';missions.forEach((m,i)=>{const unlocked=i===0||state.completed.has(i);const d=document.createElement('article');d.className='mission-card'+(unlocked?'':' locked');d.innerHTML=`<div class="mission-num">MISSÃO ${m.id} ${unlocked?'':'🔒'}</div><h3>${m.title}</h3><p>${m.desc}</p><button class="secondary" ${unlocked?'':'disabled'}>${state.completed.has(i+1)?'✓ CONCLUÍDA':'EXPLORAR'}</button>`;d.querySelector('button').onclick=()=>openMission(m.id);g.appendChild(d)})}
function openMission(id){const m=missions.find(x=>x.id===id);if(!m)return;state.current=id;$('#missionKicker').textContent='MISSÃO '+id;$('#missionTitle').textContent=m.title;$('#missionDesc').textContent=m.desc;$('#objective').textContent=m.obj;$('#hintText').textContent='';$('#hintBtn').textContent='💡 PEDIR UMA PISTA';$('#nextBtn').disabled=true;setView('lab');setMood('pensativo');say(m.speech);resetValues(id===1?[-.1,1.4,1]:id===2?[1,0,4]:id===3?[-1,6,0]:[1,0,0]);renderProgress()}
function resetValues(vals=[1,0,0]){$('#aSlider').value=vals[0];$('#bSlider').value=vals[1];$('#cSlider').value=vals[2];updateValues()}
function updateValues(){state.a=+$('#aSlider').value;state.b=+$('#bSlider').value;state.c=+$('#cSlider').value;$('#aOut').textContent=fmt(state.a);$('#bOut').textContent=fmt(state.b);$('#cOut').textContent=fmt(state.c);$('#fa').textContent=fmt(state.a);$('#fb').textContent=fmt(state.b);$('#fc').textContent=fmt(state.c);state.explorations++;renderProperties();draw();if(state.explorations===1){unlock('explore');say('Boa. Você acaba de fazer seu primeiro experimento. Agora observe antes de tentar acertar.')} }
['aSlider','bSlider','cSlider'].forEach(id=>$('#'+id).addEventListener('input',updateValues));['showVertex','showRoots','showAxis'].forEach(id=>$('#'+id).addEventListener('change',draw));
function calc(){const{a,b,c}=state;if(Math.abs(a)<.0001)return{linear:true,root:Math.abs(b)<.0001?null:-c/b};const delta=b*b-4*a*c,vx=-b/(2*a),vy=a*vx*vx+b*vx+c,roots=delta>=0?[(-b-Math.sqrt(delta))/(2*a),(-b+Math.sqrt(delta))/(2*a)]:[];return{linear:false,delta,vx,vy,roots}}
function renderProperties(){const q=calc();let items=[];if(q.linear)items=[['Vértice','—'],['Eixo','—'],['Δ','—'],['Raízes',q.root==null?'infinitas':fmt(q.root)],['Concavidade','linear']];else items=[['Vértice',`(${fmt(q.vx)}; ${fmt(q.vy)})`],['Eixo',`x = ${fmt(q.vx)}`],['Discriminante',fmt(q.delta)],['Raízes',q.roots.length?q.roots.map(fmt).join(' ; '):'sem reais'],['Concavidade',state.a>0?'para cima':'para baixo']];$('#properties').innerHTML=items.map(x=>`<div class="prop"><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}
const canvas=$('#graph'),ctx=canvas.getContext('2d');let anim=null;
function resizeCanvas(){const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);draw()}
window.addEventListener('resize',resizeCanvas);
function world(){const w=canvas.clientWidth,h=canvas.clientHeight;return{w,h,xmin:-3,xmax:13,ymin:-6,ymax:11,sx:w/16,sy:h/17,X:x=>20+(x+3)*w/16,Y:y=>h-20-(y+6)*h/17}}
function draw(ball=null){const q=calc(),g=world(),{w,h,X,Y}=g;ctx.clearRect(0,0,w,h);ctx.fillStyle='#06111f';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#122a46';ctx.lineWidth=1;for(let x=-3;x<=13;x++){ctx.beginPath();ctx.moveTo(X(x),0);ctx.lineTo(X(x),h);ctx.stroke()}for(let y=-6;y<=11;y++){ctx.beginPath();ctx.moveTo(0,Y(y));ctx.lineTo(w,Y(y));ctx.stroke()}ctx.strokeStyle='#617c9a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(X(-3),Y(0));ctx.lineTo(X(13),Y(0));ctx.stroke();ctx.beginPath();ctx.moveTo(X(0),Y(-6));ctx.lineTo(X(0),Y(11));ctx.stroke();ctx.fillStyle='#8198b4';ctx.font='11px system-ui';for(let x=-3;x<=13;x++)if(x!==0)ctx.fillText(x,X(x)-4,Y(0)+15);for(let y=-6;y<=11;y++)if(y!==0)ctx.fillText(y,X(0)-18,Y(y)+4);drawMissionObjects(g);if(!q.linear){if($('#showAxis').checked){ctx.setLineDash([5,5]);ctx.strokeStyle='#6b7b92';ctx.beginPath();ctx.moveTo(X(q.vx),0);ctx.lineTo(X(q.vx),h);ctx.stroke();ctx.setLineDash([])}ctx.beginPath();let first=true;for(let x=-3;x<=13;x+=.035){let y=state.a*x*x+state.b*x+state.c;if(y<g.ymin-2||y>g.ymax+2){first=true;continue}if(first){ctx.moveTo(X(x),Y(y));first=false}else ctx.lineTo(X(x),Y(y))}ctx.strokeStyle='#5bc0ff';ctx.lineWidth=3;ctx.shadowBlur=12;ctx.shadowColor='#159bff';ctx.stroke();ctx.shadowBlur=0;if($('#showVertex').checked){dot(X(q.vx),Y(q.vy),'#f4bd4f',5);label(`V (${fmt(q.vx)}, ${fmt(q.vy)})`,X(q.vx)+8,Y(q.vy)-10,'#f4d27e')}if($('#showRoots').checked&&q.roots.length){q.roots.forEach(r=>{if(r>=g.xmin&&r<=g.xmax){dot(X(r),Y(0),'#ff6b67',5);label(`x = ${fmt(r)}`,X(r)+7,Y(0)-9,'#ff9994')}})}}if(ball)dot(X(ball.x),Y(ball.y),'#fff',7);function dot(x,y,c,r){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}function label(t,x,y,c){ctx.fillStyle=c;ctx.font='bold 11px system-ui';ctx.fillText(t,x,y)}}
function drawMissionObjects(g){
  const {X,Y}=g;
  const marker=(x,y,label,color='#ff4f4f')=>{
    ctx.save();
    ctx.shadowBlur=10;ctx.shadowColor=color;
    ctx.strokeStyle=color;ctx.lineWidth=2;
    ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(X(x),Y(y)-28);ctx.lineTo(X(x),Y(y)+28);ctx.stroke();ctx.setLineDash([]);
    ctx.restore();
    ctx.fillStyle='#eef6ff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(label,X(x),Y(y)-36);ctx.textAlign='start';
  };
  if(state.current===1){
    const x=10,y=5,px=X(x),py=Y(y);
    // Flag pole
    ctx.save();
    ctx.strokeStyle='#c7d2df';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px,py+30);ctx.lineTo(px,py-36);ctx.stroke();
    ctx.fillStyle='#ff5d62';ctx.beginPath();ctx.moveTo(px,py-34);ctx.lineTo(px+34,py-24);ctx.lineTo(px,py-12);ctx.closePath();ctx.fill();
    // Target / bullseye
    ctx.shadowBlur=14;ctx.shadowColor='#ff5360';
    ctx.fillStyle='#f4f0df';ctx.beginPath();ctx.arc(px,py,20,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff5a5f';ctx.beginPath();ctx.arc(px,py,14,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f4f0df';ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff5a5f';ctx.beginPath();ctx.arc(px,py,3.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
    marker(x,y,'ALVO • (10, 5)');
  }
  if(state.current===4){
    marker(2,4,'ALVO DO VÉRTICE','#f4bd4f');
    ctx.save();ctx.strokeStyle='#f4bd4f';ctx.lineWidth=3;ctx.beginPath();ctx.arc(X(2),Y(4),17,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  if(state.current===5){
    [2,6].forEach((x,i)=>{marker(x,0,`PORTAL ${i+1}`,'#7fe7ff');ctx.save();ctx.strokeStyle='#7fe7ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(X(x),Y(0),15,0,Math.PI*2);ctx.stroke();ctx.restore();});
  }
  if(state.current===6){
    marker(3,0,'TOQUE ÚNICO','#c28cff');
    ctx.save();ctx.strokeStyle='#c28cff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(X(3),Y(0),15,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  if(state.current===7){
    marker(3,5,'VÉRTICE','#f4bd4f');
    ctx.save();ctx.strokeStyle='#f4bd4f';ctx.lineWidth=3;ctx.beginPath();ctx.arc(X(3),Y(5),15,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#7fe7ff';ctx.beginPath();ctx.arc(X(1),Y(1),11,0,Math.PI*2);ctx.stroke();ctx.restore();
    ctx.fillStyle='#eef6ff';ctx.font='bold 11px system-ui';ctx.fillText('P (1, 1)',X(1)+12,Y(1)-10);
  }
  if(state.current===8){
    marker(2,5,'VÉRTICE','#f4bd4f');
    ctx.save();ctx.strokeStyle='#f4bd4f';ctx.lineWidth=3;ctx.beginPath();ctx.arc(X(2),Y(5),15,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#7fe7ff';ctx.beginPath();ctx.arc(X(0),Y(1),11,0,Math.PI*2);ctx.stroke();ctx.restore();
    ctx.fillStyle='#eef6ff';ctx.font='bold 11px system-ui';ctx.fillText('P (0, 1)',X(0)+12,Y(1)-10);
  }
}

function testTrajectory(){if(anim)return;state.attempts++;if(!state.current){say('No laboratório livre, teste uma hipótese e observe o comportamento.');animate();return}const m=missions.find(x=>x.id===state.current);animate(()=>{const ok=m.check(state);if(ok){complete(state.current);say('Conseguiu. Você não recebeu a resposta: construiu uma solução.');setMood('alegre');$('#nextBtn').disabled=state.current>=missions.length}else{say(failSpeech());setMood('pensativo')}})}
function animate(done){const q=calc();let x=-1.5;const end=12;const step=()=>{x+=.12;if(x>end){anim=null;draw();done&&done();return}let y=q.linear?state.a*x+state.b:state.a*x*x+state.b*x+state.c;draw({x,y});anim=requestAnimationFrame(step)};anim=requestAnimationFrame(step)}
function failSpeech(){const q=calc();if(state.current===1)return q.vy<2?'A trajetória ficou baixa. Experimente pensar na altura em x = 10.':'Quase. Compare a posição do alvo com a trajetória.';if(state.current===5)return q.roots.length===2?'Você já tem duas raízes, mas elas não estão nos portais.':'A trajetória ainda não atravessa o eixo duas vezes.';if(state.current===6)return q.delta>0?'Ainda há duas raízes reais. Procure o caso em que Δ desaparece.':'Observe o discriminante e a posição do toque.';return 'Ainda não. Observe o gráfico e formule outra hipótese antes de tentar novamente.'}
$('#testBtn').onclick=testTrajectory;$('#resetBtn').onclick=()=>resetValues();$('#hintBtn').onclick=()=>{const m=state.current&&missions.find(x=>x.id===state.current);if(!m){$('#hintText').textContent='Escolha uma missão primeiro.';return}let i=+$('#hintBtn').dataset.i||0;if(i>=m.hint.length)i=m.hint.length-1;$('#hintText').textContent=m.hint[i];$('#hintBtn').dataset.i=String(i+1);state.hints++;setMood('explicando')};
$('#nextBtn').onclick=()=>{if(state.current<missions.length)openMission(state.current+1)};
function complete(id){if(state.completed.has(id))return;state.completed.add(id);addXP(100);unlock(id===1?'m1':id===3?'m3':id===6?'m6':id===8?'all':null);renderMissions();renderProgress();$('#nextBtn').disabled=id>=missions.length}
function addXP(n){state.xp+=n;let level=Math.floor(state.xp/100)+1;$('#levelText').textContent='NÍVEL '+level;$('#xpFill').style.width=(state.xp%100)+'%';$('#xpText').textContent=(state.xp%100)+' / 100 XP';renderAchievements()}
function unlock(key){if(key){document.body.dataset[key]='1';renderAchievements()}}
function renderProgress(){const p=$('#progressList');p.innerHTML=missions.map(m=>`<div class="progress-item ${state.completed.has(m.id)?'done':''}"><span>${m.id}. ${m.title}</span><span>${state.completed.has(m.id)?'✓':'○'}</span></div>`).join('')}
function renderAchievements(){const g=$('#achievementGrid');g.innerHTML=achievements.map(a=>{let ok=a[3]==='explore'?state.explorations>0:a[3]==='lab'?$('#lab').classList.contains('active-view'):a[3]==='m1'?state.completed.has(1):a[3]==='m3'?state.completed.size>=3:a[3]==='m6'?state.completed.size>=6:a[3]==='all'?state.completed.size===8:false;return `<article class="achievement ${ok?'':'locked'}"><div class="icon">${a[0]}</div><h3>${a[1]}</h3><p>${a[2]}</p><b>${ok?'DESBLOQUEADA':'BLOQUEADA'}</b></article>`}).join('')}
function say(t){$('#speech').textContent=t;$('#pixText').textContent=state.current?`Missão ${state.current}: observe, formule e teste.`:'Laboratório pronto. Vamos experimentar?'}
function setMood(m){$('#guideMood').textContent=m}
resetValues();renderMissions();renderProgress();renderAchievements();resizeCanvas();
