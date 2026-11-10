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
 shoraku:{kind:'마늘 라멘',order:'닌니쿠 라멘 · 마늘 양 선택',jp:'にんにくらーめん',explain:'마늘을 적게 넣고 싶다면 주문할 때 양을 확인하세요.'},
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
function prepareTripPlaces(){
 for(const restaurant of restaurants){
  const {id,name,jp,address}=restaurant;
  restaurant.dish=MENU[id];
  restaurant.blogs=BLOGS[id]||[];
  PLACE[id]={name,jp,query:jp+' '+address};
 }
 Object.assign(PLACE,{
  jrNagoya:{name:'JR 나고야역',jp:'JR名古屋駅',query:'JR名古屋駅'},
  kanayama:{name:'가나야마역',jp:'金山駅',query:'金山駅 名鉄 名古屋'},
  cafe:{name:'대륙횡단비행 카페',jp:'大陸横断飛行',query:'大陸横断飛行 ジブリパーク'}
 });
 const ramen=restaurants.find(r=>r.id==='ramen');
 ramen.day='목 저녁 선택';ramen.hours='11:00–14:30(LO), 17:30–21:30(LO 21:00).';
 ramen.booking='메이테츠 나고야에 19:00까지 도착하고 짐을 바로 맡길 수 있을 때 선택. 대기가 길거나 20:15까지 매장에 도착하기 어렵다면 호텔로 바로 이동합니다.';
 const komeda=restaurants.find(r=>r.id==='komeda');
 komeda.day='금 08:25 · 일 07:00';
 komeda.booking='현장 방문. 일요일 아침에는 바로 입장하기 어렵다면 준비한 간단식으로 바꿉니다.';
 const sushi=restaurants.find(r=>r.id==='sushi');
 sushi.day='토 17:30';
 for(const key of ['menu','why','booking'])sushi[key]=sushi[key].replaceAll('일요일','토요일');
 const keshiki=restaurants.find(r=>r.id==='keshiki');
 keshiki.menu='새우 텐무스 모닝을 우선하고, 키시멘은 모닝 메뉴에 있으면 함께 주문합니다.';
 restaurants.find(r=>r.id==='eel').day='금 점심 교체 선택';
 restaurants.find(r=>r.id==='eel').why='원한다면 금요일 점심을 장어로 교체하는 선택지입니다.';
}

