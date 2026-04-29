// ═══ UTILS ═══
function fm(v){return parseFloat(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});}
function fd(s){try{var p=s.split('-');return p[2]+'/'+p[1]+'/'+p[0];}catch(e){return s||'';}}
function dDiff(s){try{var t=new Date(s+'T00:00:00');var n=new Date();n.setHours(0,0,0,0);return Math.ceil((t-n)/86400000);}catch(e){return 0;}}
function addD(s,n){try{var d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return d.toISOString().split('T')[0];}catch(e){return s;}}
function td(){return new Date().toISOString().split('T')[0];}
function lastEnd(){var a=DB.j.filter(function(j){return !j.done&&j.end;}).sort(function(a,b){return new Date(b.end)-new Date(a.end);});return a.length?a[0].end:null;}
// ═══════════════════════════════════════════════
// ORÇAMENTOS HISTÓRICO
// ═══════════════════════════════════════════════

var _orcFilter = '';

function renderOrc() {
  // Summary cards
  var total = DB.q.length;
  var totalVista = DB.q.reduce(function(s,q){return s+(q.vista||0);},0);
  var thisMonth = (new Date()).toISOString().slice(0,7);
  var mesCount = DB.q.filter(function(q){return (q.date||'').slice(0,7)===thisMonth;}).length;
  var sumEl = document.getElementById('orcSummary');
  if(sumEl) sumEl.innerHTML =
    '<div class="orc-sum-card"><div class="orc-sum-v">'+total+'</div><div class="orc-sum-l">Total</div></div>' +
    '<div class="orc-sum-card"><div class="orc-sum-v">'+mesCount+'</div><div class="orc-sum-l">Este mês</div></div>' +
    '<div class="orc-sum-card"><div class="orc-sum-v">R$ '+(totalVista/1000).toFixed(0)+'k</div><div class="orc-sum-l">Em orçamentos</div></div>';
  filterOrc();
}

function filterOrc() {
  _orcFilter = (document.getElementById('orcSearch')||{value:''}).value.trim().toLowerCase();
  var filtered = _orcFilter
    ? DB.q.filter(function(q){ return (q.cli||'').toLowerCase().indexOf(_orcFilter) >= 0; })
    : DB.q;
  buildOrcList(filtered);
}

