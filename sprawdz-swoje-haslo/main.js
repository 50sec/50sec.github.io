(() => {
'use strict';


Object.freeze(Object.prototype);
Object.freeze(Array.prototype);
Object.freeze(Function.prototype);

const pwd = document.getElementById('pwd');
const bar = document.getElementById('bar');
const fb  = document.getElementById('fb');
const toggle = document.getElementById('toggle');
const privacy = document.getElementById('privacy');
const modal = document.getElementById('modal');
const close = document.getElementById('close');

const common = ['password','qwerty','admin','welcome','letmein','123456','111111'];

const unique = s => new Set(s).size;

const entropy = p => {
  const u = unique(p);
  if (u <= 1) return 0;
  let pool = 0;
  if (/[a-z]/.test(p)) pool+=26;
  if (/[A-Z]/.test(p)) pool+=26;
  if (/[0-9]/.test(p)) pool+=10;
  if (/[^A-Za-z0-9]/.test(p)) pool+=33;
  return Math.log2(Math.pow(pool*(u/p.length), p.length));
};

const analyze = p => {
  const issues=[];
  if(p.length<12) issues.push("Za krótkie hasło");
  if(unique(p)<p.length/4) issues.push("Powtarzalne znaki");
  if(common.some(w=>p.toLowerCase().includes(w))) issues.push("Popularne słowo");

  const e=Math.round(entropy(p));
  let s=0;
  if(e>=100 && issues.length===0) s=4;
  else if(e>=70) s=3;
  else if(e>=45) s=2;
  else if(p.length>0) s=1;

  return {s,e,issues};
};

const clear = el => { while(el.firstChild) el.removeChild(el.firstChild); };

pwd.addEventListener('input', ()=>{
  clear(fb);
  if(!pwd.value){ bar.style.width='0%'; return; }

  const {s,e,issues}=analyze(pwd.value);

  const widths=['15%','35%','55%','75%','100%'];
  const colors=['#ff6b6b','#ff9f43','#ffd166','#9cffb0','#7cffd6'];
  bar.style.width=widths[s];
  bar.style.background=colors[s];

  const msg=document.createElement('div');
  msg.className=s>=3?'ok':s===2?'warn':'bad';
  const strengthText=['','Słabe','Średnie','Silne','Bardzo silne'];
  msg.textContent=`${strengthText[s]} (~${e} bitów)`;
  fb.appendChild(msg);

  if(issues.length){
    const ul=document.createElement('ul');
    issues.forEach(i=>{
      const li=document.createElement('li');
      li.textContent=i;
      ul.appendChild(li);
    });
    fb.appendChild(ul);
  }
},{passive:true});

toggle.addEventListener('click',()=>{
  pwd.type=pwd.type==='password'?'text':'password';
  toggle.textContent=pwd.type==='password'?'Pokaż hasło':'Ukryj hasło';
});

privacy.addEventListener('click', ()=>{
  modal.style.display='flex';
});

close.addEventListener('click', ()=>{
  modal.style.display='none';
});

window.addEventListener('click', e=>{
  if(e.target===modal) modal.style.display='none';
});
})();
