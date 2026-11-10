'use strict';

const PLAN_LABELS = {A:'A 게로 온천', B:'B 나바나노사토'};
const SUNDAY = 3;
const BOOKING = ITINERARY_SOURCE.bookingLinks;
const RAIL = 'https://railway.jr-central.co.jp/ticketless/index.html';
const BOOKING_RULES = {
 f06:{id:'ramuchi',modes:['phone','walk'],name:'쿠로부타야 라무치',time:'11:00',requirement:'방문 전 전화 확인',links:[['매장 전화','tel:+81522411664']]},
 f22:{id:'mutsumi',modes:['web','phone'],name:'테바사키 무츠미 본점',time:'17:30',requirement:'예약 권장',links:[['예약 안내','https://tabelog.com/aichi/A2301/A230103/23079119/'],['매장 전화','tel:+81526845577']]},
 s05:{id:'sushi-lunch',modes:['phone'],name:'야나기바시 키타로 장내점 · 점심',time:'11:30',requirement:'사전 전화 확인 권장',links:[['장내점 공식 안내',BOOKING.kitaro],['매장 전화','tel:+81524332004']]},
 s24:{id:'ibushigin',modes:['web','phone'],name:'로바타야키 이부시긴 후시미점',time:'18:40',requirement:'예약 권장',links:[['공식 웹 예약 안내',BOOKING.ibushigin],['매장 전화','tel:+81522049889']]},
 'd4-train':{id:'hida-outbound',name:'특급 히다 3호 · 나고야 → 게로',time:'08:43',requirement:'승차권·특급권 준비 / 지정석 권장',links:[['JR 지정석 안내',RAIL]]},
 'd4-bath':{id:'ogawaya-ruri',name:'오가와야 별관 유라기 · 루리(瑠璃)',time:'12:30',requirement:'사전 예약 필요',links:[['루리 예약',BOOKING.ogawaya_yuragi_ruri],['카스미 대안',BOOKING.ogawaya_yuragi_kasumi],['시설 안내','https://www.gero-ogawaya.net/how_to_spend/daytrip/'],['시설 전화','tel:+81576252118']]},
 'd4-return':{id:'hida-return',name:'특급 히다 14호 · 게로 → JR 나고야',time:'15:32',requirement:'승차권·특급권 준비 / 지정석 권장',links:[['JR 지정석 안내',RAIL]]},
 'd4-monja':{id:'monja',modes:['phone'],name:'츠키시마 몬자 오코게 사카에',time:'19:15',requirement:'선택 방문 / 전화 문의',links:[['매장 전화','tel:+81522286998']]},
 b09:{id:'nabana-ticket',name:'나바나노사토 일루미네이션 입장권',time:'15:50',requirement:'입장권 사전 구매 권장',links:[['공식 입장권 안내',BOOKING.nabana]]},
 'd5-keshiki':{id:'keshiki',modes:['web','walk'],name:'케시키 · 우선 안내',time:'09:30',requirement:'우선 안내 선택',links:[['TableCheck 우선 안내','https://www.tablecheck.com/ja/shops/tenmusudokorokeshiki/reserve']]}
};
const VISIT_LINKS = {
 f04:[['오아시스21 공사 공지','https://www.sakaepark.co.jp/news/news-8135/']],
 f22:[['본점 주소·영업','https://tebasaki623.co.jp/ja/shops']],
 f24:[['12월 야간 전망대 안내','https://www.nagoya-tv-tower.co.jp/news/202611011053/']],
 s04:[['장내점 공식 안내',BOOKING.kitaro]],
 b03:[['JR 나고야역점 공식 안내','https://www.maruya-honten.com/shop/nagoya-jrmeieki/'],['매장 전화','tel:+81525891208']],
 b05:[['JR 게이트타워 안내','https://www.towers.jp/']],
 b10:[['12월 13일 운영·점등 안내','https://www.nagashima-onsen.co.jp/nabana/fee/calendar/20261213.html']],
 b12:[['비어가든 메뉴·영업 안내','https://www.nagashima-onsen.co.jp/nabana/restaurant/beer.html'],['개인 방문 문의','tel:+81594410752']],
 b15:[['긴테쓰 귀환 열차 시간표','https://www.kintetsu.co.jp/railway/Dia/dia_nabana_20261017.html']],
 'd4-train':[['JR 시간표','https://railway.jr-central.co.jp/time-schedule/']],
 'd4-return':[['JR 시간표','https://railway.jr-central.co.jp/time-schedule/']],
 'd5-airport':[['공항 철도 안내','https://www.meitetsu.co.jp/train/centrair/guidance/index.html'],['가나야마역 환승 위치',appMap('金山駅 名古屋')]],
 'd5-lunch':[['플라이트 오브 드림즈','https://www.centrair.jp/flight-of-dreams/']]
};
const VISIT_REQUIREMENTS = {f24:'야간 전망대 입장권',s22:'무료 입장 · 혼잡 시 현장 정리권 또는 입장 제한',b12:'개인 현장 방문 · 15명 이상 단체는 별도 사전 예약'};
const MEAL_INFO = {
 shoraku:['마늘 라멘','닌니쿠 라멘 · 마늘 양 선택','목요일 18:00–23:00, 주문 마감 22:45. 재료 소진 시 조기 종료.','https://tabelog.com/aichi/A2301/A230103/23000137/'],
 komeda:['나고야 모닝','커피·토스트에 오구라앙(단팥)','매일 07:00 개점. 모닝은 개점부터 11:00까지. 현재 지점 안내상 월~토 21:00, 일·공휴일 19:00 마감.','https://www.komeda.co.jp/shop/detail.html?id=350'],
 ramuchi:['미소카츠','파가 올라간 미소카츠 정식','공개 점심 영업 11:00–15:30, 주문 마감 15:00.','https://tabelog.com/aichi/A2301/A230103/23001001/'],
 harbs:['케이크·음료','케이크 한 조각과 따뜻한 음료','매장 안내 11:00–21:00. 혼잡 시 주문 마감보다 일찍 입장이 끝날 수 있습니다.','https://www.harbs.co.jp/shop_tokai/'],
 mutsumi:['테바사키','흑·백 테바사키를 나눠 비교','본점 일반 금요일 15:00–24:00. 음식 주문 마감 23:00.','https://tebasaki623.co.jp/ja/shops'],
 sushi:['니기리 스시','니기리 세트나 당일 점심 메뉴','장내점 공식 안내에 점심 11:00–15:00(주문 마감 14:30). 일정은 11:30 방문.',BOOKING.kitaro],
 ibushigin:['로바타야키·사케','제철 숯불구이와 사케','공식 안내상 17:00부터. 정기휴무 비고정.',BOOKING.ibushigin],
 yushimaan:['히다규 간식','히다규 아부리 스시','히다규 협의회 안내 10:00–17:00.','https://www.hidagyu-gifu.com/hidagyu/eatinfo.php?id=00535'],
 senda:['히다 지역 정식','히다규 마부시 덮밥','게로 상공회 안내 11:00 개점, 점심 주문 마감 14:00. 수요일 등 휴무.','https://www.gerogle.jp/gourmet/detail_11.html'],
 geropudding:['푸딩·디저트','게로 우유 푸딩','공식 안내 10:00–17:00.','https://www.gero-purin.com/'],
 monja:['몬자야키','명란·떡 몬자와 치즈 토핑','오코게 사카에점의 당일 영업 안내를 확인하세요.','https://tabelog.com/aichi/A2301/A230103/23091106/'],
 maruya:['히츠마부시','장어덮밥을 그대로, 약미와 함께, 육수를 부어 맛보기','11:00–22:00, 주문 마감 21:30. 시설 일정에 따름.','https://www.maruya-honten.com/shop/nagoya-jrmeieki/'],
 beerGarden:['원내 저녁','스페어립 또는 미에식 돈테키','요일별 식당 영업시간과 마감은 공식 안내에서 확인하세요.'],
 keshiki:['텐무스 모닝','새우 텐무스. 키시멘은 모닝 메뉴에서 확인','모닝 제공 메뉴와 우선 안내 시간을 확인하세요.','https://tabelog.com/aichi/A2301/A230101/23087668/']
};
function normalizeEvent(raw, index, plan) {
 const key = raw.place.id;
 const meal = raw.category==='식사'||(raw.category==='휴식'&&MEAL_INFO[key])
  ? MEAL_INFO[key]||['식사',null] : null;
 return {
  ...raw, time:raw.start, end:raw.end||'', kind:raw.category, desc:raw.description,
  steps:raw.details, placeId:key, day:index, plan, booking:BOOKING_RULES[raw.id],
  meal, transport:raw.transport_from_previous||raw.card_notes?.transport,
  requirement:BOOKING_RULES[raw.id]?.requirement||VISIT_REQUIREMENTS[raw.id]||raw.reservation?.requirement||raw.card_notes?.reservation_requirement
 };
}
function normalizeDay(raw, index, plan=null) {
 return {...raw, date:raw.date.slice(5).replace('-','.'), iso:raw.date, dow:raw.weekday,
  short:['도착','사카에 쇼핑','오스·피규어',plan==='A'?'게로 온천':'나바나노사토','귀국'][index],
  subtitle:raw.summary, events:raw.events.map(event=>normalizeEvent(event,index,plan))};
}
const commonDays = ITINERARY_SOURCE.shared.map((day,i)=>normalizeDay(day,i===3?4:i));
const sundayDays = Object.fromEntries(Object.entries(ITINERARY_SOURCE.sunday).map(([plan,day])=>[plan,normalizeDay(day,SUNDAY,plan)]));
const days = [...commonDays.slice(0,3),sundayDays.A,commonDays[3]];
function daysForPlan(plan) {
 return [...commonDays.slice(0,3),sundayDays[plan]||sundayDays.A,commonDays[3]];
}
const ALL_EVENTS = [...commonDays.flatMap(day=>day.events),...Object.values(sundayDays).flatMap(day=>day.events)];
function exportItinerary(plan='A') {
 return {destination:ITINERARY_SOURCE.destination,timezone:ITINERARY_SOURCE.timezone,plan,
  days:daysForPlan(plan).map(day=>({date:day.iso,weekday:day.dow,title:day.title,summary:day.summary,note:day.note,
   events:day.events.map(e=>({
    id:e.id,start:e.time,end:e.end||null,title:e.title,category:e.kind,place:e.place,description:e.desc,details:e.steps,optional:e.optional,
    ...(e.booking&&{booking:{requirement:e.booking.requirement,planTime:e.booking.time,links:e.booking.links}}),
    ...(e.reservation&&{reservation:e.reservation}),...(e.transport_from_previous&&{transport_from_previous:e.transport_from_previous}),
    ...(e.source_url!==undefined&&{source_url:e.source_url}),...(e.card_notes&&{card_notes:e.card_notes}),
    ...(e.alternatives&&{alternatives:e.alternatives})
   }))}))};
}
