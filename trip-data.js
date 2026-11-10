'use strict';

// Stable map keys for each venue. Repeated visits share a location, not an activity ID.
const VENUES = {
 'd1-arrival':'airport', 'd1-train-in':'station', 'd1-checkin':'hotel', 'd1-ramen':'shoraku',
 'd1-night-park':'hisaya', f01:'komeda', f04:'oasis', f06:'ramuchi', f07:'beams', f09:'unitedArrows',
 f10:'stussy', f12:'bape', f14:'hoods', f16:'blackeye', f18:'freaks', f19:'atmos', f20:'harbs',
 f22:'mutsumi', f24:'tower', s02:'sunroad', s04:'sushi', s06:'darumaya', s07:'kannon',
 s09:'mandarake', s11:'lashinbang', s13:'surugaya', s15:'volks', s17:'animateParco',
 s19:'mugiwara', s21:'heroPopup', s23:'ibushigin', 'd4-train':'geroStation',
 'd4-town':'geroTown', 'd4-beef':'yushimaan', 'd4-lunch':'senda', 'd4-bath':'ogawaya',
 'd4-pudding':'geropudding', 'd4-monja':'monja', 'd5-morningtransfer':'keshiki',
 b02:'kintetsuNagoya', b03:'maruya', b05b:'hands', b07:'nagashima', b08:'nabana'
};
const PLAN_LABELS = {A:'A 게로 온천', B:'B 나바나노사토'};
const SUNDAY = 3;
const BOOKING = ITINERARY_SOURCE.bookingLinks;
const RAIL = 'https://railway.jr-central.co.jp/ticketless/index.html';
const sourceDays = [...ITINERARY_SOURCE.shared, ...Object.values(ITINERARY_SOURCE.sunday)];
const sourceEvents = sourceDays.flatMap(day => day.events);
const keyByName = new Map();
for (const [id, key] of Object.entries(VENUES)) {
 const {place} = sourceEvents.find(event => event.id === id);
 keyByName.set(place.name, key);
 PLACE[key] = {
  name: place.name, jp: place.japaneseName, address: place.address || '',
  query: new URL(place.mapUrl).searchParams.get('query'), mapUrl: place.mapUrl
 };
}
function locationFields(name, japaneseName, address, query=japaneseName+' '+address) {
 return {name,japaneseName,address,mapUrl:appMap(query)};
}
const VENUE_DETAILS = {
 ogawaya:locationFields('게로 온천 오가와야 별관 유라기','下呂温泉 小川屋 別館ゆらぎ','岐阜県下呂市湯之島570'),
 gateTower:locationFields('JR 게이트타워','JRゲートタワー','名古屋市中村区名駅1-1-3'),
 ibushigin:locationFields('로바타야키 이부시긴 후시미점','炉端焼き 燻銀 伏見店','名古屋市中区栄2-1-14 マルイチセンタービル1F'),
 maruya:locationFields('마루야 본점 JR 나고야역점','まるや本店 JR名古屋駅店','名古屋市中村区名駅1-1-4 JR名古屋駅構内 うまいもん通り'),
 sunroad:locationFields('메이에키 지하상가 선로드','名駅地下街 サンロード','名古屋市中村区名駅4-7-25 先'),
 jrNagoya:locationFields('JR 나고야역','JR名古屋駅','名古屋市中村区名駅1-1-4'),
 beerGarden:locationFields('나가시마 비어가든','長島ビール園','三重県桑名市長島町駒江漆畑270 なばなの里内')
};
const ENDPOINTS = {
 f02:'hisaya', f05:'ramuchi', f21:'mutsumi', f23:'tower', s06:'kannon',
 'd4-return':'jrNagoya', b02:'jrNagoya', b04:'jrNagoya', b05:'gateTower', b12:'beerGarden'
};
const ADDRESS_FALLBACK = {
 airport:'愛知県常滑市セントレア1丁目', station:'名古屋市中村区名駅1-2-1',
 hotel:'名古屋市中区錦3-4-3', shoraku:'名古屋市東区泉1-4-1',
 komeda:'名古屋市中区丸の内3-19-30', monja:'名古屋市中区栄3-9-29',
 keshiki:'名古屋市中村区那古野1-46-12 小鳥ビル1F', ogawaya:'岐阜県下呂市湯之島570',
 geroStation:'岐阜県下呂市幸田', geroTown:'岐阜県下呂市 湯之島・森', hisaya:'名古屋市中区・東区 久屋大通'
};
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
 f04:[['오아시스21 안내','https://www.sakaepark.co.jp/']],
 f22:[['본점 주소·영업','https://tebasaki623.co.jp/ja/shops']],
 f24:[['전망대 안내','https://www.nagoya-tv-tower.co.jp/fee/']],
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
const VISIT_REQUIREMENTS = {b12:'개인 현장 방문 · 15명 이상 단체는 별도 사전 예약'};
const MEAL_INFO = {
 shoraku:['마늘 라멘','닌니쿠 라멘 · 마늘 양 선택','목요일 18:00–23:00, 주문 마감 22:45. 재료 소진 시 조기 종료.','https://tabelog.com/aichi/A2301/A230103/23000137/'],
 komeda:['나고야 모닝','커피·토스트에 오구라앙(단팥)','사쿠라도리오츠점의 모닝 안내를 확인하세요.','https://www.komeda.co.jp/shop/detail.html?id=350'],
 ramuchi:['미소카츠','파가 올라간 미소카츠 정식','점심 영업은 당일 매장 안내를 확인하세요.','https://tabelog.com/aichi/A2301/A230103/23001001/'],
 harbs:['케이크·음료','케이크 한 조각과 따뜻한 음료','PARCO 매장 안내에서 마지막 주문 시각을 확인하세요.'],
 mutsumi:['테바사키','흑·백 테바사키를 나눠 비교','본점 일반 금요일 15:00–24:00. 음식 주문 마감 23:00.','https://tebasaki623.co.jp/ja/shops'],
 sushi:['니기리 스시','니기리 세트나 당일 점심 메뉴','장내점 공식 안내에 점심 11:00–15:00(주문 마감 14:30). 일정은 11:30 방문.',BOOKING.kitaro],
 ibushigin:['로바타야키·사케','제철 숯불구이와 사케','후시미점의 당일 영업·메뉴를 확인하세요.',BOOKING.ibushigin],
 yushimaan:['히다규 간식','히다규 아부리 스시'],
 senda:['히다 지역 정식','히다규와 지역 재료를 곁들인 정식','점심은 가게 안내에서 확인하세요.','https://www.gerogle.jp/gourmet/detail_11.html'],
 geropudding:['푸딩·디저트','게로 푸딩과 따뜻한 음료'],
 monja:['몬자야키','명란·떡 몬자와 치즈 토핑','오코게 사카에점의 당일 영업 안내를 확인하세요.','https://tabelog.com/aichi/A2301/A230103/23091106/'],
 maruya:['히츠마부시','장어덮밥을 그대로, 약미와 함께, 육수를 부어 맛보기','JR역 우마이몬도리 지점의 공식 영업시간을 확인하세요.','https://www.maruya-honten.com/shop/nagoya-jrmeieki/'],
 beerGarden:['원내 저녁','스페어립 또는 미에식 돈테키','요일별 식당 영업시간과 마감은 공식 안내에서 확인하세요.'],
 keshiki:['텐무스 모닝','새우 텐무스. 키시멘은 모닝 메뉴에서 확인','모닝 제공 메뉴와 우선 안내 시간을 확인하세요.','https://tabelog.com/aichi/A2301/A230101/23087668/']
};
function effectivePlace(raw, key) {
 let place = VENUE_DETAILS[key] || raw.place;
 if (ENDPOINTS[raw.id] && !VENUE_DETAILS[key]) {
  const target = PLACE[key];
  place = locationFields(target.name, target.jp, target.address, target.query);
 }
 const address = place.address || ADDRESS_FALLBACK[key];
 const query = new URL(place.mapUrl).searchParams.get('query');
 const exactName = place.japaneseName.replace(/\s/g,'');
 return {...place,address,mapUrl:query?.replace(/\s/g,'').includes(exactName)
  ? place.mapUrl : appMap([place.japaneseName,address].filter(Boolean).join(' '))};
}
function normalizeEvent(raw, index, plan) {
 const key = ENDPOINTS[raw.id] || keyByName.get(raw.place.name);
 if (!key) throw new Error('Unmapped itinerary place: '+raw.id);
 const place = effectivePlace(raw,key);
 const booking = BOOKING_RULES[raw.id];
 let steps = [...raw.details];
 if (ENDPOINTS[raw.id]||raw.id==='d4-bath') {
  steps = steps.map(step=>step.replaceAll(raw.place.name,place.name));
 }
 if (raw.id==='d4-bath') {
  steps[0]='12:20 접수 후 12:30에 루리(瑠璃)를 이용하는 계획입니다. 실제 확정은 예약 기록에 남기세요.';
  steps[5]='카스미(霞)는 같은 이용 시간의 별도 선택지입니다. 실제 이용한 욕탕 이름은 예약 메모에 기록하세요.';
 }
 if (raw.id==='d4-monja') steps[0]='피로가 크면 가벼운 저녁으로 바꿀 수 있습니다. 기존 예약이 있다면 매장 취소 규정을 확인하세요.';
 const meal = raw.category==='식사'||(raw.category==='휴식'&&MEAL_INFO[key]) ? MEAL_INFO[key]||['식사',steps[0]] : null;
 return {
  ...raw, place, details:steps,
  ...(raw.card_notes&&steps[0]!==raw.details[0]&&{card_notes:{...raw.card_notes,visit_tip:steps[0]}}), time:raw.start, end:raw.end||'', kind:raw.category, desc:raw.description,
  steps, placeId:key, day:index, plan, booking,
  meal, transport:raw.transport_from_previous||raw.card_notes?.transport||'전후 장소와 길찾기 확인',
  requirement:booking?.requirement||VISIT_REQUIREMENTS[raw.id]||raw.reservation?.requirement||raw.card_notes?.reservation_requirement||'현장 안내 확인'
 };
}
function normalizeDay(raw, index, plan=null) {
 const note = plan==='A'
  ? '12:20 접수 후 12:30~13:15 루리(瑠璃) 대절탕. 카스미(霞)는 다다미 취향 대안입니다. 히다 왕복은 지정석을 권장합니다. 예약 기록은 직접 관리하며 A/B는 언제든 선택할 수 있습니다.'
  : raw.note;
 return {...raw, date:raw.date.slice(5).replace('-','.'), iso:raw.date, dow:raw.weekday,
  short:['도착','사카에 쇼핑','오스·피규어',plan==='A'?'게로 온천':'나바나노사토','귀국'][index],
  subtitle:raw.summary,note, events:raw.events.map(event=>normalizeEvent(event,index,plan))};
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
