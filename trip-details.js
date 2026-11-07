/* Place identities, itinerary updates and Google Maps links. No API key required. */
const PLACE = {
 hotel:{name:'니시테츠 호텔 크룸 나고야',jp:'西鉄ホテル クルーム名古屋',query:'西鉄ホテル クルーム名古屋 名古屋市中区錦3-4-3'},
 airport:{name:'주부국제공항 센트레아',jp:'中部国際空港 セントレア',query:'中部国際空港 セントレア 愛知県常滑市'},
 station:{name:'메이테츠 나고야역',jp:'名鉄名古屋駅',query:'名鉄名古屋駅 名古屋'},
 sake:{name:'사카에역',jp:'栄駅',query:'栄駅 名古屋'},
 fuji:{name:'후지가오카역 리니모 환승',jp:'藤が丘駅',query:'藤が丘駅 リニモ 名古屋'},
 parkstation:{name:'아이치큐하쿠키넨코엔역',jp:'愛・地球博記念公園駅',query:'愛・地球博記念公園駅 リニモ'},
 park:{name:'지브리파크',jp:'ジブリパーク',query:'ジブリパーク 愛知県長久手市'},
 hill:{name:'청춘의 언덕',jp:'青春の丘',query:'ジブリパーク 青春の丘'},
 warehouse:{name:'지브리의 대창고',jp:'ジブリの大倉庫',query:'ジブリの大倉庫 長久手'},
 valley:{name:'마녀의 계곡',jp:'魔女の谷',query:'ジブリパーク 魔女の谷'},
 forest:{name:'돈도코 숲',jp:'どんどこ森',query:'ジブリパーク どんどこ森'},
 mononoke:{name:'모노노케 마을',jp:'もののけの里',query:'ジブリパーク もののけの里'},
 tower:{name:'중부전력 미라이타워',jp:'中部電力 MIRAI TOWER',query:'中部電力 MIRAI TOWER 名古屋市中区錦3-6-15'},
 hisaya:{name:'히사야오도리 공원',jp:'久屋大通公園 Hisaya-odori Park',query:'Hisaya-odori Park 名古屋'},
 oasis:{name:'오아시스21 지상광장',jp:'オアシス21 緑の大地',query:'オアシス21 名古屋市東区東桜1-11-1'},
 donki:{name:'돈키호테 사카에 본점',jp:'ドン・キホーテ 栄本店',query:'ドン・キホーテ 栄本店 名古屋市中区錦3-17-15'},
 lachic:{name:'라시크',jp:'ラシック',query:'ラシック 名古屋市中区栄3-6-1'},
 osu:{name:'오스상점가 반쇼지도리',jp:'大須商店街 万松寺通',query:'大須商店街 万松寺通 名古屋'},
 kannon:{name:'오스칸논',jp:'大須観音',query:'大須観音 名古屋市中区大須2-21-47'},
 bansho:{name:'반쇼지',jp:'万松寺',query:'万松寺 名古屋市中区大須3-29-12'},
 shike:{name:'시케미치 옛거리',jp:'四間道',query:'四間道 名古屋'},
 endoji:{name:'엔도지 상점가',jp:'円頓寺商店街',query:'円頓寺商店街 名古屋'},
 kokusai:{name:'국제센터역',jp:'国際センター駅',query:'国際センター駅 名古屋'},
 zoo:{name:'히가시야마 동식물원 정문',jp:'東山動植物園 正門',query:'東山動植物園 正門 名古屋'},
 nagoya:{name:'나고야역 기념품 상점',jp:'名古屋駅',query:'名古屋駅 JR 名古屋'}
};
const MENU={
 ramen:{kind:'파이탄 라멘',order:'시시마루 파이탄 라멘 1그릇',jp:'獅子丸ぱいたんらぁめん',explain:'닭·돼지뼈 등으로 우린 크리미한 백탕 면요리. 처음에는 기본 파이탄을 추천하고, 진한 해산물 계열은 당일 메뉴를 보고 선택하세요.'},
 komeda:{kind:'커피와 나고야 모닝',order:'따뜻한 커피 + 토스트 + 오구라앙',jp:'コメダブレンド / モーニング / おぐらあん',explain:'오구라앙은 단팥입니다. 11시 전 음료 주문에 선택형 빵·토핑이 붙는 모닝 서비스. 오래 걷는 일요일에는 달걀이나 샐러드를 별도로 추가하세요.'},
 ramuchi:{kind:'미소카츠 정식',order:'파 듬뿍 미소카츠 정식',jp:'味噌かつ定食',explain:'된장 소스를 올린 돈카츠와 밥·국이 나오는 식사. 파와 소스의 양이 많으니 작은 사이즈·파 조절 가능 여부를 주문 때 물어보세요.'},
 mutsumi:{kind:'테바사키 닭날개 튀김',order:'흑·백 맛 비교, 본본 추가',jp:'黒 / 白 / ぼんぼん',explain:'흑은 달콤한 간장, 백은 소금·후추 계열. 본본은 뼈를 먹기 편하게 손질한 닭날개 메뉴입니다. 매운맛을 좋아하면 적도 후보.'},
 monja:{kind:'몬자야키 철판요리',order:'명란·떡 몬자 + 치즈 토핑',jp:'明太子もちもんじゃ / チーズ',explain:'묽은 반죽을 철판에 펼쳐 작은 주걱으로 떠먹는 요리입니다. 2인이라면 한 판을 나눠 먹고 모자랄 때 추가. 직원에게 조리를 부탁해도 좋습니다.'},
 sushi:{kind:'에도마에 니기리 스시',order:'9관 또는 11관 니기리 세트',jp:'最幸の9貫にぎり / 極上の11貫にぎり',explain:'생선 등을 올린 초밥 세트. 공식 표시 세금 포함 9관 ¥4,620 / 11관 ¥6,050. 주말에는 평일 한정 런치 가격이 적용되지 않습니다.'},
 keshiki:{kind:'키시멘과 텐무스',order:'새우 텐무스 + 키시멘 세트',jp:'海老の天むす / きしめん',explain:'키시멘은 넓고 납작한 면, 텐무스는 새우튀김 주먹밥입니다. 면의 찰기를 원하면 냉, 따뜻한 국물이 좋으면 온 메뉴를 확인하세요. 모닝 제공 범위는 매장 문의.'},
 eel:{kind:'히츠마부시 장어덮밥',order:'히츠마부시 기본 세트',jp:'ひつまぶし',explain:'잘게 자른 장어덮밥을 그대로 먹고, 약미를 넣고, 마지막에 육수와 함께 먹는 나고야식 식사. 필수가 아닌 교체 선택입니다.'}
};
const BLOGS={
 ramen:[{name:'밥집 | 시시마루 라멘 방문기',url:'https://babzip.tistory.com/entry/일본-나고야-맛집-매우-특별했던-뿔닭새우-랍스터-라멘-멘야-시시마루',note:'사진·라멘 종류 참고. 방문 당시 한정 메뉴는 현재와 다를 수 있습니다.'}],
 mutsumi:[{name:'방문기 | 테바사키 무츠미 본점',url:'https://msbahng.tistory.com/m/1570',note:'흑·백 맛과 주문 사진 참고. 과거 영업·휴무 정보는 최신 공식 안내와 다릅니다.'}],
 keshiki:[{name:'토게키스 | 케시키 아침식사·웨이팅 후기',url:'https://togekiss.tistory.com/35',note:'2026년 10월 게시. 텐무스·키시멘 사진과 대기 경험 참고.'}]
};
function applyTripUpdates(){
 restaurants.forEach(r=>{r.dish=MENU[r.id];PLACE[r.id]={name:r.name,jp:r.jp,query:r.jp+' '+r.address};r.blogs=BLOGS[r.id]||[]});
 days[0].events.splice(4,1,
 E('20:50','21:20','미라이타워 외관과 히사야오도리 공원','산책','첫날 밤의 시내 산책. 전망대 입장은 금요일에 남겨둡니다.',['호텔에서 도보 약 5–10분. 타워 외관·공원 수면 주변 야경을 감상.','컨디션이 좋으면 오아시스21 지상광장까지 연결하고, 피곤하면 이 구간만 걸어도 충분합니다.'],'久屋大通公園'),
 E('21:20','21:40','오아시스21 지상에서 야경 보기','관광','옥상은 공사 폐쇄 기간이므로 지상광장 외관만 봅니다.',['공식 관광 안내: 물의 우주선 옥상은 2026.11.04–2027.04.30 예정 폐쇄.','지상에서 외관과 주변 도시 풍경을 촬영. 공사 가림막·현장 통제에 따라 산책 범위를 조정.','금요일 낮과 겹치는 것이 싫으면 오늘은 생략하고 돈키호테로 바로 이동해도 좋습니다.'],'オアシス21'),
 E('21:50','22:30','돈키호테 사카에 본점 쇼핑','쇼핑','원하면 추가하는 첫날 밤 일정. 과자·생활용품 가격을 미리 구경합니다.',['공식 24시간 영업 안내. 오아시스21에서 도보 약 10분, 호텔 복귀도 약 10분.','과자와 다음 날 물 정도만 구매하고 큰 쇼핑은 마지막 날에. 면세 계산은 대기할 수 있습니다.','입국이 늦거나 피곤하면 생략. 일행과 귀가 시각을 정하고 휴식 시간을 확보합니다.'],'ドン・キホーテ 栄本店'));
 days[0].route=['주부국제공항','시시마루 라멘','호텔','미라이타워 외관','오아시스21 지상','돈키호테'];
 days[0].subtitle='첫날 라멘 식사 후 호텔 체크인. 밤에는 공원 야경과 24시간 상점을 선택해서.';
 const oasisEvent=days[1].events.find(e=>e.place==='オアシス21');
 Object.assign(oasisEvent,{title:'오아시스21 지상광장 · 사카에 거리',desc:'옥상 공사 폐쇄를 반영해 지상·지하 구경으로 변경했습니다.',steps:['물의 우주선 옥상은 2026.11.04–2027.04.30 예정 폐쇄. 올라가는 일정은 제외.','지상 녹지·지하 은하의 광장 주변에서 현장 개방 구간만 구경.','목요일 밤에 이미 봤다면 오늘은 주변 사카에 쇼핑·카페 시간을 늘려도 좋습니다.']});
 // Weekend calendar revision: keep stable activity identities when swapping dates.
 const park=days[2],city=days[3];
 park.subtitle='일요일 스탠다드 3개 구역. 07:30 아침, 08:30 출발, 대창고 11시 입장 제안.';
 park.walk='도보 약 7–10km';park.cost='약 ¥9,000–13,000';
 park.events[0]=E('07:30','08:20','고메다에서 든든한 아침','식사','커피·토스트에 달걀이나 샐러드를 더해 아침을 충분히 먹습니다.',['호텔에서 도보 약 3–5분. 식사 시간을 50분 확보.','대기가 15분을 넘으면 전날 준비한 간단식으로 바꾸고 08:30 출발.','대창고 11시는 제안입니다. 구매한 입장 시각이 다르면 출발과 점심도 조정.'],'コメダ珈琲店 桜通大津店','komeda');
 park.events[1]=E('08:30','10:00','식사 후 지브리파크로 이동','이동','호텔 → 사카에역 → 후지가오카역 → 리니모 → 공원역.',['사카에역까지 도보 10–15분 후 히가시야마선 후지가오카행.','리니모 환승·대기 포함 총 75–90분 확보.','실제 열차편은 당일 확인. 역 도착 후 대창고까지 걸을 시간도 확보.'],'愛・地球博記念公園駅');
 park.events[2]=E('10:00','10:45','공원 입구 · 대창고로 산책','관광','공원에서 화장실·사진 시간을 갖고 대창고로 이동합니다.',['대표자 여권·티켓 QR을 준비하고 구역 입장 시 전원이 함께 이동.','청춘의 언덕·돈도코 숲은 스탠다드에 불포함이므로 방문 동선에서 제외.','건물 내부 추가권을 위해 아침 오픈런을 하는 일정은 아닙니다.'],'ジブリパーク');
 park.events[3]=E('11:00','12:45','지브리의 대창고 / 11시 입장 제안','관광','스탠다드 포함 구역. 전시·사진·단편 영화 중 보고 싶은 것을 먼저 봅니다.',['구매한 지정 입장 시각이 우선. 조기 입장은 불가하며 지정 시각 후 1시간 이내 입장.','전시와 시네마 오리온을 보고 기념품점은 원하는 곳만 선택.','대창고는 재입장할 수 없습니다. 내부 카페 식사와 쇼핑을 마친 뒤 퇴장.'],'ジブリの大倉庫');
 park.events[4]=E('12:45','13:30','대륙횡단비행 카페에서 점심','식사','대창고 안 카페. 샌드위치 등 당일 메뉴로 식사합니다.',['퇴장하기 전에 점심·화장실·기념품을 해결. 대창고 재입장 불가.','현장 주문·대기이며 혼잡하면 오후 관람 시간을 줄입니다.','가져온 음식은 지정된 취식 허용 장소에서만.'],'大陸横断飛行 ジブリパーク');
 PLACE.cafe={name:'대륙횡단비행 카페',jp:'大陸横断飛行',query:'大陸横断飛行 ジブリパーク'};
 park.events[5]=E('13:45','15:20','마녀의 계곡 / 하울·키키의 거리','관광','스탠다드 포함 구역. 하울의 성 외관·빵집·모자 가게를 둘러봅니다.',['하울의 성·오키노 저택·마녀의 집 내부는 기본권에 불포함. 외관·상점 중심으로 관람.','건물 당일권 교환권은 주말 09:00부터 선착순 배부. 오후 도착 시 매진될 수 있어 기본 일정에는 포함하지 않습니다.','마녀의 계곡만 재입장 가능. 놀이기구·일부 체험은 별도 요금.'],'ジブリパーク 魔女の谷');
 park.events[6]=E('15:35','16:20','모노노케 마을','관광','스탠다드에 포함된 세 번째 구역. 원령공주의 야외 구조물을 봅니다.',['타타라바와 옷코토누시·타타리신 외관을 중심으로 30–45분 관람.','최종 입장 16:30 전에 전원이 함께 입장. 재입장은 불가.','체험은 추가 요금·접수 여부를 확인하고, 17시 공원 종료 전 역으로 이동.'],'ジブリパーク もののけの里');
 park.events[8].steps=['일요일 19:15 전화 예약 문의. 기존 토요일 예약이 있다면 매장에 변경 가능 여부 확인.','명란·떡·치즈 몬자부터 나눠 먹고 추가 주문.','호텔로 돌아와 귀국 짐 정리. 내일 13:15 호텔 짐 회수·14:50 공항 도착 목표.'];
 park.note='12/12 토요일 매진으로 12/13 일요일 방문 계획. 스탠다드는 대창고·마녀의 계곡·모노노케 마을 3구역이며 성인 주말 ¥3,800 + 발권 수수료. 청춘의 언덕·돈도코 숲 및 계곡의 하울의 성·오키노 저택·마녀의 집 내부는 불포함. 건물 당일권은 선착순·매진 가능하므로 기본 일정에서 제외. 대창고 11시는 미확정 제안이며 실제 티켓 시간이 우선. 대창고·모노노케 재입장 불가, 계곡만 재입장 가능. 티켓 정책: 공식 해외구매 안내 2026.11.06 확인.';
 park.route=['고메다 모닝','후지가오카','공원역','대창고·카페','마녀의 계곡','모노노케 마을','오코게'];
 city.note='토요일 오스 → 시케미치·엔도지 → 야나기바시 스시 순서. 동물원은 오늘 오전의 교체 선택지이며 선택하면 시케미치를 생략하고 오스는 14시부터. 스시의 기존 일요일 예약이 있다면 토요일 17:30 변경 여부를 확인하세요. 저녁에는 일요일 지브리 티켓·여권·아침식사 준비.';
 city.events[6].steps[1]='추가 스시는 가격과 재고를 확인. 주말에는 평일 한정 런치 가격이 적용되지 않습니다.';
 city.events[7].title='호텔 복귀 / 내일 지브리 준비';city.events[7].desc='시내 쇼핑을 마치고 호텔에서 다음 날 준비와 휴식을 합니다.';city.events[7].steps=['남은 생필품 구매는 짧게 마치고 호텔로 복귀.','일요일 스탠다드 QR·여권·실제 대창고 입장 시각 확인.','아침 대기 대비 간단식·물·핫팩을 준비하고 일찍 취침.'];
 days[0].events[3].steps[2]='체크인 시 일요일 출발·대욕장 운영 시간·체크아웃 후 짐 보관 확인.';
 days[1].events[8].title='호텔 복귀 / 휴식';days[1].events[8].desc='토요일은 시내 산책. 다음 날 동선을 확인하고 쉽니다.';days[1].events[8].steps=['쇼핑 짐과 예약 내역 정리.','토요일 스시 예약과 선택 동물원 방문 여부 확인.','지브리 출발 준비는 토요일 밤에.'];
 restaurants.find(r=>r.id==='komeda').day='금·일 07:30';
 const monja=restaurants.find(r=>r.id==='monja');monja.day='일 19:15';monja.booking=monja.booking.replace('토요일 19:15','일요일 19:15');
 const sushi=restaurants.find(r=>r.id==='sushi');sushi.day='토 17:30';for(const key of ['menu','why','booking'])sushi[key]=sushi[key].replaceAll('일요일','토요일');
 restaurants.find(r=>r.id==='eel').day='금 점심 교체 선택';
 zooEvents[0].steps[0]='이동 약 35–45분. 토요일 오전의 교체 선택지입니다.';
 days[2]={...city,date:'12.12',dow:'토요일',stableDay:3};
 days[3]={...park,date:'12.13',dow:'일요일',stableDay:2};
 applyGeroItinerary();
}

