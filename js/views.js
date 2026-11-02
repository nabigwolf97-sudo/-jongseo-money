import {money,localDate} from './budget.js';
export function el(tag, text, className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
export function button(text,action,className='quiet'){const b=el('button',text,className);b.type='button';b.addEventListener('click',action);return b;}
export function amount(value,className='metric'){const n=el('strong',undefined,className);n.setAttribute('aria-label',money(value));const number=el('span',value.toLocaleString('ko-KR'),'amount-number'),unit=el('span','원','amount-unit');number.setAttribute('aria-hidden','true');unit.setAttribute('aria-hidden','true');n.append(number,unit);return n;}
export function card(label,value,detail='',className=''){const n=el('article',undefined,`card ${className}`);n.append(el('span',label,'muted'),amount(value));if(value<0)n.classList.add('negative');if(detail)n.append(el('p',detail,'hint'));return n;}
export function dateLabel(date,today=localDate()){if(date===today)return '오늘';const [y,m,d]=today.split('-').map(Number);if(date===localDate(new Date(y,m-1,d-1,12)))return '어제';const [year,month,day]=date.split('-').map(Number);return `${year===y?'':year+'년 '}${month}월 ${day}일`;}
export function list(records,edit,remove){
 const box=el('div',undefined,'records');
 if(!records.length){const empty=el('div',undefined,'empty');empty.append(el('span','· · ·','empty-mark'),el('b','아직 기록이 없어요'),el('p','오늘의 작은 지출부터 남겨볼까요?'));box.append(empty);}
 const groups=new Map();const colors={'식비':'#73E5C3','카페·간식':'#D8B4FE','교통':'#93C5FD','쇼핑':'#F9A8D4','문화·여가':'#FCD59A','생활':'#A5B4FC','건강':'#99E2D0','기타':'#A9B4CF'};
 records.forEach(e=>{
  if(!groups.has(e.date)){const section=el('section',undefined,'record-group'),heading=el('h3',undefined,'record-date');heading.append(el('span',dateLabel(e.date)),el('time',e.date));section.append(heading);groups.set(e.date,section);box.append(section);}
  const row=el('article',undefined,'record'),content=el('div',undefined,'record-body'),label=el('b'),dot=el('span',undefined,'category-dot');dot.style.backgroundColor=colors[e.category]||colors['기타'];dot.setAttribute('aria-hidden','true');label.append(dot,el('span',e.category));content.append(label);if(e.memo)content.append(el('small',e.memo));
  const menu=el('details',undefined,'record-menu'),trigger=el('summary','⋯');trigger.setAttribute('aria-label',`${e.date} ${e.category} ${money(e.amount)} 더보기`);trigger.setAttribute('role','button');trigger.setAttribute('aria-haspopup','true');trigger.setAttribute('aria-expanded','false');const actions=el('div',undefined,'record-actions');
  actions.append(button('수정',()=>{menu.open=false;edit(e);}),button('삭제',()=>{menu.open=false;remove(e);},'quiet danger'));menu.append(trigger,actions);menu.addEventListener('toggle',()=>{trigger.setAttribute('aria-expanded',String(menu.open));menu.classList.toggle('opens-up',trigger.getBoundingClientRect().bottom+130>window.innerHeight-96);if(menu.open)box.querySelectorAll('details[open]').forEach(other=>{if(other!==menu)other.open=false;});});
  row.append(content,amount(e.amount,'record-amount'),menu);groups.get(e.date).append(row);
 });return box;
}

document.addEventListener('click',event=>{document.querySelectorAll('.record-menu[open]').forEach(menu=>{if(!menu.contains(event.target))menu.open=false;});});
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.record-menu[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus();});});
