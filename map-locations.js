/* Venue map links, named buildings, and GSI/OSM address points. Indoor pins are explicitly building-level. */
const MAP_LOCATIONS={
 "flightOfDreams":{"lat":34.855313,"lng":136.817046,"kind":"place","source":"https://aichinow.pref.aichi.jp/spots/detail/2446","note":"T2 연결통로 쪽 시설입니다."},
 "gateTower":{"lat":35.17211,"lng":136.88283,"kind":"area-anchor","source":"https://mapcarta.com/W51080885","note":"JR 게이트타워 건물 기준점 · 카페는 층별 안내를 참고하세요."},
 "stussy":{"lat":35.1643941,"lng":136.9063534,"kind":"address","source":"https://www.stussy.com/blogs/chapters/stussy-nagoya","note":"공식 매장 안내에서 연결한 3-27-24 주소 지점입니다."},
 "bape":{"lat":35.164868,"lng":136.9047401,"kind":"place","source":"https://jp.bape.com/pages/store-list/nagoya"},
 "hoods":{"lat":35.1637678,"lng":136.9047608,"kind":"place","source":"https://www.doubledutch-jp.com/hoods-nagoya"},
 "sunroad":{"lat":35.169647,"lng":136.884903,"kind":"area-anchor","source":"https://www.sunroad.org/access","note":"지하상가의 대표 지점입니다."},
 "darumaya":{"lat":35.158974,"lng":136.900482,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "mandarake":{"lat":35.159882,"lng":136.904587,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "lashinbang":{"lat":35.160427,"lng":136.905197,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "surugaya":{"lat":35.158417,"lng":136.904785,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "volks":{"lat":35.161304,"lng":136.90654,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "ibushigin":{"lat":35.167717,"lng":136.898666,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "yushimaan":{"lat":35.809082,"lng":137.242126,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "senda":{"lat":35.809654,"lng":137.242035,"kind":"area-anchor","source":"https://msearch.gsi.go.jp/address-search/AddressSearch","note":"번지 기준 대표점입니다."},
 "geropudding":{"lat":35.810295,"lng":137.241013,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "nabana":{"lat":35.081676,"lng":136.703308,"kind":"area-anchor","source":"https://www.nagashima-onsen.co.jp/nabana/access/index.html","note":"나바나노사토 전체의 대표 지점입니다."},
 "beerGarden":{"lat":35.081676,"lng":136.703308,"kind":"area-anchor","source":"https://www.nagashima-onsen.co.jp/nabana/restaurant/beer.html","note":"나바나노사토의 대표 핀입니다. 상세 원내 위치는 식당 안내를 참고하세요."},
 "kintetsuNagoya":{"lat":35.169407,"lng":136.884506,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "nagashima":{"lat":35.097806,"lng":136.6967083,"kind":"address","source":"https://en.wikipedia.org/wiki/Kintetsu_Nagashima_Station"},
 "maruya":{"lat":35.1706232,"lng":136.8821911,"kind":"area-anchor","source":"https://www.maruya-honten.com/shop/nagoya-jrmeieki/","note":"JR 나고야역 대표점 · 우마이몬도리 지점입니다."},
 "hands":{"lat":35.1706232,"lng":136.8821911,"kind":"area-anchor","source":"https://nagoya.hands.net/","note":"JR 나고야역 대표점 · JR 나고야 다카시마야 5~10층입니다."},
 "beams":{"lat":35.167721,"lng":136.907272,"kind":"area-anchor","source":"https://www.lachic.jp/floorguide.html","note":"라시크 건물 대표점 · 매장은 2층입니다."},
 "unitedArrows":{"lat":35.167721,"lng":136.907272,"kind":"area-anchor","source":"https://www.lachic.jp/floorguide.html","note":"라시크 건물 대표점 · 매장은 2층입니다."},
 "blackeye":{"lat":35.16368,"lng":136.90747,"kind":"area-anchor","source":"https://mapcarta.com/W200265098","note":"PARCO 서관 기준점 · 매장은 1층입니다."},
 "freaks":{"lat":35.16368,"lng":136.90747,"kind":"area-anchor","source":"https://mapcarta.com/W200265098","note":"PARCO 서관 기준점 · 매장은 2층입니다."},
 "atmos":{"lat":35.16368,"lng":136.90747,"kind":"area-anchor","source":"https://mapcarta.com/W200265098","note":"PARCO 서관 기준점 · 매장은 1층입니다."},
 "harbs":{"lat":35.16368,"lng":136.90747,"kind":"area-anchor","source":"https://mapcarta.com/W200265098","note":"PARCO 서관 기준점 · 매장은 1층입니다."},
 "animateParco":{"lat":35.16355,"lng":136.90816,"kind":"area-anchor","source":"https://mapcarta.com/W200265107","note":"PARCO 동관 기준점 · 매장은 4층입니다."},
 "mugiwara":{"lat":35.16368,"lng":136.90747,"kind":"area-anchor","source":"https://mapcarta.com/W200265098","note":"PARCO 서관 기준점 · 매장은 8층입니다."},
 "heroPopup":{"lat":35.1630456,"lng":136.9071562,"kind":"area-anchor","source":"https://mapfan.com/spots/SCQ5Q%2C000%2CS","note":"PARCO 남관 기준점 · 행사는 10층 EVENT SPACE입니다."},
 "shoraku":{"lat":35.178307,"lng":136.911362,"kind":"address","source":"https://msearch.gsi.go.jp/address-search/AddressSearch"},
 "kanayama":{"lat":35.14303,"lng":136.90083,"kind":"place","source":"https://mapcarta.com/27464318"},
 "jrNagoya":{"lat":35.1706232,"lng":136.8821911,"kind":"place","source":"https://www.openstreetmap.org/relation/20258665"},
 "geroStation":{"lat":35.80582,"lng":137.23955,"kind":"place","source":"https://mapcarta.com/27454068"},
 "geroTown":{"lat":35.80937,"lng":137.241474,"kind":"area-anchor","source":"https://www.city.gero.lg.jp/site/kanko/1246.html","note":"온천마을의 비너스 족욕 부근을 대표점으로 사용."},
 "geroLunch":{"lat":35.807199,"lng":137.24178,"kind":"area-anchor","source":"https://www.city.gero.lg.jp/site/kanko/1246.html","note":"유아미야 인근 온천마을 중심부. 지정 식당 위치가 아님."},
 "ogawaya":{"lat":35.8086519,"lng":137.2418786,"kind":"place","source":"https://mapfan.com/spots/SC5CC,J,CR9"},
 "geroRiver":{"lat":35.808193,"lng":137.242994,"kind":"area-anchor","source":"https://nightview.useless-landscape.com/details/gero-spa/","note":"히다강 주변 산책 구간의 대표점."},
 "hotel": {
  "lat": 35.173293,
  "lng": 136.9055994,
  "kind": "place",
  "source": "https://www.openstreetmap.org/node/9337801479"
 },
 "airport": {
  "lat": 34.8588595,
  "lng": 136.812964,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/108605111"
 },
 "station": {
  "lat": 35.1696519,
  "lng": 136.8839331,
  "kind": "place",
  "source": "https://www.openstreetmap.org/relation/9892407"
 },
 "sake": {
  "lat": 35.1699643,
  "lng": 136.9088206,
  "kind": "place",
  "source": "https://www.openstreetmap.org/node/7784263288"
 },
 "fuji": {
  "lat": 35.1821018,
  "lng": 137.0217107,
  "kind": "place",
  "source": "https://www.openstreetmap.org/relation/7966770"
 },
 "parkstation": {
  "lat": 35.1776505,
  "lng": 137.0874513,
  "kind": "place",
  "source": "https://www.openstreetmap.org/relation/9639034"
 },
 "park": {
  "lat": 35.1751206,
  "lng": 137.0887745,
  "kind": "place",
  "source": "https://www.openstreetmap.org/node/12193590953"
 },
 "hill": {
  "lat": 35.1755521,
  "lng": 137.0892516,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/1317481827"
 },
 "warehouse": {
  "lat": 35.1735648,
  "lng": 137.0893477,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/1058741195"
 },
 "valley": {
  "lat": 35.1738966,
  "lng": 137.0927623,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/1094025332"
 },
 "forest": {
  "lat": 35.1697143,
  "lng": 137.0934435,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/1094025333"
 },
 "mononoke": {
  "lat": 35.1767418,
  "lng": 137.0938313,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/1094025331"
 },
 "cafe": {
  "lat": 35.1731472,
  "lng": 137.0890267,
  "kind": "place",
  "source": "https://www.openstreetmap.org/node/11256954616"
 },
 "tower": {
  "lat": 35.1722971,
  "lng": 136.9083338,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/51778897"
 },
 "hisaya": {
  "lat": 35.1702344,
  "lng": 136.9084342,
  "kind": "place",
  "source": "https://www.openstreetmap.org/relation/18418512"
 },
 "oasis": {
  "lat": 35.1710328,
  "lng": 136.9097175,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/230302740"
 },
 "lachic": {
  "lat": 35.1674207,
  "lng": 136.907732,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/89231320"
 },
 "osu": {
  "lat": 35.1588914,
  "lng": 136.9037987,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/43552201"
 },
 "kannon": {
  "lat": 35.1597013,
  "lng": 136.8992478,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/923032216"
 },
 "bansho": {
  "lat": 35.1585553,
  "lng": 136.9060527,
  "kind": "place",
  "source": "https://www.openstreetmap.org/node/549893642"
 },
 "shike": {
  "lat": 35.1749766,
  "lng": 136.892384,
  "kind": "place",
  "source": "https://www.openstreetmap.org/relation/12415574"
 },
 "endoji": {
  "lat": 35.1762584,
  "lng": 136.8912598,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/52290445"
 },
 "kokusai": {
  "lat": 35.1721409,
  "lng": 136.8892476,
  "kind": "place",
  "source": "https://www.openstreetmap.org/relation/7997511"
 },
 "zoo": {
  "lat": 35.1588656,
  "lng": 136.9741269,
  "kind": "place",
  "source": "https://www.openstreetmap.org/way/352739621"
 },
 "nagoya": {
  "lat": 35.1706232,
  "lng": 136.8821911,
  "kind": "place",
  "source": "https://www.openstreetmap.org/relation/20258665"
 },
 "ramen": {
  "lat": 35.174217,
  "lng": 136.879562,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中村区亀島二丁目１番１号"
 },
 "komeda": {
  "lat": 35.174332,
  "lng": 136.906509,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中区丸の内三丁目１９番３０号"
 },
 "ramuchi": {
  "lat": 35.166855,
  "lng": 136.907898,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中区栄三丁目１５番６号"
 },
 "mutsumi": {
  "lat": 35.167244,
  "lng": 136.90509,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中区栄三丁目８番１２５号"
 },
 "monja": {
  "lat": 35.166924,
  "lng": 136.903625,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中区栄三丁目９番２９号"
 },
 "sushi": {
  "lat": 35.170147,
  "lng": 136.888519,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中村区名駅四丁目１５番２号"
 },
 "keshiki": {
  "lat": 35.173725,
  "lng": 136.890091,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中村区那古野一丁目４６番１２号"
 },
 "donki": {
  "lat": 35.170097,
  "lng": 136.90657,
  "kind": "address",
  "source": "https://msearch.gsi.go.jp/address-search/AddressSearch",
  "address": "愛知県名古屋市中区錦三丁目１７番１５号"
 },
 "kamimaezu": {
  "lat": 35.157374,
  "lng": 136.906699,
  "kind": "place",
  "source": "https://www.openstreetmap.org/node/5408459629"
 }
};
