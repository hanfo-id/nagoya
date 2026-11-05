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
 komeda:{kind:'커피와 나고야 모닝',order:'따뜻한 커피 + 토스트 + 오구라앙',jp:'コメダブレンド / モーニング / おぐらあん',explain:'오구라앙은 단팥입니다. 11시 전 음료 주문에 선택형 빵·토핑이 붙는 모닝 서비스. 오래 걷는 토요일에는 달걀이나 샐러드를 별도로 추가하세요.'},
 ramuchi:{kind:'미소카츠 정식',order:'파 듬뿍 미소카츠 정식',jp:'味噌かつ定食',explain:'된장 소스를 올린 돈카츠와 밥·국이 나오는 식사. 파와 소스의 양이 많으니 작은 사이즈·파 조절 가능 여부를 주문 때 물어보세요.'},
 mutsumi:{kind:'테바사키 닭날개 튀김',order:'흑·백 맛 비교, 본본 추가',jp:'黒 / 白 / ぼんぼん',explain:'흑은 달콤한 간장, 백은 소금·후추 계열. 본본은 뼈를 먹기 편하게 손질한 닭날개 메뉴입니다. 매운맛을 좋아하면 적도 후보.'},
 monja:{kind:'몬자야키 철판요리',order:'명란·떡 몬자 + 치즈 토핑',jp:'明太子もちもんじゃ / チーズ',explain:'묽은 반죽을 철판에 펼쳐 작은 주걱으로 떠먹는 요리입니다. 2인이라면 한 판을 나눠 먹고 모자랄 때 추가. 직원에게 조리를 부탁해도 좋습니다.'},
 sushi:{kind:'에도마에 니기리 스시',order:'9관 또는 11관 니기리 세트',jp:'最幸の9貫にぎり / 極上の11貫にぎり',explain:'생선 등을 올린 초밥 세트. 공식 표시 세금 포함 9관 ¥4,620 / 11관 ¥6,050. 일요일에는 평일 한정 런치 가격이 적용되지 않습니다.'},
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
 const sat=days[2];sat.subtitle='07:30 든든한 모닝, 08:30 출발. 대창고 11시 표를 기준으로 핵심 구역부터.';
 sat.events[0]=E('07:30','08:20','고메다 사쿠라도리오츠점에서 든든한 아침','식사','빵 한 조각만 먹고 서두르지 않도록 식사 시간을 50분 확보합니다.',['커피 + 모닝 토스트에 달걀·샐러드 등 추가 메뉴를 곁들여 단백질도 챙기기.','주말이라 대기가 15분을 넘으면 전날 준비한 주먹밥·달걀·요거트로 호텔에서 식사하고 08:30 출발은 유지.','점심이 12:30 전후이므로 허기가 잘 지면 허용된 간식·물을 챙겨 지정된 취식 장소에서만 이용.'],'コメダ珈琲店 桜通大津店','komeda');
 sat.events[1]=E('08:30','10:00','식사 후 지브리파크로 이동','이동','호텔 → 사카에역 → 후지가오카역 → 리니모 → 공원역.',['호텔에서 사카에역까지 도보 10–15분, 히가시야마선 후지가오카행 탑승.','후지가오카에서 리니모로 환승해 아이치큐하쿠키넨코엔역 하차. 환승·대기 포함 75–90분 확보.','이 시각은 실제 열차편이 아닌 계획 창입니다. 11시 대창고 티켓이면 10:30 전후 대창고 주변 도착 목표.'],'愛・地球博記念公園駅');
 sat.events[2]=E('10:00','10:40','공원 입구 · 여유 있는 도착','관광','9시 개장에 맞추는 오픈런은 생략합니다.',['대표자 여권·티켓과 전원 동행 확인. 입구에서 손목밴드를 정오 전 수령.','역에서 대창고까지 걷고 화장실·사진 시간을 확보.','청춘의 언덕 내부 관람은 이 시간에 억지로 넣지 않습니다. 오후에 시간·티켓이 맞을 때 추가.'],'ジブリパーク');
 sat.events[3].time='11:00';sat.events[3].end='12:30';sat.events[3].steps=['구매한 대창고 지정 시각에 맞춰 입장. 11시는 제안이므로 확보한 티켓 시간이 우선입니다.','대표 전시·단편 영화 중 우선순위 두 가지를 정해 90분 전후 관람. 사진 줄이 길면 한 곳만 선택.','배고프기 전에 12:30 점심으로 전환. 필요하면 대창고 체류를 늘리고 오후 선택 구역을 하나 줄입니다.'];
 sat.events[4].time='12:30';sat.events[4].end='13:20';sat.events[4].title='대륙횡단비행 카페에서 점심';sat.events[4].place='大陸横断飛行 ジブリパーク';sat.events[4].desc='대창고 안 카페 大陸横断飛行. 샌드위치 등 당일 메뉴 중 한 끼를 먹습니다.';sat.events[4].steps=['방문 구역 안 카페에서 식사. 샌드위치·음료 등 당일 판매 메뉴와 재고를 확인.','현장 대기이며 좌석·주문 사전 예약은 확인되지 않았습니다. 혼잡하면 식사를 먼저 해결하고 오후 관람을 줄이기.','가져온 간식은 취식 허용 장소에서만. 건물 내부에서 임의로 먹지 않습니다.'];
 PLACE.cafe={name:'대륙횡단비행 카페',jp:'大陸横断飛行',query:'大陸横断飛行 ジブリパーク'};
 sat.events[5].time='13:30';sat.events[5].end='15:30';sat.events[6].title='돈도코 숲 또는 청춘의 언덕 중 한 곳';sat.events[6].desc='오후 마지막 선택 구역. 모노노케 마을까지 모두 완주하려 하지는 않습니다.';sat.events[6].steps=['토토로가 우선이면 돈도코 숲, 귀를 기울이면이 우선이면 청춘의 언덕을 선택.','마녀의 계곡 관람이 길어지면 추가 구역은 생략하고 공원을 산책.','일반 구역 최종 입장 16:30 전에 도착. 실제 입장 범위·종료는 구매한 티켓과 현장 안내가 우선.'];
 sat.note='아침을 충분히 먹고 출발을 75분 늦춘 일정입니다. 대창고·마녀의 계곡을 우선하고, 나머지 구역은 하나만 고르세요. 이미 9시·10시 대창고 표를 샀다면 해당 입장 시각이 우선이므로 출발을 앞당겨야 합니다. 12/11만 표가 가능하면 금·토를 교환하되 평일 10시 개장을 확인하세요.';
 sat.route=['고메다 모닝','후지가오카','공원역','대창고·카페','마녀의 계곡','선택 구역','오코게'];
 restaurants.find(r=>r.id==='komeda').day='금·토 07:30';
 days[1].events[8].desc='내일은 식사 후 08:30 출발입니다.';
 days[1].events[8].steps[2]='아침식사를 편하게 하도록 전날 밤 짐을 정리하고 일찍 취침.';
 restaurants.find(r=>r.id==='eel').day='금 점심 교체 선택';
}
function placesForDay(i){
 const zoo=document.querySelector('#zoo')?.checked;
 const keys=[['airport','station','ramen','hotel','hisaya','tower','oasis','donki'],['hotel','komeda','hisaya','ramuchi','lachic','oasis','mutsumi','tower'],['komeda','sake','fuji','parkstation','park','warehouse','cafe','valley','forest','hill','mononoke','monja','hotel'],zoo?['hotel','zoo','kannon','osu','bansho','sushi']:['hotel','kokusai','shike','endoji','kannon','osu','bansho','sushi'],['hotel','kokusai','keshiki','nagoya','station','airport']][i];
 return keys.map(k=>({id:k,...PLACE[k],optional:i===0&&['oasis','donki'].includes(k)||i===2&&['forest','hill','mononoke'].includes(k)}));
}
function mapEmbed(points){return 'https://maps.google.com/maps?'+new URLSearchParams({saddr:points[0].query,daddr:points.slice(1).map(p=>p.query).join(' to:'),output:'embed',hl:'ko',...(points.every(p=>['park','warehouse','cafe','valley','forest','hill','mononoke'].includes(p.id))?{dirflg:'w'}:{})}).toString()}
function singleEmbed(p){return 'https://maps.google.com/maps?'+new URLSearchParams({q:p.query,output:'embed',hl:'ko'}).toString()}
function appMap(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}
function directions(q,mode,origin){return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',destination:q,travelmode:mode,...(origin?{origin}: {})}).toString()}
function mapPanel(i,print){
 const points=placesForDay(i);if(print)return `<p class="print-map">지도: ${points.map(p=>p.name).join(' / ')}</p>`;
 const groups=i===2?[{label:'시내에서 공원',points:points.slice(0,5)},{label:'공원 안 구역',points:points.slice(4,11)},{label:'공원에서 저녁',points:[points[3],points[11],points[12]]}]:[{label:'하루 전체',points}];
 return `<section class="daymap" aria-label="${days[i].date} 지도"><div class="maphead"><h4>이날의 동선 지도</h4><div class="mapmodes">${groups.map((g,j)=>`<button type="button" data-mapgroup="${j}" aria-pressed="${j===0}">${g.label}</button>`).join('')}</div></div><iframe class="googlemap" id="daymapframe" title="${days[i].date} Google 지도 동선" src="${esc(mapEmbed(groups[0].points))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><p class="mapcaption" id="mapcaption">여러 경유지를 표시한 위치 확인용 지도입니다. 파란 선·시간은 자동차 기준일 수 있으므로 실제 이동은 아래 도보·대중교통 링크를 이용하세요. 공원 내 선택 구역은 모두 방문하는 일정이 아닙니다.</p><ol class="pinlist">${points.map((p,n)=>`<li><button type="button" class="pinselect" data-pin="${p.id}" aria-label="${p.name} 지도에서 보기"><span class="pinindex">${n+1}</span><span>${p.name}${p.optional?'<small>선택</small>':''}<small>${p.jp}</small></span></button><div class="pinlinks"><a href="${esc(appMap(p.query))}">맵 열기</a><a href="${esc(directions(p.query,'transit'))}">대중교통</a><a href="${esc(directions(p.query,'walking'))}">도보</a></div></li>`).join('')}</ol><p class="mapcaption">장소명을 누르면 해당 핀으로 확대합니다. ‘맵 열기’는 설치된 Google Maps 앱으로 연결되는 공식 URL입니다. 휴대폰·브라우저의 앱 연결 설정에 따라 웹으로 열릴 수도 있습니다.</p></section>`;
}
function placeForEvent(e){
 const r=restaurants.find(r=>r.id===e.food);if(r)return PLACE[r.id];
 const aliases={'中部国際空港':'airport','名鉄名古屋駅':'station','西鉄ホテル クルーム名古屋':'hotel','久屋大通公園':'hisaya','オアシス21':'oasis','ドン・キホーテ 栄本店':'donki','ラシック 名古屋':'lachic','中部電力 MIRAI TOWER':'tower','愛・地球博記念公園駅':'parkstation','ジブリパーク':'park','ジブリの大倉庫':'warehouse','ジブリパーク 魔女の谷':'valley','ジブリパーク どんどこ森':'forest','大陸横断飛行 ジブリパーク':'cafe','四間道 名古屋':'shike','大須観音':'kannon','大須商店街':'osu','東山動植物園':'zoo','名古屋駅':'nagoya'};
 return PLACE[aliases[e.place]]|| (e.place?{name:e.place,jp:e.place,query:e.place+' 名古屋'}:null);
}
function foodPreview(r){return r?.dish?`<p class="dishpreview"><span>${r.dish.kind}</span>추천 <b>${r.dish.order}</b></p>`:''}
function menuDetails(r){return r?.dish?`<div class="menudetail"><h5>무엇을 먹을까</h5><p><strong>${r.dish.order}</strong><span lang="ja">${r.dish.jp}</span></p><p>${r.dish.explain}</p></div>`:''}
function reviewLinks(r){if(!r)return '';const blogs=r.blogs||[];return `<details class="reviewnotes"><summary>한국어 후기 참고</summary>${blogs.map(b=>`<p>${link(b.url,b.name)}<small>${b.note}</small></p>`).join('')}${blogs.length?'':`<p>확인된 한국어 블로그 원문이 없어 검색 링크를 제공합니다. 검색 결과의 지점명·방문일을 확인하세요.</p>`}<p>${link('https://search.naver.com/search.naver?where=blog&query='+encodeURIComponent('나고야 '+r.name+' 후기'),'네이버 블로그 더 찾기')}</p><small>방문 경험 참고용입니다. 가격·운영·예약 조건은 위 공식·타베로그 안내를 우선하세요.</small></details>`}
document.addEventListener('click',e=>{
 const pin=e.target.closest('[data-pin]'),group=e.target.closest('[data-mapgroup]');if(!pin&&!group)return;
 const frame=document.querySelector('#daymapframe');if(!frame)return;
 const points=placesForDay(active);
 if(pin){const p=points.find(p=>p.id===pin.dataset.pin);frame.src=singleEmbed(p);document.querySelector('#mapcaption').textContent=p.name+' / '+p.jp+' / 선택한 장소의 핀입니다. 전체 동선으로 돌아가려면 위 지도 탭을 누르세요.';document.querySelectorAll('[data-mapgroup]').forEach(b=>b.setAttribute('aria-pressed','false'));document.querySelectorAll('[data-pin]').forEach(b=>b.setAttribute('aria-pressed',b===pin?'true':'false'))}
 if(group){const n=Number(group.dataset.mapgroup);const groups=active===2?[points.slice(0,5),points.slice(4,11),[points[3],points[11],points[12]]]:[points];frame.src=mapEmbed(groups[n]);document.querySelector('#mapcaption').textContent='동선 위치 확인용 지도. 경로·소요시간은 지도 표시 모드에 따라 달라질 수 있습니다. 실제 이동은 장소 옆 대중교통·도보 링크를 이용하세요.';document.querySelectorAll('[data-mapgroup]').forEach(b=>b.setAttribute('aria-pressed',b===group?'true':'false'));document.querySelectorAll('[data-pin]').forEach(b=>b.setAttribute('aria-pressed','false'))}
});
