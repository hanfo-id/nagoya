/* Booking research is separate from the fixed itinerary. Method dates are the dates checked. */
const RESERVATION_GROUPS={advance:'사전 조치가 중요한 항목',optional:'선택 예약·문의',onsite:'현장 접수·공지 확인'};
const TICKET_KINDS={familymart:'패밀리마트 편의점권',seven:'세븐일레븐 편의점권',kintetsu:'긴테쓰 전철·버스 세트권',venue:'입구 현장권',other:'기타'};
const RESERVATION_CLASSES={
 required:'예약 필수',recommended:'사전예약 권장',optional:'예약 선택',ticket:'유료 입장권',
 queue:'현장 정리권',none:'예약 불필요',check:'확인 필요'
};
const RESERVATION_REVIEW_DATE='2026-11-10';
const method=(type,service,label,url,fee,verification,selection,note='',source=url)=>({
 type,service,label,url,fee,verification,selection,note,source,verifiedAt:RESERVATION_REVIEW_DATE
});
const TEBASAKI='https://tabelog.com/aichi/A2301/A230103/23079119/';
const OKOGE='https://tabelog.com/aichi/A2301/A230103/23091106/';
const UNAYASU='https://tabelog.com/aichi/A2301/A230103/23079412/';
const RAMUCHI='https://tabelog.com/aichi/A2301/A230103/23001001/';
const KESHIKI='https://www.tablecheck.com/ja/shops/tenmusudokorokeshiki/reserve';
const KESHIKI_GOOGLE='https://www.google.com/maps/reserve/v/dine/c/UXJucRGp_XQ?source=pa&hl=ja';
const NABANA='https://www.nagashima-onsen.co.jp/nabana/info/advanceticket.schedule.html';
const NABANA_FEES='https://www.nagashima-onsen.co.jp/nabana/illumination/fee/index.html';
const TOWER_NIGHT='https://www.nagoya-tv-tower.co.jp/event/star-illumination-2026/';
const CHIIKAWA='https://www.chiikawa-yaki.com/#reserve-info1';
const HERO='https://nagoya.parco.jp/event/detail/?id=38619';
const KURIN='https://www.kurin.gensg.jp/shop/shop_index.html';
const KATO='https://www.katocoffee.com/com/company/access.html';
const BOOKING_RULES={
 f22:{
  id:'mutsumi',group:'advance',type:'restaurant',classification:'recommended',time:'17:30',modes:['web','phone'],
  requirement:'사전예약 강력 권장 · 성인 2명',
  note:'일정 도착 17:20, 예약 목표 17:30. Google 지도는 타베로그·핫페퍼로 연결합니다. 타베로그 12/11 잔여석·좌석만 조건은 미확인입니다. 핫페퍼는 2명 17:30을 요청 접수로 표시했습니다.',
  methods:[
   method('tabelog','타베로그','타베로그 예약',TEBASAKI,'별도 수수료 검증 필요','지점 온라인 예약 지원','날짜·시각·인원 선택','연락 없이 예약 시각을 15분 넘기면 취소될 수 있습니다. 최종 취소료는 예약 화면에서 확인하세요.','https://tabelog.com/aichi/A2301/A230103/23079119/table'),
   method('phone','매장 직접 전화','+81 52-684-5577','tel:+81526845577','통화료 별도','공식 지점 번호 확인','2명·17:30 전화 문의','','https://tebasaki623.co.jp/ja/shops'),
   method('free-web','핫페퍼','핫페퍼 빈자리 확인','https://www.hotpepper.jp/strJ001282169/yoyaku/','일반 웹 접수 · 식사비 별도','지점 예약 양식 확인','날짜·시각·인원 선택','12/11 성인 2명 17:30 조건에 요청 접수(□)를 확인했습니다. 매장 연락을 받아야 확정됩니다.')
  ]
 },
 's-okoge':{
  id:'monja-saturday',group:'advance',type:'restaurant',classification:'recommended',modes:['phone'],
  requirement:'주말 저녁 사전예약 권장 · 성인 2명',
  note:'타베로그는 예약 가능으로 표시하지만 지점 온라인 예약 양식은 확인되지 않았습니다. 공식 번호로 토요일 19:30에 두 자리를 문의하세요.',
  methods:[
   method('phone','매장 직접 전화','+81 52-228-6998','tel:+81522286998','통화료 별도','지점 번호·예약 가능 표기 확인','2명·19:30 전화 문의','잔여석, 좌석만 예약, 취소 조건은 통화 시 확인하세요.','https://kano-corp.tokyo/shop/'),
   method('notice','타베로그','타베로그 지점 정보',OKOGE,'안내 열람 무료','온라인 예약 양식 미확인','웹 입력 미확인','Google 지점에서도 직접 예약 버튼을 확인하지 못했습니다.'),
   method('paid-web','AutoReserve','AutoReserve 대행 조건 확인','https://autoreserve.com/ja/restaurants/oyisd4wgv5HXYfV2HRgK','대행료 발생 가능 · 금액 검증 필요','지점 페이지 확인 · 12/12 미확인','요청 단계에서 날짜·인원 선택','요청은 즉시 확정과 다릅니다. 수수료는 최종 화면에서 확인하세요. 방문 24시간 이내 변경·취소는 매장에 직접 연락하세요.','https://help.autoreserve.com/hc/ja/articles/31607151346457')
  ]
 },
 f06:{
  id:'ramuchi',group:'optional',type:'restaurant',classification:'check',time:'11:00',modes:['phone','walk'],
  requirement:'11시 점심은 현장 대기 우선',
  note:'타베로그의 일반 예약 가능 표기는 점심 2인 좌석을 보장하지 않습니다. 점심 좌석 예약은 미확인이라 10:45 현장 대기를 기준으로 합니다.',
  methods:[
   method('phone','매장 직접 문의','+81 52-241-1664','tel:+81522411664','통화료 별도','점심 예약 조건 검증 필요','2명·11:00 전화 문의','저녁 코스·포장 접수와 점심 매장 좌석을 구분해 문의하세요.',RAMUCHI),
   method('notice','타베로그','라무치 지점 안내',RAMUCHI,'안내 열람 무료','일반 예약 가능 표기','온라인 양식·점심 좌석 미확인')
  ]
 },
 'sun-unayasu':{
  id:'unayasu-lunch',group:'optional',type:'restaurant',classification:'optional',modes:['web','phone','walk'],
  requirement:'온라인 예약 선택 · 현장 방문 가능',
  note:'11:00 니시키점, 성인 2명. Google 지도 예약 버튼은 제휴 사이트로 연결합니다. 여행일 잔여석은 확인이 필요합니다.',
  methods:[
   method('tabelog','타베로그','타베로그 예약',UNAYASU,'별도 수수료 검증 필요','지점 온라인 예약 지원','날짜·시각·인원 선택'),
   method('phone','매장 직접 전화','+81 52-951-5151','tel:+81529515151','통화료 별도','지점 연락처 확인','2명·11:00 전화 문의','점심 좌석은 통화 시 확인하세요.',UNAYASU),
   method('free-web','핫페퍼','핫페퍼 빈자리 확인','https://www.hotpepper.jp/strJ003341409/yoyaku/','일반 웹 접수 · 식사비 별도','지점 예약 양식 확인','날짜·시각·인원 선택')
  ]
 },
 'd5-keshiki':{
  id:'keshiki-saturday',name:'케시키 본점 · 우선 안내',group:'optional',type:'priority',classification:'optional',modes:['web','walk'],
  requirement:'유료 우선 안내 선택 · 좌석 확정 아님',
  note:'12/12 10:00 방문. 14일 전인 11/28부터 접수 범위를 확인하세요. 혼잡하면 대기할 수 있습니다.',
  methods:[
   method('google','Google에서 예약','Google에서 신청 화면 열기',KESHIKI_GOOGLE,'결제 조건 검증 필요','Google 직접 화면·TableCheck 연동 확인','날짜·시각·인원 선택','TableCheck 연동 경로입니다. 무료 좌석 예약은 확인되지 않았습니다. Google 화면의 최종 수수료와 안내 내용을 확인하세요.'),
   method('paid-web','TableCheck','TableCheck 우선 안내 신청',KESHIKI,'¥500/인 · 2명 ¥1,000','본점 유료 우선 안내 확인','날짜·시각·인원 선택','성립 시 수수료 부과, 취소해도 환불 불가. 변경은 취소 후 재신청이며 당일 30분 전까지 접수합니다.')
  ]
 },
 b09:{
  id:'nabana-ticket',name:'나바나노사토 일루미네이션 입장권',group:'advance',type:'ticket',classification:'ticket',modes:[],
  requirement:'입장권 필수 · 편의점 사전 발권 권장',
  note:'12/13 일반 기간권. 사전 ¥3,000/인, 현장 ¥3,200/인. 원내 이용권 ¥1,000과 베고니아가든 입장 포함. 종이 티켓으로 교환 없이 입장합니다.',
  methods:[
   method('official','나가시마 리조트','공식 발권 일정·코드',NABANA,'유료 ¥3,000/인 · 2명 ¥6,000','12/13 유효 기간권 확인','시각 지정 없음 · 2매 발권','11/21 00:00 판매 개시. 현장 발권은 30분 이상 걸릴 수 있습니다.'),
   method('official','패밀리마트 · JTB','패밀리마트 발권 방법','https://www.family.co.jp/services/ticket/leisure/nabana.html','유료 ¥3,000/인','공식 제휴 편의점','시각 지정 없음 · 2매 발권','점포 멀티복사기에서 JTB 상품번호 0268315로 신청하고 계산대에서 결제·발권하세요.',NABANA),
   method('official','세븐일레븐 · 세븐티켓','세븐일레븐 발권 안내','https://7ticket.jp/sp/nagashima-spaland','유료 ¥3,000/인','공식 제휴 편의점','시각 지정 없음 · 2매 발권','세븐코드 117-561. 점포 멀티복사기에서 발권하거나 공개 후 웹 신청과 점포 수령 절차를 확인하세요.',NABANA),
   method('official','긴테쓰','전철·버스·입장 세트권','https://www.kintetsu.co.jp/senden/Railway/Ticket/nabana/','유료 · 12/13 긴테쓰 나고야 출발 ¥4,170/인','공식 역 창구 판매 확인','승차 시작일 지정 · 열차 시각 자유','긴테쓰 나고야 특급권 창구에서 2명 ¥8,340. 왕복 전철·버스와 입장권 포함.'),
   method('onsite','나바나노사토 입구','현장 요금 보기',NABANA_FEES,'유료 ¥3,200/인 · 2명 ¥6,400','공식 요금 확인','시각 지정 없음')
  ]
 },
 f24:{
  id:'mirai-night-ticket',name:'미라이타워 야간 전망대',group:'advance',type:'ticket',classification:'ticket',modes:[],
  requirement:'야간 행사 입장권 · 1층 현장 구매',
  note:'12/11 금요일 17:00–21:00, 마지막 입장 20:40. 19:25 방문에는 야간 NAKED 행사권을 구매하세요.',
  methods:[
   method('onsite','MIRAI TOWER','공식 야간 티켓 안내',TOWER_NIGHT,'유료 ¥1,800/인 · 2명 ¥3,600','1층 티켓 창구 판매 확인','시각 지정 요구 미표기','야간 적용 온라인 판매는 검증되지 않았습니다. 주간 전망권·할인권과 구분하세요.'),
   method('notice','MIRAI TOWER','야간 영업·요금 공지','https://www.nagoya-tv-tower.co.jp/news/202611011053/','안내 열람 무료','12/11 야간 시간·요금 확인','온라인 사전 발권 검증 필요')
  ]
 },
 's-kurin':{
  id:'kurin-queue',group:'onsite',type:'queue',classification:'queue',modes:['walk'],
  requirement:'오스점 현장 정리권 · 10:30부터',
  note:'15:30 착석은 보장되지 않습니다. 대기가 길면 같은 골목의 카누레와 아이스크림을 선택하세요.',
  methods:[
   method('notice','쿠리린 오스점','공식 정리권 안내',KURIN,'접수 무료 · 식사비 별도','매장 앞 배부·전화 좌석 예약 불가 확인','현장에서 안내'),
   method('notice','카누레와 아이스크림','대체 매장 확인','https://www.caneleandicecream.com/','안내 열람 무료','오스 본점 위치 확인','현장 방문')
  ]
 },
 'f-chiikawa':{
  id:'chiikawa-yaki-notice',group:'onsite',type:'notice',classification:'check',modes:['walk'],
  requirement:'12/11 운영 방식 추후 공지 확인',
  note:'평일 자유입장이 원칙이나 혼잡일은 선착순 예약이 적용됩니다. 적용되면 전날 10:00부터 공식 날짜 링크로 신청하세요.',
  methods:[
   method('notice','치이카와야키','나고야점 최신 구매 공지',CHIIKAWA,'안내 열람 무료','12/11 자유입장·선착순 미발표','예약일만 공식 링크에서 신청'),
   method('notice','치이카와야키 공식 X','공식 X 공지 확인','https://x.com/chiikawayaki','안내 열람 무료','공식 공지 채널','당일 운영 확인')
  ]
 },
 s22:{
  id:'hero-popup-queue',group:'onsite',type:'queue',classification:'queue',modes:[],
  requirement:'무료 입장 · 혼잡 시 현장 정리권 가능',
  note:'12/5–20, 나고야 PARCO 남관 10층. 혼잡 시 배포·입장 제한을 공식 공지에서 확인하세요.',
  methods:[
   method('notice','나고야 PARCO','공식 행사 안내',HERO,'입장 무료','기간·지점 확인','현장 운영에 따름'),
   method('notice','나고야 PARCO 행사 공식 X','정리권 공지 채널','https://x.com/ngparco_gallery','안내 열람 무료','공식 공지 채널','현장 배포 확인')
  ]
 },
 'd5-kato':{
  id:'kato-sakae-visit',group:'onsite',type:'notice',classification:'check',modes:['walk'],record:false,
  requirement:'현장 방문 · 08:00 도착 권장',
  note:'공식 사이트가 연결한 양식은 메이토구 주소를 표시합니다. 양식에서 실제 접수 지점을 확인할 수 없어 사카에점은 현장 방문으로 안내합니다.',
  methods:[
   method('notice','카토커피','사카에점 영업 안내',KATO,'안내 열람 무료','해당 지점 주소·08:00 개점 확인','예약 양식 검증 필요'),
   method('phone','사카에점 문의','+81 52-951-7676','tel:+81529517676','통화료 별도','공식 지점 번호 확인','예약이 필요한지 문의','공식 사이트 연결 양식의 주소가 방문 지점과 다릅니다.','https://airrsv.net/katocoffee/calendar')
  ]
 }
};