const GERO_LINKS={
 bath:'https://www.gero-ogawaya.net/how_to_spend/daytrip/',
 rail:'https://railway.jr-central.co.jp/ticketless/index.html',
 timetable:'https://railway.jr-central.co.jp/timetable/nr_doc/search.html?s=1',
 footbaths:'https://www.city.gero.lg.jp/site/kanko/1246.html'
};

// Apply the revised itinerary while keeping existing IDs for carried-over activities.
function applyGeroItinerary(){
 Object.assign(PLACE,{
  geroStation:{name:"JR 게로역",jp:"JR下呂駅",query:"JR下呂駅"},
  geroTown:{name:"게로 온천마을",jp:"下呂温泉街",query:"下呂温泉街"},
  geroLunch:{name:"게로 온천마을 식당",jp:"下呂温泉 食事処",query:"下呂温泉 飛騨牛 ランチ"},
  ogawaya:{name:"게로 온천 오가와야",jp:"下呂温泉 小川屋",query:"下呂温泉 小川屋"},
  geroRiver:{name:"게로 온천마을",jp:"下呂温泉街 飛騨川",query:"下呂温泉街 飛騨川"},
  jrNagoya:{name:"JR 나고야역",jp:"JR名古屋駅",query:"JR名古屋駅"}
 });
 const visit=(id,placeId,time,end,title,kind,description,steps,food='')=>({
  ...E(time,end,title,kind,description,steps,PLACE[placeId].jp,food),id,placeId
 });
 days[3]={
  ...days[3],
  short:"게로 온천 당일치기",
  title:"게로 온천 당일치기",
  subtitle:"특급 히다 → 온천마을 산책·점심 → 오가와야 대절탕 → 족욕·카페 → 15:32 열차로 나고야 복귀 → 몬자.",
  note:"지브리 예약 불가에 따른 최종 대체 일정. 12/13(일) 오가와야 별관 유라기 대절탕 12:30 시작 목표, 45분 기본 ¥4,400/실(정원 2명, 객실별 요금 확인)을 예약하는 구성을 추천합니다. 사전예약이 필수이며 실제 이용 시각은 예약 화면에서 확인합니다. 본관 대절탕 ¥3,300/45분은 일요일 이용 시작이 15:30이라 추천 복귀 열차와 겹칩니다. JR 특급 히다 3호 08:43 나고야→10:14 게로, 히다 14호 15:32 게로→17:05 나고야는 현재 공개 시간표를 기준으로 한 계획값이며, 12월 실제 운행·좌석은 출발 전 재확인하고 지정석을 확보합니다. 15:32 편을 놓치면 16:18 편은 저녁 여유가 줄어드니 몬자에 연락하거나 유연한 저녁으로 변경합니다.",
  walk:'도보 약 3–5km',
  cost:'대절탕 ¥2,200 (2인 이용 기준) + 열차·식사',
  route:['고메다','JR 나고야역','JR 게로역','온천마을','오가와야','JR 나고야역','호텔','오코게'],
  events:[
   visit("sun-gero-morning", "komeda", "07:00", "07:40", "고메다 모닝 / 게로 나들이 준비", "식사", "아침을 간단히 먹고 나고야역으로 이동합니다.", [
    "07:45까지 호텔을 출발해 나고야역에 08:15 전후 도착하는 계획.",
    "아침 대기가 길면 테이크아웃 또는 간단식으로 바꾸고 특급 승차 시간을 우선합니다.",
    "작은 가방, 보온 겉옷, 갈아입을 속옷을 준비합니다."
   ], "komeda"),
   visit("sun-gero-outbound", "geroStation", "07:45", "10:14", "나고야역 → 게로역 / 특급 히다 3호", "이동", "JR 나고야역에서 다카야마선 특급 히다를 타고 게로로 이동합니다.", [
    "현재 공개 시간표의 계획 예시: 나고야 08:43 출발, 게로 10:14 도착.",
    "호텔에서 나고야역까지 지하철·역내 이동을 포함해 30–40분 확보.",
    "특급권·지정석을 미리 확인하고 실제 12/13 운행 시각을 출발 전 재확인합니다."
   ]),
   visit("sun-gero-town-am", "geroTown", "10:14", "11:30", "게로 온천마을 산책 / 강변·족욕", "산책", "역에서 온천마을 중심부로 걸어가 강변과 족욕을 둘러봅니다.", [
    "게로역→오가와야는 도보 약 7분. 짐을 맡길 수 있는지는 현장 확인.",
    "공공 족욕은 수건을 지참하고, 혼잡하면 강변 산책만 합니다.",
    "오전 산책은 평탄한 중심가 위주로 두어 온천사 계단과 중복 보행을 피합니다."
   ]),
   visit("sun-gero-lunch", "geroLunch", "11:30", "12:15", "게로에서 히다 지역 점심", "식사", "온천마을에서 점심을 먹고 대절탕 예약 시간에 맞춥니다.", [
    "비예약 식당을 기본으로 하며 대기 20분을 넘으면 다른 영업 중인 가게로 변경.",
    "점심을 길게 먹지 않고 12:20까지 오가와야에 도착하는 것을 목표로 합니다.",
    "개별 점포의 12월 영업·메뉴·예약은 출발 전 확인합니다."
   ]),
   visit("sun-gero-private-bath", "ogawaya", "12:30", "13:15", "오가와야 대절탕 / 2인 프라이빗 온천", "온천", "오가와야 별관 유라기의 2인 대절탕을 12:30으로 계획합니다. 사전 예약이 필요합니다.", [
    "본관 대절탕은 45분 ¥3,300/실(최대 4명)이지만 일요일 첫 슬롯은 15:30이라 15:32 복귀 열차와 양립하지 않습니다. 이번 일정은 12:30부터 이용 가능한 별관 유라기 대절탕 45분 ¥4,400/실(정원 2명) 기준.",
    "12:30은 별관 이용 가능 시간대에 맞춘 계획값이며 해당 날짜 예약 가능한 시작 시각은 예약 화면에서 확정해야 합니다.",
    "별관은 서로 다른 7종. 사전예약 필수. 예약이 없으면 공용 족욕·온천마을 산책으로 전환합니다.",
    "대절탕만 이용하면 2인 총 ¥4,400. 공용 대욕장도 추가하면 성인 1인 ¥1,500이 더해져 2인 총 ¥7,400. 이용 조합·당일 추가 요금은 현장 재확인."
   ]),
   visit("sun-gero-town-pm", "geroRiver", "13:15", "15:05", "온천마을 후식·강변 산책 / 선택 온천사", "산책", "목욕 후 따뜻한 음료와 강변 산책으로 여유를 둡니다.", [
    "카페·온천 디저트·족욕 중 두 가지 정도만 고릅니다.",
    "온천사는 게로역에서 도보 약 15분, 일몰 전 자유 참배 안내. 오르막이 있으므로 컨디션이 좋고 시간이 남을 때만 선택.",
    "15:05에는 역 방향으로 이동해 15:15까지 게로역 도착. 기념품 쇼핑을 늘려 열차를 놓치지 않습니다."
   ]),
   visit("sun-gero-return", "jrNagoya", "15:05", "17:30", "게로역 → 나고야역 / 특급 히다 14호", "이동", "15:32 게로 출발, 17:05 나고야 도착 편을 우선 목표로 돌아옵니다.", [
    "현재 공개 시간표 기준 계획 예시: 게로 15:32→나고야 17:05.",
    "호텔까지 지하철·도보 포함 약 25–35분 추정.",
    "15:32 편을 놓칠 때의 다음 16:18→18:06 편은 저녁 준비 시간을 크게 줄입니다. 몬자 예약이 확정됐다면 지연 시 매장에 연락합니다."
   ]),
   visit("sun-gero-rest", "hotel", "17:30", "18:45", "호텔 휴식 / 온천 후 정리", "휴식", "호텔로 돌아와 쉬고 저녁 식사 전 여유를 둡니다.", [
    "젖은 옷·수건 정리, 수분 보충, 잠깐 다리 쉬기.",
    "열차가 늦으면 산책·쇼핑 없이 바로 호텔로 이동."
   ]),
   visit("d3-monja", "monja", "19:15", "20:30", "오코게에서 몬자야키", "식사", "게로에서 돌아온 뒤 기존 저녁 계획을 이어갑니다.", [
    "일요일 19:15는 계획 시각이며 실제 예약 확정 여부는 매장 확인.",
    "호텔에서 도보 약 15–25분. 시간 여유가 부족하면 사전 연락 후 유연한 저녁으로 변경.",
    "15:32 게로 출발편을 기준으로 한 구성. 다음 열차로 돌아오면 식사 전 휴식이 거의 없어 변경을 판단합니다."
   ], "monja")
  ]
 };
 const saturday=days[2];
 saturday.subtitle="오스칸논·상점가 → 호텔 휴식 → 야나기바시 스시. 다음 날 게로 장거리 당일치기를 위해 오후 보행을 줄입니다.";
 saturday.note="토요일은 오스에서 점심을 먹은 뒤 호텔에서 쉬고 17:30 야나기바시 스시로 이동합니다. 동물원은 오전 교체 선택이며, 고르면 오스는 14시부터 둘러봅니다. 저녁에는 일요일 히다 왕복 열차와 오가와야 대절탕 예약을 확인합니다.";
 saturday.route=['호텔','오스칸논','오스상점가','호텔 휴식','야나기바시','호텔'];
 saturday.events[1]=visit("d4-old-town", "hotel", "14:00", "16:45", "호텔 휴식 / 저녁 스시 전 여유", "휴식", "객실에서 쉬거나 주변 카페에서 앉아 다음 날 장거리 이동에 대비합니다.", [
    "기존 14:00–16:45 시케미치·엔도지 산책을 호텔 휴식으로 바꿉니다.",
    "17:10 전후 호텔을 출발해 야나기바시 시장 식당에 도착. 실제 예약 시각·위치를 확인합니다.",
    "체력이 충분해도 골목 방문을 추가하지 않고 다음 날 준비와 휴식을 우선합니다."
   ]);
 saturday.events[5]=visit("d4-market-transfer", "hotel", "13:15", "14:00", "오스에서 호텔로 복귀", "이동", "오스 관람을 마치고 숙소로 돌아가 저녁 식사 전 휴식을 확보합니다.", [
    "히사야오도리역까지 지하철 이동. 환승·역 보행 포함 30–45분 계획.",
    "시케미치·엔도지는 이번 여행에서 생략해 토요일 보행과 다음 날 게로 왕복 피로를 낮춥니다.",
    "14:00 전후 호텔 도착을 목표로 하고 필요하면 점심·상점가 체류를 조금 줄입니다."
   ]);
 saturday.events[6]=visit("d4-sushi", "sushi", "17:30", "18:45", "시장 안 카운터에서 스시", "식사", "전화로 예약 여부를 확인한 후 방문합니다.", [
    "스시 저녁 계획 유지. 실제 예약 여부·시간은 매장에 재확인.",
    "저녁 식사 뒤 호텔 복귀 후 다음 날 특급 열차권과 대절탕 예약 정보를 확인합니다.",
    "일요일은 07:45 호텔 출발 목표이므로 22시 무렵까지 휴식합니다."
   ], "sushi");
 saturday.events[7]=visit("d4-return", "hotel", "19:00", "20:30", "호텔 복귀 / 내일 게로 준비", "휴식", "저녁 식사 뒤 호텔에서 쉬고 다음 날 나들이를 준비합니다.", [
    "일요일 07:45 호텔 출발. 히다 왕복 지정석·열차 시각과 오가와야 대절탕 예약을 확인합니다.",
    "따뜻한 겉옷, 작은 가방, 수건과 갈아입을 옷을 준비합니다."
   ]);
 days[0].events[3].steps[2]='체크인 시 일요일 게로 나들이·대욕장 운영·체크아웃 후 짐 보관 확인.';
 days[1].events[8].steps[2]='일요일은 07:45 호텔 출발. 토요일 밤에 히다 열차와 게로 대절탕 예약 확인.';
 restaurants.find(r=>r.id==='komeda').day='금 07:30 · 일 07:00';
 restaurants.find(r=>r.id==='monja').why='게로에서 돌아온 뒤 숙소 근처에서 즐기는 몬자야키 저녁.';
 restaurants.find(r=>r.id==='ramen').hours='11:00–14:30(LO),17:30–21:30(LO21:00). 공식2026.11.07 확인.';
}
function placesForDay(i){
 const zoo=document.querySelector('#zoo')?.checked;
 const city=zoo?['hotel','zoo','kannon','osu','bansho','sushi']:['hotel','kannon','osu','bansho','hotel','sushi'];
 const keys=[['airport','station','ramen','hotel','hisaya','tower','oasis','donki'],['hotel','komeda','hisaya','ramuchi','lachic','oasis','mutsumi','tower'],city,['komeda','jrNagoya','geroStation','geroTown','geroLunch','ogawaya','geroRiver','geroStation','jrNagoya','hotel','monja'],['hotel','kokusai','keshiki','nagoya','station','airport']][i];
 return keys.map(k=>({id:k,...PLACE[k],optional:i===0&&['oasis','donki'].includes(k)}));
}
function mapEmbed(points){return 'https://maps.google.com/maps?'+new URLSearchParams({saddr:points[0].query,daddr:points.slice(1).map(p=>p.query).join(' to:'),output:'embed',hl:'ko',...(points.every(p=>['park','warehouse','cafe','valley','forest','hill','mononoke'].includes(p.id))?{dirflg:'w'}:{})}).toString()}
function singleEmbed(p){return 'https://maps.google.com/maps?'+new URLSearchParams({q:p.query,output:'embed',hl:'ko'}).toString()}
function appMap(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}
function directions(q,mode,origin){return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',destination:q,travelmode:mode,...(origin?{origin}: {})}).toString()}
function placeForEvent(e){
 const r=restaurants.find(r=>r.id===e.food);if(r)return PLACE[r.id];
 const aliases={'中部国際空港':'airport','名鉄名古屋駅':'station','西鉄ホテル クルーム名古屋':'hotel','久屋大通公園':'hisaya','オアシス21':'oasis','ドン・キホーテ 栄本店':'donki','ラシック 名古屋':'lachic','中部電力 MIRAI TOWER':'tower','愛・地球博記念公園駅':'parkstation','ジブリパーク':'park','ジブリの大倉庫':'warehouse','ジブリパーク 魔女の谷':'valley','ジブリパーク どんどこ森':'forest','大陸横断飛行 ジブリパーク':'cafe','四間道 名古屋':'shike','大須観音':'kannon','大須商店街':'osu','東山動植物園':'zoo','名古屋駅':'nagoya'};
 return PLACE[aliases[e.place]]|| (e.place?{name:e.place,jp:e.place,query:e.place+' 名古屋'}:null);
}
function foodPreview(r){return r?.dish?`<p class="dishpreview"><span>${r.dish.kind}</span>추천 <b>${r.dish.order}</b></p>`:''}
function menuDetails(r){return r?.dish?`<div class="menudetail"><h5>무엇을 먹을까</h5><p><strong>${r.dish.order}</strong><span lang="ja">${r.dish.jp}</span></p><p>${r.dish.explain}</p></div>`:''}
function reviewLinks(r){if(!r)return '';const blogs=r.blogs||[];return `<details class="reviewnotes"><summary>한국어 후기 참고</summary>${blogs.map(b=>`<p>${link(b.url,b.name)}<small>${b.note}</small></p>`).join('')}${blogs.length?'':`<p>확인된 한국어 블로그 원문이 없어 검색 링크를 제공합니다. 검색 결과의 지점명·방문일을 확인하세요.</p>`}<p>${link('https://search.naver.com/search.naver?where=blog&query='+encodeURIComponent('나고야 '+r.name+' 후기'),'네이버 블로그 더 찾기')}</p><small>방문 경험 참고용입니다. 가격·운영·예약 조건은 위 공식·타베로그 안내를 우선하세요.</small></details>`}

/* Optional things to do within each area. These are never timed itinerary stops. */
const SHOP_GUIDE={
 mandarake:{name:'만다라케 나고야점',short:'만다라케',jp:'まんだらけ 名古屋店',category:'굿즈',tag:'중고 피규어·만화',hours:'12:00–20:00',address:'大須3丁目18-21',query:'まんだらけ 名古屋店 大須3丁目18-21',url:'https://www.mandarake.co.jp/dir/ngy/',minutes:'30–45분',picks:['절판 만화와 중고 피규어 살펴보기','상태·부속품을 비교하며 작품별 상품 고르기'],note:'오전에는 닫혀 있으니 12시 이후 선택. 재고는 매일 달라집니다.'},
 superpotato:{name:'슈퍼포테이토 나고야점',short:'슈퍼포테이토',jp:'スーパーポテト 名古屋店',category:'게임',tag:'레트로 게임·게임 음악',hours:'11:00–20:00',address:'大須3丁目11-30',query:'スーパーポテト 名古屋店 大須3丁目11-30',url:'https://www.superpotato.com/shop/nagoya/',minutes:'20–30분',picks:['옛 게임기와 게임 소프트 구경','게임 음악 CD·캐릭터 코너 둘러보기'],note:'구매 전 지역 코드·전압·작동 상태를 확인하세요. 11시 이후에 들르기.'},
 alice:{name:'수요일의 앨리스 나고야',short:'수요일의 앨리스',jp:'水曜日のアリス 名古屋',category:'소품',tag:'앨리스 테마 소품·액세서리',hours:'10:00–20:00 / 연말연시 변동',address:'大須2-20-25',query:'水曜日のアリス 名古屋 大須2-20-25',url:'https://osu.nagoya/ja/shop.php?s=3OornP',minutes:'15–25분',picks:['작은 문과 테마 장식 살펴보기','취향에 맞는 액세서리·작은 선물 고르기'],note:'오스칸논 주변에서 상점가로 들어갈 때 고르기 좋은 소품점입니다.'},
 lees:{name:'리산의 대만명물 포장마차 본점',short:'리산 대만치킨',jp:'李さんの台湾名物屋台 本店',category:'간식',tag:'대만식 닭튀김·타피오카',hours:'일·공휴일 11:30–20:00 / 평일 12:00–20:00 / 수 휴무',address:'大須3-35-10',query:'李さんの台湾名物屋台 本店 大須3-35-10',url:'https://osu.nagoya/ja/shop.php?s=95Rjm5',minutes:'10–20분',picks:['대만식 닭튀김을 나눠 먹기','음료가 필요하면 타피오카 선택'],note:'오스 점심 먹거리의 한 가지 후보입니다. 저녁 스시를 생각해 양을 조절하세요.'},
 parco:{name:'애니메이트 나고야 PARCO',short:'애니메이트 PARCO',jp:'アニメイト名古屋パルコ',category:'굿즈',tag:'신작 굿즈·만화',hours:'10:00–20:00 / 시설 운영에 따름',address:'栄3丁目29-1 名古屋PARCO東館4階',query:'アニメイト名古屋パルコ',url:'https://www.animate.co.jp/shop/sakae/',minutes:'30–45분',picks:['좋아하는 작품의 굿즈·문구 고르기','만화·캐릭터 코너 둘러보기'],note:'라시크 내부 매장이 아닌 PARCO 매장입니다. 11/13 확장 재개장 예정이므로 층·운영을 출발 전 확인하세요.'},
 jump:{name:'점프숍 나고야점',short:'점프숍',jp:'ジャンプショップ 名古屋店',category:'굿즈',tag:'점프 작품 공식 캐릭터 상품',hours:'10:00–21:00',address:'栄3-28-11 名古屋ZERO GATE 1F',query:'ジャンプショップ 名古屋店 名古屋ZERO GATE',url:'https://zerogate.parco.jp/nagoya/index.php',minutes:'20–30분',picks:['좋아하는 점프 작품 상품 구경','기념으로 가져갈 문구·소품 선택'],note:'PARCO와 가까운 ZERO GATE 매장입니다. 작품별 취급·재고는 현장에서 확인하세요.'},
 harbs:{name:'하브스 사카에 본점',short:'하브스',jp:'HARBS 栄本店',category:'카페',tag:'케이크·커피',hours:'11:00–20:00 / 매장 이용 LO 19:30',address:'錦3-6-17 セントラルパークビル2F',query:'HARBS 栄本店 錦3-6-17',url:'https://www.harbs.co.jp/shop_tokai/',minutes:'30–45분',picks:['진열된 케이크 중 한 조각 고르기','따뜻한 음료와 함께 쉬기'],note:'아침 공원 산책 시간에는 아직 열기 전입니다. 낮에 사카에로 돌아왔을 때 휴식 후보로 고르세요.'},
 snowpeak:{name:'스노우피크 히사야오도리 공원점',short:'스노우피크',jp:'Snow Peak 久屋大通公園',category:'쇼핑',tag:'아웃도어 용품·의류',hours:'10:00–20:00 / 비정기 휴무',address:'錦3丁目5-15先 RAYARD Hisaya-odori Park ZONE3',query:'Snow Peak 久屋大通公園',url:'https://sbs.snowpeak.co.jp/hisayaodoripark/',minutes:'15–25분',picks:['일상에서도 쓸 수 있는 의류·용품 구경','공원 산책 중 매장만 짧게 둘러보기'],note:'오전 10시 이전과 밤 20시 이후에는 쇼핑할 수 없습니다. 공원 야경과 구분해서 선택하세요.'},
 donguriSakae:{name:'동구리공화국 사카에 공원점',short:'동구리공화국',jp:'どんぐり共和国 栄公園店',category:'기념품',tag:'오아시스21 지하 지브리 굿즈',hours:'10:00–21:00 / 시설 휴관일 적용',address:'東桜1-11-1 オアシス21 B1F',query:'どんぐり共和国 栄公園店 オアシス21',url:'https://www.benelic.com/donguri/shop-feature/app/',minutes:'15–25분',picks:['지브리 캐릭터 생활 소품 구경','파크에서 못 산 기념품 후보 비교'],note:'지브리파크 입장권이 필요 없는 도심 매장입니다. 파크 한정 상품 판매를 보장하지 않습니다.'},
 animate:{name:'애니메이트 나고야점',short:'애니메이트',jp:'アニメイト名古屋',category:'굿즈',tag:'나고야역 서쪽 굿즈·서적',hours:'10:00–20:00',address:'椿町18-4 椿太閤ビル',query:'アニメイト名古屋 椿町18-4',url:'https://www.animate.co.jp/shop/nagoya/',minutes:'30–45분',picks:['좋아하는 작품의 굿즈와 만화 찾기','음반·영상물 코너 둘러보기'],note:'다이코도리 출구에서 도보 5분인 서쪽 매장입니다. 역 동쪽 쇼핑과 왕복할 시간이 있을 때만 선택하세요.'},
 donguriGate:{name:'동구리공화국 게이트타워몰점',short:'동구리공화국',jp:'どんぐり共和国 名古屋 タカシマヤゲートタワーモール店',category:'기념품',tag:'역 연결 지브리 생활 소품',hours:'10:00–20:00 / 시설 휴관일 적용',address:'名駅1-1-3 JRゲートタワー1F',query:'どんぐり共和国 タカシマヤゲートタワーモール店',url:'https://www.benelic.com/donguri/shop-feature/app/',minutes:'15–25분',picks:['작은 캐릭터 소품·선물 구경','공항 이동 전에 살 기념품 한 가지 선택'],note:'역 쇼핑 중 짧게 고를 수 있는 후보입니다. 사카에 지점과 둘 다 방문할 필요는 없습니다.'},
 takashimaya:{name:'JR 나고야 다카시마야 지하 식품관',short:'다카시마야 식품관',jp:'ジェイアール名古屋タカシマヤ B1F',category:'식품관',tag:'과자·도시락·나고야 먹거리',hours:'통상 10:00–20:00 / 변경 가능',address:'名駅1-1-4 ジェイアール名古屋タカシマヤ B1F',query:'ジェイアール名古屋タカシマヤ 地下1階',url:'https://www.jr-takashimaya.co.jp/floor/b1/',extraUrl:'https://www.jr-takashimaya.co.jp/hour/?vm=r',minutes:'20–30분',picks:['상온 보관 가능한 과자 선물 비교','필요하면 간단한 도시락·간식 고르기'],note:'백화점 지하의 여러 브랜드를 한 번에 둘러보는 선택지입니다. 12:20 호텔 짐 회수 이동은 늦추지 마세요.'},
 newpoppy:{name:'찻집 뉴 포피',short:'뉴 포피',jp:'喫茶ニューポピー',category:'카페',tag:'창고 건물 카페·철판 오구라 토스트',hours:'08:00–18:00 / 목·둘째 수 휴무',address:'那古野1丁目36-52',query:'喫茶ニューポピー 那古野1丁目36-52',url:'https://b-bitou.com/shop/',minutes:'30–45분',picks:['철판 오구라 토스트와 커피 선택','창고 건물 안에서 골목 산책 중 쉬기'],note:'대기가 길면 엔도지의 다른 휴식 후보로 바꾸세요. 스시 예약 전 이동 여유를 남기세요.'},
 matsuba:{name:'찻집 마쓰바',short:'마쓰바',jp:'喫茶まつば',category:'카페',tag:'엔도지 자가배전 커피',hours:'08:00–18:00 / 수 휴무',address:'那古野1-35-14',query:'喫茶まつば 那古野1-35-14',url:'https://ec.endojishotengai.com/shop/matuba',minutes:'20–40분',picks:['자가배전 커피로 잠깐 쉬기','상점가 산책 중 토스트 메뉴 확인'],note:'오후에는 모닝 시간을 전제로 주문하지 마세요. 뉴 포피와 둘 중 한 곳을 골라도 충분합니다.'},
 adventure:{name:'모험비행단',short:'모험비행단',jp:'冒険飛行団',category:'기념품',tag:'대창고 메인 기념품점',hours:'구역 운영 시간 내 / 현장 안내 확인',address:'ジブリの大倉庫 内',query:'ジブリの大倉庫 冒険飛行団',url:'https://ghibli-park.jp/shop/',minutes:'20–30분',picks:['파크 오리지널 상품 확인','작품별 소품 중 사고 싶은 것만 고르기'],note:'대창고에 입장 가능한 티켓이 필요합니다. 품절이나 대기 시간을 고려해 관람 시간 안에서 선택하세요.'},
 minamimachi:{name:'대창고 남쪽거리 상점들',short:'남쪽거리 상점',jp:'ジブリの大倉庫 南街',category:'구경',tag:'서점·모형·옛날 과자점',hours:'대창고 관람 시간 안에서 / 현장 운영 확인',address:'ジブリの大倉庫 南街',query:'ジブリの大倉庫 南街',url:'https://ghibli-park.jp/shop/',minutes:'15–20분',picks:['넷푸 서점과 오조라 모형 구경','옛날 과자점에서 작은 간식 찾기'],note:'대창고 내부의 선택 코스입니다. 일부 매장은 실제 상품을 구매할 수 있습니다.'},
 witches:{name:'13인의 마녀단',short:'13인의 마녀단',jp:'13人の魔女団',category:'기념품',tag:'마녀의 계곡 테마 상품',hours:'구역 운영 시간 내 / 현장 안내 확인',address:'魔女の谷 内',query:'ジブリパーク 13人の魔女団',url:'https://ghibli-park.jp/shop/',minutes:'15–25분',picks:['계곡 건물·작품을 모티브로 한 소품 구경','여러 기념품점 중 취향에 맞는 곳 선택'],note:'마녀의 계곡 입장 조건을 충족해야 이용할 수 있습니다. 다음 선택 구역 이동 시간을 남기세요.'},
 hatter:{name:'해터 모자점',short:'해터 모자점',jp:'ハッター帽子店',category:'소품',tag:'오리지널 모자·캔디 틴',hours:'계곡 관람 시간 안에서 / 현장 운영 확인',address:'魔女の谷 内',query:'ジブリパーク ハッター帽子店',url:'https://ghibli-park.jp/shop/',minutes:'10–20분',picks:['모자와 캔디 틴 구경','계곡 산책 중 작은 상점 체험'],note:'마녀의 계곡 입장권 범위가 우선입니다. 13인의 마녀단과 전부 들를 필요는 없습니다.'}
};
const AREA_GUIDES={
 osu:{name:'오스상점가',intro:'굿즈·게임·소품·간식 중 1~2곳만 골라보기. 만다라케는 12시, 게임점은 11시 이후.',places:['mandarake','superpotato','alice','lees']},
 lachic:{name:'사카에·야바초',intro:'라시크 쇼핑 시간 안에서 고르는 주변 매장. PARCO와 ZERO GATE는 별도 건물입니다.',places:['parco','jump']},
 hisaya:{name:'히사야오도리 공원 주변',intro:'낮에 공원 근처를 다시 지날 때 고르는 선택지. 이른 아침·늦은 밤에는 매장 영업시간을 확인하세요.',places:['harbs','snowpeak']},
 oasis:{name:'오아시스21',intro:'지상 산책 뒤, 시간이 맞으면 지하 매장에 짧게 들러보기.',places:['donguriSakae']},
 nagoya:{name:'나고야역 주변',intro:'서쪽 굿즈점 또는 역 연결 상점 중 고르기. 귀국일에는 12:20 짐 회수 이동을 우선하세요.',places:['animate','donguriGate','takashimaya']},
 shike:{name:'시케미치',intro:'골목 산책 중 한 곳에서 쉬어가기. 대기가 길면 엔도지의 카페와 비교하세요.',places:['newpoppy']},
 endoji:{name:'엔도지 상점가',intro:'시케미치와 이어서 걷다가 쉬어갈 수 있는 카페.',places:['matsuba']},
 warehouse:{name:'지브리의 대창고 안',intro:'예약된 관람 시간 안에서 골라보기. 상점을 위한 별도 이동 일정은 없습니다.',places:['adventure','minamimachi']},
 valley:{name:'마녀의 계곡 안',intro:'계곡을 구경하며 취향에 맞는 상점만 선택. 입장권 조건과 다음 이동 시간이 우선입니다.',places:['witches','hatter']}
};
function areaGuideForStop(point){if(point.id==='osu'&&point.eventId!=='d4-osu')return null;if(point.kind==='이동')return null;return AREA_GUIDES[point.id]||null}

/* One-sentence purpose shown consistently on every itinerary place. */
const PLACE_INTROS={
 hotel:'히사야오도리역 근처 숙소. 체크인·휴식·짐 보관의 거점입니다.',airport:'주부국제공항 센트레아. 공항철도 이용과 입출국 수속을 하는 곳입니다.',station:'공항철도와 지하철을 갈아타는 메이테츠 나고야역입니다.',nagoya:'역과 백화점이 연결된 쇼핑 구역. 옷·생활소품·먹거리 선물을 고릅니다.',sake:'지브리파크 방면 히가시야마선을 타는 사카에역입니다.',fuji:'지하철에서 리니모로 갈아타는 환승역입니다.',parkstation:'지브리파크가 있는 공원의 입구역. 전시 구역까지는 더 걸어갑니다.',park:'넓은 기념공원 안에 지브리 작품별 구역이 나뉜 테마 공간입니다.',hill:'「귀를 기울이면」의 지구옥 등 작품 속 건물을 만나는 구역입니다.',warehouse:'전시·단편 상영·기념품점이 모인 지브리의 실내 전시 공간입니다.',valley:'「하울의 움직이는 성」과 「마녀 배달부 키키」의 건물을 만나는 구역입니다.',forest:'「이웃집 토토로」의 사츠키와 메이의 집이 있는 숲속 구역입니다.',mononoke:'「원령공주」의 세계를 모티브로 한 야외 체험 구역입니다.',cafe:'대창고 관람 중 샌드위치·피자 등으로 점심을 먹는 카페입니다.',tower:'나고야 도심을 내려다보는 전망 타워. 밤에는 야경을 봅니다.',hisaya:'타워 주변으로 길게 이어지는 도심 공원. 산책과 주변 상점 구경을 합니다.',oasis:'타원형 유리 구조물로 유명한 사카에 광장. 이번 여행은 지상·지하층 위주입니다.',lachic:'사카에의 패션·생활잡화 쇼핑몰. 주변 PARCO까지 취향에 맞춰 둘러봅니다.',osu:'아케이드 골목에 옷·빈티지·굿즈·간식 가게가 모인 상점가입니다.',kannon:'오스상점가 서쪽의 관음 사찰. 참배와 거리 산책의 시작점입니다.',bansho:'오스상점가 안에 있는 사찰. 주변 쇼핑 골목과 함께 잠깐 둘러봅니다.',shike:'창고와 오래된 건물 외관이 남은 골목. 산책과 레트로 카페를 즐깁니다.',endoji:'시케미치와 이어 걷는 지붕 있는 상점가. 오래된 찻집에서 쉬어갑니다.',kokusai:'시케미치·엔도지 골목 산책으로 들어가기 위한 지하철 도착역입니다.',zoo:'코알라 등 동물 전시와 식물원을 함께 볼 수 있는 넓은 동식물원입니다.',kamimaezu:'오스상점가 동쪽에서 지하철로 이동하기 편한 가미마에즈역입니다.',donki:'과자·생필품·기념품을 한 번에 둘러볼 수 있는 할인점입니다.',ramen:'크리미한 파이탄 라멘으로 알려진 나고야역 근처 라멘집입니다.',komeda:'커피와 토스트 모닝을 먹으며 아침을 시작하는 나고야식 카페입니다.',ramuchi:'파가 듬뿍 올라간 된장 소스 돈카츠, 미소카츠 정식을 먹는 식당입니다.',mutsumi:'흑·백 맛 닭날개를 비교해 먹는 테바사키 전문점입니다.',monja:'철판에서 구워 먹는 몬자야키 전문점. 명란·떡·치즈 조합을 고릅니다.',sushi:'야나기바시 시장 안에서 니기리 세트를 먹는 스시 카운터입니다.',keshiki:'새우 텐무스와 키시멘을 먹기 위해 들르는 아침 식사 후보입니다.'
};
function placeIntro(point){return PLACE_INTROS[point.id]||'이동 동선 안에서 둘러보는 장소입니다.'}
Object.assign(SHOP_GUIDE,{
 wegoOsu:{name:'WEGO 오스점',short:'WEGO',jp:'WEGO 大須店',category:'옷',tag:'캐주얼 옷·가방·액세서리',hours:'11:00–19:00 / 시설 휴관일 제외',address:'大須3-14-43 第2アメ横ビル2F',query:'WEGO 大須店',url:'https://wego.jp/a/shops/chubu',minutes:'20–30분',picks:['평소 입을 캐주얼 상·하의 비교','가방·모자 등 작은 패션 소품 구경'],note:'부담 적은 캐주얼 쇼핑 후보. 같은 건물 1층의 RUSHOUT과 함께 비교하고 사고 싶은 것만 고르세요.'},
 rushout:{name:'RUSHOUT 나고야 오스점',short:'RUSHOUT',jp:'RUSHOUT 名古屋大須店',category:'빈티지',tag:'미국 빈티지·스웨트·티셔츠',hours:'12:00–20:00 / 연중무휴 안내',address:'大須3-14-43 第2アメ横ビル1F 3号室',query:'RUSHOUT 名古屋大須店',url:'https://www.rushout.jp/hpgen/HPB/entries/650.html',minutes:'20–40분',picks:['스웨트·프린트 티셔츠를 취향대로 찾기','실측과 상태를 보고 입어볼 옷 고르기'],note:'중고 의류는 같은 브랜드도 가격·상태가 다릅니다. 12시 이후 점심·쇼핑 시간 안에서 선택하세요.'},
 secondStreet:{name:'세컨드스트리트 오스 아카몬점',short:'세컨드스트리트',jp:'セカンドストリート 大須赤門店',category:'빈티지',tag:'브랜드 혼합 중고 의류·가방',hours:'11:00–21:00 / 임시 변경은 매장 확인',address:'大須3丁目10-16',query:'セカンドストリート 大須赤門店',url:'https://circular.city.nagoya.jp/reuse/shop/',extraUrl:'https://www.2ndstreet.jp/shop/details?shopsId=31547',minutes:'20–40분',picks:['캐주얼 중고 의류와 가방 비교','가격표·오염·실측을 확인하며 고르기'],note:'명품부터 캐주얼까지 섞여 있습니다. 저렴한 물건만 있는 가게는 아니므로 예산에 맞는 구역부터 보세요.'},
 wegoParco:{name:'WEGO 나고야 PARCO점',short:'WEGO PARCO',jp:'WEGO 名古屋パルコ店',category:'옷',tag:'캐주얼·트렌드 옷과 패션 소품',hours:'시설 영업시간 확인 / PARCO 물판 통상 10:00–20:00',address:'栄3-29-1 名古屋PARCO南館4F',query:'WEGO 名古屋パルコ店',url:'https://nagoya.parco.jp/shop/detail/?cd=007830',extraUrl:'https://nagoya.parco.jp/info/',minutes:'20–30분',picks:['옷과 가방·모자를 한 번에 둘러보기','오스점과 비교해 한 지점만 고르기'],note:'애니메이트와 같은 PARCO 일대에서 고를 수 있습니다. 브랜드 목록의 21시 표기와 시설 시간이 달라 현장 마감 확인을 권합니다.'},
 uniqloGate:{name:'유니클로 나고야점',short:'유니클로',jp:'ユニクロ 名古屋店',category:'옷',tag:'기본 옷·겨울 이너·니트',hours:'10:00–21:00 / 시설 변경 가능',address:'名駅1-1-3 JRゲートタワー11F',query:'ユニクロ 名古屋店 JRゲートタワー',url:'https://www.towers.jp/translate/ko/information/',minutes:'20–30분',picks:['기본 니트와 이너 등 필요한 옷 비교','같은 층 GU와 소재·핏 비교'],note:'역과 연결된 건물에서 쇼핑할 수 있습니다. 귀국일에는 여러 층을 전부 도는 대신 필요한 품목부터 고르세요.'},
 guGate:{name:'GU 나고야 게이트타워점',short:'GU',jp:'ジーユー 名古屋ゲートタワー店',category:'옷',tag:'트렌드 캐주얼·편한 일상복',hours:'10:00–21:00 / 시설 변경 가능',address:'名駅1-1-3 JRゲートタワー11F',query:'GU 名古屋ゲートタワー店',url:'https://www.towers.jp/translate/ko/information/',minutes:'20–30분',picks:['평소 입기 좋은 캐주얼 상·하의 찾기','유니클로와 비교해 원하는 핏 선택'],note:'럭셔리 브랜드 대신 캐주얼 옷을 보기 좋은 후보입니다. 가격·재고는 당일 상품 기준으로 비교하세요.'},
 bside:{name:'B-SIDE LABEL 나고야점',short:'B-SIDE LABEL',jp:'B-SIDE LABEL 名古屋店',category:'소품',tag:'일러스트 스티커·작은 선물',hours:'11:00–20:00 / 셋째 수요일 휴무(공휴일 제외)',address:'大須3丁目29-25 ナカノビル1F',query:'B-SIDE LABEL 名古屋店',url:'https://bside-label.com/archives/shop/名古屋',extraUrl:'https://bside-label.com/archives/81618',minutes:'10–20분',picks:['마음에 드는 일러스트 스티커 고르기','작은 선물이나 여행 기록용 소품 찾기'],note:'11시 이후 오스 쇼핑 중 짧게 들르기 좋습니다. 디자인·재고는 방문일에 확인하세요.'},
 hands:{name:'핸즈 나고야점',short:'핸즈',jp:'ハンズ 名古屋店',category:'문구',tag:'문구·생활소품·작은 선물',hours:'10:00–20:00 / 매장 공지 확인',address:'名駅1-1-4 JR名古屋タカシマヤ5F～10F',query:'ハンズ 名古屋店',url:'https://nagoya.hands.net/sp/access/',extraUrl:'https://info.hands.net/news/20260204-nagoya-close.html',minutes:'20–40분',picks:['문구·생활용품 중 관심 있는 층만 보기','부피 작은 선물이나 여행 소품 비교'],note:'2027년 1월 11일 영업 종료 예정이라 이번 12월 여행 기간과 구분해야 합니다. 현재 5~10층 운영 안내를 확인하고 방문하세요.'}
});
AREA_GUIDES.osu.places=['wegoOsu','rushout','secondStreet','bside','mandarake','superpotato','alice','lees'];
AREA_GUIDES.osu.intro='옷·빈티지, 굿즈·소품, 간식 중 관심 있는 분야로 골라보기. 옷가게는 11~12시 이후 선택하세요.';
AREA_GUIDES.lachic.places=['wegoParco','parco','jump'];
AREA_GUIDES.nagoya.places=['guGate','uniqloGate','hands','animate','donguriGate','takashimaya'];
function choiceCategory(place){return ['옷','빈티지'].includes(place.category)?'clothes':['간식','카페','식품관'].includes(place.category)?'food':'goods'}
Object.assign(PLACE_INTROS,{
 jrNagoya:'특급 히다를 타고 내리는 JR 나고야역.',
 geroStation:'온천마을의 관문. 돌아갈 때는 15:15까지 역 도착 목표.',
 geroTown:'히다강 옆 온천 거리. 산책과 무료 족욕을 즐기는 구역.',
 geroLunch:'히다 지역 음식을 고르는 자유 점심. 지도 핀은 온천마을 중심부를 표시합니다.',
 ogawaya:'별관 유라기의 2인 대절탕. 12:30 시작을 목표로 사전 예약.',
 geroRiver:'히다강 주변에서 후식·족욕·산책을 즐기고 15:05에 역으로 이동.'
});
