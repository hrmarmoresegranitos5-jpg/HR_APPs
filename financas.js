// ═══ FINANÇAS ═══
function openFin(t){fType=t;document.querySelectorAll('.ts').forEach(function(o){o.classList.toggle('on',o.dataset.ftp===t);});var fd=document.getElementById('fData');if(fd&&!fd.value)fd.value=td();showMd('finMd');}
function setFT(t){fType=t;document.querySelectorAll('[data-ftp]').forEach(function(o){o.classList.toggle('on',o.dataset.ftp===t);});}
function addTr(type,desc,value){DB.t.unshift({id:Date.now(),type:type,desc:desc,value:value,date:td()});DB.sv();renderFin();}
function saveFin(){var desc=document.getElementById('fDesc').value.trim(),val=+document.getElementById('fVal').value||0,date=document.getElementById('fData').value;if(!desc){toast('Preencha a descrição');return;}DB.t.unshift({id:Date.now(),type:fType,desc:desc,value:val,date:date});DB.sv();renderFin();closeAll();document.getElementById('fDesc').value='';document.getElementById('fVal').value='';toast('✓ Lançado!');}
function openEditTr(id){
  editTrId=+id;
  var t=DB.t.find(function(x){return x.id===editTrId;});if(!t)return;
  document.getElementById('teDesc').value=t.desc||'';
  document.getElementById('teVal').value=t.value||'';
  document.getElementById('teData').value=t.date||td();
  document.querySelectorAll('[data-tet]').forEach(function(o){o.classList.toggle('on',o.dataset.tet===t.type);});
  showMd('trEdMd');
}
function setTET(tp){document.querySelectorAll('[data-tet]').forEach(function(o){o.classList.toggle('on',o.dataset.tet===tp);});}
function saveTrEdit(){
  var t=DB.t.find(function(x){return x.id==editTrId;});if(!t)return;
  var tp=document.querySelector('[data-tet].on');
  t.type=tp?tp.dataset.tet:t.type;
  t.desc=document.getElementById('teDesc').value.trim()||t.desc;
  t.value=+document.getElementById('teVal').value||t.value;
  t.date=document.getElementById('teData').value||t.date;
  DB.sv();renderFin();closeAll();toast('✓ Atualizado!');
}
function delTr(){if(!confirm('Excluir lançamento?'))return;DB.t=DB.t.filter(function(x){return x.id!=editTrId;});DB.sv();renderFin();closeAll();toast('✓ Excluído!');}
function renderFin(){
  if(!DB.t)DB.t=[];if(!DB.j)DB.j=[];
  var inT=DB.t.filter(function(t){return t.type==='in';}).reduce(function(s,t){return s+(t.value||0);},0);
  var outT=DB.t.filter(function(t){return t.type==='out';}).reduce(function(s,t){return s+(t.value||0);},0);
  var pendT=DB.t.filter(function(t){return t.type==='pend';}).reduce(function(s,t){return s+(t.value||0);},0);
  var bal=inT-outT;

  // — Saldo hero —
  var fs=document.getElementById('finSaldo');
  if(fs){fs.textContent='R$ '+fm(bal);fs.className='finval '+(bal>=0?'pos':'neg');}
  var fsub=document.getElementById('finSub');
  if(fsub)fsub.textContent=pendT>0?'R$ '+fm(pendT)+' ainda a receber':'Tudo em dia ✔';

  // — Badges hero —
  var fb=document.getElementById('finBadges');
  if(fb){
    var bh='';
    if(inT>0)bh+='<span style="background:rgba(58,158,106,.18);border:1px solid rgba(76,218,128,.35);border-radius:20px;padding:3px 10px;font-size:.6rem;color:#4cda80;font-weight:700;">+R$ '+fm(inT)+'</span>';
    if(outT>0)bh+='<span style="background:rgba(201,68,68,.12);border:1px solid rgba(224,112,112,.3);border-radius:20px;padding:3px 10px;font-size:.6rem;color:#e07070;font-weight:700;">-R$ '+fm(outT)+'</span>';
    if(pendT>0)bh+='<span style="background:rgba(74,128,181,.14);border:1px solid rgba(122,176,222,.32);border-radius:20px;padding:3px 10px;font-size:.6rem;color:#7ab0de;font-weight:700;">⏳ R$ '+fm(pendT)+'</span>';
    fb.innerHTML=bh;
  }

  // — Cards resumo —
  var fc=document.getElementById('finCards');
  if(fc){fc.innerHTML=
    '<div style="background:linear-gradient(135deg,rgba(58,158,106,.16),rgba(58,158,106,.04));border:1px solid rgba(76,218,128,.28);border-radius:13px;padding:11px 8px;text-align:center;">'
      +'<div style="font-size:.48rem;letter-spacing:1.8px;text-transform:uppercase;color:rgba(76,218,128,.55);margin-bottom:4px;">Entradas</div>'
      +'<div style="font-size:.88rem;font-weight:900;color:#4cda80;font-family:\'Cormorant Garamond\',serif;">R$ '+fm(inT)+'</div>'
    +'</div>'
    +'<div style="background:linear-gradient(135deg,rgba(201,68,68,.13),rgba(201,68,68,.03));border:1px solid rgba(224,112,112,.26);border-radius:13px;padding:11px 8px;text-align:center;">'
      +'<div style="font-size:.48rem;letter-spacing:1.8px;text-transform:uppercase;color:rgba(224,112,112,.55);margin-bottom:4px;">Saídas</div>'
      +'<div style="font-size:.88rem;font-weight:900;color:#e07070;font-family:\'Cormorant Garamond\',serif;">R$ '+fm(outT)+'</div>'
    +'</div>'
    +'<div style="background:linear-gradient(135deg,rgba(74,128,181,.13),rgba(74,128,181,.03));border:1px solid rgba(122,176,222,.26);border-radius:13px;padding:11px 8px;text-align:center;">'
      +'<div style="font-size:.48rem;letter-spacing:1.8px;text-transform:uppercase;color:rgba(122,176,222,.55);margin-bottom:4px;">A Receber</div>'
      +'<div style="font-size:.88rem;font-weight:900;color:#7ab0de;font-family:\'Cormorant Garamond\',serif;">R$ '+fm(pendT)+'</div>'
    +'</div>';
  }

  // — Painel Serviços dos Clientes —
  var fsrv=document.getElementById('finServicos');
  if(fsrv){
    var qs=DB.q||[];
    // Agrupar por qid
    var grp={};
    DB.t.forEach(function(t){
      if(!t.qid)return;
      if(!grp[t.qid]){grp[t.qid]={recebido:0,pendente:0};}
      if(t.type==='in')grp[t.qid].recebido+=(t.value||0);
      if(t.type==='pend')grp[t.qid].pendente+=(t.value||0);
    });
    var qids=Object.keys(grp);
    if(!qids.length){
      fsrv.innerHTML='<div style="text-align:center;padding:14px 0 6px;font-size:.74rem;color:var(--t3);">Nenhum serviço vinculado ainda.<br><span style="font-size:.65rem;color:var(--t4);">No Histórico, toque 💰 para vincular.</span></div>';
    } else {
      var sh='';
      qids.forEach(function(qid){
        var q=qs.find(function(x){return String(x.id)===String(qid);})||{};
        var g=grp[qid];
        var total=(q.vista||0)||(g.recebido+g.pendente);
        var pct=total>0?Math.min(100,Math.round((g.recebido/total)*100)):0;
        var fechado=q.status==='fechado';
        var corStatus=fechado?'#4cda80':'var(--gold2)';
        var lblStatus=fechado?'✔ Fechado':'🔧 Em andamento';
        // descrição do serviço
        var descSrv='';
        if(q.desc)descSrv=q.desc;
        else{
          var p=[];
          if(q.tipo)p.push(q.tipo);
          if(q.mat)p.push(q.mat);
          if(q.m2)p.push(fm(q.m2)+' m²');
          if(q.acN&&q.acN.length)p.push(q.acN.slice(0,2).join(', '));
          descSrv=p.join(' · ');
        }
        sh+='<div style="background:linear-gradient(135deg,var(--s2),rgba(22,22,30,1));border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:13px 14px;margin-bottom:9px;box-shadow:0 3px 16px rgba(0,0,0,.4);">';
        // topo: nome + badge status
        sh+='<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:5px;">';
        sh+='<div style="font-size:.84rem;font-weight:800;color:var(--tx);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+(q.cli||'Cliente')+'</div>';
        sh+='<span style="flex-shrink:0;margin-left:8px;font-size:.56rem;font-weight:700;color:'+corStatus+';background:rgba(0,0,0,.35);border:1px solid '+corStatus+';border-radius:10px;padding:2px 8px;white-space:nowrap;">'+lblStatus+'</span>';
        sh+='</div>';
        // descrição
        if(descSrv)sh+='<div style="font-size:.68rem;color:var(--t3);margin-bottom:9px;line-height:1.55;">'+escH(descSrv)+'</div>';
        // barra de progresso
        sh+='<div style="background:rgba(255,255,255,.07);border-radius:6px;height:4px;margin-bottom:7px;overflow:hidden;">';
        sh+='<div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#4cda80,#C9A84C);border-radius:6px;transition:width .5s ease;"></div>';
        sh+='</div>';
        // valores linha
        sh+='<div style="display:flex;justify-content:space-between;align-items:center;">';
        sh+='<span style="font-size:.66rem;color:#4cda80;font-weight:700;">✔ R$ '+fm(g.recebido)+'</span>';
        sh+='<span style="font-size:.6rem;color:var(--t4);">'+pct+'% recebido</span>';
        sh+='<span style="font-size:.66rem;color:#7ab0de;">⏳ R$ '+fm(g.pendente)+'</span>';
        sh+='</div>';
        sh+='</div>';
      });
      fsrv.innerHTML=sh;
    }
  }

  // — Movimentações —
  var items=DB.t.slice(0,60),h='';
  if(items.length){
    items.forEach(function(t){
      var ic=t.type==='in'?'📈':t.type==='out'?'📉':t.type==='note'?'📝':'⏳';
      var sign=t.type==='in'?'+':t.type==='out'?'-':'';
      var valStr=t.value?'R$ '+fm(t.value):'';
      var bg=t.type==='in'?'rgba(58,158,106,.06)':t.type==='out'?'rgba(201,68,68,.06)':t.type==='pend'?'rgba(74,128,181,.06)':'transparent';
      var bord=t.type==='in'?'rgba(76,218,128,.18)':t.type==='out'?'rgba(224,112,112,.18)':t.type==='pend'?'rgba(122,176,222,.18)':'rgba(255,255,255,.05)';
      // descrição do orçamento vinculado
      var xDesc='';
      if(t.qid){
        var qr=(DB.q||[]).find(function(x){return String(x.id)===String(t.qid);});
        if(qr){
          var xp=[];
          if(qr.mat)xp.push(qr.mat);
          if(qr.m2)xp.push(fm(qr.m2)+' m²');
          if(qr.desc)xp=[qr.desc];
          if(xp.length)xDesc='<div style="font-size:.6rem;color:var(--t4);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+escH(xp.join(' · '))+'</div>';
        }
      }
      h+='<div class="trrow" style="background:'+bg+';border:1px solid '+bord+';border-radius:10px;margin-bottom:5px;">'
        +'<div class="trdot '+t.type+'">'+ic+'</div>'
        +'<div style="flex:1;min-width:0;">'
          +'<div class="trnm">'+escH(t.desc)+'</div>'
          +xDesc
          +'<div class="trdt">'+(t.date?fd(t.date):'')+'</div>'
        +'</div>'
        +'<div class="trv '+t.type+'">'+sign+valStr+'</div>'
        +'<button class="tredt" data-edittr="'+t.id+'">✏️</button>'
      +'</div>';
    });
  } else {h='<div style="padding:18px;text-align:center;color:var(--t3);font-size:.8rem;">Nenhuma movimentação</div>';}
  var tl=document.getElementById('trList');
  if(tl)tl.innerHTML=h;
}
function renderFixos(){
  var tot=0,h='';
  CFG.fixos.forEach(function(f){tot+=f.v;h+='<div class="rrow2" style="padding:9px 0;border-bottom:1px solid #0c0c10;display:flex;justify-content:space-between;"><span style="font-size:.79rem;color:var(--t3);">'+f.n+'</span><span style="font-size:.8rem;font-weight:600;">R$ '+fm(f.v)+'</span></div>';});
  h+='<div style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0 0;margin-top:4px;border-top:1px solid var(--bd2);"><span style="font-size:.88rem;font-weight:700;">Total Mensal</span><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.4rem;color:var(--gold2);font-weight:700;">R$ '+fm(tot)+'</span></div>';
  document.getElementById('fixosCard').innerHTML=h;
}

