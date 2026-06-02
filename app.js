/**
 * 채널마케팅본부 주간 대시보드 — 프론트엔드 v3.4
 *
 * v3.6 변경
 *  - 월별 매출현황 표 라벨 / 컬럼 헤더를 시트에서 동적으로 가져옴 (5월/6월/컬럼명 변경 자동 반영)
 *
 * v3.5
 *  - 핵심 메시지: "— N가지" 카운트 라벨 제거, 1/2/3개에 따라 가로 폭 자동 분배
 *
 * v3.4
 *  - "본부 핵심 지표" → "본부 핵심 과제", "— N개 지표" 카운트 제거
 *  - 월별 매출현황 표 제목/헤더는 시트의 4번 섹션 헤더에서 동적으로 가져옴 (자동 반영)
 *  - 진척율 셀: 비고가 있으면 ⓘ 아이콘 + 마우스 호버 툴팁
 *  - 월별 마감 예상매출 합계 행 추가 (월별 매출현황 합계 바로 아래, 그린 톤)
 *  - 팀별 주요 실적: 시트의 노출설정=Y 인 항목만 표시 (백엔드가 이미 필터링)
 */

const API_URL = "https://script.google.com/macros/s/AKfycbz_2-A6RxEYqm1q3O-IrnksxwfZwwMUgB-meFdH3JLQxTbbOv2aY_5dIomX3YpLZmhE/exec";

const NAV_OFFSET = 140;
let navClickGuard = 0;
let LAST_DATA = null;

const TEAM_SECTIONS = [
  { key: 'sales-part1', team: 'sales', part: '영업1파트', title: '수도권세일즈팀 · 영업1파트', summary: '수도권 직영·지사 영업 핵심 실행', cls: 't-sales' },
  { key: 'sales-part2', team: 'sales', part: '영업2파트', title: '수도권세일즈팀 · 영업2파트', summary: '총판 채권·채널 영업 실행', cls: 't-sales' },
  { key: 'regional', team: 'regional', part: '', title: '지역세일즈팀', summary: '지역 영업 + 학원 DB 확보 + 공교육 진입', cls: 't-regional' },
];

document.addEventListener("DOMContentLoaded", () => {
  bindTopBar();
  loadInitial();
});

async function loadInitial() {
  const urlParams = new URLSearchParams(location.search);
  const week = urlParams.get("week") || "";
  await loadData(week);
}

