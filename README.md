# 나고야 여행

2026년 12월 10~14일 4박 5일 여행을 위한 정적 웹앱입니다. [GitHub Pages](https://hanfo-id.github.io/nagoya/)에서 사용할 수 있습니다.

- 12월 13일은 **A 게로 온천**(기본값, 총 75개 일정) 또는 **B 나바나노사토**(총 81개 일정)를 선택합니다. 공통 4일은 같은 데이터를 사용합니다. 모든 시각은 일본 현지 시간입니다.
- 일정 카드, 번호 핀과 이동 링크는 같은 방문 순서와 필터를 사용합니다. 실제 좌표를 유지하며 같은 위치의 일정은 핀 팝업이나 카드 목록에서 고릅니다. 건물·지역을 대표하는 좌표는 상세 카드에 표시합니다.
- 예약·티켓 안내와 사용자 예약 기록은 분리합니다. 사용자가 적은 확정 시각으로 일정은 자동 변경되지 않습니다. A/B를 바꿔도 각 안의 진행 상태와 예약 기록이 유지됩니다.
- 한 기기의 기록은 `nagoya26-v3`에 저장됩니다. `nagoya26-v2`와 구형 키는 그대로 남기고, 같은 활동으로 확인한 기록만 새 일정에 연결합니다. 이전 기록 원본은 JSON 백업에도 포함합니다. 연결되지 않은 이전 예약은 예약 화면의 보관 기록에서 확인할 수 있습니다.
- 처음 온라인으로 열어 핵심 파일이 저장된 뒤 일정·기록·정적 가이드를 오프라인에서 읽을 수 있습니다. 외부 지도 타일과 Google Maps, 예약 사이트에는 인터넷이 필요합니다.

## 일정 갱신

`data/`의 A/B 원본에서 공통 일정과 두 일요일을 검증·생성합니다. 브라우저, 인쇄, 정적 가이드와 일정 JSON은 같은 정규화 로직을 사용합니다.

```powershell
node scripts/build-itinerary.cjs
node scripts/build-guide.cjs
node scripts/export-itinerary.cjs --plan=A
node scripts/export-itinerary.cjs --plan=B
foreach ($test in (Get-ChildItem tests -Filter '*.test.cjs')) {
    node $test.FullName
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
# 선택: Python Playwright와 Edge가 설치된 환경에서 모바일 브라우저 테스트
python -X utf8 tests/mobile-browser.py
```

GitHub Pages는 `main` 루트의 HTML/CSS/Vanilla JavaScript를 그대로 제공합니다. 일정 배포 시 생성 파일을 함께 커밋하고 `sw.js` 캐시 이름과 `index.html` 자산 버전을 갱신합니다.

지도는 Leaflet과 OpenStreetMap을 사용합니다. 좌표의 출처와 건물·구역 대표점은 `map-locations.js`에 기록되어 있습니다.
