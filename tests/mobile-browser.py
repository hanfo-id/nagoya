"""Browser regression suite. Run with Python Playwright and an installed Edge/Chrome."""
import json
import os
import re
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.server.origin_unavailable.is_set():
            self.close_connection = True
            return
        super().do_GET()

    def log_message(self, *_):
        pass


def verify_mobile(browser, url, server, engine):
    context = browser.new_context(
        viewport={"width": 390, "height": 700},
        is_mobile=True, has_touch=True, accept_downloads=True, reduced_motion="reduce",
    )
    # Test Leaflet interaction without relying on the public tile server.
    context.route("https://tile.openstreetmap.org/**", lambda route: route.fulfill(
        status=200, content_type="image/gif",
        body=bytes.fromhex("47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b"),
    ))
    page = context.new_page()
    errors = []
    page.set_default_timeout(12000)
    page.on("pageerror", lambda error: errors.append(str(error)))
    sunday = url + "?page=plan&day=12-13"
    page.goto(sunday, wait_until="domcontentloaded")

    def row(event_id):
        return page.locator(f'[data-event-id="{event_id}"]')

    expect(page.locator(".route-item")).to_have_count(17)
    expect(page.locator(".numberpin")).to_have_count(17)
    expect(row("sun-unayasu")).to_contain_text("우나야스")
    expect(row("b12")).to_contain_text("18:40")
    expect(row("b15")).to_contain_text("21:25")
    expect(page.locator("[data-plan]")).to_have_count(0)
    expect(row("d4-bath")).to_have_count(0)
    page.locator("#tab1").tap()
    expect(row("f-chiikawa")).to_be_visible()
    page.go_back(wait_until="domcontentloaded")
    expect(row("sun-unayasu")).to_be_visible()
    page.go_forward(wait_until="domcontentloaded")
    expect(row("f-chiikawa")).to_be_visible()
    page.locator("#tab3").tap()
    page.locator('[data-mapextent="nabana"]').tap()
    page.locator('[data-mapextent="all"]').tap()

    nabana = row("b09")
    nabana.locator(".route-more").tap()
    expect(nabana.locator(".inline-stop-detail")).to_be_visible()
    expect(nabana.locator(".inline-jp")).not_to_be_empty()
    nabana.locator(".route-more").tap()
    expect(nabana.locator(".inline-stop-detail")).to_have_count(0)
    nabana.locator(".route-more").tap()
    expect(page.locator("#selected-actions a")).to_have_attribute("href", re.compile(r"google\.com/maps/dir"))
    nabana.locator(".segment-options summary").tap()
    nabana.locator("[data-route-choice=origin]").select_option("next")
    assert "origin=" in nabana.locator("[data-segment-link]").get_attribute("href")
    nabana.locator("[data-event-status]").select_option("skipped")
    page.reload(wait_until="domcontentloaded")
    expect(nabana).to_contain_text("건너뜀")

    page.locator("#tab2").tap()
    dinner = row("s-okoge")
    expect(dinner).to_contain_text("19:30–20:45")
    dinner.locator(".route-more").tap()
    dinner.locator("[data-res-jump]").tap()
    expect(page.locator("#reservation-monja-saturday .resedit")).to_have_attribute("open", "")
    date_input = page.locator('[data-res-date="monja-saturday"]')
    time_input = page.locator('[data-res-time="monja-saturday"]')
    note_input = page.locator('[data-res-note="monja-saturday"]')
    expect(date_input).to_have_value("")
    date_input.fill("2026-12-12")
    time_input.fill("19:30")
    page.locator('[data-res-status="monja-saturday"]').select_option("confirmed")
    note_input.fill("Saturday dinner test")
    expect(page.locator("#reservation-ibushigin")).to_have_count(0)
    expect(page.locator("#reservation-ogawaya-ruri")).to_have_count(0)
    page.reload(wait_until="domcontentloaded")
    expect(page.locator("#reservation-monja-saturday")).to_contain_text("19:30")
    page.locator("#reservation-monja-saturday summary").tap()
    expect(note_input).to_have_value("Saturday dinner test")
    assert time_input.bounding_box()["y"] > date_input.bounding_box()["y"]

    page.locator("[data-nav=prepare]").tap()
    with page.expect_download() as download:
        page.locator("[data-export-itinerary]").tap()
    exported = json.loads(download.value.path().read_text(encoding="utf8"))
    assert "plan" not in exported and sum(len(day["events"]) for day in exported["days"]) == 83
    with page.expect_download() as download:
        page.locator("#exportbackup").tap()
    backup = json.loads(download.value.path().read_text(encoding="utf8"))
    assert backup["state"]["events"]["b09"]["status"] == "skipped"
    assert backup["state"]["reservations"]["monja-saturday"]["note"] == "Saturday dinner test"
    page.locator("#backupfile").set_input_files({
        "name": "backup.json", "mimeType": "application/json", "buffer": json.dumps(backup).encode(),
    })
    page.locator("#confirmdialog button[value=confirm]").tap()
    expect(page.locator("#backupfeedback")).to_contain_text("복원")
    print("PASS single Sunday, history, map, inline details, directions, progress, reservation edit, reload, export and restore")

    legacy = {**backup["state"], "version": 2, "memo": "v2 memo", "events": {
        "d4-return": {"status": "done"}, "d2-wings": {"status": "done"},
    }, "reservations": {"sushi": {"status": "confirmed", "note": "old dinner"}}}
    page.locator("#backupfile").set_input_files({
        "name": "v2.json", "mimeType": "application/json",
        "buffer": json.dumps({"app": "nagoya-trip", "state": legacy}).encode(),
    })
    page.locator("#confirmdialog button[value=confirm]").tap()
    expect(page.locator("#memo")).to_have_value("v2 memo")
    page.locator("[data-nav=reservations]").tap()
    expect(page.locator("#reservation-sushi-lunch")).to_contain_text("미확정")
    page.locator(".reservation-archive summary").tap()
    expect(page.locator(".reservation-archive")).to_contain_text("old dinner")
    page.goto(sunday+"&plan=A", wait_until="domcontentloaded")
    expect(row("d4-return")).to_have_count(0)
    expect(row("sun-unayasu")).to_be_visible()
    print("PASS v2 UI import, archived legacy reservation and colliding event ID isolation")

    page.evaluate("""() => {
        const saved = JSON.parse(localStorage.getItem('nagoya26-v3'));
        Object.assign(saved,{selectedDay:2,selectedEvent:'s18',selectionMode:'manual'});
        Object.assign(saved.events,{s18:{status:'done'},s17:{status:'skipped'}});
        localStorage.setItem('nagoya26-v3',JSON.stringify(saved));
    }""")
    page.goto(url + "?page=plan&day=12-12&plan=B&event=s18", wait_until="domcontentloaded")
    expect(page).to_have_url(re.compile(r"day=12-11"))
    expect(row("s18")).to_contain_text("완료")
    assert page.evaluate("state.events.s17.status") == "skipped"
    expect(page.locator(".route-item")).to_have_count(29)

    for width in (320, 360, 375, 390, 430, 768, 1280):
        height = {320: 568, 375: 812, 390: 844}.get(width, 640)
        page.set_viewport_size({"width": width, "height": height})
        page.goto(url + "?page=plan&day=12-11&plan=A", wait_until="domcontentloaded")
        expect(page.locator(".route-item")).to_have_count(29)
        assert page.evaluate("document.documentElement.scrollWidth === innerWidth"), width
        assert page.locator(".route-scroll").bounding_box()["height"] > 60, width
        assert page.locator("#selected-actions").bounding_box()["y"] < height, width
        assert page.locator(".route-layout").bounding_box()["width"] <= width, width
        assert page.locator(".route-meta").evaluate_all(
            "(rows)=>rows.every(row=>row.scrollWidth<=row.clientWidth)"
        ), width
        assert row("f-chiikawa").locator(".route-more").bounding_box()["height"] >= 44
        expect(row("f-chiikawa").locator(".optional-label")).to_have_text("선택")
        expect(row("f-chiikawa").locator(".category-badge")).to_have_text("휴식·간식")
        expect(row("s18").locator(".route-status")).to_have_text("완료")
        expect(row("s18").locator(".category-badge")).to_have_text("쇼핑")
        for button in page.locator(".selected-buttons .btn").all():
            bounds = button.bounding_box()
            assert bounds["height"] >= 44 and bounds["x"] + bounds["width"] <= width, (width, bounds)
        for event_id in ("f08", "f11", "f13", "f15", "f17"):
            row(event_id).locator(".route-more").tap()
            expect(row(event_id).locator(".inline-jp")).not_to_be_empty()
            expect(row(event_id).locator(".info-bullets").first).not_to_be_empty()
        assert page.locator(".route-scroll").evaluate("node=>node.scrollTop") > 0
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(url + "?page=plan&day=12-10", wait_until="domcontentloaded")
    expect(row("d1-checkin").locator(".category-badge")).to_have_text("숙소")
    expect(row("d1-night-park").locator(".category-badge")).to_have_text("관광")
    expect(row("d1-arrival").locator(".category-badge")).to_have_text("이동")
    expect(row("d1-ramen").locator(".category-badge")).to_have_text("식사")
    page.goto(url + "?page=home&day=12-10", wait_until="domcontentloaded")
    expect(page.locator(".home-next .category-badge")).to_have_text("이동")
    page.set_viewport_size({"width": 390, "height": 700})
    page.goto(url + "?page=plan&day=12-12&plan=A", wait_until="domcontentloaded")
    expect(page.locator(".route-item")).to_have_count(23)
    expect(page.locator(".numberpin")).to_have_count(23)
    for moved in ("s18", "s20", "s22"):
        expect(row(moved)).to_have_count(0)
    for event_id in ("s10", "s12", "s14", "s16", "s-coffee-buriko", "s-osu-walk", "s-shinsuzume", "s-okoge"):
        row(event_id).locator(".route-more").tap()
        expect(row(event_id).locator(".inline-jp")).not_to_be_empty()
        expect(row(event_id).locator(".info-bullets").first).not_to_be_empty()
    page.evaluate("dayMap.zoomIn();dayMap.panBy([40,30],{animate:false})")
    page.locator('[data-mapextent="all"]').tap()
    assert page.evaluate("Array.from(mapMarkers.values()).every(({marker,point})=>marker.getLatLng().lat===point.location.lat && marker.getLatLng().lng===point.location.lng)")
    page.evaluate("[...mapMarkers.values()].find(({point})=>point.eventId==='s08').marker.fire('click')")
    expect(row("s08").locator(".inline-stop-detail")).to_be_visible()
    assert page.evaluate("""[...mapMarkers.values()].every(({marker,point})=>{
        const row=document.querySelector('[data-event-id="'+point.eventId+'"]');
        return marker.getElement().dataset.category===row.dataset.category &&
            marker.getElement().textContent===String(point.number);
    })""")
    page.evaluate("[...mapMarkers.values()].find(({point})=>point.eventId==='s-coffee-buriko').marker.fire('click')")
    choice = page.locator("#map-choices .pin-visits [data-place-detail=s-coffee-buriko]")
    expect(choice).to_be_visible()
    choice.tap()
    expect(row("s-coffee-buriko").locator(".inline-stop-detail")).to_be_visible()
    expect(row("s08").locator(".inline-stop-detail")).to_have_count(0)
    page.locator("#optional").uncheck()
    expect(row("s-osu-walk")).to_have_count(0)
    expect(row("s-shinsuzume")).to_have_count(0)
    expect(row("s-okoge")).to_be_visible()
    page.locator("#optional").check()
    expect(row("s-osu-walk")).to_be_visible()
    snack = row("s-shinsuzume")
    snack.locator(".route-more").tap()
    snack.locator("[data-event-status]").select_option("progress")
    expect(snack.locator(".route-status")).to_have_text("진행 중")
    snack.locator("[data-event-status]").select_option("skipped")
    expect(snack).to_have_class(re.compile("is-skipped"))
    expect(snack.locator(".route-status")).to_have_text("건너뜀")
    expect(snack.locator(".category-badge")).to_have_text("휴식·간식")
    expect(snack.locator(".optional-label")).to_have_text("선택")
    assert snack.locator(".route-copy > strong").evaluate(
        "(node)=>getComputedStyle(node).textDecorationLine"
    ) == "line-through"

    page.goto(url + "?page=food&day=12-12&plan=A", wait_until="domcontentloaded")
    for query, event_id in (
        ("부리코", "s-coffee-buriko"), ("치이카와", "f-chiikawa"), ("당고", "s-shinsuzume"),
        ("오코게", "s-okoge"), ("우나야스", "sun-unayasu"),
    ):
        page.locator("#search").fill(query)
        expect(page.locator("#restaurant-" + event_id)).to_be_visible()
    unayasu = page.locator("#restaurant-sun-unayasu")
    expect(unayasu.locator(".category-badge")).to_have_text("식사")
    expect(unayasu.locator(".optional-label")).to_have_text("선택")
    expect(unayasu.locator(".statusbadge")).to_have_text("예약 미확정")
    assert unayasu.locator(".food-card-meta").evaluate("(node)=>node.scrollWidth<=node.clientWidth")
    page.locator("#search").fill("이부시긴")
    expect(page.locator("#foodcount")).to_contain_text("0개")

    page.goto(url + "?page=plan&day=12-11&plan=A", wait_until="domcontentloaded")
    row("s22").locator(".route-more").tap()
    row("s22").locator(".inline-section").first.locator("summary").tap()
    expect(row("s22")).to_contain_text("12/11 금요일 포함")
    for selector in (".route-sheet", "#tab4", ".selected-buttons"):
        target = page.locator("#plan " + selector).first.bounding_box()
        assert target["x"] + target["width"] <= 390, (selector, target)
    screenshot = os.getenv("NAGOYA_TEST_SCREENSHOT")
    if screenshot:
        row("s22").locator(".inline-section").first.scroll_into_view_if_needed()
        page.screenshot(path=screenshot)
    page.evaluate("beforePrint()")
    expect(page.locator("[data-printed-event] .category-badge")).to_have_count(83)
    page.evaluate("afterPrint()")
    page.goto(sunday + "&plan=B", wait_until="domcontentloaded")
    page.evaluate("beforePrint()")
    expect(page.locator("[data-printed-event]")).to_have_count(83)
    expect(page.locator("[data-printed-event=d4-bath]")).to_have_count(0)
    page.evaluate("afterPrint()")
    print("PASS 320–1280 px, category labels, combined status, touch, scroll, marker choice and print")

    # Measure foreground/background pairs from the actual badges on the static guide.
    page.goto(url + "guide.html", wait_until="load")
    expect(page.locator('.category-badge[data-category="transit"]').first).to_have_css(
        "background-color", "rgb(235, 238, 241)"
    )
    ratios = page.locator(".category-badge").evaluate_all(r"""badges=>{
        function luminance(color){
            const rgb=color.match(/\d+/g).slice(0,3).map(n=>{
                const v=Number(n)/255;
                return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;
            });
            return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];
        }
        return Object.fromEntries(badges.map(b=>{
            const style=getComputedStyle(b);
            const l1=luminance(style.color),l2=luminance(style.backgroundColor);
            return [b.dataset.category,(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)];
        }));
    }""")
    assert len(ratios) == 6 and min(ratios.values()) >= 4.5, ratios
    print("PASS all six category badge contrast ratios:", {k: round(v, 2) for k, v in ratios.items()})
    page.goto(sunday, wait_until="domcontentloaded")

    page.wait_for_function("navigator.serviceWorker.controller !== null", timeout=15000)
    # Windows WebKit aborts navigations before the worker when Playwright turns off
    # the network context. A stopped origin exercises the same worker cache path.
    if engine == "webkit":
        server.origin_unavailable.set()
        assert page.evaluate("fetch('/origin-probe').then(()=>false,()=>true)")
    else:
        context.set_offline(True)
    page.goto(sunday + "&plan=B", wait_until="domcontentloaded")
    expect(page.locator(".route-item")).to_have_count(17)
    if engine != "webkit":
        expect(page.locator("#networkstatus")).to_contain_text("오프라인")
    nabana.locator(".route-more").tap()
    expect(nabana.locator(".inline-stop-detail")).to_be_visible()
    row("sun-unayasu").locator(".route-more").tap()
    expect(row("sun-unayasu").locator(".inline-stop-detail")).to_be_visible()
    expect(page.locator("[data-plan]")).to_have_count(0)

    page.goto(url + "?page=plan&day=12-12&plan=B", wait_until="domcontentloaded")
    expect(page.locator(".route-item")).to_have_count(23)
    row("s-coffee-buriko").locator(".route-more").tap()
    expect(row("s-coffee-buriko").locator(".inline-jp")).to_have_text("珈琲ぶりこ")
    page.goto(url + "guide.html#sunday-b", wait_until="domcontentloaded")
    expect(page.locator("#day-4 [data-guide-event]")).to_have_count(17)
    expect(page.locator('[data-guide-event="s-okoge"] .category-badge')).to_have_css(
        "background-color", "rgb(250, 236, 230)"
    )
    expect(page.locator("[data-guide-event]")).to_have_count(83)
    expect(page.locator("#sunday-a")).to_have_count(0)
    expect(page.locator("[data-guide-event=s-okoge]")).to_contain_text("몬자야키")
    assert not errors, errors
    print("PASS Service Worker offline timeline, details and static guide; no page errors")
    context.close()


def main():
    root = Path(__file__).resolve().parents[1]
    handler = partial(Handler, directory=str(root))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        server.origin_unavailable = threading.Event()
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            with sync_playwright() as playwright:
                engine = os.getenv("NAGOYA_BROWSER_ENGINE", "chromium")
                browser = (playwright.webkit.launch() if engine == "webkit" else
                           playwright.chromium.launch(channel=os.getenv("NAGOYA_BROWSER_CHANNEL", "msedge")))
                verify_mobile(browser, f"http://127.0.0.1:{server.server_port}/", server, engine)
                browser.close()
        finally:
            server.shutdown()


if __name__ == "__main__":
    main()
