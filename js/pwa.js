/* 1) 시스템/카카오톡 인앱 브라우저의 글꼴 확대를 상쇄
   2) 홈 화면 추가(PWA)용 서비스워커 등록 */
(function () {
  try {
    var t = document.createElement("div");
    t.style.cssText = "position:absolute;left:-9999px;top:0;font-size:16px;line-height:1;visibility:hidden;";
    t.textContent = "가";
    document.documentElement.appendChild(t);
    var z = parseFloat(getComputedStyle(t).fontSize) / 16;
    t.remove();
    if (z && Math.abs(z - 1) > 0.01) document.documentElement.style.fontSize = (16 / z) + "px";
  } catch (e) {}

  // 두 손가락 확대·더블탭 확대 막기 (iOS Safari)
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, { passive: false });
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
