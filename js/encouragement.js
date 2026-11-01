export function encouragement(balance,todaySpend,daily){
  if(balance<0)return '종서야, 잠깐 숨 고르자. 내일은 조금 더 가볍게 써보자.';
  if(balance===0)return '오늘 예산은 딱 여기까지. 잘 기록했어, 종서야.';
  if(balance<daily*0.25)return '종서야, 오늘은 조금만 아껴보자. 작은 선택이면 충분해.';
  if(todaySpend===0)return '아직 쓰지 않은 오늘의 가능성. 좋은 출발이야, 종서야.';
  return '잘하고 있어, 종서야. 오늘의 작은 여유를 지켜보자.';
}
