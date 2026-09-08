/* 1) 시스템/카카오톡 인앱 브라우저의 글꼴 확대를 상쇄
   2) 홈 화면 추가(PWA)용 서비스워커 등록 */
(function () {
  // 실제로 그려진 1rem 글자 높이를 재서 16px이 될 때까지 html 글자 크기를 보정한다.
  // (카카오톡·삼성 인터넷 웹뷰의 "글자 크기" 확대, 브라우저 기본 글꼴 크기 변경 모두 상쇄)
  function measure() {
    var t = document.createElement("div");
    t.style.cssText = "position:absolute;left:-9999px;top:0;width:auto;height:auto;padding:0;margin:0;border:0;font-size:1rem;line-height:1;visibility:hidden;white-space:nowrap;font-family:sans-serif;";
    t.textContent = "가A";
    document.documentElement.appendChild(t);
    var h = t.getBoundingClientRect().height;
    t.remove();
    return h;
  }
  function fixZoom() {
    try {
      var root = document.documentElement;
      var size = parseFloat(root.style.fontSize) || 16;
      for (var i = 0; i < 4; i++) {
        var h = measure();
        if (!h || Math.abs(h - 16) < 0.4) break;
        size = size * 16 / h;
        root.style.fontSize = size + "px";
      }
    } catch (e) {}
  }
  fixZoom();
  window.addEventListener("DOMContentLoaded", fixZoom);
  window.addEventListener("load", fixZoom);
  window.addEventListener("pageshow", fixZoom);

  // 402px 고정 폭 무대를 화면 폭에 맞춰 zoom (테마 메이커와 같은 방식)
  var DESIGN_W = 402, MAX_K = 1.25;
  function applyStage() {
    try {
      var root = document.documentElement;
      var w = (window.visualViewport && window.visualViewport.width) || root.clientWidth || window.innerWidth || DESIGN_W;
      var k = Math.min(MAX_K, w / DESIGN_W);
      root.style.setProperty("--k", k);
      var vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      root.style.setProperty("--stage-h", Math.ceil(vh / k) + "px");
      var cs = getComputedStyle(root);
      var st = parseFloat(cs.getPropertyValue("--env-top")) || 0, sb = parseFloat(cs.getPropertyValue("--env-bottom")) || 0;
      root.style.setProperty("--safe-top", st / k + "px");
      root.style.setProperty("--safe-bottom", sb / k + "px");
    } catch (e) {}
  }
  applyStage();
  [50, 150, 400, 800, 1500].forEach(function (t) { setTimeout(applyStage, t); });
  window.addEventListener("resize", applyStage, { passive: true });
  window.addEventListener("orientationchange", function () { setTimeout(applyStage, 250); });
  window.addEventListener("pageshow", applyStage);
  window.addEventListener("load", applyStage);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", applyStage, { passive: true });
    window.visualViewport.addEventListener("scroll", function () {
      var vv = window.visualViewport, meta = document.querySelector("meta[name=viewport]");
      if (vv && vv.scale > 1.01 && meta) { var o = meta.content; meta.content = o + ", maximum-scale=1.0"; setTimeout(function () { meta.content = o; }, 60); }
    }, { passive: true });
  }
  document.addEventListener("touchmove", function (e) { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

  // 두 손가락 확대·더블탭 확대 막기 (iOS Safari)
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false }); });
  var last = 0;
  document.addEventListener("touchend", function (e) {
    var now = Date.now();
    if (now - last < 300 && !e.target.closest("input, textarea, select, button, a, [data-v]")) e.preventDefault();
    last = now;
  }, { passive: false });

  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
