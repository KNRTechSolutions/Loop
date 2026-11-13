const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const L=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},S=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DR=[["Paper & newspaper",14],["Cardboard",10],["Old books",12],["Iron",28],["Steel",35],["Aluminium",105],["Copper",650],["Brass",400],["Plastic",12],["E-waste",20],["Batteries",70],["Old tyres",9]];
const rates=()=>L('lp_rates',DR.map((r,i)=>({id:i+1,name:r[0],price:r[1],unit:'kg'})));
const books=()=>L('lp_books',[]);
const ST=['New','Confirmed','Out for pickup','Completed','Cancelled'];
const R=document.body.dataset.r||'',P=document.body.dataset.p;
if(P&&P[0]=='a'&&P!='a-login'&&!sessionStorage.lp_admin)location.href='login.html';
const pages=[['index','Home'],['services','Services'],['rates','Rates'],['how-it-works','How it works'],['about','About'],['contact','Contact'],['track','Track']];
const hd=$('header');if(hd){const adm=P&&P[0]=='a';
hd.innerHTML='<div class="w"><a class="logo" href="'+(adm?'index.html':'index.html')+'"><b>L</b>oopo'+(adm?' Admin':'')+'</a><nav>'+(adm?(P=='a-login'?'':[['index','Dashboard'],['bookings','Bookings'],['rates','Rates']].map(x=>'<a class="'+(P=='a-'+x[0]?'on':'')+'" href="'+x[0]+'.html">'+x[1]+'</a>').join('')+'<a href="#" id="lo">Logout</a>'):pages.map(x=>'<a class="'+(P==x[0]?'on':'')+'" href="'+R+x[0]+'.html">'+x[1]+'</a>').join('')+'<a class="btn l s" href="'+R+'book.html">Book pickup</a>')+'</nav></div>';
const lo=$('#lo');if(lo)lo.onclick=e=>{e.preventDefault();sessionStorage.removeItem('lp_admin');location.href='login.html'}}
const ft=$('footer');if(ft)ft.innerHTML='<div class="w"><span>© 2026 Loopo · Doorstep scrap pickup</span><span><a href="'+(P&&P[0]=='a'?'login.html':'admin/login.html')+'">Admin</a> · +91 90000 00000 · hello@loopo.example</span></div>';
const cat=n=>n;
if(P=='rates'){const rs=rates();$('#rt').innerHTML=rs.map(r=>'<tr><td>'+esc(r.name)+'</td><td>₹'+esc(r.price)+' / '+esc(r.unit)+'</td></tr>').join('');
$('#cs').innerHTML=rs.map(r=>'<option value="'+r.id+'">'+esc(r.name)+'</option>').join('');
const calc=()=>{const r=rs.find(x=>x.id==$('#cs').value),w=+$('#cw').value||0;$('#cr').textContent='≈ ₹'+Math.round(r.price*w).toLocaleString('en-IN')};$('#cs').onchange=$('#cw').oninput=calc;calc()}
if(P=='book'){const rs=rates();$('#cats').innerHTML=rs.map(r=>'<label><input type="checkbox" value="'+esc(r.name)+'">'+esc(r.name)+'</label>').join('');
$('#dt').min=new Date().toISOString().slice(0,10);
$('#bf').onsubmit=e=>{e.preventDefault();const f=e.target,items=$$('#cats input:checked').map(i=>i.value);if(!items.length)return alert('Select at least one scrap type');
const b={id:'LP'+Date.now().toString(36).toUpperCase(),name:f.name.value,phone:f.phone.value,address:f.address.value,date:f.date.value,slot:f.slot.value,items,kg:f.kg.value,status:'New',at:new Date().toISOString()};
const a=books();a.unshift(b);S('lp_books',a);$('#bf').hidden=true;$('#done').hidden=false;$('#bid').textContent=b.id}}
if(P=='track'){$('#tf').onsubmit=e=>{e.preventDefault();const q=$('#q').value.trim().toUpperCase(),m=books().filter(b=>b.id==q||b.phone==q);
$('#tr').innerHTML=m.length?m.map(b=>'<div class="c" style="margin-bottom:12px"><b>'+esc(b.id)+'</b> <span class="tag">'+esc(b.status)+'</span><p>'+esc(b.items.join(', '))+' · '+esc(b.date)+' · '+esc(b.slot)+'</p></div>').join(''):'<p>No booking found. Check your ID or phone.</p>'}}
if(P=='a-login'){$('#lf').onsubmit=e=>{e.preventDefault();if($('#u').value=='admin'&&$('#p').value=='loopo123'){sessionStorage.lp_admin=1;location.href='index.html'}else $('#er').textContent='Wrong username or password'}}
if(P=='a-index'){const b=books(),n=s=>b.filter(x=>x.status==s).length;
$('#st').innerHTML=[['Total',b.length],['New',n('New')],['Active',n('Confirmed')+n('Out for pickup')],['Completed',n('Completed')]].map(x=>'<div class="c"><p>'+x[0]+'</p><div class="n">'+x[1]+'</div></div>').join('');
$('#rc').innerHTML=b.slice(0,5).map(x=>'<tr><td>'+esc(x.id)+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.date)+'</td><td><span class="tag">'+esc(x.status)+'</span></td></tr>').join('')||'<tr><td colspan=4>No bookings yet</td></tr>'}
if(P=='a-bookings'){const draw=()=>{const q=$('#fq').value.toLowerCase(),b=books();
$('#bt').innerHTML=b.filter(x=>(x.id+x.name+x.phone+x.status).toLowerCase().includes(q)).map(x=>'<tr><td>'+esc(x.id)+'</td><td>'+esc(x.name)+'<br><small>'+esc(x.phone)+'</small></td><td>'+esc(x.address)+'</td><td>'+esc(x.items.join(', '))+' ('+esc(x.kg||'?')+' kg)</td><td>'+esc(x.date)+'<br><small>'+esc(x.slot)+'</small></td><td><select data-i="'+esc(x.id)+'">'+ST.map(s=>'<option'+(s==x.status?' selected':'')+'>'+s+'</option>').join('')+'</select></td><td><button class="btn d s" data-d="'+esc(x.id)+'">✕</button></td></tr>').join('')||'<tr><td colspan=7>No bookings</td></tr>'};
$('#fq').oninput=draw;draw();
$('#bt').onchange=e=>{const a=books(),x=a.find(y=>y.id==e.target.dataset.i);if(x){x.status=e.target.value;S('lp_books',a)}};
$('#bt').onclick=e=>{const id=e.target.dataset.d;if(id&&confirm('Delete booking?')){S('lp_books',books().filter(y=>y.id!=id));draw()}}}
if(P=='a-rates'){let rs=rates();const draw=()=>{$('#at').innerHTML=rs.map((r,i)=>'<tr><td><input data-i="'+i+'" data-k="name" value="'+esc(r.name)+'"></td><td><input type="number" min="0" data-i="'+i+'" data-k="price" value="'+esc(r.price)+'"></td><td><input data-i="'+i+'" data-k="unit" value="'+esc(r.unit)+'" size="5"></td><td><button class="btn d s" data-d="'+i+'">✕</button></td></tr>').join('')};draw();
$('#at').oninput=e=>{const d=e.target.dataset;if(d.k)rs[d.i][d.k]=e.target.value};
$('#at').onclick=e=>{if(e.target.dataset.d!==undefined){rs.splice(e.target.dataset.d,1);draw()}};
$('#add').onclick=()=>{rs.push({id:Date.now(),name:'New item',price:0,unit:'kg'});draw()};
$('#sv').onclick=()=>{S('lp_rates',rs);$('#ok').textContent='Saved ✓'}}