// Only the actual booking event represents each action. Other IDs cover transport,
// repeat visits, and ordinary admission. A source confirms the relevant facility/policy.
const RESERVATION_AUDIT=Object.fromEntries([
 ['required','d5-flight','https://www.centrair.jp/flight/'],
 ['check','d1-checkin','https://nnr-h.com/croom/nagoya/'],
 ['check','d1-train-in d5-airport','https://www.meitetsu.co.jp/train/centrair/guidance/index.html'],
 ['none','d1-arrival d5-security','https://www.centrair.jp/flight/'],
 ['none','d1-hotel-rest f25 s01 s-hotel-return b15 b16 d5-kato-return d5-checkout','https://nnr-h.com/croom/nagoya/'],
 ['none','d1-night-park f02 f03','https://rhp.nagoya/'],
 ['none','f04','https://www.sakaepark.co.jp/'],
 ['none','d1-ramen','https://tabelog.com/aichi/A2301/A230103/23000137/'],
 ['none','f01','https://www.komeda.co.jp/shop/detail.html?id=350'],
 ['none','f20','https://tabelog.com/aichi/A2301/A230103/23081245/'],
 ['none','f05',RAMUCHI],['none','f21',TEBASAKI],['none','f23',TOWER_NIGHT],
 ['none','f07 f08','https://www.beams.co.jp/shop/bna/'],
 ['none','f09','https://store.united-arrows.co.jp/brand/ua/stores/ung.html'],
 ['none','f10 f11','https://www.stussy.com/blogs/chapters/stussy-nagoya'],
 ['none','f12 f13','https://jp.bape.com/pages/store-list/nagoya'],
 ['none','f14 f15','https://www.doubledutch-jp.com/hoods-nagoya'],
 ['none','f16 f17','https://nagoya.parco.jp/shop/detail/?cd=029194'],
 ['none','f18','https://nagoya.parco.jp/shop/detail/?cd=009015'],
 ['none','f19','https://www.atmos-tokyo.com/shop/store/shoplist/29'],
 ['none','s20','https://www.mugiwara-store.com/store/'],
 ['none','s18','https://www.animate.co.jp/shop/sakae/'],
 ['none','s-keshiki-transfer',KESHIKI],['none','s-kurin-transfer',KURIN],
 ['none','s-kannon-transfer s07','https://db.nagoya-info.jp/spot/detail/13/'],
 ['none','s-osu-buffer s-osu-walk','https://osu.nagoya/'],
 ['none','s-shinsuzume','https://osu.nagoya/ja/shop.php?s=lOJDBK'],
 ['none','s08','https://www.kinsyachi.com/shop/darumaya/'],
 ['none','s09 s10','https://www.mandarake.co.jp/shop/ngy/floor_guide.html'],
 ['none','s13 s14','https://www.suruga-ya.jp/feature/realstore/osu_main/index.html'],
 ['none','s11 s12','https://www.lashinbang.com/special/25082/'],
 ['none','s15 s16','https://hobby.volks.co.jp/shop/sr_nagoya.html'],
 ['none','s-sakae-transfer',OKOGE],['none','s-donki-transfer s-donki','https://www.donki.com/store/shop_detail.php?shop_id=348'],
 ['none','b01','https://nnr-h.com/croom/nagoya/'],
 ['none','b02 b04 b05','https://www.towers.jp/'],
 ['none','b05b','https://nagoya.hands.net/'],
 ['none','b06 b07','https://www.kintetsu.co.jp/railway/Dia/dia_nabana_20261017.html'],
 ['none','b08 b14','https://www.sanco.co.jp/shuttle_20261001/'],
 ['none','b10 b11 b13',NABANA_FEES],
 ['none','b12','https://www.nagashima-onsen.co.jp/nabana/restaurant/beer.html'],
 ['none','d5-kato-transfer',KATO],
 ['none','d5-lunch','https://www.centrair.jp/shop-dine/restaurant/'],
 ['none','d5-flight-park','https://www.centrair.jp/flight-of-dreams/'],
].flatMap(([classification,ids,source])=>ids.split(' ').map(id=>[id,{classification,source,reviewedAt:RESERVATION_REVIEW_DATE}])));
