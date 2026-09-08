/* ═══════════════════════════════════════════════════════════
   드라마 기록 · 공용 앱 로직
   - 각 페이지의 <body data-region="cn|jp|kr"> 로 나라를 구분
   - Supabase(Auth + Postgres + Storage) 사용
   - config.js 를 채우기 전에는 "미리보기 모드"(브라우저 저장)로 동작
═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const REGION = document.body.dataset.region || "cn";
  const LOGIN_DOMAIN = "drama.app"; // 아이디 "hyejin" → hyejin@drama.app 으로 로그인
  const REGION_META = {
    cn: { name: "중국 드라마", short: "중드" },
    jp: { name: "일본 드라마", short: "일드" },
    kr: { name: "한국 드라마", short: "한드" },
  };
  const STATUS = {
    watching: { label: "보는 중" },
    done:     { label: "완주" },
    wish:     { label: "찜" },
    dropped:  { label: "중단" },
  };
  const SORTS = {
    updated: "최근 수정순",
    created: "추가한 순",
    rating:  "별점 높은 순",
    title:   "제목순",
    start:   "시작일순",
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(16).slice(2));
  const today = () => new Date().toISOString().slice(0, 10);

  /* ─────────────────────────────────────────────
     데이터 어댑터
  ───────────────────────────────────────────── */
  const cfg = window.SHELF_CONFIG || {};
  const DEMO = !cfg.SUPABASE_URL || /YOUR-PROJECT/.test(cfg.SUPABASE_URL) || !window.supabase;

  // 미리보기(로컬) 모드 --------------------------------------------
  const localAdapter = {
    demo: true,
    _key: "drama-shelf-demo",
    _all() { try { return JSON.parse(localStorage.getItem(this._key) || "[]"); } catch { return []; } },
    _write(list) { localStorage.setItem(this._key, JSON.stringify(list)); },
    async user() { return { email: "미리보기" }; },
    async signIn() {},
    async signOut() {},
    async list(region) { return this._all().filter((d) => d.region === region); },
    async upsert(item) {
      const all = this._all();
      const i = all.findIndex((d) => d.id === item.id);
      item.updated_at = new Date().toISOString();
      if (i >= 0) all[i] = item; else { item.created_at = item.updated_at; all.push(item); }
      this._write(all);
      return item;
    },
    async remove(id) { this._write(this._all().filter((d) => d.id !== id)); },
    async uploadPoster(file) { return await fileToDataUrl(file, 700); },
    posterUrl(path) { return path || ""; },
    async deletePoster() {},
  };

  // Supabase 모드 ---------------------------------------------------
  const sb = DEMO ? null : window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const supaAdapter = {
    demo: false,
    async user() { const { data } = await sb.auth.getUser(); return data.user; },
    async signIn(id, password) {
      const email = id.includes("@") ? id : `${id.toLowerCase()}@${LOGIN_DOMAIN}`;
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signOut() { await sb.auth.signOut(); },
    async list(region) {
      const { data, error } = await sb.from("dramas").select("*").eq("region", region).order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    async upsert(item) {
      const { data, error } = await sb.from("dramas").upsert(item).select().single();
      if (error) throw error;
      return data;
    },
    async remove(id) { const { error } = await sb.from("dramas").delete().eq("id", id); if (error) throw error; },
    async uploadPoster(file) {
      const blob = await fileToJpegBlob(file, 700);
      const path = `${REGION}/${uid()}.jpg`;
      const { error } = await sb.storage.from("posters").upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (error) throw error;
      return path;
    },
    posterUrl(path) { return path ? sb.storage.from("posters").getPublicUrl(path).data.publicUrl : ""; },
    async deletePoster(path) { if (path) await sb.storage.from("posters").remove([path]); },
  };
  const db = DEMO ? localAdapter : supaAdapter;

  /* 이미지 리사이즈 유틸 */
  function loadImage(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); res(img); };
      img.onerror = rej;
      img.src = url;
    });
  }
  async function drawResized(file, maxW) {
    const img = await loadImage(file);
    const scale = Math.min(1, maxW / img.width);
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
  async function fileToDataUrl(file, maxW) { return (await drawResized(file, maxW)).toDataURL("image/jpeg", 0.86); }
  async function fileToJpegBlob(file, maxW) {
    const c = await drawResized(file, maxW);
    return new Promise((res) => c.toBlob(res, "image/jpeg", 0.86));
  }

  /* ─────────────────────────────────────────────
     상태
  ───────────────────────────────────────────── */
  const state = {
    items: [],
    q: "",
    status: "all",
    tag: null,
    sort: "updated",
    showStats: false,
    user: null,
  };

  /* ─────────────────────────────────────────────
     셸 렌더
  ───────────────────────────────────────────── */
  const app = $("#app");
  app.innerHTML = `
    <section class="auth-gate" id="authGate" hidden>
      <form class="auth-card" id="authForm">
        <h2>로그인</h2>
        <label>아이디<input type="text" name="id" required autocomplete="username" autocapitalize="none"></label>
        <label>비밀번호<input type="password" name="password" required autocomplete="current-password"></label>
        <button class="btn primary" type="submit" id="authBtn">로그인</button>
        <p class="auth-err" id="authErr"></p>
      </form>
    </section>

    <section class="shelf" id="shelf" hidden>
      <div class="toolbar">
        <div class="search">
          <input id="q" type="search" placeholder="검색">
        </div>
        <div class="chips" id="statusChips">
          <button class="chip active" data-status="all">전체</button>
          ${Object.entries(STATUS).map(([k, v]) => `<button class="chip" data-status="${k}">${v.label}</button>`).join("")}
        </div>
        <div class="toolbar-right">
          <select id="sort">${Object.entries(SORTS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
          <button class="btn ghost" id="statsBtn">통계</button>
          <button class="btn primary" id="addBtn">+ 추가</button>
        </div>
      </div>
      <div class="tagbar" id="tagbar"></div>
      <div class="stats" id="stats" hidden></div>
      <div class="grid" id="grid"></div>
      <div class="empty" id="empty" hidden>
        <p>아직 추가한 드라마가 없어요.</p>
        <button class="btn primary" id="addBtn2">+ 추가</button>
      </div>
      <div class="shelf-foot">
        <span id="userLabel" class="muted"></span>
        <button class="link" id="exportBtn">JSON 내보내기</button>
        <button class="link" id="logoutBtn" ${DEMO ? "hidden" : ""}>로그아웃</button>
      </div>
    </section>

    <div class="modal" id="detailModal" hidden><div class="modal-box detail" id="detailBox"></div></div>
    <div class="modal" id="formModal" hidden><div class="modal-box form" id="formBox"></div></div>
    <div class="toast" id="toast" hidden></div>
  `;

  const el = {
    gate: $("#authGate"), authForm: $("#authForm"), authErr: $("#authErr"),
    shelf: $("#shelf"), q: $("#q"), statusChips: $("#statusChips"), sort: $("#sort"),
    tagbar: $("#tagbar"), stats: $("#stats"), grid: $("#grid"), empty: $("#empty"),
    detailModal: $("#detailModal"), detailBox: $("#detailBox"),
    formModal: $("#formModal"), formBox: $("#formBox"), toast: $("#toast"),
    userLabel: $("#userLabel"),
  };
  // 고정 위치 요소는 zoom 된 무대 밖(body)으로 옮겨 각자 zoom 을 적용
  document.body.append(el.detailModal, el.formModal, el.toast);

  /* ─────────────────────────────────────────────
     토스트
  ───────────────────────────────────────────── */
  let toastTimer;
  function toast(msg, isErr = false) {
    el.toast.textContent = msg;
    el.toast.classList.toggle("err", isErr);
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.toast.hidden = true), 2600);
  }

  /* ─────────────────────────────────────────────
     인증
  ───────────────────────────────────────────── */
  async function boot() {
    state.user = await db.user();
    if (state.user) {
      el.gate.hidden = true; el.shelf.hidden = false;
      el.userLabel.textContent = DEMO ? "" : (state.user.email || "").replace("@" + LOGIN_DOMAIN, "");
      await reload();
    } else {
      el.gate.hidden = false; el.shelf.hidden = true;
    }
  }
  el.authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.authErr.textContent = "";
    const btn = $("#authBtn"); btn.disabled = true;
    try {
      await db.signIn(el.authForm.id.value.trim(), el.authForm.password.value);
      await boot();
    } catch (err) {
      el.authErr.textContent = "아이디나 비밀번호가 맞지 않아요.";
    } finally { btn.disabled = false; }
  });
  $("#logoutBtn").addEventListener("click", async () => { await db.signOut(); location.reload(); });

  /* ─────────────────────────────────────────────
     데이터 로드 / 필터 / 정렬
  ───────────────────────────────────────────── */
  async function reload() {
    try { state.items = await db.list(REGION); }
    catch (err) { console.error(err); toast("불러오지 못했어요: " + err.message, true); state.items = []; }
    render();
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = state.items.filter((d) => {
      if (state.status !== "all" && d.status !== state.status) return false;
      if (state.tag && !(d.tags || []).includes(state.tag)) return false;
      if (q) {
        const hay = [d.title, d.original_title, d.review, d.synopsis, ...(d.tags || [])].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const by = {
      updated: (a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""),
      created: (a, b) => (b.created_at || "").localeCompare(a.created_at || ""),
      rating:  (a, b) => (b.rating ?? -1) - (a.rating ?? -1),
      title:   (a, b) => (a.title || "").localeCompare(b.title || "", "ko"),
      start:   (a, b) => (b.start_date || "").localeCompare(a.start_date || ""),
    }[state.sort];
    return list.sort(by);
  }

  /* ─────────────────────────────────────────────
     렌더
  ───────────────────────────────────────────── */
  function stars(r, small = false) {
    if (r == null || r === "") return `<span class="stars none">별점 없음</span>`;
    const full = Math.floor(r), half = r - full >= 0.5;
    let s = "";
    for (let i = 1; i <= 5; i++) s += `<i class="${i <= full ? "on" : i === full + 1 && half ? "half" : ""}">★</i>`;
    return `<span class="stars ${small ? "small" : ""}">${s}<b>${Number(r).toFixed(1)}</b></span>`;
  }
  function progress(d) {
    if (!d.total_ep) return d.current_ep ? `${d.current_ep}화까지` : "";
    const pct = Math.min(100, Math.round(((d.current_ep || 0) / d.total_ep) * 100));
    return `<div class="prog"><div class="bar"><span style="width:${pct}%"></span></div><small>${d.current_ep || 0} / ${d.total_ep}화</small></div>`;
  }
  function posterHtml(d, cls = "") {
    const url = db.posterUrl(d.poster_path);
    return url
      ? `<img class="poster ${cls}" src="${esc(url)}" alt="${esc(d.title)}" loading="lazy">`
      : `<div class="poster placeholder ${cls}"><span>${esc((d.title || "").slice(0, 2))}</span></div>`;
  }

  function render() {
    // 태그바
    const tagCount = {};
    state.items.forEach((d) => (d.tags || []).forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1)));
    const tags = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a]);
    el.tagbar.innerHTML = tags.length
      ? `<span class="tagbar-label">태그</span>` + tags.map((t) => `<button class="tag ${state.tag === t ? "active" : ""}" data-tag="${esc(t)}">#${esc(t)} <small>${tagCount[t]}</small></button>`).join("")
      : "";

    // 그리드
    const list = filtered();
    el.empty.hidden = state.items.length > 0;
    el.grid.innerHTML = list.map((d) => `
      <article class="card status-${d.status}" data-id="${d.id}">
        <div class="poster-wrap">
          ${posterHtml(d)}
          <span class="badge">${STATUS[d.status]?.label || d.status}</span>
        </div>
        <div class="card-body">
          <h3>${esc(d.title)}</h3>
          ${d.original_title ? `<p class="orig">${esc(d.original_title)}</p>` : ""}
          ${progress(d)}
          ${stars(d.rating, true)}
          ${(d.tags || []).length ? `<div class="card-tags">${d.tags.slice(0, 3).map((t) => `<span>#${esc(t)}</span>`).join("")}</div>` : ""}
        </div>
      </article>`).join("");
    if (state.items.length && !list.length) el.grid.innerHTML = `<p class="muted nothing">조건에 맞는 드라마가 없어요.</p>`;

    el.stats.hidden = !state.showStats;
    if (state.showStats) renderStats();
  }

  function renderStats() {
    const it = state.items;
    const cnt = (s) => it.filter((d) => d.status === s).length;
    const rated = it.filter((d) => d.rating != null && d.rating !== "");
    const avg = rated.length ? (rated.reduce((a, d) => a + Number(d.rating), 0) / rated.length).toFixed(2) : "-";
    const eps = it.reduce((a, d) => a + (Number(d.current_ep) || 0), 0);
    const year = new Date().getFullYear();
    const doneThisYear = it.filter((d) => d.status === "done" && (d.end_date || "").startsWith(String(year))).length;
    const months = Array.from({ length: 12 }, (_, i) =>
      it.filter((d) => d.status === "done" && d.end_date && d.end_date.startsWith(`${year}-${String(i + 1).padStart(2, "0")}`)).length);
    const max = Math.max(1, ...months);
    const top = [...rated].sort((a, b) => b.rating - a.rating).slice(0, 3);

    el.stats.innerHTML = `
      <div class="stat-tiles">
        <div class="tile"><b>${it.length}</b><span>전체</span></div>
        <div class="tile"><b>${cnt("watching")}</b><span>보는 중</span></div>
        <div class="tile"><b>${cnt("done")}</b><span>완주</span></div>
        <div class="tile"><b>${cnt("wish")}</b><span>찜</span></div>
        <div class="tile"><b>${cnt("dropped")}</b><span>중단</span></div>
        <div class="tile"><b>${avg}</b><span>평균 별점</span></div>
        <div class="tile"><b>${eps.toLocaleString()}</b><span>본 회차 합계</span></div>
        <div class="tile"><b>${doneThisYear}</b><span>${year}년 완주</span></div>
      </div>
      <div class="stat-row">
        <div class="chart">
          <h4>${year}년 월별 완주</h4>
          <div class="bars">${months.map((m, i) => `<div class="bar-col"><div class="bar-fill" style="height:${(m / max) * 100}%"><em>${m || ""}</em></div><span>${i + 1}</span></div>`).join("")}</div>
        </div>
        <div class="top3">
          <h4>내 최고 별점</h4>
          ${top.length ? `<ol>${top.map((d) => `<li data-id="${d.id}"><span>${esc(d.title)}</span>${stars(d.rating, true)}</li>`).join("")}</ol>` : `<p class="muted">별점을 매긴 드라마가 아직 없어요.</p>`}
        </div>
      </div>`;
  }

  /* ─────────────────────────────────────────────
     상세 모달
  ───────────────────────────────────────────── */
  function openDetail(id) {
    const d = state.items.find((x) => x.id === id);
    if (!d) return;
    const quotes = Array.isArray(d.quotes) ? d.quotes : [];
    el.detailBox.innerHTML = `
      <button class="close" data-close>×</button>
      <div class="detail-grid">
        <div class="detail-poster">${posterHtml(d, "big")}</div>
        <div class="detail-info">
          <span class="badge">${STATUS[d.status]?.label || d.status}</span>
          <h2>${esc(d.title)}</h2>
          ${d.original_title ? `<p class="orig">${esc(d.original_title)}</p>` : ""}
          ${stars(d.rating)}
          ${progress(d)}
          <dl class="meta">
            ${d.start_date ? `<dt>시작</dt><dd>${d.start_date}</dd>` : ""}
            ${d.end_date ? `<dt>완주</dt><dd>${d.end_date}</dd>` : ""}
            ${(d.tags || []).length ? `<dt>태그</dt><dd>${d.tags.map((t) => `<span class="tag static">#${esc(t)}</span>`).join(" ")}</dd>` : ""}
          </dl>
        </div>
      </div>
      <div class="detail-sections">
        ${d.synopsis ? `<section><h4>줄거리</h4><p>${esc(d.synopsis).replace(/\n/g, "<br>")}</p></section>` : ""}
        ${d.review ? `<section><h4>후기</h4><p>${esc(d.review).replace(/\n/g, "<br>")}</p></section>` : ""}
        ${quotes.length ? `<section class="quotes"><h4>명대사 · 장면</h4>${quotes.map((q) => `<blockquote><p>${esc(q.text).replace(/\n/g, "<br>")}</p>${q.note ? `<footer>${esc(q.note)}</footer>` : ""}</blockquote>`).join("")}</section>` : ""}
      </div>
      <div class="detail-actions">
        <button class="btn ghost" data-edit="${d.id}">수정</button>
        <button class="btn danger" data-del="${d.id}">삭제</button>
      </div>`;
    el.detailModal.hidden = false;
  }

  /* ─────────────────────────────────────────────
     추가/수정 폼
  ───────────────────────────────────────────── */
  let formState = { posterFile: null, posterPreview: "", quotes: [], rating: null };

  function openForm(id) {
    const d = id ? state.items.find((x) => x.id === id) : null;
    formState = {
      id: d?.id || null,
      posterFile: null,
      posterPath: d?.poster_path || null,
      posterPreview: d ? db.posterUrl(d.poster_path) : "",
      quotes: d && Array.isArray(d.quotes) ? d.quotes.map((q) => ({ ...q })) : [],
      rating: d?.rating ?? null,
    };
    el.formBox.innerHTML = `
      <button class="close" data-close>×</button>
      <form id="dramaForm" class="drama-form">
        <h2>${d ? "수정" : "추가"}</h2>
        <div class="form-grid">
          <div class="poster-col">
            <label class="poster-drop" id="posterDrop">
              <input type="file" accept="image/*" id="posterInput" hidden>
              <img id="posterPreview" src="${esc(formState.posterPreview)}" ${formState.posterPreview ? "" : "hidden"}>
              <span id="posterHint" ${formState.posterPreview ? "hidden" : ""}>포스터</span>
            </label>
            <div class="rating-input" id="ratingInput">
              ${[1, 2, 3, 4, 5].map((i) => `<span data-v="${i}"><i class="l" data-v="${i - 0.5}"></i><i class="r" data-v="${i}"></i>★</span>`).join("")}
              <b id="ratingLabel"></b>
              <button type="button" class="link" id="ratingClear">지우기</button>
            </div>
          </div>
          <div class="fields">
            <label>제목<input name="title" required value="${esc(d?.title || "")}"></label>
            <label>원제<input name="original_title" value="${esc(d?.original_title || "")}"></label>
            <div class="row">
              <label>상태<select name="status">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${d?.status === k ? "selected" : ""}>${v.label}</option>`).join("")}</select></label>
              <label>본 화수<input type="number" name="current_ep" min="0" value="${d?.current_ep ?? 0}"></label>
              <label>총 화수<input type="number" name="total_ep" min="0" value="${d?.total_ep ?? ""}"></label>
            </div>
            <div class="row two">
              <label>시작일<input type="date" name="start_date" value="${d?.start_date || ""}"></label>
              <label>완주일<input type="date" name="end_date" value="${d?.end_date || ""}"></label>
            </div>
            <label>태그<input name="tags" value="${esc((d?.tags || []).join(", "))}" placeholder="쉼표로 구분"></label>
            <label>줄거리<textarea name="synopsis" rows="3">${esc(d?.synopsis || "")}</textarea></label>
            <label>후기<textarea name="review" rows="4">${esc(d?.review || "")}</textarea></label>
            <div class="quotes-edit">
              <div class="quotes-head"><span>명대사 · 장면</span><button type="button" class="link" id="addQuote">+ 추가</button></div>
              <div id="quoteList"></div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn ghost" data-close>취소</button>
          <button type="submit" class="btn primary" id="saveBtn">저장</button>
        </div>
      </form>`;
    renderQuotes();
    renderRating();
    el.formModal.hidden = false;
    setTimeout(() => $("#dramaForm [name=title]").focus(), 50);

    // 포스터
    const drop = $("#posterDrop"), input = $("#posterInput");
    input.addEventListener("change", () => setPoster(input.files[0]));
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", (e) => setPoster(e.dataTransfer.files[0]));

    // 별점
    $("#ratingInput").addEventListener("click", (e) => {
      const v = e.target.closest("i")?.dataset.v;
      if (v) { formState.rating = Number(v); renderRating(); }
    });
    $("#ratingClear").addEventListener("click", () => { formState.rating = null; renderRating(); });

    // 명대사
    $("#addQuote").addEventListener("click", () => { formState.quotes.push({ text: "", note: "" }); renderQuotes(); $("#quoteList textarea:last-of-type")?.focus(); });
    $("#quoteList").addEventListener("input", (e) => {
      const i = Number(e.target.dataset.i);
      if (Number.isNaN(i)) return;
      formState.quotes[i][e.target.dataset.k] = e.target.value;
    });
    $("#quoteList").addEventListener("click", (e) => {
      const b = e.target.closest("[data-rm]");
      if (b) { formState.quotes.splice(Number(b.dataset.rm), 1); renderQuotes(); }
    });

    // 상태 바뀌면 완주일 자동
    $("#dramaForm [name=status]").addEventListener("change", (e) => {
      const end = $("#dramaForm [name=end_date]");
      if (e.target.value === "done" && !end.value) end.value = today();
      const start = $("#dramaForm [name=start_date]");
      if (e.target.value === "watching" && !start.value) start.value = today();
    });

    $("#dramaForm").addEventListener("submit", submitForm);
  }

  async function setPoster(file) {
    if (!file || !file.type.startsWith("image/")) return;
    formState.posterFile = file;
    formState.posterPreview = await fileToDataUrl(file, 500);
    const img = $("#posterPreview");
    img.src = formState.posterPreview; img.hidden = false;
    $("#posterHint").hidden = true;
  }
  function renderRating() {
    const r = formState.rating;
    $("#ratingInput").querySelectorAll("span").forEach((s) => {
      const v = Number(s.dataset.v);
      s.className = r == null ? "" : v <= r ? "on" : v - 0.5 === r ? "half" : "";
    });
    $("#ratingLabel").textContent = r == null ? "" : r.toFixed(1);
  }
  function renderQuotes() {
    $("#quoteList").innerHTML = formState.quotes.map((q, i) => `
      <div class="quote-item">
        <textarea data-i="${i}" data-k="text" rows="2" placeholder="대사">${esc(q.text)}</textarea>
        <input data-i="${i}" data-k="note" value="${esc(q.note || "")}" placeholder="메모">
        <button type="button" class="link danger" data-rm="${i}">삭제</button>
      </div>`).join("");
  }

  async function submitForm(e) {
    e.preventDefault();
    const btn = $("#saveBtn"); btn.disabled = true; btn.textContent = "저장 중…";
    const f = new FormData(e.target);
    const num = (v) => (v === "" || v == null ? null : Number(v));
    const item = {
      id: formState.id || uid(),
      region: REGION,
      title: f.get("title").trim(),
      original_title: f.get("original_title").trim() || null,
      status: f.get("status"),
      current_ep: num(f.get("current_ep")) ?? 0,
      total_ep: num(f.get("total_ep")),
      start_date: f.get("start_date") || null,
      end_date: f.get("end_date") || null,
      tags: f.get("tags").split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean),
      synopsis: f.get("synopsis").trim() || null,
      review: f.get("review").trim() || null,
      rating: formState.rating,
      quotes: formState.quotes.filter((q) => q.text.trim()),
      poster_path: formState.posterPath,
    };
    if (!DEMO && state.user) item.user_id = state.user.id;
    try {
      if (formState.posterFile) {
        const oldPath = formState.posterPath;
        item.poster_path = await db.uploadPoster(formState.posterFile);
        if (oldPath && oldPath !== item.poster_path) db.deletePoster(oldPath).catch(() => {});
      }
      await db.upsert(item);
      closeModals();
      toast(formState.id ? "수정했어요" : "저장했어요");
      await reload();
    } catch (err) {
      console.error(err);
      toast("저장 실패: " + err.message, true);
      btn.disabled = false; btn.textContent = "저장";
    }
  }

  async function removeItem(id) {
    const d = state.items.find((x) => x.id === id);
    if (!d || !confirm(`"${d.title}" 삭제할까요?`)) return;
    try {
      await db.remove(id);
      db.deletePoster(d.poster_path).catch(() => {});
      closeModals();
      toast("삭제했어요");
      await reload();
    } catch (err) { toast("삭제 실패: " + err.message, true); }
  }

  function closeModals() { el.detailModal.hidden = true; el.formModal.hidden = true; }

  /* ─────────────────────────────────────────────
     이벤트
  ───────────────────────────────────────────── */
  el.q.addEventListener("input", () => { state.q = el.q.value; render(); });
  el.sort.addEventListener("change", () => { state.sort = el.sort.value; render(); });
  el.statusChips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.status = b.dataset.status;
    el.statusChips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
    render();
  });
  el.tagbar.addEventListener("click", (e) => {
    const b = e.target.closest(".tag"); if (!b) return;
    state.tag = state.tag === b.dataset.tag ? null : b.dataset.tag;
    render();
  });
  $("#statsBtn").addEventListener("click", (e) => { state.showStats = !state.showStats; e.target.classList.toggle("active", state.showStats); render(); });
  $("#addBtn").addEventListener("click", () => openForm());
  $("#addBtn2").addEventListener("click", () => openForm());
  el.grid.addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) openDetail(c.dataset.id); });
  el.stats.addEventListener("click", (e) => { const li = e.target.closest("li[data-id]"); if (li) openDetail(li.dataset.id); });
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]") || e.target.classList.contains("modal")) closeModals();
    const ed = e.target.closest("[data-edit]"); if (ed) { closeModals(); openForm(ed.dataset.edit); }
    const dl = e.target.closest("[data-del]"); if (dl) removeItem(dl.dataset.del);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals(); });
  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.items, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `drama-shelf-${REGION}-${today()}.json`; a.click();
  });

  boot();
})();