async function loadData(weekKey) {
  const root = document.getElementById("app");
  root.innerHTML = '<div class="loading">대시보드 데이터를 불러오는 중입니다…</div>';
  if (!API_URL || API_URL.indexOf("Apps-Script") !== -1) {
    root.innerHTML = '<div class="error">API_URL이 설정되지 않았습니다. app.js 의 API_URL 에 Apps Script 웹앱 URL을 입력하세요.</div>';
    return;
  }
  try {
    const qs = weekKey ? `?week=${encodeURIComponent(weekKey)}` : "";
    const res = await fetch(`${API_URL}${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    LAST_DATA = data;
    render(data);
  } catch (err) {
    root.innerHTML = `<div class="error">데이터를 불러오지 못했습니다: ${err.message}</div>`;
    console.error(err);
  }
}

function bindTopBar() {
  const select = document.getElementById("week-select");
  const refresh = document.getElementById("refresh-btn");
  select.addEventListener("change", () => {
    const v = select.value;
    if (v) loadData(v);
  });
  refresh.addEventListener("click", () => loadData(select.value || ""));
}

function fillWeekDropdown(weeks, currentKey) {
  const select = document.getElementById("week-select");
  select.innerHTML = "";
  weeks.forEach((w, i) => {
    const opt = document.createElement("option");
    opt.value = w.key;
    opt.textContent = w.label + (i === 0 ? " (최신)" : "");
    if (w.key === currentKey) opt.selected = true;
    select.appendChild(opt);
  });
}

const TEAM_ORDER = ["sales", "regional"];
const TEAM_DISPLAY = {
  sales:    "수도권세일즈팀",
  regional: "지역세일즈팀",
};
const TEAM_META = {
  sales:    { id: "sales",    cls: "t-sales",    summary: "수도권 직영·지사 영업 핵심 실행" },
  regional: { id: "regional", cls: "t-regional", summary: "지역 영업 + 학원 DB 확보 + 공교육 진입" },
};

function render(d) {
  fillWeekDropdown(d.weeks || [], d.week);
  const root = document.getElementById("app");

  const messages    = d.messages || [];
  const kpis        = d.kpis || [];
  const sales       = d.monthlySales || { title:"", rows: [], note: "", forecastTotal: null };
  const ceo         = d.ceo || [];
  const teams       = d.teams || {};
  const decisions   = d.decisions || [];

  const hasMessages = messages.length > 0;
  const hasKpis     = kpis.length > 0;
  const hasSales    = (sales.rows || []).length > 0;
  const hasCeo      = ceo.length > 0;
  const teamSections = buildTeamSections(teams);
  const teamPresent = {};
  teamSections.forEach(sec => { teamPresent[sec.id] = true; });
  const hasTeams = teamSections.length > 0;
  const hasDecisions = decisions.length > 0;

  const parts = [];
  parts.push(`
    <section class="cover-card">
      <div class="cover-title">${escape(d.cover["보고서 제목"] || "채널마케팅본부 주간 보고")}</div>
      <div class="cover-meta">
        <span><b>보고 기간</b> ${escape(d.cover["보고 기간"] || "")}</span>
        <span><b>보고일</b> ${escape(d.cover["보고일"] || "")}</span>
        <span><b>작성 본부</b> ${escape(d.cover["작성 본부"] || "")}</span>
        <span><b>본부장</b> ${escape(d.cover["본부장"] || "")}</span>
        <span><b>주차</b> ${escape(d.weekLabel || d.week)}</span>
      </div>
    </section>
  `);

  if (hasMessages) {
    parts.push(`<h2 class="section-title" id="overview">핵심 메시지</h2>`);
    parts.push(`<div id="signals" class="signals"></div>`);
  }
  if (hasKpis) {
    // 본부 핵심 지표 → 본부 핵심 과제, 카운트 제거
    parts.push(`<h2 class="section-title" id="kpis-anchor">본부 핵심 과제</h2>`);
    parts.push(`<div id="kpis" class="kpi-grid"></div>`);
  }
  if (hasSales) {
    // 섹션 제목도 시트의 4번 섹션 헤더로
    const salesSectionLabel = escape(sales.title || "월별 매출현황");
    parts.push(`<h2 class="section-title" id="sales-anchor">${salesSectionLabel}</h2>`);
    parts.push(`<div id="monthly-sales"></div>`);
  }
  if (hasCeo) {
    parts.push(`<h2 class="section-title" id="ceo">CEO 지침 응답</h2>`);
    parts.push(`<div id="ceo-block" class="ceo-block"></div>`);
  }
  if (hasTeams) {
    parts.push(`
      <div class="section-head-row" id="teams-head">
        <h2 class="section-title" id="teams-anchor">팀별 주요 실적</h2>
        <button class="download-btn" id="download-form-btn" type="button" title="현재 보고 있는 주차 데이터를 기존 폼(금주/차주) 엑셀로 다운로드">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          기존 폼으로 다운로드
        </button>
      </div>
    `);
    parts.push(`<div id="teams"></div>`);
  }
  if (hasDecisions) {
    parts.push(`<h2 class="section-title" id="decisions-anchor">의사결정 요청</h2>`);
    parts.push(`<div id="decisions-block" class="decisions-block"></div>`);
  }
  if (parts.length === 1) parts.push('<div class="loading">이번 주차에 등록된 내용이 없습니다.</div>');

  root.innerHTML = parts.join("");

  if (hasMessages)  renderMessages(messages);
  if (hasKpis)      renderKpis(kpis);
  if (hasSales)     renderMonthlySales(sales);
  if (hasCeo)       renderCeo(ceo);
  if (hasTeams)     renderTeams(teamSections);
  if (hasDecisions) renderDecisions(decisions);

  const dlBtn = document.getElementById("download-form-btn");
  if (dlBtn) {
    dlBtn.addEventListener("click", () => {
      downloadWeeklyForm(LAST_DATA).catch(err => {
        console.error(err);
        alert("엑셀 변환 중 오류가 발생했습니다: " + err.message);
      });
    });
  }

  setupNavScroll({
    overview: hasMessages,
    ceo: hasCeo,
    "sales-part1": !!teamPresent["sales-part1"],
    "sales-part2": !!teamPresent["sales-part2"],
    regional: !!teamPresent.regional,
    "decisions-anchor": hasDecisions,
  });
}

function renderMessages(messages) {
  const el = document.getElementById("signals");
  if (!el) return;
  // 1/2/3개에 따라 그리드 컬럼 폭 자동 조정
  el.className = "signals count-" + Math.min(messages.length, 3);
  el.innerHTML = messages.map(m => `
    <div class="signal">
      <span class="num">${escape(m.idx)}</span>
      <div class="stitle">${escape(m.title)}</div>
      <p class="sbody">${escape(m.body)}</p>
    </div>
  `).join("");
}

const STATUS_MAP = {
  "정상 진척":         { card: "k-good", badge: "b-good" },
  "전환 가속":         { card: "k-good", badge: "b-good" },
  "페이스 부족":       { card: "k-bad",  badge: "b-bad"  },
  "목표 하향 조정":    { card: "k-warn", badge: "b-warn" },
  "컨설팅 영업 지속":  { card: "k-info", badge: "b-info" },
  "신규 진행":         { card: "k-new",  badge: "b-new"  },
};

function renderKpis(kpis) {
  const el = document.getElementById("kpis");
  if (!el) return;
  el.innerHTML = kpis.map(k => {
    const sm = STATUS_MAP[k.status] || { card: "", badge: "" };
    // 상태요약은 배지(배경색)로, 근거(I열)는 배지 바깥 별도 텍스트로 표시
    const statusHtml = k.status ? `<span class="kpi-badge ${sm.badge}">${escape(k.status)}</span>` : "";
    const basisHtml  = k.basis  ? `<span class="kpi-basis">${k.status ? " - " : ""}${escape(k.basis)}</span>` : "";
    return `
      <div class="kpi-card ${sm.card}">
        <p class="kpi-name">${escape(k.name)}</p>
        <p class="kpi-value">${escape(k.value)}<span class="unit">${escape(k.unit || "")}</span></p>
        <p class="kpi-desc">${escape(k.desc)}</p>
        ${statusHtml}${basisHtml}
      </div>
    `;
  }).join("");
}

/* ============================================================
 * 월별 매출현황 — v3.4
 *   - 표 제목/헤더 동적
 *   - 비고 있으면 진척율 셀에 ⓘ 아이콘 + 툴팁
 *   - 월별 마감 예상매출 합계 행 (있으면) 합계 바로 아래에 추가
 * ============================================================ */
function renderMonthlySales(ms) {
  const el = document.getElementById("monthly-sales");
  if (!el) return;
  const rows = ms.rows || [];
  if (!rows.length) { el.innerHTML = ""; return; }
  const fmt2 = v => (v === null || v === undefined) ? "-" : Number(v).toFixed(2);
  const fmtPct = v => (v === null || v === undefined) ? "-" : `${(Number(v) * 100).toFixed(1)}%`;
  const pctCls = v => {
    if (v === null || v === undefined) return "";
    const pct = Number(v) * 100;
    if (pct >= 100) return "up";
    if (pct < 50)   return "down";
    return "";
  };

  // 진척율 셀 안에 (비고가 있을 때) ⓘ 아이콘 + 툴팁 삽입
  function pctCell(v, remark, cls) {
    const pctText = fmtPct(v);
    const info = remark ? `<span class="info-icon" tabindex="0" data-tip="${escape(remark)}" aria-label="비고">i</span>` : "";
    return `<td class="num ${cls}">${pctText}${info}</td>`;
  }

  // 표 라벨은 시트의 [...] 라벨이 있으면 그걸 우선 사용, 없으면 섹션 제목
  const tableTitle = ms.tableLabel || ms.title || "월별 매출현황";
  // 컬럼 헤더도 시트의 헤더 행을 그대로 사용 (없으면 기본값)
  const h = ms.headers || {
    team: '팀', target: '1Q 목표 매출액', shipped: '총출고',
    returns: '반품', net: '순매출액', progress: '진척율'
  };

  let bodyRows = rows.map(r => `
    <tr class="${r.type}">
      <td>${escape(r.label)}</td>
      <td class="num">${fmt2(r.target)}</td>
      <td class="num">${fmt2(r.shipped)}</td>
      <td class="num">${fmt2(r.returns)}</td>
      <td class="num">${fmt2(r.net)}</td>
      ${pctCell(r.progress, r.remark, r.type === 'normal' ? pctCls(r.progress) : '')}
    </tr>
  `).join("");

  // 월별 마감 예상매출 합계 행 (있으면 추가)
  if (ms.forecastTotal) {
    const ft = ms.forecastTotal;
    bodyRows += `
      <tr class="forecast-total">
        <td>${escape(ft.label || "월별 마감 예상매출 합계")}</td>
        <td class="num">${fmt2(ft.target)}</td>
        <td class="num">${fmt2(ft.shipped)}</td>
        <td class="num">${fmt2(ft.returns)}</td>
        <td class="num">${fmt2(ft.net)}</td>
        ${pctCell(ft.progress, ft.remark, '')}
      </tr>
    `;
  }

  el.innerHTML = `
    <div class="sales-block">
      <h3>${escape(tableTitle)}</h3>
      <table class="sales-table">
        <colgroup>
          <col style="width: 32%"/><col style="width: 14%"/><col style="width: 12%"/>
          <col style="width: 12%"/><col style="width: 15%"/><col style="width: 15%"/>
        </colgroup>
        <thead><tr>
          <th>${escape(h.team)}</th>
          <th class="num">${escape(h.target)}</th>
          <th class="num">${escape(h.shipped)}</th>
          <th class="num">${escape(h.returns)}</th>
          <th class="num">${escape(h.net)}</th>
          <th class="num">${escape(h.progress)}</th>
        </tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      ${ms.note ? `<div class="sales-note">${escape(ms.note)}</div>` : ""}
    </div>
  `;
}

function buildTeamSections(teams) {
  const sections = [];
  TEAM_SECTIONS.forEach(cfg => {
    const t = teams[cfg.team];
    if (!t || !t.items || !t.items.length) return;
    let items = t.items;
    if (cfg.part) items = items.filter(it => String(it.part || '').trim() === cfg.part);
    else items = items.filter(it => !String(it.part || '').trim());
    if (!items.length) return;
    sections.push({
      id: cfg.key,
      cls: cfg.cls,
      title: cfg.title,
      summary: cfg.summary,
      items,
    });
  });
  return sections;
}

function renderCeo(items) {
  const el = document.getElementById("ceo-block");
  if (!el) return;
  el.innerHTML = `
    <table class="ceo-table">
      <thead><tr>
        <th style="width: 22%;">CEO 지침</th>
        <th style="width: 22%;">갭 분석</th>
        <th style="width: 36%;">본부 응답</th>
        <th style="width: 10%;">When</th>
      </tr></thead>
      <tbody>
        ${items.map(c => `
          <tr>
            <td><b>${escape(c.directive)}</b></td>
            <td>${escape(c.gap)}</td>
            <td>${escape(c.answer)}</td>
            <td class="when">${escape(c.when)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderTeams(sections) {
  const el = document.getElementById("teams");
  if (!el) return;
  el.innerHTML = sections.map(sec => {
    const cards = sec.items.map(renderItemCard).join("");
    return `
      <section class="team-block team-block-solo" id="${sec.id}">
        <header class="team-header ${sec.cls}">
          <h2>${escape(sec.title)}</h2>
        </header>
        <div class="team-summary">목적 — ${escape(sec.summary)}</div>
        <div class="team-body ${sec.cls}">${cards}</div>
      </section>
    `;
  }).join("");
}

function renderItemCard(it) {
  const title = String(it.title || "");
  const isStar = it.isStar === true
    || /^\s*\[★\]\s*/.test(title)
    || /^\s*★\s*/.test(title);
  const titleClean = title
    .replace(/^\s*\[★\]\s*/, "")
    .replace(/^\s*★\s*/, "")
    .trim();
  return `
    <article class="item-card ${isStar ? "is-star" : ""}">
      <div class="item-head">
        <h3>
          ${isStar ? '<span class="star-mark" aria-hidden="true">★</span>' : ""}
          ${escape(titleClean)}
          ${isStar ? '<span class="key-badge">핵심</span>' : ""}
        </h3>
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" style="width: ${it.progress}%;"></div></div>
          <span class="progress-pct">${it.progress}%</span>
        </div>
      </div>
      <div class="meta-table">
        ${it.goal   ? `<span class="lab goal">목표</span><span class="val">${escape(it.goal)}</span>`     : ""}
        ${it.fact   ? `<span class="lab fact">실적</span><span class="val">${escape(it.fact)}</span>`     : ""}
        ${it.plan   ? `<span class="lab plan">계획</span><span class="val">${escape(it.plan)}</span>`     : ""}
        ${it.gap    ? `<span class="lab gap">갭</span><span class="val">${escape(it.gap)}</span>`         : ""}
        ${it.action ? `<span class="lab act">액션</span><span class="val">${escape(it.action)}</span>`    : ""}
      </div>
    </article>
  `;
}

function renderDecisions(items) {
  const el = document.getElementById("decisions-block");
  if (!el) return;
  el.innerHTML = `
    <div id="decisions-rows" class="decisions-table">
      <div class="decision-row decision-header" aria-hidden="true">
        <div>우선순위</div><div>타이틀</div><div>본문</div><div>필요 액션</div><div>마감일</div>
      </div>
      ${items.map(d => `
        <div class="decision-row">
          <div><span class="priority-chip ${priorityClass(d.priority)}">${escape(d.priority)}</span></div>
          <div class="decision-title">${escape(d.title)}</div>
          <div class="decision-body">${escape(d.body)}</div>
          <div class="decision-action">${escape(d.action)}</div>
          <div class="decision-due">${escape(d.deadline)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function priorityClass(priority) {
  const p = String(priority || "").trim();
  if (p === "긴급" || p === "P0" || p === "PO") return "p0";
  if (p === "중요" || p === "P1") return "p1";
  if (p === "참고" || p === "P2") return "p2";
  return "p2";
}

function setupNavScroll(visibleMap) {
  const links = Array.from(document.querySelectorAll(".tabs-inner a[href^='#']"));
  if (!links.length) return;
  links.forEach(link => {
    const id = link.getAttribute("href").slice(1);
    const visible = !visibleMap || visibleMap[id];
    link.style.display = visible ? "" : "none";
    link.onclick = (ev) => {
      const target = document.getElementById(id);
      if (!target) return;
      ev.preventDefault();
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      navClickGuard = Date.now() + 800;
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET + 4;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    };
  });
  if (!window.__navScrollBound) {
    window.__navScrollBound = true;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (Date.now() < navClickGuard) return;
        updateActiveTab();
      });
    }, { passive: true });
  }
  updateActiveTab();
}

function updateActiveTab() {
  const links = Array.from(document.querySelectorAll(".tabs-inner a[href^='#']"))
    .filter(a => a.style.display !== "none");
  if (!links.length) return;
  const sections = links
    .map(a => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      return el ? { id, el, link: a } : null;
    })
    .filter(Boolean);
  if (!sections.length) return;
  const probe = window.scrollY + NAV_OFFSET + 10;
  let activeIdx = 0;
  for (let i = 0; i < sections.length; i++) {
    const top = sections[i].el.getBoundingClientRect().top + window.scrollY;
    if (top - 1 <= probe) activeIdx = i;
    else break;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    activeIdx = sections.length - 1;
  }
  links.forEach(l => l.classList.remove("active"));
  sections[activeIdx].link.classList.add("active");
}

function escape(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ============================================================
 * 📥 기존 폼(금주/차주) 엑셀 다운로드 (v3.3 그대로)
 * ============================================================ */
async function downloadWeeklyForm(data) {
  if (!data) throw new Error("표시 중인 데이터가 없습니다.");
  if (typeof ExcelJS === "undefined") throw new Error("엑셀 라이브러리(ExcelJS) 로드 실패");

  const period = (data.cover && data.cover["보고 기간"]) || "";
  const labels = buildWeekLabels(period);
  const teamBlocks = buildTeamBlocks(data.teams || {});
  if (!teamBlocks.length) throw new Error("팀별 주요 실적 데이터가 없습니다.");

  const wb = new ExcelJS.Workbook();
  const sheetName = data.week || "주간보고";
  const ws = wb.addWorksheet(sheetName);

  ws.getColumn(1).width = 9;
  ws.getColumn(2).width = 78;
  ws.getColumn(3).width = 78;

  const hdr = ws.getRow(1);
  hdr.values = ["본부/실", labels.cur, labels.next];
  hdr.height = 32;
  [1, 2, 3].forEach(col => {
    const cell = hdr.getCell(col);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF4B8" } };
    cell.font = { name: "맑은 고딕", bold: true, color: { argb: "FF000000" }, size: 11 };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = thinBorder();
  });

  let rowIdx = 2;
  for (const tb of teamBlocks) {
    const row = ws.getRow(rowIdx);
    row.getCell(2).value = tb.cur;
    row.getCell(3).value = tb.next;
    [2, 3].forEach(col => {
      const cell = row.getCell(col);
      cell.font = { name: "맑은 고딕", size: 10 };
      cell.alignment = { horizontal: "left", vertical: "top", wrapText: true, indent: 1 };
      cell.border = thinBorder();
    });
    const lineCount = Math.max(
      (tb.cur.match(/\n/g) || []).length + 1,
      (tb.next.match(/\n/g) || []).length + 1,
    );
    row.height = Math.max(40, 16 * lineCount);
    rowIdx++;
  }

  const lastRow = rowIdx - 1;
  ws.mergeCells(`A2:A${lastRow}`);
  const aCell = ws.getCell("A2");
  aCell.value = "채널마케팅본부";
  aCell.font = { name: "맑은 고딕", bold: true, size: 12, color: { argb: "FF000000" } };
  aCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  aCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF4B8" } };
  for (let r = 2; r <= lastRow; r++) {
    const c = ws.getCell(`A${r}`);
    c.border = thinBorder();
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF4B8" } };
  }
  ws.views = [{ state: "frozen", ySplit: 1, xSplit: 1 }];

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `주간보고_금주차주폼_${sheetName}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function thinBorder() {
  const side = { style: "thin", color: { argb: "FF999999" } };
  return { left: side, right: side, top: side, bottom: side };
}

function buildWeekLabels(period) {
  const m = String(period || "").match(
    /(\d{4})\.(\d{1,2})\.(\d{1,2})\s*~\s*(\d{4})\.(\d{1,2})\.(\d{1,2})/
  );
  if (!m) return { cur: "금주 핵심 업무 및 논의사항", next: "차주 핵심 업무계획" };
  const cs = new Date(+m[1], +m[2] - 1, +m[3]);
  const ce = new Date(+m[4], +m[5] - 1, +m[6]);
  const ns = new Date(cs.getTime() + 7 * 86400000);
  const ne = new Date(ce.getTime() + 7 * 86400000);
  const f = d => `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  return {
    cur:  `금주 핵심 업무 및 논의사항(${f(cs)}~${f(ce)})`,
    next: `차주 핵심 업무계획(${f(ns)}~${f(ne)})`,
  };
}

function buildTeamBlocks(teams) {
  const blocks = [];
  for (const key of TEAM_ORDER) {
    const t = teams[key];
    if (!t || !t.items || !t.items.length) continue;
    const [cur, next] = buildOneTeam(key, t);
    blocks.push({ key, cur, next });
  }
  return blocks;
}

function buildOneTeam(key, t) {
  const name = TEAM_DISPLAY[key] || t.name || key;
  const order = [];
  const map = new Map();
  t.items.forEach(it => {
    const k = it.part || "";
    if (!map.has(k)) { map.set(k, []); order.push(k); }
    map.get(k).push(it);
  });
  const allEmpty = order.length === 1 && order[0] === "";
  const cur  = [`[${name}]`];
  const next = [`[${name}]`];
  if (allEmpty) {
    t.items.forEach((it, i) => {
      cur.push(fmtCur(i + 1, it));
      next.push(fmtNext(i + 1, it));
    });
    return [cur.join("\n"), next.join("\n")];
  }
  order.forEach(partKey => {
    if (partKey) {
      cur.push("", `[${partKey}]`);
      next.push("", `[${partKey}]`);
    }
    map.get(partKey).forEach((it, i) => {
      cur.push(fmtCur(i + 1, it));
      next.push(fmtNext(i + 1, it));
    });
  });
  return [cur.join("\n"), next.join("\n")];
}

function _cleanInline(s) {
  return String(s || "").replace(/⏎/g, " ").replace(/\n/g, " ").trim();
}

function _displayTitle(it) {
  const t = String(it.title || "").trim();
  if (it.isStar && !/^\[★\]/.test(t)) return `[★] ${t}`;
  return t;
}

function fmtCur(idx, it) {
  const title = _displayTitle(it);
  const pct = (typeof it.progress === "number") ? `(${it.progress}%)` : "";
  let head = `${idx}. ${title}`;
  if (pct) head += ` ${pct}`;
  const fact = _cleanInline(it.fact);
  if (fact) head += ` - ${fact}`;
  const lines = [head];
  const gap = _cleanInline(it.gap);
  if (gap)    lines.push(` -이슈 : ${gap}`);
  const action = _cleanInline(it.action);
  if (action) lines.push(` -실행 : ${action}`);
  return lines.join("\n");
}

function fmtNext(idx, it) {
  const title = _displayTitle(it);
  const plan = _cleanInline(it.plan);
  return plan ? `${idx}. ${title} - ${plan}` : `${idx}. ${title}`;
}