function buildOrcList(list) {
  var el = document.getElementById('orcList');
  if(!el) return;
  if(!list.length) {
    el.innerHTML = '<div class="orc-empty"><div class="orc-empty-icon">📋</div>' +
      (_orcFilter ? 'Nenhum orçamento para "'+_orcFilter+'"' : 'Nenhum orçamento ainda.<br>Faça um orçamento para começar!') + '</div>';
    return;
  }
  var tipo_icons = {Cozinha:'🍳',Banheiro:'🚿',Lavabo:'🪴',Soleira:'🚪',Peitoril:'🏠',Escada:'📐',Fachada:'🏛️',Outro:'📦'};
  var h = '';
  list.forEach(function(q,idx) {
    var icon = tipo_icons[q.tipo]||'📦';
    var dateStr = q.date ? fd(q.date) : '';
    var pdsCount = (q.pds||[]).length + (q.sfPcs||[]).length;
    h += '<div class="qcard" id="qc-'+q.id+'" onclick="togQCard(\''+q.id+'\')">';
    // Head
    h += '<div class="qcard-head">';
    h +=   '<div class="qcard-badge">'+icon+'</div>';
    h +=   '<div class="qcard-info">';
    h +=     '<div class="qcard-cli" onclick="orcIrFinancas('+q.id+',event)" style="cursor:pointer;" title="Ver nas Finanças">'+escH(q.cli)+'<span style="font-size:.52rem;color:var(--gold);opacity:.7;margin-left:5px;">💰</span></div>';
    h +=     '<div class="qcard-meta">'+dateStr+' · '+q.tipo+' · '+escH(q.mat||'')+'</div>';
    h +=   '</div>';
    h +=   '<div class="qcard-val">R$ '+fm(q.vista)+'</div>';
    h +=   '<span class="qcard-chev">▼</span>';
    h += '</div>';
    // Body (hidden until expanded)
    h += '<div class="qcard-body">';
    // Pills
    h += '<div class="qcard-pills">';
    if(q.m2) h += '<div class="qpill gold">'+q.m2.toFixed(3)+' m²</div>';
    if(pdsCount) h += '<div class="qpill">'+pdsCount+' peça'+(pdsCount>1?'s':'')+'</div>';
    if(q.mat) h += '<div class="qpill">'+escH(q.mat)+'</div>';
    if(q.tel) h += '<div class="qpill">'+escH(q.tel)+'</div>';
    h += '</div>';
    // Detail table
    h += '<div class="qcard-detail">';
    if(q.pds&&q.pds.length) {
      q.pds.forEach(function(p){
        h += '<div class="qdr"><span class="k">'+escH(p.desc||'Peça')+'</span><span class="v">'+p.w+'×'+p.h+'cm'+(p.q>1?' ×'+p.q:'')+'</span></div>';
      });
    }
    if(q.sfPcs&&q.sfPcs.length) {
      q.sfPcs.forEach(function(p){
        h += '<div class="qdr"><span class="k">'+escH(p.l||'Sainha/Frontão')+'</span><span class="v">'+p.w+'ml×'+p.h+'cm'+(p.q>1?' ×'+p.q:'')+'</span></div>';
      });
    }
    if(q.acN&&q.acN.length) {
      h += '<div class="qdr"><span class="k">Serviços incluso</span><span class="v" style="font-size:.68rem;text-align:right;max-width:180px;">'+q.acN.join(', ')+'</span></div>';
    }
    if(q.cidade) h += '<div class="qdr"><span class="k">Cidade</span><span class="v">'+escH(q.cidade)+'</span></div>';
    if(q.end) h += '<div class="qdr"><span class="k">Endereço</span><span class="v" style="font-size:.72rem;text-align:right;max-width:180px;">'+escH(q.end)+'</span></div>';
    if(q.obs) h += '<div class="qdr"><span class="k">Obs.</span><span class="v grn" style="font-size:.72rem;max-width:180px;text-align:right;">'+escH(q.obs)+'</span></div>';
    h += '</div>';
    // Totals
    h += '<div class="qcard-total"><span class="k">À Vista (melhor)</span><span class="v">R$ '+fm(q.vista)+'</span></div>';
    // Buttons
    h += '<div class="qcard-btns">';
    h += '<button class="btn btn-g" onclick="orcEditar(\''+q.id+'\',event)">✏️ Editar</button>';
    h += '<button class="btn btn-o" onclick="orcCopiar(\''+q.id+'\',event)">📋 Copiar</button>';
    h += '<button class="btn btn-o" onclick="orcPDF(\''+q.id+'\',event)">📄 PDF</button>';
    h += '<button class="btn btn-contrato" data-cid="'+q.id+'" onclick="gerarContrId(this,event)">📜 Contrato</button>';
    if(q.status==='fechado'){
      h += '<span style="font-size:.7rem;color:#4caf70;font-weight:700;padding:9px 8px;border:1px solid #1a5030;border-radius:10px;background:rgba(76,175,112,.08);white-space:nowrap;">✔ Fechado</span>';
    }else{
      h += '<button class="btn" onclick="fecharServico(\''+q.id+'\',event)" style="background:linear-gradient(135deg,#071a0f,#0a2515);color:#4caf70;border:1px solid #1a5030;font-size:.78rem;font-weight:700;padding:9px 13px;border-radius:10px;cursor:pointer;font-family:Outfit,sans-serif;white-space:nowrap;">✅ Fechar</button>';
    }
    h += '<button class="btn btn-red" onclick="orcDel(\''+q.id+'\',event)">🗑</button>';
    h += '</div>';
    h += '</div>'; // qcard-body
    h += '</div>'; // qcard
  });
  el.innerHTML = h;
}

function togQCard(id) {
  var el = document.getElementById('qc-'+id);
  if(el) el.classList.toggle('open');
}

function orcEditar(id, e){orcRefazer(id,e);}

