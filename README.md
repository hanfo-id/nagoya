# 나고야 여행

2026년 12월 10~14일 4박 5일 여행을 위한 정적 웹앱입니다. [GitHub Pages](https://hanfo-id.github.io/nagoya/)에서 사용할 수 있습니다.

- 12월 11일은 사카에·야바초 PARCO(29개), 12월 12일은 나고노·오스·사카에(24개)를 중심으로 방문합니다. 금요일로 옮긴 방문 기록은 기존 ID를 사용하며, 빠진 방문·이동 기록은 상태 백업에 남습니다.
- 12월 13일은 나고야 시내와 **나바나노사토**를 방문합니다. 5일 전체 일정은 85개입니다. 모든 시각은 일본 현지 시간입니다.
- 일정 카드, 번호 핀과 이동 링크는 같은 방문 순서와 필터를 사용합니다. 실제 좌표를 유지하며 같은 위치의 일정은 핀을 누른 뒤 일정 영역에서 고릅니다. 건물·지역을 대표하는 좌표는 상세 카드에 표시합니다.
- 예약·티켓 안내와 사용자 예약 기록은 분리합니다. 사용자가 적은 확정 시각으로 일정은 자동 변경되지 않습니다. 일정에서 빠진 항목의 기록은 상태 백업에 보관되며 신규 예약에 연결되지 않습니다.
- 한 기기의 기록은 `nagoya26-v3`에 저장됩니다. `nagoya26-v2`와 구형 키는 그대로 남기고, 같은 활동으로 확인한 기록만 새 일정에 연결합니다. 이전 기록 원본은 JSON 백업에도 포함합니다. 연결되지 않은 이전 예약은 예약 화면의 보관 기록에서 확인할 수 있습니다.
- 처음 온라인으로 열어 핵심 파일이 저장된 뒤 일정·기록·정적 가이드를 오프라인에서 읽을 수 있습니다. 외부 지도 타일과 Google Maps, 예약 사이트에는 인터넷이 필요합니다.

## 예약 조사

`data/reservations.js`는 85개 이벤트의 예약 분류, 표시할 예약 항목, 지점별 경로와 확인 근거를 관리합니다. 예약 페이지의 집계는 사전 조치 항목만 계산합니다. 티켓 종류와 메모는 수동 기록이며 기존 JSON 백업과 함께 저장됩니다.

## 일정 갱신

`data/nagoya_2026-12-10_14.json`의 5일 일정을 검증·생성합니다. 브라우저, 인쇄, 정적 가이드와 일정 JSON은 같은 정규화 로직을 사용합니다.

```powershell
node scripts/build-itinerary.cjs
node scripts/build-guide.cjs
node scripts/stamp-release.cjs
node scripts/export-itinerary.cjs
foreach ($test in (Get-ChildItem tests -Filter '*.test.cjs')) {
    node $test.FullName
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
# 선택: Python Playwright와 Edge가 설치된 환경에서 모바일 브라우저 테스트
python -X utf8 tests/mobile-browser.py
```

GitHub Pages는 `main` 루트의 HTML/CSS/Vanilla JavaScript를 그대로 제공합니다. 일정 배포 시 `sw.js`의 `RELEASE`를 먼저 갱신한 뒤 생성 명령을 실행합니다. 서비스 워커는 한 버전의 HTML과 자산을 함께 캐시하고, 스크립트 무결성 해시가 다른 파일의 실행을 막습니다.

지도는 Leaflet과 OpenStreetMap을 사용합니다. 좌표의 출처와 건물·구역 기준점은 `map-locations.js`에 기록되어 있습니다. 일정 원본의 `place.id`가 같은 장소는 동일한 이름·주소·지도 링크를 공유하며, 각 이벤트 ID는 별도입니다.