// Public operating information for the booked itinerary. Walk times are itinerary allowances.
const VENUE_VISITS = {
 donki:{hours:'24시간 영업 · 야간 면세 접수는 매장 확인',picks:'과자, 화장품, 기념품, 생활용품. 여권 원본을 지참하고 결제 전에 환급 접수를 문의하세요.',source:'https://www.donki.com/store/shop_detail.php?shop_id=348'},
 beams:{hours:'11:00–21:00 · 비정기 휴무',picks:'BEAMS PLUS의 재킷·셔츠, BEAMS T 그래픽 상의, 모자·잡화.',source:'https://www.beams.co.jp/shop/bna/'},
 unitedArrows:{hours:'11:00–21:00 · 라시크 영업 일정에 따름',picks:'깔끔한 캐주얼, 테일러드 재킷, 신발과 액세서리. BEAMS와 핏을 비교하기 좋습니다.',source:'https://store.united-arrows.co.jp/brand/ua/stores/ung.html'},
 stussy:{hours:'월~일 11:00–19:00 · 공식 챕터 안내',picks:'그래픽 티셔츠·후디·캡. 시즌 아우터는 사이즈를 먼저 확인하세요.',source:'https://www.stussy.com/blogs/chapters/stussy-nagoya'},
 bape:{hours:'11:00–19:00 · 공식 매장 목록',picks:'A BATHING APE 카모 후드와 그래픽 티셔츠, 작은 액세서리.',source:'https://jp.bape.com/pages/store-list/nagoya'},
 hoods:{hours:'11:00–20:00 · 정기휴무 미공개',picks:'NEIGHBORHOOD의 워크웨어와 WTAPS의 밀리터리풍 상의·아우터.',source:'https://www.doubledutch-jp.com/hoods-nagoya'},
 blackeye:{hours:'PARCO 일반 쇼핑 10:00–20:00. 브랜드 페이지는 21:00 마감 표기이므로 오후 방문 권장.',picks:'도쿄 스트리트웨어의 로고 티셔츠·후드와 그래픽 소품.',source:'https://nagoya.parco.jp/shop/detail/?cd=029194',extra:'https://blackeyepatch.com/en/pages/store'},
 freaks:{hours:'PARCO 일반 쇼핑 10:00–20:00 · 시설 일정에 따름',picks:'아메리칸 캐주얼의 데님·워크웨어·아우터를 BEAMS와 비교.',source:'https://nagoya.parco.jp/shop/detail/?cd=009015'},
 atmos:{hours:'10:00–20:00 · PARCO 영업 일정에 따름',picks:'스니커즈와 스트리트 의류. 모델명과 일본 cm 사이즈를 확인하세요.',source:'https://www.atmos-tokyo.com/shop/store/shoplist/29'},
 darumaya:{hours:'10:00–19:00 · 수요일 휴무',picks:'오스 니오몬도리의 캐릭터 완구와 특촬 장난감. 다음 중고점과 비교할 첫 매장.',source:'https://www.kinsyachi.com/shop/darumaya/'},
 mandarake:{hours:'12:00–20:00 · 공식 안내상 연중무휴',picks:'2층 중고 완구·피규어, 4층 로봇·마법소녀 완구. 박스·부속품 상태를 비교하세요.',source:'https://www.mandarake.co.jp/shop/ngy/floor_guide.html'},
 lashinbang:{hours:'평일 11:00–20:00 / 토·일·공휴일 10:00–20:00',picks:'중고 아크릴 스탠드·배지·피규어. 작품별 소형 굿즈를 비교하기 좋습니다.',source:'https://www.lashinbang.com/special/25082/'},
 surugaya:{hours:'10:00–21:00 · 정기휴무 없음',picks:'3층 애니 굿즈, 4층 게임·서적, 5층 피규어·프라모델·공구.',source:'https://www.suruga-ya.jp/feature/realstore/osu_main/index.html'},
 volks:{hours:'평일 11:00–20:00 / 토·일·공휴일 10:00–20:00 · 건물 휴관 시 휴무',picks:'PVC 완성품, 캐릭터 프라모델과 조립·도색 용품. 전시품과 판매품을 구분하세요.',source:'https://hobby.volks.co.jp/shop/sr_nagoya.html'},
 animateParco:{hours:'10:00–20:00 · PARCO 영업 일정에 따름',picks:'최신 작품의 공식 신품 굿즈·서적. 오스 중고점과 달리 신작 코너 위주로 보세요.',source:'https://www.animate.co.jp/shop/sakae/'},
 mugiwara:{hours:'10:00–20:00 · PARCO 영업 일정에 따름',picks:'원피스 공식 피규어·키링·문구. 좋아하는 캐릭터부터 찾아보세요.',source:'https://www.mugiwara-store.com/store/'},
 heroPopup:{hours:'12/5–12/20 10:00–20:00 · 12/11 금요일 포함 · 최종일 18:00 마감',picks:'히로아카 10주년 한정 팝업의 캐릭터 굿즈. 혼잡 시 현장 정리권과 구매 제한 안내를 확인하세요.',source:'https://nagoya.parco.jp/event/detail/?id=38619',extra:'https://x.com/ngparco_gallery'},
 oasis:{hours:'옥상 물의 우주선은 2027/4/30까지 공사로 폐쇄. 지상·지하도 구간별 통제.',picks:'열린 지상 구간에서 유리 지붕과 미라이타워를 한 프레임에 담기.',source:'https://www.sakaepark.co.jp/news/news-8135/'},
 tower:{hours:'12/11 금요일 17:00–21:00, 마지막 입장 20:40 · 야간 성인 ¥1,800.',picks:'야경과 겨울 프로젝션 매핑. 야간 입장 시각과 요금은 해당 기간 공지를 확인하세요.',source:'https://www.nagoya-tv-tower.co.jp/news/202611011053/'},
 hands:{hours:'다카시마야 영업 일정에 따름. 해당 점포는 2027/1/11 영업 종료 예정.',picks:'문구·여행용 소품·생활용품. 열차 이동을 앞두고 5~10층 중 관심 층부터 보세요.',source:'https://nagoya.hands.net/',extra:'https://info.hands.net/news/20260204-nagoya-close.html'},
 flightOfDreams:{hours:'플라이트 파크 10:00–17:00 · 무료 전시, 일부 체험 유료. 식당별 시간은 상이.',picks:'1층 B787 초호기 전시와 플라이트 파크. 14:30까지 수속 동선으로 복귀하세요.',source:'https://www.centrair.jp/flight-of-dreams/access.html'}
};
const SHOP_WALKS = {
 's-donki':['오코게 사카에에서 사카에역 1번 출구 방향으로 도보 10~15분 배정','오쓰도리를 북쪽으로 걸어 호텔까지 약 430m'],
 'd5-kato':['호텔에서 사쿠라도리 동쪽으로 도보 약 7~10분','같은 길로 돌아가 09:00 짐 정리'],
 'f-chiikawa':['HARBS에서 서관 지하 1층으로 이동','같은 서관 8층 무기와라 스토어로 엘리베이터'],
 's-shinsuzume':['오스칸논에서 니오몬도리로 도보 3~4분 계획','같은 아케이드 다루마야까지 도보 1~2분'],
 's-okoge':['오스 북동쪽에서 와카미야오도리를 건너 사카에 스미요시까지 도보 15~20분 계획','사카에역 1번 출구 쪽 돈키호테 본점까지 약 630m'],
 f08:['라무치 → 라시크 2층 도보·에스컬레이터 5~10분','같은 2층에서 UNITED ARROWS로 이동'],
 f09:['BEAMS에서 같은 2층 통로','라시크 밖으로 나와 Stüssy까지 도보 10~15분'],
 f11:['라시크 → 사카에 3초메 남서쪽 도보 10~15분','BAPE까지 도보 5~10분'],
 f13:['Stüssy에서 인근 도로를 따라 도보 5~10분','HOODS까지 도보 5~10분'],
 f15:['BAPE에서 SK빌딩 1층까지 도보 5~10분','PARCO 서관까지 도보 약 10분'],
 f17:['HOODS에서 PARCO 서관까지 도보 약 10분','같은 서관 1층 atmos로 이동'],
 f19:['BlackEyePatch에서 같은 1층 통로','서관 2층 FREAK’S STORE로 이동'],
 f18:['서관 1층 atmos에서 2층으로 이동','서관 1층 HARBS로 내려가기'],
 f20:['서관 2층 FREAK’S STORE에서 1층으로 이동','서관 지하 1층 치이카와야키. 생략하면 서관 8층으로 직행'],
 s20:['서관 지하 1층 치이카와야키에서 8층까지 엘리베이터. 간식 생략 시 HARBS 1층 출발','동관으로 건너가 애니메이트 4층. 이동 시간은 일정에 포함'],
 s18:['무기와라 스토어 서관 8층에서 동관 4층까지 건물·층 이동','남관 10층 EVENT SPACE로 이동'],
 s22:['애니메이트 동관 4층에서 남관 10층 EVENT SPACE로 이동','17:00 남관 출발, 무츠미 본점까지 도보·여유 포함 20분'],
 s08:['신스즈메에서 니오몬도리 아케이드 도보 1~2분. 간식 생략 시 오스칸논 출발','만다라케까지 오스 골목 도보 5~10분'],
 s10:['다루마야에서 오스 골목 도보 5~10분','스루가야 오스 본관까지 도보 5~10분'],
 s14:['만다라케에서 오스 본관까지 도보 5~10분','오스 3-37-40 쿠리린까지 도보와 정리권 확인 10분 배정'],
 's-kurin':['스루가야 오스 본관에서 도보와 정리권 확인 10분 배정','MultinaBox 2층 라신반까지 도보·층간 이동 10분 배정'],
 s12:['쿠리린 또는 카누레 매장에서 MultinaBox 2층까지 도보·층간 이동 10분 배정','보크스 쇼룸까지 도보·2층 이동 10분 배정'],
 s16:['라신반에서 야바초 방면으로 걸어 쇼룸 2층까지 10분 배정','오스 북동쪽 소품·간식 골목에서 자유 산책']
};

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
 hotel:'히사야오도리역 근처 숙소. 체크인·휴식·짐 보관의 거점입니다.',airport:'주부국제공항 센트레아. 공항철도 이용과 입출국 수속을 하는 곳입니다.',station:'공항철도와 지하철을 갈아타는 메이테츠 나고야역입니다.',nagoya:'역과 백화점이 연결된 쇼핑 구역. 옷·생활소품·먹거리 선물을 고릅니다.',sake:'지브리파크 방면 히가시야마선을 타는 사카에역입니다.',fuji:'지하철에서 리니모로 갈아타는 환승역입니다.',parkstation:'지브리파크가 있는 공원의 입구역. 전시 구역까지는 더 걸어갑니다.',park:'넓은 기념공원 안에 지브리 작품별 구역이 나뉜 테마 공간입니다.',hill:'「귀를 기울이면」의 지구옥 등 작품 속 건물을 만나는 구역입니다.',warehouse:'전시·단편 상영·기념품점이 모인 지브리의 실내 전시 공간입니다.',valley:'「하울의 움직이는 성」과 「마녀 배달부 키키」의 건물을 만나는 구역입니다.',forest:'「이웃집 토토로」의 사츠키와 메이의 집이 있는 숲속 구역입니다.',mononoke:'「원령공주」의 세계를 모티브로 한 야외 체험 구역입니다.',cafe:'대창고 관람 중 샌드위치·피자 등으로 점심을 먹는 카페입니다.',tower:'나고야 도심을 내려다보는 전망 타워. 밤에는 야경을 봅니다.',hisaya:'타워 주변으로 길게 이어지는 도심 공원. 산책과 주변 상점 구경을 합니다.',oasis:'타원형 유리 구조물로 유명한 사카에 광장. 이번 여행은 지상·지하층 위주입니다.',lachic:'사카에의 패션·생활잡화 쇼핑몰. 주변 PARCO까지 취향에 맞춰 둘러봅니다.',osu:'아케이드 골목에 옷·빈티지·굿즈·간식 가게가 모인 상점가입니다.',kannon:'오스상점가 서쪽의 관음 사찰. 참배와 거리 산책의 시작점입니다.',bansho:'오스상점가 안에 있는 사찰. 주변 쇼핑 골목과 함께 잠깐 둘러봅니다.',shike:'창고와 오래된 건물 외관이 남은 골목. 산책과 레트로 카페를 즐깁니다.',endoji:'시케미치와 이어 걷는 지붕 있는 상점가. 오래된 찻집에서 쉬어갑니다.',kokusai:'시케미치·엔도지 골목 산책으로 들어가기 위한 지하철 도착역입니다.',zoo:'코알라 등 동물 전시와 식물원을 함께 볼 수 있는 넓은 동식물원입니다.',kamimaezu:'오스상점가 동쪽에서 지하철로 이동하기 편한 가미마에즈역입니다.',donki:'과자·생필품·기념품을 한 번에 둘러볼 수 있는 할인점입니다.',ramen:'크리미한 파이탄 라멘으로 알려진 나고야역 근처 라멘집입니다.',komeda:'커피와 토스트 모닝을 먹으며 아침을 시작하는 나고야식 카페입니다.',ramuchi:'파가 듬뿍 올라간 된장 소스 돈카츠, 미소카츠 정식을 먹는 식당입니다.',mutsumi:'흑·백 맛 닭날개를 비교해 먹는 테바사키 전문점입니다.',monja:'철판에서 구워 먹는 몬자야키 전문점. 명란·떡·치즈 조합을 고릅니다.',sushi:'야나기바시 시장 안에서 니기리 세트를 먹는 스시 카운터입니다.',keshiki:'새우 텐무스와 키시멘을 먹는 나고노의 텐무스 전문점입니다.'
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
 jrNagoya:'백화점·지하상가와 연결되는 JR 나고야역.',
 shoraku:'체크인 후 호텔에서 걸어갈 수 있는 이즈미의 마늘 라멘집.',
 kanayama:'메이조선에서 메이테츠 공항행으로 갈아타는 역.'
});
