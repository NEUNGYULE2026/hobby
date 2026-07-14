/**
 * 채널마케팅본부 주간 대시보드 — 프론트엔드 v3.35
 *
 * v3.35 변경
 *  - 매출현황 2단 진척율 헤더 아래에 '총출고 기준' 보조 라벨(.prog-basis) 추가 — 진척율 산정 기준 명시. style.css v3.21.
 *
 * v3.34 변경
 *  - 매출현황 표 안 제목(h3, 예 '7월 매출현황 (단위: 억)') 제거 — 섹션 헤더 '월별 매출현황'과 중복. tableTitle 변수 제거.
 *
 * v3.33 변경
 *  - 매출현황 2단 헤더 정돈: 그룹 경계 세로 구분선을 팀|목표·목표|실적·실적|진척율 3곳으로(각 그룹 첫 셀·진척율에 .gsep), 목표 컬럼 옅은 음영(.tgt), 하위헤더 보조 톤(.sub). style.css v3.20.
 *
 * v3.32 변경
 *  - 매출현황 2단 구조 렌더(ms.twoTier): 팀/파트 | 목표(총출고·반품·순매출액) | 실적(총출고·반품·순매출액) | 진척율 | 증감사유. 목표/실적 경계 세로 구분선(.gsep, style.css v3.19). 구 1단 레이아웃은 기존 렌더 유지(자동 분기). forecastTotal도 2단 셀. buildTrendOverride는 shipped=실적총출고로 계속 동작.
 *
 * v3.31 변경
 *  - 저작권·리플릿 최신월(7월*)도 실적 연동: buildTrendOverride가 매출현황 행에서 /저작권/(마케팅전략팀 저작권)·/리플릿/(제작팀 리플릿(제작)) 총출고를 추출해 effY26 오버라이드. 시트 총출고 없으면 폴백 0 유지.
 *
 * v3.30 변경
 *  - 추세 구분 토글에 '저작권'·'리플릿' 추가(전체/영업1파트/영업2파트/저작권/리플릿). trend-data.js에 두 그룹 시계열 신설(v6). 칩·차트·effY26은 series 키 기반이라 버튼만 추가하면 자동 반영. 우측 범례는 미변경(그룹명 직관).
 *
 * v3.29 변경
 *  - 하드코딩 팀(마케팅전략팀·제작팀) 주차 게이팅: 드롭다운 주차가 M7-W2(7월 2주차) 이후일 때만 카드·탭 노출(weekSortKey ≥ HARDCODED_MIN_WEEK 702). 이전 주차엔 숨김.
 *  - 텍스트형 KPI 달성율 미니바를 실적 바로 아래로 올림(여백 축소, style.css v3.18).
 *
 * v3.28 변경
 *  - 텍스트형 KPI에 달성율 컴팩트 인라인 미니바(C형) 추가 — 단위 칸(k.unit) 값을 achieveRate로 파싱(0~1이면 ×100), 목표/실적 아래 '달성율 [미니바] %' 한 줄. 값 없으면 미표기. style.css v3.17(.kpi-trate).
 *
 * v3.27 변경
 *  - 텍스트형 KPI 우선순위 상향: 목표/실적이 텍스트면 레이아웃 X(정적)여도 텍스트형 레이아웃으로 렌더(isTextKpi > static). 예: '제작 & 물류 자동화율'.
 *
 * v3.26 변경
 *  - 제작팀(하드코딩) 추가 — js/production-team-data.js(PRODUCTION_TEAM, 파트 없음). renderHardcodedTeam을 파트有/無 모두 지원하도록 일반화. 상단 탭 '제작팀'(#production) 연결(setupNavScroll·index.html). 원본 form/xlsx.
 *
 * v3.25 변경
 *  - 본부 핵심 과제: 목표/실적이 텍스트(수치 아님)인 KPI는 달성률 막대 대신 깔끔한 라벨-값(목표/실적) 레이아웃으로 렌더(isTextKpi, .kpi-textbox). 원문은 Code.gs v3.8의 targetRaw/currentRaw. style.css v3.15.
 *
 * v3.24 변경
 *  - (고3영어/레이아웃 X) '최종 목표' 값(41.7%) 헤드라인 복원. 단계 스텝은 계속 미표기, 📌 배너·근거·선택교과 영업현황 유지. (.kpi-goalrow CSS는 미사용 상태로 잔존)
 *
 * v3.23 변경
 *  - (고3영어/레이아웃 X) 카드 간소화: '최종 목표' 값 헤드라인(41.7%) 제거 → 📌 확정시점 배너로 대체(동일 폰트), 단계 스텝(전략수립/현장영업/채택확정) 삭제. 근거 버튼은 배너 우측 유지. style.css v3.14(.kpi-goalrow).
 *
 * v3.22 변경
 *  - (고3영어) 카드: '최종 목표' 줄 우측에 '근거' 버튼 신설(기존 세부보기=공교육 근거 팝업 연결). 하단 버튼을 '세부보기'→'🔗 선택교과 영업현황'(https://necrm-2026.vercel.app/ _blank)으로 교체.
 *  - style.css v3.13: .gg-basis-btn 추가.
 *
 * v3.21 변경
 *  - 부서별 주간 보고 '기존 폼으로 다운로드' 버튼 숨김(마크업 제거). downloadWeeklyForm 함수·핸들러 가드는 유지(dlBtn null 안전).
 *
 * v3.20 변경
 *  - 상단 탭 변경: 영업1파트·영업2파트 → 수도권세일즈팀(#sales-part1)·마케팅전략팀(#mktstrategy). setupNavScroll config·index.html 탭 동기화.
 *
 * v3.19 변경
 *  - 부서별 주간 보고에 마케팅전략팀(하드코딩) 추가 — js/mkt-team-data.js(MKT_TEAM)를 맨 아래 카드로 append(DI/온라인유통/물류/CS 파트). 원본 form/xlsx.
 *  - renderDeptTable 열 라벨 파라미터화(headers) — 팀별 상이 지원. 마케팅전략팀은 진도율/이슈 사항/사유,해결책 라벨.
 *  - 수도권세일즈팀 열 라벨 문구 교체: 진행사항→(금주)진행사항, 예정사항→(차주)예정사항(DEPT_HEADERS_DEFAULT).
 *
 * v3.18 변경
 *  - 부서별 주간 보고: 파트별 카드 → 팀별 카드로 재편. 수도권세일즈팀 1개 카드 안에서 영업1파트·영업2파트를 볼드 소제목(.part-label)으로 구분. 팀 요약문구(team-summary) 제거(수도권). 탭 앵커(#sales-part1=카드/#sales-part2=영업2파트 소제목) 유지. 지역세일즈팀은 종전대로.
 *
 * v3.17 변경
 *  - (고3영어) 확정시점 배너 하드코딩 문구에서 '· 27학년도 학교별 교과서 채택 · 확정 전' 삭제 → '2026.11 결과 확정'만 표기.
 *
 * v3.16 변경
 *  - 증감사유 팝업: (지사)/(총판) 접두어 볼드 처리(모달 본문 textContent→innerHTML, escape 후 접두어만 <strong>).
 *  - 영업1·영업2 비고 둘 다 있으면 영업1 내용과 (총판) 사이에 빈 줄 1개 확보(_fLines.join '\n'→'\n\n').
 *
 * v3.15 변경
 *  - 증감사유 팝업(모달) 제목 문구 '증감사유' → '(증감)주요내역'(modal-title·aria-label). 표 컬럼 헤더·아이콘 tooltip은 '증감사유' 유지.
 *
 * v3.14 변경
 *  - 증감사유(월마감 예상매출 합계) 비고에서 (지사)/(총판) 접두어 뒤를 공백→줄바꿈으로 변경. 접두어가 한 줄, 비고 내용은 다음 행부터 표시.
 *
 * v3.13 변경
 *  - 추세 캡션 하드코딩 일자('1~8일') 제거 → cutNote가 기간을 단독 소유(일자 변경 시 trend-data.js만 수정). 25년은 '동기간(같은 일자) 컷'으로 일반화.
 *  - (데이터) trend-data.js 재집계: 26년 rawdata 갱신 반영, 6월 컷 6/8→6/10(25년 1~10일 동기간). 1~5월 값 불변.
 *
 * v3.12 변경
 *  - 추세 26년 최종월(현재 진행월) 값을 rawdata 집계 대신 구글시트 매출현황의 파트별 총출고로 동적 교체
 *    (전체=합계 총출고 / 영업1파트·영업2파트=각 파트 총출고). 25년 및 그 외 월은 trend-data.js 그대로.
 *    renderMonthlySales에서 trendLastOverride 설정 → effY26()가 최종월만 교체. 캡션도 26년 최종월 기준 안내.
 *
 * v3.11 변경
 *  - 공교육 팝업 문구: 흐름 라벨 '그대로 목표로 수립'->'유지 목표', 근거 문장 간결화(동일 선택과목 기반 26 고2 실적->27 고3 목표 수립)
 *
 * v3.10 변경
 *  - 공교육 팝업 '근거형'으로 재구성: 26 고2 실적→27 고3 목표 흐름(동일 41.7%) + 한 줄 근거 문장 + 근거 데이터 표만 유지. 요약카드 3개·과목별 막대차트·출처 문구 제거(gonggyoChart 삭제)
 *
 * v3.9 변경
 *  - 공교육 팝업 재구성: 27학년도 목표 = 26 고2 실적 합계 점유율(41.7%)로 일치 → 요약카드 3번째를 '목표−실적 %p'에서 '목표 달성률 100%'로 교체(목표=실적 명시). gonggyo-data.js target 0.42→0.4173 갱신
 *
 * v3.8 변경
 *  - 추세 차트: 막대/라인 위 실적 수치 라벨(억 1자리) 인라인 플러그인 추가
 *  - 추세 패널: 파트 구성 범례 표기(영업1=참고서(영/수/국)+교과서+AIDT, 영업2=B&G+OUP)
 *
 * v3.7 변경
 *  - (고3 영어) 점유율 카드: 세부보기 버튼을 시트 detailSheet 값과 무관하게 하드코딩 노출(isGonggyoKpi: 카드명 패턴 판정) → 공교육 전용 레이어 연결
 *  - 확정시점 배너 텍스트 2026.12 → 2026.11 결과 확정
 *  - 추세 펼침 패널 명칭 '추세 분석' → '추세'
 *  - 추세 월별 막대 25년 색상 #B9CFE0 → #D9A325 (26년 #1F5E92와 명확히 구분)
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

const API_URL = "https://script.google.com/macros/s/AKfycbw8u9F3lTB5RFt8VZfhhsVfWr43WQsYsk5RAqi--P1b_E1S0RRin1FcbAv-LzTtCWEq/exec";

const NAV_OFFSET = 140;
let navClickGuard = 0;
let LAST_DATA = null;

const TEAM_SECTIONS = [
  { key: 'sales-part1', team: 'sales', part: '영업1파트', title: '수도권세일즈팀 · 영업1파트', summary: '지사 채권·채널 영업 및 공교육 영업 실행', cls: 't-sales' },
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

// 하드코딩 팀(마케팅전략팀·제작팀) 노출 시작 주차 — M7-W2(7월 2주차)부터. 주차키 = 월*100+주.
const HARDCODED_MIN_WEEK = 702;
function weekSortKey(weekKey){
  const m = String(weekKey || "").match(/^M(\d{1,2})-W(\d{1,2})$/i);
  return m ? (parseInt(m[1], 10) * 100 + parseInt(m[2], 10)) : 0;
}

function render(d) {
  fillWeekDropdown(d.weeks || [], d.week);
  const root = document.getElementById("app");

  const messages    = d.messages || [];
  const kpis        = d.kpis || [];
  const sales       = d.monthlySales || { title:"", rows: [], note: "", forecastTotal: null };
  const ceo         = d.ceo || [];
  const teams       = d.teams || {};
  const decisions   = d.decisions || [];
  // 하드코딩 팀(마케팅전략팀·제작팀)은 7월 2주차(M7-W2) 이후 주차에서만 노출
  const showHardcoded = weekSortKey(d.week) >= HARDCODED_MIN_WEEK;

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
        <h2 class="section-title" id="teams-anchor">부서별 주간 보고</h2>
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
  if (hasTeams)     renderTeams(teamSections, showHardcoded);
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
    "sales-part1": !!teamPresent["sales-part1"],   // 탭: 수도권세일즈팀
    "mktstrategy": showHardcoded && (typeof MKT_TEAM !== "undefined" && !!MKT_TEAM), // 탭: 마케팅전략팀(하드코딩, M7-W2~)
    "production": showHardcoded && (typeof PRODUCTION_TEAM !== "undefined" && !!PRODUCTION_TEAM), // 탭: 제작팀(하드코딩, M7-W2~)
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

function fmtNum(n){ return (n==null) ? "-" : Number(n).toLocaleString("ko-KR"); }

// 목표/실적이 수치가 아니라 텍스트로 들어온 KPI 판정 (숫자 파싱 실패 + 원문 텍스트 존재)
function isTextKpi(k){
  const tText = (k.target == null)  && !!(k.targetRaw  && String(k.targetRaw).trim());
  const cText = (k.current == null) && !!(k.currentRaw && String(k.currentRaw).trim());
  return tText || cText;
}

// 텍스트형 KPI의 달성율(%) — 단위 칸(k.unit) 값 파싱. 0~1이면 ×100(비율), 그 외 그대로(%). 비수치면 null.
function achieveRate(k){
  const raw = (k.unit == null) ? "" : String(k.unit).trim();
  if(!raw) return null;
  let n = parseFloat(raw.replace(/[,%\s]/g, ""));
  if(isNaN(n)) return null;
  if(n <= 1) n = n * 100;
  return Math.round(n);
}

// (고3 영어) 점유율 카드 판정 — 구글시트 detailSheet 값과 무관하게 공교육 레이어를 띄운다.
// 시트 H열(detailSheet)이 '공교육'이거나, 카드명이 고3영어 패턴이면 GONGGYO 전용 레이어로 연결(하드코딩 노출).
function isGonggyoKpi(k){
  if (typeof GONGGYO === "undefined") return false;
  return k.detailSheet === "공교육" || /고\s*3[\s\S]*영어/.test(k.name || "");
}

function stepperHtml(stages, cur) {
  return `<div class="stepper">` + stages.map((s, idx) => {
    const cls = idx < cur ? "done" : (idx === cur ? "cur" : "todo");
    const seg = idx < stages.length - 1 ? `<span class="seg ${idx < cur ? "done" : ""}"></span>` : "";
    return `<span class="step ${cls}"><i></i>${escape(s)}</span>${seg}`;
  }).join("") + `</div>`;
}

function renderKpis(kpis) {
  const el = document.getElementById("kpis");
  if (!el) return;
  el.innerHTML = kpis.map((k, i) => {
    const stageChip = k.stage ? `<span class="kpi-stage">${escape(k.stage)}</span>` : "";
    const isGonggyo = isGonggyoKpi(k);
    const hasDetail = isGonggyo || !!(k.detail && k.detail.length);
    // 고3영어 카드: 하단 버튼 = '선택교과 영업현황'(외부 링크 _blank). 그 외: 기존 '세부보기'.
    const footBtn = isGonggyo
      ? `<a class="detail-btn" href="https://necrm-2026.vercel.app/" target="_blank" rel="noopener">🔗 선택교과 영업현황</a>`
      : (hasDetail ? `<button class="detail-btn" type="button" data-i="${i}">🔍 세부보기</button>` : "");
    // 고3영어 카드: '최종 목표' 줄 우측 끝 '근거' 버튼 → 기존 세부보기(공교육 근거 팝업) 호출.
    const basisBtn = isGonggyo ? `<button class="gg-basis-btn" type="button" data-detail="${i}">근거</button>` : "";
    let body;
    if (!isTextKpi(k) && k.layout === "static") {
      // 레이아웃 X — 최종목표 값(41.7% 등) + 📌 확정시점 배너. 단계 스텝은 미표기(v3.23~). 근거 버튼은 최종목표 줄 우측.
      // ※ 목표/실적이 텍스트면(isTextKpi) 레이아웃 X여도 정적이 아닌 텍스트형으로 렌더(아래 분기).
      const dueLabel = k.dueLabel || "2026.11 결과 확정";
      body = `
        <div class="kpi-value">
          <span class="now">${fmtNum(k.target)}<span class="unit">${escape(k.unit || "")}</span></span>
          <span class="goal-tag">최종 목표</span>
          ${basisBtn}
        </div>
        <div class="kpi-due">📌 ${escape(dueLabel)}</div>`;
    } else if (isTextKpi(k)) {
      // 목표/실적이 텍스트 → 라벨-값(목표/실적) + (단위칸의 달성율 있으면) 컴팩트 인라인 미니바
      const tv = nlbr(k.targetRaw) || "-";
      const cv = nlbr(k.currentRaw) || "-";
      const ar = achieveRate(k);   // 단위 칸의 달성율(0~1이면 ×100), 없으면 null
      const rateRow = (ar == null) ? "" : `
        <div class="kpi-trate"><span class="kpi-tlab-r">달성율</span><span class="kpi-trate-bar ${ar>=100?"full":""}"><i style="width:${Math.max(0,Math.min(100,ar))}%"></i></span><span class="kpi-trate-pct">${ar}%</span></div>`;
      body = `
        <div class="kpi-textbox">
          <div class="kpi-trow"><span class="kpi-tlab">목표</span><span class="kpi-tval">${tv}</span></div>
          <div class="kpi-trow"><span class="kpi-tlab kpi-tlab-cur">실적</span><span class="kpi-tval">${cv}</span></div>
        </div>${rateRow}`;
    } else {
      const rate = (k.rate == null) ? 0 : k.rate;
      const barW = Math.max(0, Math.min(100, rate));
      body = `
        <div class="kpi-value">
          <span class="now">${fmtNum(k.current)}<span class="unit">${escape(k.unit || "")}</span></span>
          <span class="rate">달성률 ${rate}%</span>
        </div>
        <div class="kpi-bar ${barW>=100?"full":""}"><i style="width:${barW}%"></i></div>
        <div class="kpi-bar-meta"><span>현재 <b>${fmtNum(k.current)}${escape(k.unit||"")}</b></span><span>목표 <b>${fmtNum(k.target)}${escape(k.unit||"")}</b></span></div>`;
    }
    return `
      <div class="kpi-card">
        <p class="kpi-name">${escape(k.name)}</p>
        ${body}
        <div class="kpi-foot">${stageChip}${footBtn}</div>
      </div>`;
  }).join("");
  el.querySelectorAll("button.detail-btn").forEach(b => {
    b.addEventListener("click", () => openKpiDetail(kpis[+b.dataset.i]));
  });
  el.querySelectorAll(".gg-basis-btn").forEach(b => {
    b.addEventListener("click", () => openKpiDetail(kpis[+b.dataset.detail]));
  });
}

// KPI 세부보기 — 세부 시트 내용을 표로 레이어창에 표시(타이틀 고정 + 본문 세로 스크롤)
function openKpiDetail(k) {
  if (isGonggyoKpi(k) && typeof Chart !== "undefined") { openGonggyoDetail(); return; }
  let m = document.getElementById("kpi-detail-modal");
  if (!m) {
    m = document.createElement("div");
    m.id = "kpi-detail-modal";
    m.className = "reason-modal";
    m.innerHTML = `
      <div class="reason-modal-backdrop"></div>
      <div class="reason-modal-box" role="dialog" aria-modal="true" aria-label="세부보기">
        <div class="reason-modal-head">
          <span class="reason-modal-title">세부보기</span>
          <button class="reason-modal-close" type="button" aria-label="닫기">&times;</button>
        </div>
        <div class="reason-modal-body"></div>
      </div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove("open");
    m.querySelector(".reason-modal-backdrop").addEventListener("click", close);
    m.querySelector(".reason-modal-close").addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
  m.querySelector(".reason-modal-title").textContent = k.name || "세부보기";
  const rows = k.detail || [];
  let html;
  if (rows.length) {
    const head = rows[0], rest = rows.slice(1);
    html = `<table class="detail-table"><thead><tr>${head.map(h=>`<th>${escape(h)}</th>`).join("")}</tr></thead>`
         + `<tbody>${rest.map(r=>`<tr>${r.map(c=>`<td>${escape(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  } else {
    html = `<p style="color:var(--text-soft);">세부 내용이 없습니다.</p>`;
  }
  m.querySelector(".reason-modal-body").innerHTML = html;
  m.classList.add("open");
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
  // 추세 26년 최종월 = 시트 파트별 총출고로 동적 교체 (effY26에서 사용)
  trendLastOverride = buildTrendOverride(rows);
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

  const nz = s => String(s == null ? "" : s).trim();
  function pctCell(v, cls) {
    return `<td class="num ${cls}">${fmtPct(v)}</td>`;
  }

  // ── 증감사유(비고) ──
  // 일반/합계 행: 자기 비고. 월마감 예상매출 합계 행: 마감 예상매출 표의 영업1(지사)·영업2(총판) 비고 합산.
  const _ft0 = ms.forecastTotal || {};
  const _fLines = [];
  if (nz(_ft0.part1Remark)) _fLines.push('(지사)\n' + nz(_ft0.part1Remark));
  if (nz(_ft0.part2Remark)) _fLines.push('(총판)\n' + nz(_ft0.part2Remark));
  const forecastReason = _fLines.join('\n\n'); // 영업1·2 둘 다 있으면 사이에 빈 줄 1개 확보
  const showReason = rows.some(r => nz(r.remark)) || !!forecastReason;
  const REASON_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></svg>`;
  function reasonCell(text) {
    if (!showReason) return "";
    const t = nz(text);
    if (!t) return `<td class="reason-cell"></td>`;
    return `<td class="reason-cell"><button class="reason-btn" type="button" data-reason="${escape(t)}" aria-label="증감사유 보기" title="증감사유">${REASON_ICON}</button></td>`;
  }

  const h = ms.headers || {};
  const twoTier = !!ms.twoTier;

  let tableHtml;
  if (twoTier) {
    // 신 2단: 팀/파트 | 목표(총출고·반품·순매출액) | 실적(총출고·반품·순매출액) | 진척율 | 증감사유
    const rowCells = (o, pcls) =>
      `<td>${escape(o.label)}</td>`
      + `<td class="num tgt gsep">${fmt2(o.targetShipped)}</td><td class="num tgt">${fmt2(o.targetReturns)}</td><td class="num tgt">${fmt2(o.targetNet)}</td>`
      + `<td class="num gsep">${fmt2(o.shipped)}</td><td class="num">${fmt2(o.returns)}</td><td class="num">${fmt2(o.net)}</td>`
      + `<td class="num gsep ${pcls}">${fmtPct(o.progress)}</td>`;
    let body = rows.map(r => `<tr class="${r.type}">${rowCells(r, r.type === 'normal' ? pctCls(r.progress) : '')}${reasonCell(r.remark)}</tr>`).join("");
    if (ms.forecastTotal) {
      const ft = ms.forecastTotal;
      body += `<tr class="forecast-total">${rowCells({ label: ft.label || "월마감 예상매출 합계", targetShipped: ft.targetShipped, targetReturns: ft.targetReturns, targetNet: ft.targetNet, shipped: ft.shipped, returns: ft.returns, net: ft.net, progress: ft.progress }, '')}${reasonCell(forecastReason)}</tr>`;
    }
    const cg = showReason
      ? `<col style="width:20%"/><col style="width:10%"/><col style="width:9%"/><col style="width:11%"/><col style="width:10%"/><col style="width:9%"/><col style="width:11%"/><col style="width:11%"/><col style="width:9%"/>`
      : `<col style="width:22%"/><col style="width:11%"/><col style="width:10%"/><col style="width:12%"/><col style="width:11%"/><col style="width:10%"/><col style="width:12%"/><col style="width:12%"/>`;
    const sN = escape(h.net || '순매출액'), sS = escape(h.shipped || '총출고'), sR = escape(h.returns || '반품');
    tableHtml = `
      <table class="sales-table sales-2tier">
        <colgroup>${cg}</colgroup>
        <thead>
          <tr>
            <th rowspan="2" class="tm">${escape(h.team || '팀 / 파트')}</th>
            <th colspan="3" class="grp gsep">${escape(h.targetGroup || '목표')}</th>
            <th colspan="3" class="grp gsep">${escape(h.actualGroup || '실적')}</th>
            <th rowspan="2" class="num gsep prog-th">${escape(h.progress || '진척율')}<span class="prog-basis">총출고 기준</span></th>
            ${showReason ? `<th rowspan="2" class="reason-col">증감사유</th>` : ""}
          </tr>
          <tr>
            <th class="num sub tgt gsep">${sS}</th><th class="num sub tgt">${sR}</th><th class="num sub tgt">${sN}</th>
            <th class="num sub gsep">${sS}</th><th class="num sub">${sR}</th><th class="num sub">${sN}</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>`;
  } else {
    // 구 1단: 팀 | 목표매출액 | 총출고 | 반품 | 순매출액 | 진척율 | 증감사유
    const hh = { team: h.team || '팀', target: h.target || '1Q 목표 매출액', shipped: h.shipped || '총출고', returns: h.returns || '반품', net: h.net || '순매출액', progress: h.progress || '진척율' };
    let body = rows.map(r => `
      <tr class="${r.type}">
        <td>${escape(r.label)}</td>
        <td class="num">${fmt2(r.target)}</td>
        <td class="num">${fmt2(r.shipped)}</td>
        <td class="num">${fmt2(r.returns)}</td>
        <td class="num">${fmt2(r.net)}</td>
        ${pctCell(r.progress, r.type === 'normal' ? pctCls(r.progress) : '')}
        ${reasonCell(r.remark)}
      </tr>`).join("");
    if (ms.forecastTotal) {
      const ft = ms.forecastTotal;
      body += `
        <tr class="forecast-total">
          <td>${escape(ft.label || "월마감 예상매출 합계")}</td>
          <td class="num">${fmt2(ft.target)}</td>
          <td class="num">${fmt2(ft.shipped)}</td>
          <td class="num">${fmt2(ft.returns)}</td>
          <td class="num">${fmt2(ft.net)}</td>
          ${pctCell(ft.progress, '')}
          ${reasonCell(forecastReason)}
        </tr>`;
    }
    const cg = showReason
      ? `<col style="width:27%"/><col style="width:13%"/><col style="width:11%"/><col style="width:11%"/><col style="width:13%"/><col style="width:13%"/><col style="width:12%"/>`
      : `<col style="width:32%"/><col style="width:14%"/><col style="width:12%"/><col style="width:12%"/><col style="width:15%"/><col style="width:15%"/>`;
    tableHtml = `
      <table class="sales-table">
        <colgroup>${cg}</colgroup>
        <thead><tr>
          <th>${escape(hh.team)}</th>
          <th class="num">${escape(hh.target)}</th>
          <th class="num">${escape(hh.shipped)}</th>
          <th class="num">${escape(hh.returns)}</th>
          <th class="num">${escape(hh.net)}</th>
          <th class="num">${escape(hh.progress)}</th>
          ${showReason ? `<th class="reason-col">증감사유</th>` : ""}
        </tr></thead>
        <tbody>${body}</tbody>
      </table>`;
  }

  el.innerHTML = `
    <div class="sales-block">
      ${tableHtml}
      ${ms.note ? `<div class="sales-note">${escape(ms.note)}</div>` : ""}
      ${buildTrendExpander()}
    </div>
  `;

  el.querySelectorAll('.reason-btn').forEach(btn => {
    btn.addEventListener('click', () => openReasonModal(btn.getAttribute('data-reason')));
  });
  bindTrendExpander(el);
}

// 증감사유 레이어창 — 비고 내용을 표 본문과 동일한 폰트 크기로 표시
function openReasonModal(text) {
  let modal = document.getElementById('reason-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reason-modal';
    modal.className = 'reason-modal';
    modal.innerHTML = `
      <div class="reason-modal-backdrop"></div>
      <div class="reason-modal-box" role="dialog" aria-modal="true" aria-label="(증감)주요내역">
        <div class="reason-modal-head">
          <span class="reason-modal-title">(증감)주요내역</span>
          <button class="reason-modal-close" type="button" aria-label="닫기">&times;</button>
        </div>
        <div class="reason-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.classList.remove('open');
    modal.querySelector('.reason-modal-backdrop').addEventListener('click', close);
    modal.querySelector('.reason-modal-close').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
  // 본문은 HTML 이스케이프 후 (지사)/(총판) 접두어만 볼드 처리(개행은 .reason-modal-body의 white-space:pre-wrap가 렌더)
  modal.querySelector('.reason-modal-body').innerHTML =
    escape(text || "").replace(/\((지사|총판)\)/g, '<strong>($1)</strong>');
  modal.classList.add('open');
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
      team: cfg.team,
      part: cfg.part,
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

function renderTeams(sections, showHardcoded) {
  const el = document.getElementById("teams");
  if (!el) return;
  // 팀별로 그룹핑(순서 유지). 파트가 있는 팀은 한 카드 안에서 파트를 소제목으로 구분.
  const order = [];
  const byTeam = {};
  sections.forEach(sec => {
    if (!byTeam[sec.team]) { byTeam[sec.team] = []; order.push(sec.team); }
    byTeam[sec.team].push(sec);
  });
  let html = order.map(teamKey => {
    const secs = byTeam[teamKey];
    const teamName = TEAM_DISPLAY[teamKey] || secs[0].title;
    const cls = secs[0].cls;
    const cardId = secs[0].id;               // 첫 파트 섹션 id를 카드 앵커로(탭 유지)
    const hasParts = secs.some(s => String(s.part || "").trim());
    if (hasParts) {
      // 수도권세일즈팀 등: 요약 제거, 파트를 볼드 소제목(.part-label)으로 구분
      const body = secs.map((s, i) => `
          <div class="part-group"${i > 0 ? ` id="${s.id}"` : ""}>
            <div class="part-label">${escape(s.part)}</div>
            <div class="dept-table-wrap">${renderDeptTable(s.items)}</div>
          </div>`).join("");
      return `
      <section class="team-block" id="${cardId}">
        <header class="team-header ${cls}"><h2>${escape(teamName)}</h2></header>
        <div class="team-body ${cls}">${body}</div>
      </section>`;
    }
    // 파트 없는 팀(지역세일즈 등): 기존과 동일(요약 유지)
    const s = secs[0];
    return `
      <section class="team-block team-block-solo" id="${s.id}">
        <header class="team-header ${cls}"><h2>${escape(teamName)}</h2></header>
        <div class="team-summary">${escape(s.summary)}</div>
        <div class="team-body ${cls}">
          <div class="dept-table-wrap">${renderDeptTable(s.items)}</div>
        </div>
      </section>`;
  }).join("");

  // 하드코딩 팀 — 7월 2주차(M7-W2) 이후 주차에서만 노출. js/*-team-data.js에서 읽어 맨 아래 순서대로 append
  if (showHardcoded) {
    if (typeof MKT_TEAM !== "undefined" && MKT_TEAM) html += renderHardcodedTeam(MKT_TEAM);
    if (typeof PRODUCTION_TEAM !== "undefined" && PRODUCTION_TEAM) html += renderHardcodedTeam(PRODUCTION_TEAM);
  }
  el.innerHTML = html;

  el.querySelectorAll(".basis-i").forEach(b => {
    const open = () => openProgressBasis(b.dataset.task, b.dataset.pct, b.dataset.basis);
    b.addEventListener("click", open);
    b.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}

// 하드코딩 팀 렌더 — 파트 있으면 파트 볼드 소제목(.part-label)별 표, 없으면 단일 표. 열 라벨은 tm.headers 사용.
function renderHardcodedTeam(tm) {
  const cls = tm.cls || "t-sales";
  const hasParts = tm.parts && tm.parts.length;
  let body, solo = "";
  if (hasParts) {
    body = tm.parts.map((p, i) => `
          <div class="part-group"${i > 0 ? ` id="${escape(p.id)}"` : ""}>
            <div class="part-label">${escape(p.part)}</div>
            <div class="dept-table-wrap">${renderDeptTable(p.items, tm.headers)}</div>
          </div>`).join("");
  } else {
    body = `<div class="dept-table-wrap">${renderDeptTable(tm.items || [], tm.headers)}</div>`;
    solo = " team-block-solo";
  }
  return `
      <section class="team-block${solo}" id="${escape(tm.id)}">
        <header class="team-header ${cls}"><h2>${escape(tm.name)}</h2></header>
        <div class="team-body ${cls}">${body}</div>
      </section>`;
}

// 진척율 판단근거 레이어창 (타이틀 고정 + 본문 세로 스크롤)
function openProgressBasis(task, pct, basis) {
  let m = document.getElementById("progress-basis-modal");
  if (!m) {
    m = document.createElement("div");
    m.id = "progress-basis-modal";
    m.className = "reason-modal";
    m.innerHTML = `
      <div class="reason-modal-backdrop"></div>
      <div class="reason-modal-box" role="dialog" aria-modal="true" aria-label="진척율 판단근거">
        <div class="reason-modal-head">
          <span class="reason-modal-title">진척율 판단근거</span>
          <button class="reason-modal-close" type="button" aria-label="닫기">&times;</button>
        </div>
        <div class="reason-modal-pct"></div>
        <div class="reason-modal-body"></div>
      </div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove("open");
    m.querySelector(".reason-modal-backdrop").addEventListener("click", close);
    m.querySelector(".reason-modal-close").addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
  m.querySelector(".reason-modal-title").textContent = "진척율 판단근거 — " + (task || "");
  m.querySelector(".reason-modal-pct").textContent = "현재 진척율 " + (pct || 0) + "%";
  m.querySelector(".reason-modal-body").textContent = basis || "";
  m.classList.add("open");
}

// 부서별 주간 보고 기본 헤더(수도권세일즈팀 등). 진행사항→(금주)진행사항, 예정사항→(차주)예정사항
const DEPT_HEADERS_DEFAULT = ["업무","목적","시작일","종료일","진척율","(금주)진행사항","지연사유","(차주)예정사항"];

// 부서별 주간 보고 — 파트별 표. headers로 열 라벨 커스터마이즈(팀별 상이 가능)
function renderDeptTable(items, headers) {
  const H = headers || DEPT_HEADERS_DEFAULT;
  const cell = s => { const t = String(s == null ? "" : s).trim(); return t ? nlbr(t) : "-"; };
  const rows = (items || []).map(it => {
    const title = String(it.title || "");
    const isStar = it.isStar === true || /^\s*\[★\]\s*/.test(title) || /^\s*★\s*/.test(title);
    const titleClean = title.replace(/^\s*\[★\]\s*/, "").replace(/^\s*★\s*/, "").trim();
    const p = Math.max(0, Math.min(100, Number(it.progress) || 0));
    return `
      <tr class="${isStar ? "is-star" : ""}">
        <td class="c-task">${escape(titleClean)}${isStar ? ' <span class="key-badge">핵심</span>' : ""}</td>
        <td class="c-purpose">${cell(it.purpose)}</td>
        <td class="c-date">${escape(it.startDate || "") || "-"}</td>
        <td class="c-date">${escape(it.endDate || "") || "-"}</td>
        <td class="c-prog"><div class="pgauge"><div class="pgauge-bar"><div class="pgauge-fill ${p >= 100 ? "full" : ""}" style="height:${p}%"></div></div><span class="pgauge-pct">${p}%${(it.progressBasis && String(it.progressBasis).trim()) ? ` <span class="basis-i" role="button" tabindex="0" title="진척율 판단근거" aria-label="진척율 판단근거" data-task="${escape(titleClean)}" data-pct="${p}" data-basis="${escape(it.progressBasis)}">i</span>` : ""}</span></div></td>
        <td class="c-note">${cell(it.progressNote)}</td>
        <td class="c-delay">${cell(it.delay)}</td>
        <td class="c-next">${cell(it.upcoming)}</td>
      </tr>`;
  }).join("");
  return `
    <table class="dept-table">
      <colgroup>
        <col style="width:13%"/><col style="width:15%"/><col style="width:7%"/><col style="width:7%"/>
        <col style="width:7%"/><col style="width:19%"/><col style="width:14%"/><col style="width:18%"/>
      </colgroup>
      <thead><tr>
        <th>${escape(H[0])}</th><th>${escape(H[1])}</th><th class="c-date">${escape(H[2])}</th><th class="c-date">${escape(H[3])}</th>
        <th class="c-prog">${escape(H[4])}</th><th>${escape(H[5])}</th><th>${escape(H[6])}</th><th>${escape(H[7])}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function nlbr(s) {
  return escape(String(s == null ? "" : s)).replace(/\n/g, "<br>");
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
  const cur = _cleanInline(it.progressNote);
  if (cur) head += ` - ${cur}`;
  const lines = [head];
  const delay = _cleanInline(it.delay);
  if (delay) lines.push(` -지연사유 : ${delay}`);
  return lines.join("\n");
}

function fmtNext(idx, it) {
  const title = _displayTitle(it);
  const up = _cleanInline(it.upcoming);
  return up ? `${idx}. ${title} - ${up}` : `${idx}. ${title}`;
}


/* ============================================================
 * 📈 매출 추세 분석 (인라인 펼침) — trend-data.js + Chart.js 필요
 *  기준: 총매출(반품 제외) · AIDT만 순매출 / 26년 전일까지 vs 25년 동기간
 * ============================================================ */
let trendChart = null;
const trendState = { g: "전체", p: "월별" };

// 추세 26년 최종월(현재 진행월) 총출고 동적 오버라이드.
// 구글시트 매출현황의 행별 총출고를 그룹별로 매핑: { 전체, 영업1파트, 영업2파트, 저작권, 리플릿 }(억 단위).
// 저작권 = (마케팅전략팀) 저작권 행, 리플릿 = (제작팀) 리플릿(제작) 행. renderMonthlySales에서 설정. 없으면 trend-data.js 원본 그대로 사용.
let trendLastOverride = null;

// 매출현황 rows(ms.rows)에서 그룹별 총출고(shipped) 추출 → 오버라이드 맵 생성.
function buildTrendOverride(rows) {
  if (!Array.isArray(rows) || !rows.length) return null;
  const ov = {};
  let partSum = 0, hasPart = false;
  rows.forEach(r => {
    const lbl = String(r && r.label != null ? r.label : "");
    const s = Number(r && r.shipped);
    if (!isFinite(s)) return;
    if (/영업\s*1\s*파트/.test(lbl))      { ov["영업1파트"] = s; partSum += s; hasPart = true; }
    else if (/영업\s*2\s*파트/.test(lbl)) { ov["영업2파트"] = s; partSum += s; hasPart = true; }
    else if (/저작권/.test(lbl))          { if (ov["저작권"] == null) ov["저작권"] = s; }
    else if (/리플릿/.test(lbl))          { if (ov["리플릿"] == null) ov["리플릿"] = s; }
    if (r && r.type === "total")          { ov["전체"] = s; }
  });
  // 합계행이 없으면 파트 합으로 전체 보정
  if (ov["전체"] == null && hasPart) ov["전체"] = partSum;
  return Object.keys(ov).length ? ov : null;
}

// 그룹의 26년 시계열에서 최종월만 시트 총출고로 교체한 사본 반환(원본 불변).
function effY26(group) {
  const base = (TREND_DATA.series[group] || {}).y26 || [];
  if (!trendLastOverride || trendLastOverride[group] == null || !base.length) return base;
  const out = base.slice();
  out[out.length - 1] = trendLastOverride[group];
  return out;
}

// 추세 차트 값 라벨 — 막대/라인 위에 실적 수치(억, 소수1자리) 표기. 데이터셋 색상과 동일.
const trendValueLabels = {
  id: "trendValueLabels",
  afterDatasetsDraw(chart){
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "600 10px Pretendard, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      const color = (typeof ds.borderColor === "string" ? ds.borderColor : null) || (typeof ds.backgroundColor === "string" ? ds.backgroundColor : "#243B53");
      ctx.fillStyle = color;
      meta.data.forEach((el, i) => {
        const v = ds.data[i];
        if (v == null) return;
        ctx.fillText(Number(v).toFixed(1), el.x, el.y - 3);
      });
    });
    ctx.restore();
  }
};

function trendAvailable() {
  return (typeof TREND_DATA !== "undefined") && (typeof Chart !== "undefined");
}

function buildTrendExpander() {
  if (!trendAvailable()) return "";
  return `
    <div class="trend-exp" id="trend-exp">
      <div class="trend-head" id="trend-head" role="button" tabindex="0" aria-expanded="false">
        <b>📈 추세 — 2026 vs 2025 (연누적·월 YoY)</b>
        <span class="arrow">▼</span>
      </div>
      <div class="trend-body">
        <div class="trend-ctrl">
          <div class="tseg" id="tsegG"><button type="button" data-v="전체" class="on">전체</button><button type="button" data-v="영업1파트">영업1파트</button><button type="button" data-v="영업2파트">영업2파트</button><button type="button" data-v="저작권">저작권</button><button type="button" data-v="리플릿">리플릿</button></div>
          <div class="tseg" id="tsegP"><button type="button" data-v="월별" class="on">월별</button><button type="button" data-v="연누적">연누적</button></div>
          <div class="trend-legend"><span><b>영업1파트</b> = 참고서(영/수/국) + 교과서 + AIDT</span><span><b>영업2파트</b> = B&amp;G + OUP</span></div>
        </div>
        <div class="trend-chips" id="trend-chips"></div>
        <div class="trend-cw"><canvas id="trend-cv"></canvas></div>
        <div class="trend-cap">${escape(TREND_DATA.cutNote)} · 기준: ${escape(TREND_DATA.basis)} · 26년 최종월은 구글시트 파트별 총출고, 25년 동월은 동기간(같은 일자) 컷</div>
      </div>
    </div>`;
}

function bindTrendExpander(scope) {
  if (!trendAvailable()) return;
  const exp = scope.querySelector("#trend-exp");
  if (!exp) return;
  if (trendChart) { trendChart.destroy(); trendChart = null; }
  let rendered = false;
  const head = exp.querySelector("#trend-head");
  const toggle = () => {
    exp.classList.toggle("open");
    head.setAttribute("aria-expanded", exp.classList.contains("open") ? "true" : "false");
    if (exp.classList.contains("open") && !rendered) { rendered = true; renderTrendChips(); renderTrendChart(); }
  };
  head.addEventListener("click", toggle);
  head.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  exp.querySelectorAll("#tsegG button").forEach(b => b.addEventListener("click", () => {
    exp.querySelectorAll("#tsegG button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    trendState.g = b.dataset.v; renderTrendChips(); renderTrendChart();
  }));
  exp.querySelectorAll("#tsegP button").forEach(b => b.addEventListener("click", () => {
    exp.querySelectorAll("#tsegP button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    trendState.p = b.dataset.v; renderTrendChips(); renderTrendChart();
  }));
}

function trendChip(label, cur, prev) {
  const diff = cur - prev, up = diff >= 0;
  const f1 = n => Number(n).toFixed(1);
  const body = (prev > 0)
    ? `${up ? "▲" : "▼"} ${Math.abs(diff / prev * 100).toFixed(1)}% (${f1(cur)} vs ${f1(prev)}억)`
    : `${up ? "▲" : "▼"} ${f1(Math.abs(diff))}억 (${f1(cur)} vs ${f1(prev)}억)`;
  return `<span class="t-chip ${up ? "up" : "down"}">${label} ${body}</span>`;
}

function renderTrendChips() {
  const el = document.getElementById("trend-chips");
  if (!el) return;
  const d = TREND_DATA.series[trendState.g];
  const y26 = effY26(trendState.g);
  const sum = a => a.reduce((x, y) => x + y, 0);
  const li = TREND_DATA.months.length - 1;
  el.innerHTML =
    trendChip("연누적", sum(y26), sum(d.y25)) +
    trendChip(TREND_DATA.months[li], y26[li], d.y25[li]);
}

function renderTrendChart() {
  const ctx = document.getElementById("trend-cv");
  if (!ctx) return;
  const d = TREND_DATA.series[trendState.g];
  const y26 = effY26(trendState.g);
  const sum = a => a.reduce((x, y) => x + y, 0);
  const cum = a => a.reduce((acc, v, i) => (acc.push((i ? acc[i - 1] : 0) + v), acc), []);
  const f1 = n => Number(n).toFixed(1);
  if (trendChart) { trendChart.destroy(); trendChart = null; }
  const opts = t => ({ responsive: true, maintainAspectRatio: false, layout: { padding: { top: 14 } },
    plugins: { title: { display: true, text: `${t} · ${trendState.g}`, color: "#243B53", font: { size: 13, weight: "600" } },
      legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: { callbacks: { label: c => `${c.dataset.label} ${f1(c.parsed.y)}억` } } },
    scales: { x: { grid: { display: false } }, y: { ticks: { callback: v => v + "억" }, grid: { color: "#EDF2F7" } } } });
  if (trendState.p === "연누적") {
    trendChart = new Chart(ctx, { type: "line", data: { labels: TREND_DATA.months, datasets: [
      { label: "2026 누적", data: cum(y26), borderColor: "#1F5E92", backgroundColor: "#1F5E92", borderWidth: 2.5, tension: .25, pointRadius: 3 },
      { label: "2025 누적", data: cum(d.y25), borderColor: "#D9A325", backgroundColor: "#D9A325", borderWidth: 2, borderDash: [6, 4], tension: .25, pointRadius: 3 }] },
      options: opts("연누적 매출 추이 (26 vs 25)"), plugins: [trendValueLabels] });
  } else {
    trendChart = new Chart(ctx, { type: "bar", data: { labels: TREND_DATA.months, datasets: [
      { label: "2026", data: y26, backgroundColor: "#1F5E92", borderRadius: 3 },
      { label: "2025", data: d.y25, backgroundColor: "#D9A325", borderRadius: 3 }] },
      options: opts("월별 매출 (26 vs 25)"), plugins: [trendValueLabels] });
  }
}

/* ============================================================
 * 공교육 점유율 전용 세부보기 — gonggyo-data.js + Chart.js 필요
 *  26학년도 고2 선택과목 실적(점유율) + 27학년도 목표 42% 한눈에
 * ============================================================ */
function openGonggyoDetail() {
  const g = GONGGYO;
  const pct = v => (v * 100).toFixed(1) + "%";
  const num = n => Number(n).toLocaleString("ko-KR");
  const baseAll = g.rows.reduce((a, r) => a + r.all, 0);
  const baseNe  = g.rows.reduce((a, r) => a + r.ne, 0);
  const baseShare = baseNe / baseAll;

  let m = document.getElementById("gonggyo-modal");
  if (!m) {
    m = document.createElement("div");
    m.id = "gonggyo-modal";
    m.className = "reason-modal";
    m.innerHTML = `
      <div class="reason-modal-backdrop"></div>
      <div class="reason-modal-box gg-box" role="dialog" aria-modal="true" aria-label="공교육 점유율">
        <div class="reason-modal-head"><span class="reason-modal-title"></span>
          <button class="reason-modal-close" type="button" aria-label="닫기">&times;</button></div>
        <div class="gg-body"></div>
      </div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove("open");
    m.querySelector(".reason-modal-backdrop").addEventListener("click", close);
    m.querySelector(".reason-modal-close").addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
  m.querySelector(".reason-modal-title").textContent = g.title;
  const rows = g.rows.map(r => ({ ...r, share: r.ne / r.all }));
  m.querySelector(".gg-body").innerHTML = `
    <div class="gg-basis">
      <div class="gg-flow">
        <div class="gg-node"><span class="lbl">26학년도 고2<br>동일 선택과목 실적 점유율</span><span class="val">${pct(baseShare)}</span></div>
        <div class="gg-op"><span class="arr">&rarr;</span><span>유지<br>목표</span></div>
        <div class="gg-node target"><span class="lbl">27학년도 고3<br>점유율 목표</span><span class="val">${pct(g.target)}</span></div>
      </div>
      <p class="gg-msg"><b>동일 선택과목</b> 기반 직전 학년(26학년도 고2)의 실제 점유율(${pct(baseShare)})을 <b>27학년도 3학년 선택과목 점유율 목표</b>로 수립.</p>
    </div>
    <div class="gg-sec-h">산정 근거 &mdash; 26학년도 고2 선택과목 실적</div>
    <table class="gg-table">
      <thead><tr><th>선택과목</th><th>출원사(전체)</th><th>NE능률</th><th>점유율</th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr><td>${escape(r.subject)}</td><td>${num(r.all)}</td><td>${num(r.ne)}</td><td>${pct(r.share)}</td></tr>`).join("")}
        <tr class="gg-tot"><td>합계</td><td>${num(baseAll)}</td><td>${num(baseNe)}</td><td>${pct(baseShare)}</td></tr>
      </tbody>
    </table>`;
  m.classList.add("open");
}