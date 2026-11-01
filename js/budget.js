export const money = n => `${n.toLocaleString('ko-KR')}원`;
export function localDate(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export const monthOf = date => date.slice(0,7);
export function validDate(s) {
  if(typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y,m,d]=s.split('-').map(Number); const v=new Date(y,m-1,d,12);
  return y>=2000 && y<=9999 && v.getFullYear()===y && v.getMonth()===m-1 && v.getDate()===d;
}
export const validMonth = s => typeof s==='string' && validDate(`${s}-01`);
export function dailyBudget(state, month) {
  const key=Object.keys(state.budgets).filter(k=>k<=month).sort().at(-1);
  return key ? state.budgets[key] : 30000;
}
export function months(state, today=localDate()) {
  const result=[]; let [y,m]=state.startMonth.split('-').map(Number);
  while(`${y}-${String(m).padStart(2,'0')}`<=monthOf(today)) {
    result.push(`${y}-${String(m).padStart(2,'0')}`); if(++m===13){m=1;y++;}
  } return result;
}
export function summary(state, month, today=localDate()) {
  const current=monthOf(today), past=month<current, future=month>current;
  const [y,m]=month.split('-').map(Number);
  const days=future?0:past?new Date(y,m,0).getDate():Number(today.slice(8));
  const records=state.expenses.filter(e=>monthOf(e.date)===month && e.date<=today);
  const spend=records.filter(e=>!e.fixed).reduce((s,e)=>s+e.amount,0);
  const fixed=records.filter(e=>e.fixed).reduce((s,e)=>s+e.amount,0);
  const todaySpend=records.filter(e=>!e.fixed && e.date===today).reduce((s,e)=>s+e.amount,0);
  const allocated=days*dailyBudget(state,month), balance=allocated-spend;
  return {days,spend,fixed,todaySpend,allocated,balance,past,overspend:past?Math.max(0,-balance):0,todayStart:balance+todaySpend};
}

// Legacy fixed records remain stored, but are not surfaced in the current UI.
export function recentExpenses(state,today=localDate(),limit=8){return state.expenses.map((entry,index)=>({entry,index})).filter(({entry})=>!entry.fixed&&entry.date<=today).sort((a,b)=>b.entry.date.localeCompare(a.entry.date)||b.index-a.index).slice(0,limit).map(({entry})=>entry);}
