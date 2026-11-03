import {localDate, monthOf, validDate, validMonth} from './budget.js';
export const KEY='money-save-v1';
export const categories=['식비','카페·간식','교통','쇼핑','문화·여가','생활','건강','기타'];
const amount=n=>Number.isSafeInteger(n)&&n>0&&n<=100000000;
export function initial(today=localDate()) {const month=monthOf(today); return {version:1,startMonth:month,budgets:{[month]:30000},expenses:[],savings:{},wishes:[],lastCategory:'식비',lastBackup:null};}
export function validate(s,today=localDate()) {
  const fail=()=>{throw new Error('백업 데이터의 형식, 날짜 또는 금액이 올바르지 않습니다.');};
  if(!s||s.version!==1||!validMonth(s.startMonth)||s.startMonth>monthOf(today)||!s.budgets||typeof s.budgets!=='object'||Array.isArray(s.budgets)||!Array.isArray(s.expenses)||s.expenses.length>100000||!s.savings||typeof s.savings!=='object'||Array.isArray(s.savings)) fail();
  const clean=initial(today);clean.startMonth=s.startMonth;clean.budgets={};
  for(const [m,n] of Object.entries(s.budgets)){if(!validMonth(m)||!amount(n))fail();clean.budgets[m]=n;}
  if(!Object.keys(clean.budgets).some(m=>m<=s.startMonth))fail();
  const ids=new Set();
  clean.expenses=s.expenses.map(e=>{
    if(!e||typeof e.id!=='string'||e.id.length>100||ids.has(e.id)||!amount(e.amount)||!validDate(e.date)||e.date>today||monthOf(e.date)<s.startMonth||!categories.includes(e.category)||typeof e.memo!=='string'||e.memo.length>300||typeof e.fixed!=='boolean')fail();
    ids.add(e.id);return {id:e.id,amount:e.amount,date:e.date,category:e.category,memo:e.memo,fixed:e.fixed};
  });
  for(const [m,v] of Object.entries(s.savings)){
    if(!validMonth(m)||m<s.startMonth||m>=monthOf(today)||!v||!amount(v.amount)||!validDate(v.date)||v.date>today)fail();
    clean.savings[m]={amount:v.amount,date:v.date};
  }
  if(s.wishes!==undefined&&(!Array.isArray(s.wishes)||s.wishes.length>10000))fail();
  const wishIds=new Set();clean.wishes=(s.wishes||[]).map(w=>{
    if(!w||typeof w.id!=='string'||!w.id||w.id.length>100||wishIds.has(w.id)||typeof w.title!=='string'||!w.title.trim()||w.title.length>80||!amount(w.amount)||!validDate(w.date)||w.date>today||typeof w.memo!=='string'||w.memo.length>300||!['want','skipped','bought'].includes(w.status))fail();
    if(w.status==='want'?w.resolvedDate!==null:!validDate(w.resolvedDate)||w.resolvedDate<w.date||w.resolvedDate>today)fail();
    wishIds.add(w.id);return {id:w.id,title:w.title,amount:w.amount,date:w.date,memo:w.memo,status:w.status,resolvedDate:w.resolvedDate};
  });
  clean.lastCategory=categories.includes(s.lastCategory)?s.lastCategory:'식비';
  if(s.lastBackup!==null && (typeof s.lastBackup!=='string'||!Number.isFinite(Date.parse(s.lastBackup))))fail();
  clean.lastBackup=s.lastBackup;return clean;
}
export function load(){const raw=localStorage.getItem(KEY);return raw?validate(JSON.parse(raw)):initial();}
export function save(s){const previous=localStorage.getItem(KEY);let old;try{old=previous?JSON.parse(previous):null;}catch{old=null;}if(previous&&(!old||!Object.hasOwn(old,'wishes'))&&!localStorage.getItem(KEY+'-before-wishes'))localStorage.setItem(KEY+'-before-wishes',previous);localStorage.setItem(KEY,JSON.stringify(s));}