function orcRefazer(id, e) {
  e.stopPropagation();
  var q = DB.q.find(function(x){return x.id==id;});
  if(!q) return;

  // Preencher dados do cliente
  var cliEl=document.getElementById('oCliente'); if(cliEl)cliEl.value=q.cli||'';
  var telEl=document.getElementById('oTel'); if(telEl)telEl.value=q.tel||'';
  var cidEl=document.getElementById('oCidade'); if(cidEl)cidEl.value=q.cidade||'';
  var endEl=document.getElementById('oEnd'); if(endEl)endEl.value=q.end||'';
  var obsEl=document.getElementById('oObs'); if(obsEl)obsEl.value=q.obs||'';

  // Selecionar material
  var mat=CFG.stones.find(function(s){return s.nm===q.mat;});
  if(mat){selMat=mat.id;buildMat();}

  // Reconstruir ambientes
  ambientes=[];

  if(q.ambSnap&&q.ambSnap.length){
    // Orçamento novo: tem snapshot completo dos ambientes
    q.ambSnap.forEach(function(snap,idx){
      var ambId=Date.now()+idx;
      ambientes.push({
        id:ambId,
        tipo:snap.tipo||'Cozinha',
        pecas:snap.pecas.map(function(p){return {id:Date.now()+Math.random(),desc:p.desc||'',w:p.w||0,h:p.h||0,q:p.q||1};}) ,
        selCuba:snap.selCuba||null,
        svState:JSON.parse(JSON.stringify(snap.svState||{})),
        acState:JSON.parse(JSON.stringify(snap.acState||{}))
      });
    });
  } else {
    // Orçamento antigo: reconstruir do que temos
    var tipos=(q.tipo||'Cozinha').split('+');
    tipos.forEach(function(tipo,idx){
      tipo=tipo.trim();
      var ambId=Date.now()+idx;
      var pecas=[];
      if(idx===0&&q.pds&&q.pds.length){
        q.pds.forEach(function(p){
          pecas.push({id:Date.now()+Math.random(),desc:p.desc||'',w:p.w||0,h:p.h||0,q:p.q||1});
        });
      } else {
        pecas.push({id:Date.now()+Math.random(),desc:'',w:0,h:0,q:1});
      }
      ambientes.push({id:ambId,tipo:tipo,pecas:pecas,selCuba:null,svState:{},acState:{}});
    });
  }

  if(!ambientes.length)addAmbiente();

  renderAmbientes();
  go(0);
  setTimeout(function(){document.getElementById('pg0').scrollTop=0;},100);
  toast('✓ Orçamento carregado! Edite e recalcule.');
}

function orcCopiar(id, e) {
  e.stopPropagation();
  var q = DB.q.find(function(x){return x.id==id;});
  if(!q) return;
  var pTxt = (q.pds||[]).map(function(p){return '• '+(p.desc||'Peça')+' — '+p.w+'×'+p.h+'cm'+(p.q>1?' ×'+p.q:'');}).join('\n');
  if(q.sfPcs&&q.sfPcs.length) pTxt += '\n'+(q.sfPcs||[]).map(function(p){return '• '+p.l+' — '+p.w+'ml×'+p.h+'cm'+(p.q>1?' ×'+p.q:'');}).join('\n');
  var aTxt = (q.acN&&q.acN.length) ? (q.acN||[]).map(function(a){return '• '+a;}).join('\n') : '• Acabamento profissional';
  var txt = 'HR MARMORES E GRANITOS\nORCAMENTO — '+(q.cli||'Cliente')+'\n\nMaterial: '+(q.mat||'')+'\n\n'+(q.tipo||'Projeto')+':\n'+pTxt+'\n\nIncluso:\n'+aTxt+'\n• Fabricacao e acabamento completo\n\n==================\nPARCELADO\nR$ '+fm(q.parc)+' — ate 8x de R$ '+fm(q.p8||0)+'\n\nA VISTA\nR$ '+fm(q.vista)+'\n==================\n'+CFG.emp.nome+'\n'+CFG.emp.tel;
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).then(function(){toast('✓ Copiado!');}).catch(function(){_copiarFallback(txt);});return;}
  _copiarFallback(txt);
}




function orcPDF(id, e) {
  e.stopPropagation();
  var q = DB.q.find(function(x){return x.id==id;});
  if(!q) return;
  pendQ = q;
  gerarPDF();
}

function orcDel(id, e) {
  if(e){e.stopPropagation();e.preventDefault();}
  var q = DB.q.find(function(x){return x.id==id;});
  if(!q) return;
  // confirm() não funciona em PWA — executa direto com desfazer via toast
  var bk=JSON.stringify(DB.q);
  DB.q = DB.q.filter(function(x){return x.id!=id;});
  DB.sv(); renderOrc();
  toast('🗑 Excluído — '+escH(q.cli||''));
}

