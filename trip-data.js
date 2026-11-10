'use strict';

const SUNDAY = 3;
const CATEGORY_KEYS = {
 식사:'meal', 쇼핑:'shopping', 관광:'sight', 산책:'sight',
 이동:'transit', 출국:'transit', 비행:'transit', 휴식:'rest'
};
const CATEGORY_VISUALS = {
 meal:{label:'식사',icon:'<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M20 3c-3 1-5 4-5 8v2h5m0-10v18"/>'},
 shopping:{label:'쇼핑',icon:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>'},
 sight:{label:'관광',icon:'<path d="M4 7h4l2-3h4l2 3h4a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3"/>'},
 transit:{label:'이동',icon:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M12 3v8M8 18l-2 3m10-3 2 3M8.5 14.5h.01m7 0h.01"/>'},
 rest:{label:'휴식·간식',icon:'<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M3 22h17M8 3v3m4-3v3"/>'},
 lodging:{label:'숙소',icon:'<path d="M3 18v3m18-3v3M3 12V6h18v6M9 12V9h6v3M3 18v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3Z"/>'},
 activity:{label:'일정',icon:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16m-12 5h8"/>'}
};
function eventCategory(event) {
 // At the same hotel, an arrival by train or a breakfast still has its own category.
 return event.kind==='휴식'&&event.placeId==='hotel'?'lodging':CATEGORY_KEYS[event.kind]||'activity';
}
const BOOKING = ITINERARY_SOURCE.bookingLinks;
const BOOKING_RULES = {
 f06:{id:'ramuchi',modes:['phone','walk'],name:'쿠로부타야 라무치',time:'11:00',requirement:'방문 전 전화 확인',links:[['매장 전화','tel:+81522411664']]},
 f22:{id:'mutsumi',modes:['web','phone'],name:'테바사키 무츠미 본점',time:'17:30',requirement:'예약 권장',links:[['예약 안내','https://tabelog.com/aichi/A2301/A230103/23079119/'],['매장 전화','tel:+81526845577']]},
 's-okoge':{id:'monja-saturday',modes:['phone'],name:'츠키시마 몬자 오코게 사카에',time:'19:30',requirement:'예약 가능 · 전화로 확인',links:[['매장 전화','tel:+81522286998'],['타베로그 지점 안내','https://tabelog.com/aichi/A2301/A230103/23091106/']]},
 'sun-unayasu':{id:'unayasu-lunch',modes:['web','phone','walk'],name:'우나야스 니시키점',time:'11:00',requirement:'예약 없이 방문 가능 · 온라인 예약 선택',links:[['니시키점 온라인 예약','https://www.hotpepper.jp/strJ003341409/'],['매장 전화','tel:+81529515151']]},
 b09:{id:'nabana-ticket',name:'나바나노사토 일루미네이션 입장권',time:'15:50',requirement:'입장권 사전 구매 권장',links:[['공식 입장권 안내',BOOKING.nabana]]},
 'd5-keshiki':{id:'keshiki-saturday',optional:true,modes:['web','walk'],name:'케시키 · 우선 안내',time:'10:00',requirement:'우선 안내 선택 · 좌석 확정 아님',links:[['TableCheck 우선 안내','https://www.tablecheck.com/ja/shops/tenmusudokorokeshiki/reserve']]}
};
const VISIT_LINKS = {
 'd5-keshiki':[['메뉴·모닝 안내','https://tabelog.com/aichi/A2301/A230101/23087668/dtlmenu/'],['매장 문의','tel:+81529904704'],['평일 오전 두 메뉴 주문 후기','https://retty.me/area/PRE23/ARE62/SUB6202/100001738965/']],
 's-kurin':[['정리권·이용 안내','https://www.kurin.gensg.jp/shop/shop_index.html'],['카누레와 아이스크림 · 공식 안내','https://www.caneleandicecream.com/'],['대체 매장 Google Maps',appMap('カヌレとアイス 名古屋・大須本店 愛知県名古屋市中区大須3-37-43')]],
 's-donki':[['사카에 본점 공식 안내','https://www.donki.com/store/shop_detail.php?shop_id=348'],['소비세 환급 · 일본 관광청','https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00021.html']],
 'f-chiikawa':[['나고야 PARCO 매장','https://nagoya.parco.jp/shop/detail/?id=10854'],['나고야 구매 예약 안내','https://www.chiikawa-yaki.com/app-nagoya/schedules'],['매장 전화','tel:+81522657353']],
 's-shinsuzume':[['오스 상점가 매장 안내','https://osu.nagoya/ja/shop.php?s=lOJDBK']],
 'sun-unayasu':[['니시키점 메뉴·가격','https://www.hotpepper.jp/strJ003341409/food/'],['대안 · JR 중앙통로 에키카마 키시멘','https://www.jrt-food-service.co.jp/store/338/']],
 f04:[['오아시스21 공사 공지','https://www.sakaepark.co.jp/news/news-8135/']],
 f22:[['본점 주소·영업','https://tebasaki623.co.jp/ja/shops']],
 f24:[['12월 야간 전망대 안내','https://www.nagoya-tv-tower.co.jp/news/202611011053/']],
 b05:[['JR 게이트타워 안내','https://www.towers.jp/']],
 b10:[['12월 13일 운영·점등 안내','https://www.nagashima-onsen.co.jp/nabana/fee/calendar/20261213.html']],
 b12:[['비어가든 메뉴·영업 안내','https://www.nagashima-onsen.co.jp/nabana/restaurant/beer.html'],['개인 방문 문의','tel:+81594410752'],['원내 식당 운영 현황','https://www.nagashima-onsen.co.jp/nabana/info/restaurant-nabana.html'],['원내 대안 · 돈카츠 카츠마루','https://www.nagashima-onsen.co.jp/nabana/restaurant/katsumaru.html']],
 b15:[['긴테쓰 귀환 열차 시간표','https://www.kintetsu.co.jp/railway/Dia/dia_nabana_20261017.html']],
 'd5-airport':[['공항 철도 안내','https://www.meitetsu.co.jp/train/centrair/guidance/index.html'],['12/14 가나야마 출발 열차','https://trainbus.meitetsu.co.jp/meitetsu-transfer/pc/transfer/TransferSearch?basis=1&day=14&dnvName=%E4%B8%AD%E9%83%A8%E5%9B%BD%E9%9A%9B%E7%A9%BA%E6%B8%AF&goal=00009406&hour=10&method=0&minute=22&month=2026%2F12&orvName=%E9%87%91%E5%B1%B1(%E6%84%9B%E7%9F%A5%E7%9C%8C)&sort=2&start=00001879&unuse=&wspeed=standard'],['가나야마역 환승 위치',appMap('金山駅 名古屋')]],
 'd5-lunch':[['센트레아 식당 목록','https://www.centrair.jp/shop-dine/restaurant/']],
 'd5-flight-park':[['플라이트 오브 드림즈','https://www.centrair.jp/flight-of-dreams/']],
 'd5-security':[['센트레아 출국 시 환급 절차','https://www.centrair.jp/taxrefund/index.html']]
};
const VISIT_REQUIREMENTS = {'s-kurin':'현장 정리권 · 10:30부터',f24:'야간 전망대 입장권',s22:'무료 입장 · 혼잡 시 현장 정리권 또는 입장 제한',b12:'개인 현장 방문 · 15명 이상 단체는 별도 사전 예약'};
const MEAL_INFO = {
 kurin:['와구리 몽블랑','황금 몽블랑 · 쿠리잔마이 · 계절 과일 몽블랑','통상 11:00–19:00 · 부정기 휴무 · 매장·포장 현금만.','https://www.kurin.gensg.jp/menu/menu_index.html'],
 katoCoffee:['나고야 모닝','자가 로스팅 커피와 오구라 토스트 · 나고야 세트','월요일 08:00–16:00 · 모닝 08:00–10:30.','https://www.katocoffee.com/com/company/access.html'],
 airport:['공항 자유 점심','터미널과 대기 시간에 맞춰 메뉴를 고릅니다.','식당별 영업시간은 센트레아 공식 목록에서 확인.','https://www.centrair.jp/shop-dine/restaurant/'],
 chiikawaYaki:['캐릭터 구운 과자','치이카와 단팥 · 하치와레 크림 · 우사기 초콜릿','나고야 PARCO 서관 지하 1층 10:00–20:00. 구매 예약·정리권 적용과 재고는 당일 공지 기준.','https://www.chiikawa-yaki.com/'],
 shinSuzume:['오스 당고','미타라시 당고 · 콩가루 당고','오스 상점가 공식 12:00–19:00 · 부정기 휴무.','https://osu.nagoya/ja/shop.php?s=lOJDBK'],
 unayasu:['히츠마부시','히츠마부시 보통 2조각 ¥990 · 특 3조각 ¥1,350 · 특상 6조각 ¥2,400 (공개 메뉴 기준)','일요일 통상 11:00–21:00, 음식 주문 마감 20:00.','https://www.hotpepper.jp/strJ003341409/'],
 shoraku:['마늘 라멘','닌니쿠 라멘 · 마늘 양 선택','목요일 18:00–23:00, 주문 마감 22:45. 재료 소진 시 조기 종료.','https://tabelog.com/aichi/A2301/A230103/23000137/'],
 komeda:['나고야 모닝','커피·토스트에 오구라앙(단팥)','매일 07:00 개점. 모닝은 개점부터 11:00까지. 현재 지점 안내상 월~토 21:00, 일·공휴일 19:00 마감.','https://www.komeda.co.jp/shop/detail.html?id=350'],
 ramuchi:['미소카츠','파가 올라간 미소카츠 정식','공개 점심 영업 11:00–15:30, 주문 마감 15:00.','https://tabelog.com/aichi/A2301/A230103/23001001/'],
 harbs:['케이크·음료','케이크 한 조각과 따뜻한 음료','PARCO점 매장·포장 11:00–20:00. 매장 주문 마감 19:30.','https://www.harbs.co.jp/shop_tokai/'],
 mutsumi:['테바사키','흑·백 테바사키를 나눠 비교','본점 일반 금요일 15:00–24:00. 음식 주문 마감 23:00.','https://tebasaki623.co.jp/ja/shops'],
 monja:['몬자야키','명란·떡 몬자와 치즈 토핑','토요일 통상 11:00–다음 날 04:00. 마지막 주문과 12/12 변동은 매장에 확인.','https://tabelog.com/aichi/A2301/A230103/23091106/'],
 beerGarden:['원내 저녁','스페어립 또는 미에식 돈테키','12/13 개별 영업·주문 마감 미공개. 혼잡 시 조기 접수 종료 가능.'],
 keshiki:['텐무스·키시멘','새우 텐무스 · 새우 키시멘. 10시 키시멘 제공 범위는 매장 확인.','공개 안내상 토요일 모닝 08:00–11:00 · 주간 영업 08:00–15:00(주문 마감 14:30).','https://tabelog.com/aichi/A2301/A230101/23087668/dtlmenu/']
};
function normalizeEvent(raw, index) {
 const key = raw.place.id;
 const meal = raw.category==='식사'||(raw.category==='휴식'&&MEAL_INFO[key])
  ? MEAL_INFO[key]||['식사',null] : null;
 return {
  ...raw, time:raw.start, end:raw.end||'', kind:raw.category, desc:raw.description,
  steps:raw.details, placeId:key, day:index, booking:BOOKING_RULES[raw.id],
  meal, transport:raw.transport_from_previous||raw.card_notes?.transport,
  requirement:BOOKING_RULES[raw.id]?.requirement||VISIT_REQUIREMENTS[raw.id]||raw.reservation?.requirement||raw.card_notes?.reservation_requirement
 };
}
function normalizeDay(raw, index) {
 return {...raw, date:raw.date.slice(5).replace('-','.'), iso:raw.date, dow:raw.weekday,
  short:['도착','사카에·PARCO','나고노·오스·사카에','나바나노사토','귀국'][index],
  subtitle:raw.summary, events:raw.events.map(event=>normalizeEvent(event,index))};
}
const days = ITINERARY_SOURCE.days.map(normalizeDay);
const ALL_EVENTS = days.flatMap(day=>day.events);
function exportItinerary() {
 return {destination:ITINERARY_SOURCE.destination,timezone:ITINERARY_SOURCE.timezone,
  days:days.map(day=>({date:day.iso,weekday:day.dow,title:day.title,summary:day.summary,note:day.note,
   events:day.events.map(e=>({
    id:e.id,start:e.time,end:e.end||null,title:e.title,category:e.kind,place:e.place,description:e.desc,details:e.steps,optional:e.optional,
    ...(e.booking&&{booking:{requirement:e.booking.requirement,planTime:e.booking.time,links:e.booking.links}}),
    ...(e.reservation&&{reservation:e.reservation}),...(e.transport_from_previous&&{transport_from_previous:e.transport_from_previous}),
    ...(e.source_url!==undefined&&{source_url:e.source_url}),...(e.card_notes&&{card_notes:e.card_notes}),
    ...(e.alternatives&&{alternatives:e.alternatives})
   }))}))};
}
