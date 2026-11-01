import {money} from './budget.js';
export function el(tag, text, className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
export function button(text,action,className='quiet'){const b=el('button',text,className);b.type='button';b.addEventListener('click',action);return b;}
export function card(label,value,detail='',className=''){const n=el('article',undefined,`card ${className}`);n.append(el('span',label,'muted'),el('strong',money(value),'metric'));if(detail)n.append(el('p',detail,'hint'));return n;}
export function list(records,edit,remove){const box=el('div',undefined,'records');if(!records.length)box.append(el('p','아직 기록이 없어요. 첫 지출을 기록해 보세요.','empty'));
  records.forEach(e=>{const row=el('article',undefined,'record');const icon=el('span',e.fixed?'▣':'↗','record-icon');const content=el('div',undefined,'record-body');content.append(el('b',e.category+(e.fixed?' · 고정비':'')),el('small',e.date+(e.memo?' · '+e.memo:'')));const actions=el('div',undefined,'record-actions');const editButton=button('수정',()=>edit(e));editButton.setAttribute('aria-label',`${e.date} ${e.category} ${money(e.amount)} 수정`);const deleteButton=button('삭제',()=>remove(e),'quiet danger');actions.append(editButton,deleteButton);row.append(icon,content,el('strong',money(e.amount)),actions);box.append(row);});return box;
}
