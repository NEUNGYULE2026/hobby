/**
 * 채널마케팅본부 주간 대시보드 — 프론트엔드 v3.77
 *
 * v3.77 변경
 *  - (공통) 팝업 표에 시트의 행/열 병합(rowspan/colspan) 그대로 적용 + 병합 셀 상하좌우 중앙정렬(.mg, css v3.39). buildCommonContent가 셀 객체 그리드({v,rs,cs}|null=병합피복) 소비(구형 문자열 배열도 호환). 병합 피복행은 영역 경계로 오인하지 않음(세로병합 유지). 다단 헤더 자동 감지(선두의 숫자 없는 연속 행=헤더). '마감 예상' 등 '*'로 시작하는 문구 행은 표가 아닌 '텍스트(캡션)'로 렌더(붙어 있는 표의 제목). 영역별 열 정리는 병합 확장 기반(colspan 재계산). ※ Code.gs v3.20(readCommonGrid 병합 반영)과 함께 배포.
 *
 * v3.76 변경
 *  - (공통) 팝업(월마감 예상매출 합계 돋보기 등) 렌더 구조 개선: buildCommonContent를 '빈 행 기준 영역 분할'로 변경. 빈 행(1개 이상)을 완전 별개 영역 경계로 삼아, 서로 구조가 다른 표 2개 이상이 한 화면에 와도 각 영역이 독립 열 구조로 렌더(섞임/깨짐 방지). 영역 내부에서만 텍스트↔표를 세분(표 바로 앞 텍스트=캡션). 영역 간에는 간격+구분선(css v3.38: .reason-common-region). 텍스트와 표가 빈 줄 없이 붙어 있으면 같은 영역. (Code.gs readCommonGrid는 내부 빈 행 보존 — 변경 없음)
 *
 * v3.75 변경
 *  - [버그수정] Y축 세분 구간(2.5억/2.5만)이 화면에 반영되지 않던 문제. Chart.js 기본 ticks.maxTicksLimit(11) 때문에 눈금 22개가 자동 솎아져 ≈5억처럼 보였음 → maxTicksLimit을 구간 수(yMax/yStep+2)로 상향해 지정 구간 그대로 표시.
 *
 * v3.74 변경
 *  - 추세 Y축 눈금 구간 세분화: 총매출=2.5억 / 출고수량=2.5만(=25천). 월별은 이 구간 유지, 눈금 22개 초과 시(연누적)만 배수(×2) 확장(총매출 연누적≈20억·출고 연누적≈10만). 차트 높이 360→420px(css v3.37).
 *
 * v3.73 변경
 *  - 추세 차트 Y축 눈금 구간 지정: 총매출=5억 / 출고수량=5만(=50천). 기본 구간으로 눈금이 15개 초과 시(연누적 등) 그 배수로 자동 확장(총매출 연누적≈20억·출고 연누적≈15만), 최댓값은 구간 배수로 정렬(max·stepSize 명시, 기존 suggestedMax 대체). 구간은 고정축(전체 그룹 최대치) 기준이라 그룹 선택과 무관하게 일정 → 비중 비교 유지. 차트 영역 높이 280→360px(css v3.36)로 볼륨감 강화.
 *
 * v3.72 변경
 *  - KPI 세부보기 '지연 로딩': 메인 응답에 세부표(지사/총판/자사몰 등 수백 행)를 싣지 않고, 돋보기 클릭 시에만 ?action=detail&sheet=<시트명> 으로 해당 세부표 1개를 받아 렌더. → 메인 doGet 응답이 크게 가벼워져 새로고침 속도 개선. 받은 세부표는 세션 캐시(DETAIL_CACHE)+카드 객체에 저장해 재클릭 시 즉시. 로딩 중 표시·3회 재시도·다른 카드 열림 시 이전 응답 폐기 처리. openKpiDetail→async, 표 렌더는 renderKpiDetailBody로 분리. 세부보기 버튼 노출은 detailSheet 유무로 판정(구 응답의 k.detail 배열도 호환). Code.gs v3.19와 함께 배포 필요.
 *
 * v3.71 변경
 *  - 새로고침 체감 속도 개선: loadData를 캐시 우선(stale-while-revalidate) 방식으로 변경. 직전 응답을 localStorage(cmkDash:<week>)에 저장하고, 재접속·새로고침 시 캐시를 '즉시' 렌더한 뒤 백그라운드로 최신본을 받아 내용이 바뀐 경우에만 재렌더. 갱신 중에는 새로고침 버튼이 '갱신 중…'으로 표시(비활성). 서버(Apps Script) 자체 응답시간은 그대로지만, 사용자 체감상 새로고침이 즉시 뜸. fetch 실패 시 캐시가 있으면 에러로 덮지 않고 기존 화면 유지.
 *
 * v3.70 변경
 *  - loadData 자동 재시도(최대 3회, 0.7s·1.4s 점증 지연). Apps Script 엔드포인트의 간헐적 404/5xx/네트워크 오류에 대응(URL 정상인데 대시보드만 404 뜨던 현상 완화). 3회 모두 실패 시에만 에러+새로고침 안내.
 *
 * v3.69 변경
 *  - 연누적(라인) 툴팁 mode 'index'+intersect false → 같은 월의 26·25 누적을 한 툴팁에 함께 표시. 막대(월별)는 nearest 유지(개별).
 *
 * v3.68 변경
 *  - 연누적(라인) 값 라벨 겹침 정리(trendValueLabels): 두 선 라벨을 위 선=위쪽·아래 선=아래쪽으로 분리(인덱스별 y비교), 아래 라벨은 X축과 겹치지 않게 chartArea.bottom-12로 clamp. 막대(월별)는 기존 유지.
 *
 * v3.67 변경
 *  - 추세 차트 Y축 고정: 선택(그룹/채널/브랜드)과 무관하게 동일 축 → 그래프 높이로 비중 비교 가능. '전체' 그룹(전체 채널) 최대치×1.08을 suggestedMax로(월별=월 최대, 연누적=최종 누적 최대). 지표(억/천)·기간(월별/연누적)별 별도 상한. beginAtZero. 소형 그룹(리플릿·OUP·브랜드)은 바닥에 붙어 비중 직관.
 *
 * v3.66 변경
 *  - 부서별 주간 보고 헤더 문구 변경: 지연사유→이슈사항, (차주)예정사항→사유/해결책(DEPT_HEADERS_DEFAULT). 팀 카드 배경색 전 팀 통일(팔레트 순환 폐기 → 전부 t-sales 네이비).
 *
 * v3.65 변경
 *  - 총매출 추세 그룹 명칭 변경(조직개편): 영업1파트→중고등영업팀, 영업2파트→ELT영업팀. 그룹명=데이터 조회 키라 함께 변경: trendCfg groups·범례(app.js) + TREND_DATA.series·progressDaily25 키(trend-data.js) + buildTrendOverride ov 키. (출고수량 탭·부서별 보고는 무관)
 *
 * v3.64 변경
 *  - 8월 롤오버 대응: trend-data.js 8개월(1~7월 만월 + 8월*) 재생성(총매출·출고수량·브랜드·QTY10). buildTrendOverride 매출현황 행 매칭을 조직개편 신 팀명으로 확장(중고등영업팀→영업1파트·ELT영업팀→영업2파트, 저작권/리플릿 유지)해 26년 8월* 총출고 오버라이드 복구. (데이터 파일 변경 위주, 로직은 override 매칭만)
 *
 * v3.63 변경
 *  - 증감 팝업 접두어 라벨 변경: (지사)→(중고등-지사), (총판)→(ELT-총판). 볼드 정규식도 신 라벨로 갱신(공통 유지).
 *
 * v3.62 변경
 *  - KPI 세부보기 지연사유 라벨을 하드코딩('지연사유') 대신 **시트 열 이름 그대로**(head[delayIdx]) 사용 — 시트에서 열명 변경 시 자동 반영(예 '지연사유 및 관리현황'). 감지 정규식 /지연\s*사유/는 그대로(부분 일치).
 *
 * v3.61 변경
 *  - KPI 세부보기(openKpiDetail): '지연사유' 열이 있으면 **열은 숨기고** 값이 있는 행은 '정상화 시기'(없으면 마지막 표시열) 셀에 돋보기(.delay-i) 노출 — 월정보 있으면 '월+아이콘', 없으면 아이콘만, 지연사유 없으면 아이콘 없음. 클릭 시 해당 행 아래 펼침(.delay-row), 아코디언(같은 아이콘 재클릭 닫기·다른 아이콘 클릭 시 이전 닫고 열기, 항상 1개). 지연사유 열 없는 시트(총판·자사몰 등)는 기존 렌더 유지. (readDetailSheet가 빈 열 제거하므로 지연사유 미입력 시엔 열 자체가 없어 아이콘 미노출) style.css v3.35.
 *
 * v3.60 변경
 *  - 초기 로딩 시 불완전한 탭 바(팀 탭 주입 전 개요/CEO/의사결정만) 플래시 제거. `.tabs-row`를 CSS로 기본 숨김(visibility:hidden, 공간 유지) → 렌더/에러 완료 시 `revealTabs()`가 `.ready` 부여해 완성된 탭 바만 노출. (style.css v3.34)
 *
 * v3.59 변경
 *  - 부서별 주간 보고 '동적 팀' 렌더(조직 구조 변경 대응). Code.gs teams 배열(팀명별, '팀명-파트명'→파트)을 팔레트 순환 cls로 카드화(renderTeamsDynamic→renderHardcodedTeam 재사용, 파트 있으면 소제목 구분·없으면 solo). 상단 탭도 팀명 기반 동적 생성(renderTeamTabs: 개요·CEO와 의사결정 사이 삽입). index.html 하드코딩 팀 탭 제거. 구 TEAM_SECTIONS/buildTeamSections/resolveDeptTeam·주차게이팅 경로 미사용(정의는 잔존).
 *
 * v3.58 변경
 *  - (고3영어) 근거 팝업(openGonggyoDetail)에 '[출원사별 점유율]' 버튼(.gg-pub-btn, 산정근거 헤더 우측) 추가 → openGonggyoByPub 레이어. 26학년도 고2 선택과목 × 출원사(NE능률·시사·천재·미래엔·비상·동아) 부수/점유율 매트릭스 표(NE능률 강조, 부수0='-', 합계행). 데이터 gonggyo-data.js GONGGYO_BYPUB(원본 rawdata/(출원사별)점유율.xlsx). style.css v3.33.
 *
 * v3.57 변경
 *  - (데이터) 26년 rawdata 7/29 반영. trend-data.js 출고수량(TREND_QTY·TREND_QTY_BRAND) 7월* 진행월 컷 7/22→7/29 재집계(쿠팡 7/29 트림 병합). 완결월 1~6월·QTY10·총매출 불변. 공급율10 팝업 주석 7/22→7/29. (총매출 25년은 progressDaily25로 자동 추종이라 데이터 변경 없음)
 *
 * v3.56 변경
 *  - (공통) 표 가독성 개선. buildCommonContent를 행 타입(표/텍스트) 런 분할로 변경 → 제목(한 칸 행)과 표(여러 칸 행)가 빈 줄 없이 붙어 있어도 자동 분리(표 앞 텍스트는 캡션 .reason-common-cap로 강조). 표는 .reason-common-scroll로 감싸 가로 스크롤, (공통) 있을 때 모달 폭 확장(.has-common, 880px)으로 잘림 방지. (style.css v3.32)
 *
 * v3.55 변경
 *  - 총매출 추세 25년 진행월(7월*) 동기간 컷 자동화. Code.gs progressCut(누적실적 헤더 일자)로 trendSeries가 TREND_DATA.progressDaily25[그룹][day-1] 인덱싱해 y25 최종월 교체. 시트 날짜 바뀌면 자동 추종. 캡션에 '(N월 1~D일 동기간)' 표기. (기존: 25년 7월이 7/9 컷으로 고정돼 26년 7/22과 기간 불일치 → 수정)
 *
 * v3.54 변경
 *  - (공통) 표/텍스트 혼합 렌더. buildCommonTable → buildCommonContent: 빈 행으로 블록 분리 → 여러 칸 채워진 블록=표, 한 칸=텍스트로 자동 구분(블록별 빈 열 제거, 시트 순서 유지). 표만/텍스트만/혼합/null 모두 대응. (Code.gs v3.14·style.css v3.31 연동)
 *
 * v3.53 변경
 *  - (공통)을 텍스트가 아닌 '표'로 렌더. buildCommonTable(forecastTotal.commonGrid) 신설 → (지사)/(총판) 텍스트 하단에 HTML 표(첫 행=헤더, 열 단위 숫자 판정→숫자/%/원 열 우측정렬, 마지막 행 강조) 부착. openReasonModal(text, extraHTML) 2번째 인자로 표 HTML 전달, 텍스트는 .reason-text로 분리. (Code.gs v3.13·style.css v3.30 연동)
 *  - [핫픽스] buildCommonTable(전역 함수)이 renderMonthlySales 지역 변수 nz를 참조해 'nz is not defined' 발생 → 함수 내부에 자체 nz 정의. (escape는 전역이라 무관)
 *
 * v3.52 변경
 *  - (증감)주요내역 팝업: forecastTotal 합계행 비고에 적힌 시트명의 내용을 (지사)/(총판) 하단에 (공통) 섹션으로 부착. 접두어 볼드 정규식에 공통 추가.
 *
 * v3.51 변경
 *  - 출고수량 만월 기준 폐기 → 진행월(7월*) 포함. trend-data.js 재집계(TREND_QTY·TREND_QTY_BRAND·QTY10, 26 최신일 7/22, 25년 7/1~22 동기간 컷). months 1~7월*로 확장(차트 자동 대응). 공급율10 팝업 주석 26년 범위 7/22로 갱신. (app.js 로직 변경은 팝업 주석뿐; 월 확장은 데이터 주도)
 *
 * v3.50 변경
 *  - 출고수량·영어 드롭다운 라벨 '브랜드' → '주요브랜드'.
 *
 * v3.49 변경
 *  - 출고수량 캡션: 🔍 뒤 두 칸(&nbsp;&nbsp;) 띄우고 '· 영어'만 표기. basis에서 영어=중고등+수험·B&G·OUP 정의 제거(영어 라벨만 유지).
 *
 * v3.48 변경
 *  - 출고수량 캡션 정리: 연도 접두(26·25년) 제거, '출판(중고등) 공급율10 제외'→'유가(공급율10%) 제외'(🔍 replace 타깃도 갱신), 중복 '영어=중고등+수험' 제거.
 *
 * v3.47 변경
 *  - 출고수량 표시 단위 만(÷10000)→천(÷1000): trendCfg div 1000·unit '천'. 차트 축·값라벨·칩·캡션 모두 천 부.
 *
 * v3.46 변경
 *  - 출고수량·영어 전용 '브랜드' 드롭다운(우측, 선택/전체/주력품목 브랜드) 신설 → TREND_QTY_BRAND.series[브랜드][채널] 필터. '선택'=미필터(영어 전체), '전체'=주력품목 전 품목, 개별=브랜드(품목번호+구+파생 통합). 채널·기간 동일 적용. 영어일 때만 노출.
 *  - 출고수량 우측 범례(영어=·오프/온라인 정의)를 하단 캡션으로 이동. style.css v3.29(.trend-brand).
 *
 * v3.45 변경
 *  - 추세 총매출/출고수량(#tsegM)·월별/연누적(#tsegP) 탭에 .tseg-nav 부여 → 활성색 진네이비(#123D69). 중간 구분·채널 토글은 기존 브랜드 블루로 구분(style.css v3.28).
 *
 * v3.44 변경
 *  - 추세 기본 구분을 출고수량일 때 '영어'로(trendDefaultGroup) → 기본 선택 = 출고수량/영어/전체(채널)/월별. 우측 범례에서 'B&G=ELT-A·OUP=ELT-B' 줄 삭제.
 *
 * v3.43 변경
 *  - 출고수량 탭에 채널 축(전체/오프라인/온라인) 추가(구분과 기간 사이 #tsegC). TREND_QTY.series[그룹][채널] 중첩 구조, trendSeries가 채널 선택. 채널 분류=거래처코드×master(출판/ELT), 오프라인=총판·온라인=총판 외. 총매출 탭은 채널 토글 숨김.
 *
 * v3.42 변경
 *  - 공급율10 팝업 타이틀 '유가(공급율-10%) 제외 출고수량 (25 vs 26)'로 변경, 레이어 폭 축소(380px)·표 컴팩트 정렬(월 가운데·숫자 tabular 우측, style.css v3.27).
 *
 * v3.41 변경
 *  - 출고수량 캡션 '공급율10 제외' 뒤 🔍 아이콘 → 클릭 시 팝업(openQty10Modal): 제외 물량(출판중고등·공급율10·납품·수량>0) 월별 25 vs 26 비교표. 데이터 = trend-data.js QTY10_DETAIL. style.css v3.26.
 *
 * v3.40 변경
 *  - 출고수량 범례/캡션 문구 '영어=참고서(중고등)+수험영어' → '영어=중고등+수험'.
 *
 * v3.39 변경
 *  - 추세 기본 지표를 총매출→출고수량으로 변경(TREND_QTY 있으면). 토글(.tseg) 활성 탭 브랜드 블루 채움(style.css v3.25).
 *
 * v3.38 변경
 *  - 추세 패널 상위 탭 신설: '총매출'(기존, TREND_DATA·억) / '출고수량'(신규, TREND_QTY·만 부). trendCfg()로 지표별 데이터·그룹·단위·오버라이드 분기, effY26→trendSeries 일반화(출고수량은 오버라이드 없음). 그룹 버튼·범례·캡션은 renderTrendControls가 지표별 동적 구성. 출고수량 그룹=전체/영어/B&G/OUP(납품·매출수량>0, 1~6월 만월).
 *
 * v3.37 변경
 *  - 본부 핵심 과제: 비고 '보류' KPI 카드에 `.kpi-hold`(회색 음영) + '보류' 배지. 내용·수치는 그대로, 표시만 무채색으로 구분(프로젝트 홀딩). style.css v3.22.
 *
 * v3.36 변경
 *  - 마케팅전략팀·제작팀 구글시트 연동(7/8번 섹션). resolveDeptTeam이 주차별로 렌더 객체 결정: M7-W3(703)~ 시트(d.mktTeam·d.productionTeam), M7-W2(702) 하드코딩(MKT_TEAM·PRODUCTION_TEAM), 그 전 미노출. renderTeams(sections, extraTeams)로 일반화, 탭 노출도 resolve 결과 기반. 표 헤더는 하드코딩 headers 재사용.
 *
 * v3.35 변경
 *  - 매출현황 2단 진척율 헤더 아래에 '(총출고 기준)' 보조 라벨(.prog-basis) 추가 — 진척율 산정 기준 명시. style.css v3.21.
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

const API_URL = "https://script.google.com/macros/s/AKfycbxtCQ7om4h3OZdHgbo26D6CUzXSOfp96KxA4xSP1AX9O-d8CHSuAB1fNoalFNbKfbZp/exec";

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

function setRefreshing(on) {
  const b = document.getElementById("refresh-btn");
  if (b) { b.textContent = on ? "갱신 중…" : "새로고침"; b.disabled = on; }
}

async function loadData(weekKey) {
  const root = document.getElementById("app");
  const cacheKey = "cmkDash:" + (weekKey || "latest");
  // 1) 캐시가 있으면 '즉시' 렌더(체감 속도 개선). 이후 백그라운드로 최신 데이터를 받아 변경 시에만 교체(stale-while-revalidate).
  let cachedStr = null, hasCache = false;
  try {
    cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) { const d = JSON.parse(cachedStr); LAST_DATA = d; render(d); hasCache = true; }
  } catch (e) { cachedStr = null; }
  if (!hasCache) root.innerHTML = '<div class="loading">대시보드 데이터를 불러오는 중입니다…</div>';
  if (!API_URL || API_URL.indexOf("Apps-Script") !== -1) {
    if (!hasCache) { root.innerHTML = '<div class="error">API_URL이 설정되지 않았습니다. app.js 의 API_URL 에 Apps Script 웹앱 URL을 입력하세요.</div>'; revealTabs(); }
    return;
  }
  setRefreshing(true);
  // Apps Script 엔드포인트는 배포 직후/구글 부하 시 간헐적 404·5xx·네트워크 오류가 날 수 있어 자동 재시도(최대 3회, 점증 지연)
  const qs = weekKey ? `?week=${encodeURIComponent(weekKey)}` : "";
  const url = `${API_URL}${qs}`;
  const ATTEMPTS = 3;
  let lastErr;
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const fresh = await res.text();
      const data = JSON.parse(fresh);
      if (data.error) throw new Error(data.error);
      LAST_DATA = data;
      try { localStorage.setItem(cacheKey, fresh); } catch (e) {}
      if (!hasCache || fresh !== cachedStr) render(data);   // 변경 시에만 재렌더(불필요한 깜빡임·스크롤/패널 상태 리셋 방지)
      setRefreshing(false);
      return;
    } catch (err) {
      lastErr = err;
      if (i < ATTEMPTS - 1) {
        if (!hasCache) root.innerHTML = `<div class="loading">대시보드 데이터를 불러오는 중입니다… (재시도 ${i + 1})</div>`;
        await new Promise(r => setTimeout(r, 700 * (i + 1)));   // 0.7s, 1.4s 대기 후 재시도
      }
    }
  }
  // 전부 실패: 캐시가 있으면 그대로 유지(에러로 덮지 않음), 없으면 에러 표시
  setRefreshing(false);
  if (!hasCache) {
    root.innerHTML = `<div class="error">데이터를 불러오지 못했습니다: ${lastErr.message}<br><span style="font-size:12px;color:var(--text-soft)">잠시 후 '새로고침'을 눌러 주세요.</span></div>`;
    revealTabs();
  }
  console.error(lastErr);
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

// 마케팅전략팀·제작팀 노출 규칙(주차키 = 월*100+주):
//  · M7-W2(702) ~ M7-W2: 하드코딩(js/*-team-data.js)
//  · M7-W3(703)~        : 구글시트 7/8번 섹션 연동(d.mktTeam / d.productionTeam)
const HARDCODED_MIN_WEEK = 702;
const SHEET_TEAM_MIN_WEEK = 703;
function weekSortKey(weekKey){
  const m = String(weekKey || "").match(/^M(\d{1,2})-W(\d{1,2})$/i);
  return m ? (parseInt(m[1], 10) * 100 + parseInt(m[2], 10)) : 0;
}

// 렌더할 마케팅전략팀/제작팀 객체 결정: 연동 주차면 시트 데이터, 이전이면 하드코딩, 그 전이면 null.
function resolveDeptTeam(id, name, sheetParts, hardcoded, wk) {
  const headers = (hardcoded && hardcoded.headers) || DEPT_HEADERS_DEFAULT;
  const cls = (hardcoded && hardcoded.cls) || "t-sales";
  if (wk >= SHEET_TEAM_MIN_WEEK) {
    if (!sheetParts || !sheetParts.length) return null;      // 연동 주차인데 시트 비면 미노출
    if (sheetParts.length === 1) return { id, name, cls, headers, items: sheetParts[0].items };
    return { id, name, cls, headers, parts: sheetParts.map((p, i) => ({ part: p.part, id: id + "-" + i, items: p.items })) };
  }
  if (wk >= HARDCODED_MIN_WEEK) return hardcoded || null;     // 하드코딩 주차(M7-W2)
  return null;                                                // 그 이전: 미노출
}

function render(d) {
  fillWeekDropdown(d.weeks || [], d.week);
  const root = document.getElementById("app");

  const messages    = d.messages || [];
  const kpis        = d.kpis || [];
  const sales       = d.monthlySales || { title:"", rows: [], note: "", forecastTotal: null };
  const ceo         = d.ceo || [];
  const decisions   = d.decisions || [];
  // 부서별 주간 보고 — 팀 열 값 기반 동적 팀(Code.gs parseDeptTeamsDynamic). 팀명별 카드, '팀명-파트명'이면 팀 안에서 파트 구분.
  // 팀 영역 배경색은 전 팀 동일(t-sales 네이비)로 통일.
  const teamCards = (Array.isArray(d.teams) ? d.teams : []).map((t, i) => ({
    id: "team-" + i,
    name: t.name,
    cls: "t-sales",
    parts: t.parts || [],
    items: t.items || [],
  }));

  const hasMessages = messages.length > 0;
  const hasKpis     = kpis.length > 0;
  const hasSales    = (sales.rows || []).length > 0;
  const hasCeo      = ceo.length > 0;
  const hasTeams = teamCards.length > 0;
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
  if (hasTeams)     renderTeamsDynamic(teamCards);
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

  renderTeamTabs(teamCards);   // 팀 탭 동적 생성(개요·CEO와 의사결정 사이)
  const navVis = { overview: hasMessages, ceo: hasCeo, "decisions-anchor": hasDecisions };
  teamCards.forEach(tc => { navVis[tc.id] = true; });
  setupNavScroll(navVis);
  revealTabs();   // 렌더 완료 → 완성된 탭 바 노출(플래시 방지)
}

// 탭 바 노출(데이터 로드/렌더 완료 후). 로딩 중에는 CSS(.tabs-row visibility:hidden)로 감춤.
function revealTabs() {
  const tr = document.querySelector(".tabs-row");
  if (tr) tr.classList.add("ready");
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
    // 세부보기 버튼: detail 본문은 지연 로딩되므로 detailSheet(시트명) 유무로 판정. (구 응답 호환: k.detail 배열도 인정)
    const hasDetail = isGonggyo || !!k.detailSheet || !!(k.detail && k.detail.length);
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
    // 비고 '보류' → 회색 음영(현상태 유지, 프로젝트 홀딩 구분). 배지 표기.
    const onHold = k.onHold === true || /보류/.test(String(k.note || ""));
    const holdBadge = onHold ? ` <span class="kpi-hold-badge">보류</span>` : "";
    return `
      <div class="kpi-card${onHold ? " kpi-hold" : ""}">
        <p class="kpi-name">${escape(k.name)}${holdBadge}</p>
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

// 세부 시트 지연 로딩 캐시(시트명 → 2차원 배열). 세션 내 재클릭 시 재요청 방지.
const DETAIL_CACHE = {};
async function fetchDetailSheet(sheetName) {
  if (DETAIL_CACHE[sheetName]) return DETAIL_CACHE[sheetName];
  const url = `${API_URL}?action=detail&sheet=${encodeURIComponent(sheetName)}`;
  const ATTEMPTS = 3;
  let lastErr;
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const rows = data.detail || [];
      DETAIL_CACHE[sheetName] = rows;
      return rows;
    } catch (err) {
      lastErr = err;
      if (i < ATTEMPTS - 1) await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastErr;
}

// KPI 세부보기 — 세부 시트 내용을 표로 레이어창에 표시(타이틀 고정 + 본문 세로 스크롤). 세부 본문은 클릭 시 지연 로딩.
async function openKpiDetail(k) {
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
  const bodyEl = m.querySelector(".reason-modal-body");
  // 세부 본문 확보: 이미 로딩됐으면 재사용, 아니면 시트명으로 지연 로딩(로딩 표시).
  let rows = k.detail || [];
  const reqToken = (openKpiDetail._token = (openKpiDetail._token || 0) + 1);
  if (!rows.length && k.detailSheet) {
    bodyEl.innerHTML = `<p style="color:var(--text-soft);">세부 내용을 불러오는 중입니다…</p>`;
    m.classList.add("open");
    try {
      rows = await fetchDetailSheet(k.detailSheet);
      k.detail = rows;   // 객체에도 캐시(같은 카드 재클릭 시 즉시)
    } catch (err) {
      if (openKpiDetail._token === reqToken)
        bodyEl.innerHTML = `<p style="color:var(--danger,#c0392b);">세부 내용을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>`;
      return;
    }
    if (openKpiDetail._token !== reqToken) return;  // 로딩 중 다른 카드 열림 → 이 응답 폐기
  }
  renderKpiDetailBody(bodyEl, rows);
  m.classList.add("open");
}

// 세부 표 렌더 + 지연사유 아코디언 배선 (openKpiDetail에서 분리)
function renderKpiDetailBody(bodyEl, rows) {
  rows = rows || [];
  let html;
  if (rows.length) {
    const head = rows[0], rest = rows.slice(1);
    // '지연사유' 열이 있으면: 열은 숨기고, 값이 있는 행은 '정상화 시기' 열에 돋보기 아이콘 → 클릭 시 행 아래 펼침(아코디언)
    const delayIdx = head.findIndex(h => /지연\s*사유/.test(String(h == null ? "" : h)));
    if (delayIdx >= 0) {
      const delayLabel = String(head[delayIdx] == null ? "지연사유" : head[delayIdx]).trim() || "지연사유";  // 시트 열 이름 그대로(예: '지연사유 및 관리현황')
      const keep = head.map((_, i) => i).filter(i => i !== delayIdx);   // 표시 열(지연사유 열 제외)
      let iconCol = head.findIndex(h => /정상화/.test(String(h == null ? "" : h)));
      if (iconCol < 0 || iconCol === delayIdx) iconCol = keep[keep.length - 1];  // 없으면 마지막 표시 열
      const MAG = `<svg class="delay-mag" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></svg>`;
      const thead = `<thead><tr>${keep.map(i => `<th>${escape(head[i])}</th>`).join("")}</tr></thead>`;
      const body = rest.map((r, ri) => {
        const delayVal = String(r[delayIdx] == null ? "" : r[delayIdx]).trim();
        const tds = keep.map(i => {
          let cell = escape(String(r[i] == null ? "" : r[i]));
          if (i === iconCol && delayVal) {
            cell = (cell ? cell + " " : "") + `<button class="delay-i" type="button" data-idx="${ri}" aria-label="${escape(delayLabel)} 보기" title="${escape(delayLabel)}">${MAG}</button>`;
          }
          return `<td>${cell}</td>`;
        }).join("");
        const expand = delayVal
          ? `<tr class="delay-row" data-idx="${ri}" hidden><td colspan="${keep.length}"><div class="delay-box"><b>${escape(delayLabel)}</b><br>${escape(delayVal)}</div></td></tr>`
          : "";
        return `<tr>${tds}</tr>${expand}`;
      }).join("");
      html = `<table class="detail-table detail-delay">${thead}<tbody>${body}</tbody></table>`;
    } else {
      html = `<table class="detail-table"><thead><tr>${head.map(h=>`<th>${escape(h)}</th>`).join("")}</tr></thead>`
           + `<tbody>${rest.map(r=>`<tr>${r.map(c=>`<td>${escape(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
  } else {
    html = `<p style="color:var(--text-soft);">세부 내용이 없습니다.</p>`;
  }
  bodyEl.innerHTML = html;
  // 돋보기 아코디언: 같은 아이콘 재클릭=닫기, 다른 아이콘 클릭=이전 닫고 새로 열기(항상 1개만)
  bodyEl.querySelectorAll(".delay-i").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const row = bodyEl.querySelector(`.delay-row[data-idx="${idx}"]`);
      const wasOpen = row && !row.hidden;
      bodyEl.querySelectorAll(".delay-row").forEach(r => { r.hidden = true; });
      bodyEl.querySelectorAll(".delay-i.on").forEach(b => b.classList.remove("on"));
      if (row && !wasOpen) { row.hidden = false; btn.classList.add("on"); }
    });
  });
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
  // 추세 25년 진행월 = 시트 누적실적 헤더 일자까지 동기간 컷(trendSeries에서 progressDaily25 인덱싱)
  trendProgressCut = ms.progressCut || null;
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
  if (nz(_ft0.part1Remark)) _fLines.push('(중고등-지사)\n' + nz(_ft0.part1Remark));
  if (nz(_ft0.part2Remark)) _fLines.push('(ELT-총판)\n' + nz(_ft0.part2Remark));
  const forecastReason = _fLines.join('\n\n'); // 지사·총판 사이에 빈 줄 1개 확보
  const commonTableHTML = buildCommonContent(_ft0.commonGrid); // (공통) — 합계행 비고 시트명 내용을 표/텍스트 블록으로 렌더
  const showReason = rows.some(r => nz(r.remark)) || !!forecastReason || !!commonTableHTML;
  const REASON_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></svg>`;
  function reasonCell(text, withCommon) {
    if (!showReason) return "";
    const t = nz(text);
    const common = withCommon && commonTableHTML;
    if (!t && !common) return `<td class="reason-cell"></td>`;
    return `<td class="reason-cell"><button class="reason-btn" type="button" data-reason="${escape(t)}"${common ? ' data-common="1"' : ''} aria-label="비고 보기" title="비고">${REASON_ICON}</button></td>`;
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
      body += `<tr class="forecast-total">${rowCells({ label: ft.label || "월마감 예상매출 합계", targetShipped: ft.targetShipped, targetReturns: ft.targetReturns, targetNet: ft.targetNet, shipped: ft.shipped, returns: ft.returns, net: ft.net, progress: ft.progress }, '')}${reasonCell(forecastReason, true)}</tr>`;
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
            <th rowspan="2" class="num gsep prog-th">${escape(h.progress || '진척율')}<span class="prog-basis">(총출고 기준)</span></th>
            ${showReason ? `<th rowspan="2" class="reason-col">비고</th>` : ""}
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
          ${reasonCell(forecastReason, true)}
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
          ${showReason ? `<th class="reason-col">비고</th>` : ""}
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
    btn.addEventListener('click', () => openReasonModal(
      btn.getAttribute('data-reason'),
      btn.hasAttribute('data-common') ? commonTableHTML : ''
    ));
  });
  bindTrendExpander(el);
}

// (공통) — 합계행 비고 시트명 내용을 렌더. 셀 객체 그리드({v,rs,cs}|null=병합피복) 소비(구형 문자열 배열도 호환).
//  · 빈 행 = 완전 별개 '영역' 경계(병합 피복행은 경계 아님)
//  · 행이 '*'로 시작하거나 채워진 칸이 1개면 '텍스트(문구/캡션)' — 표로 만들지 않음(표 바로 앞이면 캡션)
//  · 표는 시트의 행/열 병합(rowspan/colspan)을 그대로 적용, 병합 셀은 상하좌우 중앙정렬(.mg)
function buildCommonContent(grid) {
  if (!grid || !grid.length) return '';
  const nz = s => String(s == null ? "" : s).trim();
  // 셀 정규화: null=병합 피복, 문자열=구형, 객체={v,rs,cs}
  const norm = c => (c == null ? null : (typeof c === 'object' ? { v: nz(c.v), rs: c.rs || 1, cs: c.cs || 1 } : { v: nz(c), rs: 1, cs: 1 }));
  const G = grid.map(r => r.map(norm));
  const numRe = v => { const s = nz(v).replace(/[\s원]/g, ''); return s !== '' && /^-?[\d,]+(\.\d+)?%?$/.test(s); };
  const nonEmpty = row => row.filter(c => c && c.v !== '');
  const filled = row => nonEmpty(row).length;
  const startsStar = row => { const a = nonEmpty(row); return a.length > 0 && a[0].v.charAt(0) === '*'; };
  const hasCover = row => row.some(c => c === null);
  const blankRow = row => !hasCover(row) && row.every(c => !c || c.v === '');   // 영역 경계(세로병합 피복행 제외)

  // 1) 빈 행 기준 영역 분할
  const regions = [];
  let curRegion = null;
  G.forEach(r => {
    if (blankRow(r)) { curRegion = null; return; }
    if (!curRegion) { curRegion = []; regions.push(curRegion); }
    curRegion.push(r);
  });
  if (!regions.length) return '';

  // 영역별 사용 열 계산(병합 확장) → 빈 열 제거 + colspan 재계산
  const trimRegionCols = rows => {
    const ncol = rows.reduce((m, r) => Math.max(m, r.length), 0);
    const used = new Array(ncol).fill(false);
    rows.forEach(r => r.forEach((c, j) => {
      if (c && c.v !== '') { const cs = Math.min(c.cs, ncol - j); for (let k = 0; k < cs; k++) used[j + k] = true; }
    }));
    const keep = []; for (let j = 0; j < ncol; j++) if (used[j]) keep.push(j);
    const keepSet = new Set(keep);
    return rows.map(r => {
      const out = [];
      for (let j = 0; j < r.length; j++) {
        if (!keepSet.has(j)) continue;
        const c = r[j];
        if (c === null) { out.push(null); continue; }
        let cs = 0; for (let k = j; k < j + c.cs; k++) if (keepSet.has(k)) cs++;
        out.push({ v: c.v, rs: c.rs, cs: Math.max(1, cs) });
      }
      return out;
    });
  };

  const renderTable = rows => {
    // 헤더 단수 = 선두의 '숫자 없는' 연속 행(다단 헤더 대응). 최소 1행.
    let headerCount = 0;
    for (const r of rows) { const cs = nonEmpty(r); if (cs.length && cs.every(c => !numRe(c.v))) headerCount++; else break; }
    if (headerCount === 0) headerCount = 1;
    const tr = (r, tag) => '<tr>' + r.map(c => {
      if (c === null) return '';                      // 병합 피복 → 스킵(HTML rowspan/colspan로 표현)
      const merged = c.rs > 1 || c.cs > 1;
      const cls = merged ? ' class="mg"' : (numRe(c.v) ? ' class="num"' : '');
      const span = (c.rs > 1 ? ` rowspan="${c.rs}"` : '') + (c.cs > 1 ? ` colspan="${c.cs}"` : '');
      return `<${tag}${cls}${span}>${escape(c.v)}</${tag}>`;
    }).join('') + '</tr>';
    const head = rows.slice(0, headerCount).map(r => tr(r, 'th')).join('');
    const body = rows.slice(headerCount).map(r => tr(r, 'td')).join('');
    return `<div class="reason-common-scroll"><table class="reason-common-table"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  };
  const renderText = (rows, isCaption) => {
    const lines = rows.map(r => r.filter(c => c && c.v !== '').map(c => c.v).join('  ')).filter(l => l !== '');
    if (!lines.length) return '';
    return `<div class="reason-common-text${isCaption ? ' reason-common-cap' : ''}">${escape(lines.join('\n'))}</div>`;
  };

  // 2) 각 영역 독립 렌더: 영역 열 정리 → 행 타입(텍스트/표) 런 분할 → 표 앞 텍스트=캡션
  const renderRegion = rowsRaw => {
    const rows = trimRegionCols(rowsRaw);
    const runs = [];
    let cur = null;
    rows.forEach(r => {
      const t = (filled(r) <= 1 || startsStar(r)) ? 'text' : 'table';
      if (!cur || cur.type !== t) { cur = { type: t, rows: [] }; runs.push(cur); }
      cur.rows.push(r);
    });
    const parts = runs.map((s, i) => {
      if (s.type === 'table') return renderTable(s.rows);
      const isCap = runs[i + 1] && runs[i + 1].type === 'table';
      return renderText(s.rows, isCap);
    }).filter(Boolean);
    if (!parts.length) return '';
    return `<div class="reason-common-region">${parts.join('')}</div>`;
  };
  const regionsHTML = regions.map(renderRegion).filter(Boolean).join('');
  return `<div class="reason-common"><div class="reason-common-title"><strong>(공통)</strong></div>${regionsHTML}</div>`;
}

// 증감사유 레이어창 — 비고 내용을 표 본문과 동일한 폰트 크기로 표시. extraHTML(공통 표)은 텍스트 하단에 부착.
function openReasonModal(text, extraHTML) {
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
  // 텍스트: HTML 이스케이프 후 (지사)/(총판)/(공통) 접두어만 볼드(개행은 white-space:pre-wrap가 렌더). extraHTML(공통 표)은 그 아래에.
  const boldText = escape(text || "").replace(/\((중고등-지사|ELT-총판|공통)\)/g, '<strong>($1)</strong>');
  modal.querySelector('.reason-modal-body').innerHTML =
    (boldText ? `<div class="reason-text">${boldText}</div>` : '') + (extraHTML || '');
  // (공통) 표가 있으면 모달 폭 확장(표 잘림 방지)
  modal.querySelector('.reason-modal-box').classList.toggle('has-common', !!extraHTML);
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

function renderTeams(sections, extraTeams) {
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

  // 마케팅전략팀·제작팀 — resolveDeptTeam이 결정한 객체(시트 연동 또는 하드코딩)를 맨 아래 순서대로 append
  (extraTeams || []).forEach(tm => { if (tm) html += renderHardcodedTeam(tm); });
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

// 동적 팀 렌더 — Code.gs teams 배열(팀명별). 각 팀은 renderHardcodedTeam으로 카드화(파트 있으면 소제목 구분).
function renderTeamsDynamic(teamCards) {
  const el = document.getElementById("teams");
  if (!el) return;
  el.innerHTML = (teamCards || []).map(renderHardcodedTeam).join("");
  el.querySelectorAll(".basis-i").forEach(b => {
    const open = () => openProgressBasis(b.dataset.task, b.dataset.pct, b.dataset.basis);
    b.addEventListener("click", open);
    b.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}

// 팀 탭 동적 생성 — .tabs-inner의 '의사결정 요청' 링크 앞에 팀명 탭 삽입(기존 동적 탭은 제거 후 재생성).
function renderTeamTabs(teamCards) {
  const inner = document.querySelector(".tabs-inner");
  if (!inner) return;
  inner.querySelectorAll("a.team-tab").forEach(a => a.remove());
  const decis = inner.querySelector('a[href="#decisions-anchor"]');
  (teamCards || []).forEach(tc => {
    const a = document.createElement("a");
    a.href = "#" + tc.id;
    a.className = "team-tab";
    a.textContent = tc.name;
    inner.insertBefore(a, decis || null);
  });
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
const DEPT_HEADERS_DEFAULT = ["업무","목적","시작일","종료일","진척율","(금주)진행사항","이슈사항","사유/해결책"];

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
const trendState = { metric: "총매출", g: "전체", ch: "전체", brand: "선택", p: "월별" };
// 지표별 기본 구분 그룹 — 출고수량은 '영어', 그 외(총매출)는 '전체'
function trendDefaultGroup(metric) { return metric === "출고수량" ? "영어" : "전체"; }

// 추세 26년 최종월(현재 진행월) 총출고 동적 오버라이드.
// 구글시트 매출현황의 행별 총출고를 그룹별로 매핑: { 전체, 영업1파트, 영업2파트, 저작권, 리플릿 }(억 단위).
// 저작권 = (마케팅전략팀) 저작권 행, 리플릿 = (제작팀) 리플릿(제작) 행. renderMonthlySales에서 설정. 없으면 trend-data.js 원본 그대로 사용.
let trendLastOverride = null;
// 진행월 컷 일자(구글시트 누적실적 헤더에서 파싱, Code.gs progressCut). 총매출 25년 동기간 컷 자동 추종용.
let trendProgressCut = null;

// 매출현황 rows(ms.rows)에서 그룹별 총출고(shipped) 추출 → 오버라이드 맵 생성.
function buildTrendOverride(rows) {
  if (!Array.isArray(rows) || !rows.length) return null;
  const ov = {};
  let partSum = 0, hasPart = false;
  rows.forEach(r => {
    const lbl = String(r && r.label != null ? r.label : "");
    const s = Number(r && r.shipped);
    if (!isFinite(s)) return;
    if (/중고등|영업\s*1\s*파트/.test(lbl))      { ov["중고등영업팀"] = s; partSum += s; hasPart = true; }  // 구 영업1파트
    else if (/ELT|영업\s*2\s*파트/.test(lbl)) { ov["ELT영업팀"] = s; partSum += s; hasPart = true; }  // 구 영업2파트
    else if (/저작권/.test(lbl))          { if (ov["저작권"] == null) ov["저작권"] = s; }
    else if (/리플릿/.test(lbl))          { if (ov["리플릿"] == null) ov["리플릿"] = s; }
    if (r && r.type === "total")          { ov["전체"] = s; }
  });
  // 합계행이 없으면 파트 합으로 전체 보정
  if (ov["전체"] == null && hasPart) ov["전체"] = partSum;
  return Object.keys(ov).length ? ov : null;
}

// 추세 지표(metric)별 설정 — 총매출(TREND_DATA, 억) / 출고수량(TREND_QTY, 만 부)
function trendCfg() {
  if (typeof TREND_QTY !== "undefined" && trendState.metric === "출고수량") {
    return {
      data: TREND_QTY, groups: ["전체", "영어", "B&G", "OUP"], div: 1000, unit: "천", override: false,
      hasChannel: true, channels: (TREND_QTY.channels || ["전체", "오프라인", "온라인"]),
      legend: '<span><b>영어</b> = 중고등+수험</span><span>오프라인=총판 · 온라인=총판 외</span>',
      titleBar: "월별 출고수량 (26 vs 25)", titleCum: "연누적 출고수량 (26 vs 25)",
    };
  }
  return {
    data: TREND_DATA, groups: ["전체", "중고등영업팀", "ELT영업팀", "저작권", "리플릿"], div: 1, unit: "억", override: true,
    legend: '<span><b>중고등영업팀</b> = 참고서(영/수/국) + 교과서 + AIDT</span><span><b>ELT영업팀</b> = B&amp;G + OUP</span>',
    titleBar: "월별 매출 (26 vs 25)", titleCum: "연누적 매출 추이 (26 vs 25)",
  };
}

// 그룹 시계열 반환. 총매출은 최신월을 시트 총출고로 교체(override), 출고수량은 원본 그대로.
// 출고수량(hasChannel)은 series[그룹][채널], 총매출은 series[그룹].
function trendSeries(group, cfg) {
  let s;
  // 출고수량·영어 + 브랜드 선택(≠'선택') → 브랜드 필터 데이터, 그 외 → 기존 group[channel]
  if (cfg.hasChannel && group === "영어" && trendState.brand && trendState.brand !== "선택" && typeof TREND_QTY_BRAND !== "undefined") {
    s = (TREND_QTY_BRAND.series[trendState.brand] || {})[trendState.ch] || {};
  } else {
    s = cfg.data.series[group] || {};
    if (cfg.hasChannel) s = s[trendState.ch] || s["전체"] || {};
  }
  const y26 = (s.y26 || []).slice();
  if (cfg.override && trendLastOverride && trendLastOverride[group] != null && y26.length) {
    y26[y26.length - 1] = trendLastOverride[group];
  }
  const y25 = (s.y25 || []).slice();
  // 25년 진행월: 시트 누적실적 일자(progressCut.day)에 맞춰 일자별 누적에서 컷 (총매출만)
  if (cfg.override && cfg.data.progressDaily25 && trendProgressCut && trendProgressCut.day && y25.length) {
    const daily = cfg.data.progressDaily25[group];
    const idx = (cfg.data.progressMonthIdx != null) ? cfg.data.progressMonthIdx : y25.length - 1;
    if (daily && idx >= 0 && idx < y25.length) {
      const v = daily[trendProgressCut.day - 1];
      if (v != null) y25[idx] = v;
    }
  }
  return { y26: y26, y25: y25 };
}

// 추세 차트 값 라벨 — 막대/라인 위에 실적 수치(억, 소수1자리) 표기. 데이터셋 색상과 동일.
const trendValueLabels = {
  id: "trendValueLabels",
  afterDatasetsDraw(chart){
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "600 10px Pretendard, system-ui, sans-serif";
    ctx.textAlign = "center";
    const ds = chart.data.datasets;
    const dcol = d => (typeof d.borderColor === "string" ? d.borderColor : null) || (typeof d.backgroundColor === "string" ? d.backgroundColor : "#243B53");
    const isLine = chart.config.type === "line";
    const m0 = chart.getDatasetMeta(0), m1 = ds.length > 1 ? chart.getDatasetMeta(1) : null;
    if (isLine && m1 && !m0.hidden && !m1.hidden) {
      // 연누적 라인: 두 선 라벨이 겹치므로 위 선=위쪽 / 아래 선=아래쪽으로 분리, 아래 라벨은 X축과 안 겹치게 clamp
      const bottom = chart.chartArea.bottom;
      const c0 = dcol(ds[0]), c1 = dcol(ds[1]);
      m0.data.forEach((e0, i) => {
        const e1 = m1.data[i]; if (!e1) return;
        const v0 = ds[0].data[i], v1 = ds[1].data[i];
        if (v0 == null || v1 == null) return;
        let up, down, uV, dV, uC, dC;
        if (e0.y <= e1.y) { up = e0; down = e1; uV = v0; dV = v1; uC = c0; dC = c1; }
        else              { up = e1; down = e0; uV = v1; dV = v0; uC = c1; dC = c0; }
        ctx.fillStyle = uC; ctx.textBaseline = "bottom"; ctx.fillText(Number(uV).toFixed(1), up.x, up.y - 6);
        ctx.fillStyle = dC; ctx.textBaseline = "top";
        ctx.fillText(Number(dV).toFixed(1), down.x, Math.min(down.y + 7, bottom - 12));
      });
    } else {
      ds.forEach((d, di) => {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        ctx.fillStyle = dcol(d); ctx.textBaseline = "bottom";
        meta.data.forEach((el, i) => {
          const v = d.data[i];
          if (v == null) return;
          ctx.fillText(Number(v).toFixed(1), el.x, el.y - 3);
        });
      });
    }
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
          ${(typeof TREND_QTY !== "undefined") ? `<div class="tseg tseg-metric tseg-nav" id="tsegM"><button type="button" data-v="총매출">총매출</button><button type="button" data-v="출고수량" class="on">출고수량</button></div>` : ""}
          <div class="tseg" id="tsegG"></div>
          <div class="tseg" id="tsegC"></div>
          <div class="tseg tseg-nav" id="tsegP"><button type="button" data-v="월별" class="on">월별</button><button type="button" data-v="연누적">연누적</button></div>
          <div class="trend-legend" id="trend-legend"></div>
        </div>
        <div class="trend-chips" id="trend-chips"></div>
        <div class="trend-cw"><canvas id="trend-cv"></canvas></div>
        <div class="trend-cap" id="trend-cap"></div>
      </div>
    </div>`;
}

// 지표(metric)에 맞춰 그룹 버튼·범례·캡션을 다시 구성(그룹 버튼은 클릭 바인딩 포함)
function renderTrendControls(exp) {
  const cfg = trendCfg();
  const g = exp.querySelector("#tsegG");
  if (g) {
    g.innerHTML = cfg.groups.map(gr => `<button type="button" data-v="${escape(gr)}"${gr === trendState.g ? ' class="on"' : ''}>${escape(gr)}</button>`).join("");
    g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      g.querySelectorAll("button").forEach(x => x.classList.remove("on")); b.classList.add("on");
      trendState.g = b.dataset.v; trendState.brand = "선택"; renderTrendControls(exp); renderTrendChips(); renderTrendChart();
    }));
  }
  // 채널 토글(출고수량 전용) — 전체/오프라인/온라인
  const ch = exp.querySelector("#tsegC");
  if (ch) {
    if (cfg.hasChannel) {
      if (cfg.channels.indexOf(trendState.ch) < 0) trendState.ch = "전체";
      ch.style.display = "";
      ch.innerHTML = cfg.channels.map(c => `<button type="button" data-v="${escape(c)}"${c === trendState.ch ? ' class="on"' : ''}>${escape(c)}</button>`).join("");
      ch.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
        ch.querySelectorAll("button").forEach(x => x.classList.remove("on")); b.classList.add("on");
        trendState.ch = b.dataset.v; renderTrendChips(); renderTrendChart();
      }));
    } else {
      ch.innerHTML = ""; ch.style.display = "none";
    }
  }
  // 우측 영역: 출고수량·영어 → 브랜드 드롭다운, 출고수량·그 외 → 비움(범례는 하단 캡션), 총매출 → 기존 범례
  const lg = exp.querySelector("#trend-legend");
  if (lg) {
    if (cfg.hasChannel && trendState.g === "영어" && typeof TREND_QTY_BRAND !== "undefined") {
      const opts = ["선택", "전체"].concat(TREND_QTY_BRAND.brands || []);
      lg.innerHTML = '<span class="trend-brand"><label for="trend-brand-sel">주요브랜드</label><select id="trend-brand-sel">'
        + opts.map(o => `<option value="${escape(o)}"${o === trendState.brand ? ' selected' : ''}>${escape(o)}</option>`).join("")
        + '</select></span>';
      const sel = lg.querySelector("#trend-brand-sel");
      if (sel) sel.addEventListener("change", () => { trendState.brand = sel.value; renderTrendChips(); renderTrendChart(); });
    } else if (cfg.hasChannel) {
      lg.innerHTML = "";
    } else {
      lg.innerHTML = cfg.legend;
    }
  }
  const cap = exp.querySelector("#trend-cap");
  if (cap) {
    const cutDay = (cfg.override && trendProgressCut && trendProgressCut.month && trendProgressCut.day)
                 ? ` (${trendProgressCut.month}월 1~${trendProgressCut.day}일 동기간)` : "";
    const extra = cfg.override ? " · 26년 최종월은 구글시트 파트별 총출고, 25년 동월은 동기간(같은 일자) 컷" + cutDay
                : (cfg.hasChannel ? " · 오프라인=총판 · 온라인=총판 외" : "");
    const base = String(cfg.data.cutNote || "") + " · 기준: " + String(cfg.data.basis || "") + extra;
    if (trendState.metric === "출고수량" && typeof QTY10_DETAIL !== "undefined") {
      // '공급율10 제외' 문구 뒤에 돋보기 → 제외 물량 월별(25 vs 26) 팝업
      cap.innerHTML = escape(base).replace("유가(공급율10%) 제외",
        '유가(공급율10%) 제외 <button class="cap-detail-btn" type="button" id="qty10-btn" aria-label="유가 제외 상세 보기" title="유가(공급율10%) 제외 상세">🔍</button>&nbsp;&nbsp;· 영어');
      const qb = cap.querySelector("#qty10-btn");
      if (qb) qb.addEventListener("click", openQty10Modal);
    } else {
      cap.textContent = base;
    }
  }
}

// 공급율10 제외 물량 월별(25 vs 26) 팝업 — 손익센터 출판사업(중고등)·납품·매출수량>0
function openQty10Modal() {
  if (typeof QTY10_DETAIL === "undefined") return;
  const q = QTY10_DETAIL, nf = n => Number(n).toLocaleString("ko-KR");
  let t25 = 0, t26 = 0, body = "";
  for (let i = 0; i < 12; i++) {
    const v25 = q.y25[i] || 0;
    const v26 = (i < (q.y26 ? q.y26.length : 0)) ? (q.y26[i] || 0) : null;
    t25 += v25; if (v26 != null) t26 += v26;
    body += `<tr><td>${i + 1}월</td><td class="num">${nf(v25)}</td><td class="num">${v26 == null ? "-" : nf(v26)}</td></tr>`;
  }
  const html = `
    <table class="q10-table">
      <thead><tr><th>월</th><th class="num">2025</th><th class="num">2026</th></tr></thead>
      <tbody>${body}</tbody>
      <tfoot><tr><td>합계</td><td class="num">${nf(t25)}</td><td class="num">${nf(t26)}</td></tr></tfoot>
    </table>
    <p class="q10-note">손익센터 출판사업(중고등) · 유가(공급율10%) · 납품·매출수량&gt;0 (출고수량 집계에서 제외한 물량, 단위: 부). 26년 7월은 7/29까지.</p>`;
  let m = document.getElementById("qty10-modal");
  if (!m) {
    m = document.createElement("div"); m.id = "qty10-modal"; m.className = "reason-modal";
    m.innerHTML = `<div class="reason-modal-backdrop"></div><div class="reason-modal-box q10-box" role="dialog" aria-modal="true" aria-label="유가(공급율-10%) 제외 상세"><div class="reason-modal-head"><span class="reason-modal-title">유가(공급율-10%) 제외 출고수량 (25 vs 26)</span><button class="reason-modal-close" type="button" aria-label="닫기">&times;</button></div><div class="reason-modal-body q10-body"></div></div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove("open");
    m.querySelector(".reason-modal-backdrop").addEventListener("click", close);
    m.querySelector(".reason-modal-close").addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
  m.querySelector(".q10-body").innerHTML = html;
  m.classList.add("open");
}

function bindTrendExpander(scope) {
  if (!trendAvailable()) return;
  const exp = scope.querySelector("#trend-exp");
  if (!exp) return;
  if (trendChart) { trendChart.destroy(); trendChart = null; }
  // 매 렌더 시 기본값 초기화. 기본 = 출고수량 / 영어 / 전체(채널) / 월별.
  trendState.metric = (typeof TREND_QTY !== "undefined") ? "출고수량" : "총매출";
  trendState.g = trendDefaultGroup(trendState.metric); trendState.ch = "전체"; trendState.brand = "선택"; trendState.p = "월별";
  let rendered = false;
  const head = exp.querySelector("#trend-head");
  const toggle = () => {
    exp.classList.toggle("open");
    head.setAttribute("aria-expanded", exp.classList.contains("open") ? "true" : "false");
    if (exp.classList.contains("open") && !rendered) { rendered = true; renderTrendControls(exp); renderTrendChips(); renderTrendChart(); }
  };
  head.addEventListener("click", toggle);
  head.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  exp.querySelectorAll("#tsegM button").forEach(b => b.addEventListener("click", () => {
    exp.querySelectorAll("#tsegM button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    trendState.metric = b.dataset.v; trendState.g = trendDefaultGroup(b.dataset.v); trendState.ch = "전체"; trendState.brand = "선택"; renderTrendControls(exp); renderTrendChips(); renderTrendChart();
  }));
  exp.querySelectorAll("#tsegP button").forEach(b => b.addEventListener("click", () => {
    exp.querySelectorAll("#tsegP button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    trendState.p = b.dataset.v; renderTrendChips(); renderTrendChart();
  }));
}

function trendChip(label, cur, prev, unit) {
  const diff = cur - prev, up = diff >= 0;
  const f1 = n => Number(n).toFixed(1);
  const body = (prev > 0)
    ? `${up ? "▲" : "▼"} ${Math.abs(diff / prev * 100).toFixed(1)}% (${f1(cur)} vs ${f1(prev)}${unit})`
    : `${up ? "▲" : "▼"} ${f1(Math.abs(diff))}${unit} (${f1(cur)} vs ${f1(prev)}${unit})`;
  return `<span class="t-chip ${up ? "up" : "down"}">${label} ${body}</span>`;
}

function renderTrendChips() {
  const el = document.getElementById("trend-chips");
  if (!el) return;
  const cfg = trendCfg();
  const { y26, y25 } = trendSeries(trendState.g, cfg);
  const div = cfg.div, sum = a => a.reduce((x, y) => x + y, 0);
  const li = cfg.data.months.length - 1;
  el.innerHTML =
    trendChip("연누적", sum(y26) / div, sum(y25) / div, cfg.unit) +
    trendChip(cfg.data.months[li], (y26[li] || 0) / div, (y25[li] || 0) / div, cfg.unit);
}

function renderTrendChart() {
  const ctx = document.getElementById("trend-cv");
  if (!ctx) return;
  const cfg = trendCfg();
  const { y26, y25 } = trendSeries(trendState.g, cfg);
  const div = cfg.div, unit = cfg.unit;
  const dv = a => a.map(v => v / div);
  const cum = a => a.reduce((acc, v, i) => (acc.push((i ? acc[i - 1] : 0) + v), acc), []);
  const f1 = n => Number(n).toFixed(1);
  // Y축 고정: '전체' 그룹(전체 채널) 최대치를 상한으로 → 그룹/채널/브랜드 선택과 무관하게 동일 축(비중을 높이로 비교). 월별/연누적 각각 별도.
  const refBase = cfg.hasChannel ? ((cfg.data.series["전체"] || {})["전체"] || {}) : (cfg.data.series["전체"] || {});
  let r26 = (refBase.y26 || []).slice();
  if (cfg.override && trendLastOverride && trendLastOverride["전체"] != null && r26.length) r26[r26.length - 1] = trendLastOverride["전체"];
  const r25 = refBase.y25 || [];
  const refMax = 1.08 * (trendState.p === "연누적"
    ? Math.max((cum(dv(r26)).slice(-1)[0]) || 0, (cum(dv(r25)).slice(-1)[0]) || 0)
    : Math.max(0, ...dv(r26), ...dv(r25)));
  // Y축 눈금 구간: 총매출=2.5억 / 출고수량=2.5만(=25천). 월별은 이 구간 유지, 눈금이 22개 초과 시(연누적 등)만 배수(×2)로 확장(2.5→5→10→20 / 25→50→100…). 최댓값은 구간 배수로 정렬.
  const baseStep = (trendState.metric === "출고수량") ? 25 : 2.5;
  let yStep = baseStep;
  while (refMax / yStep > 22) yStep *= 2;
  const yMax = Math.max(yStep, Math.ceil(refMax / yStep) * yStep);
  if (trendChart) { trendChart.destroy(); trendChart = null; }
  const opts = t => ({ responsive: true, maintainAspectRatio: false, layout: { padding: { top: 14 } },
    plugins: { title: { display: true, text: `${t} · ${trendState.g}${(cfg.hasChannel && trendState.ch !== "전체") ? " · " + trendState.ch : ""}`, color: "#243B53", font: { size: 13, weight: "600" } },
      legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: {
        mode: trendState.p === "연누적" ? "index" : "nearest",   // 연누적(라인): 같은 월의 26·25를 한 툴팁에 모두 표시
        intersect: trendState.p === "연누적" ? false : true,
        callbacks: { label: c => `${c.dataset.label} ${f1(c.parsed.y)}${unit}` } } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: yMax, ticks: { stepSize: yStep, maxTicksLimit: Math.round(yMax / yStep) + 2, callback: v => v + unit }, grid: { color: "#EDF2F7" } } } });
  if (trendState.p === "연누적") {
    trendChart = new Chart(ctx, { type: "line", data: { labels: cfg.data.months, datasets: [
      { label: "2026 누적", data: cum(dv(y26)), borderColor: "#1F5E92", backgroundColor: "#1F5E92", borderWidth: 2.5, tension: .25, pointRadius: 3 },
      { label: "2025 누적", data: cum(dv(y25)), borderColor: "#D9A325", backgroundColor: "#D9A325", borderWidth: 2, borderDash: [6, 4], tension: .25, pointRadius: 3 }] },
      options: opts(cfg.titleCum), plugins: [trendValueLabels] });
  } else {
    trendChart = new Chart(ctx, { type: "bar", data: { labels: cfg.data.months, datasets: [
      { label: "2026", data: dv(y26), backgroundColor: "#1F5E92", borderRadius: 3 },
      { label: "2025", data: dv(y25), backgroundColor: "#D9A325", borderRadius: 3 }] },
      options: opts(cfg.titleBar), plugins: [trendValueLabels] });
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
    <div class="gg-sec-h">산정 근거 &mdash; 26학년도 고2 선택과목 실적<button class="gg-pub-btn" type="button">[출원사별 점유율]</button></div>
    <table class="gg-table">
      <thead><tr><th>선택과목</th><th>출원사(전체)</th><th>NE능률</th><th>점유율</th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr><td>${escape(r.subject)}</td><td>${num(r.all)}</td><td>${num(r.ne)}</td><td>${pct(r.share)}</td></tr>`).join("")}
        <tr class="gg-tot"><td>합계</td><td>${num(baseAll)}</td><td>${num(baseNe)}</td><td>${pct(baseShare)}</td></tr>
      </tbody>
    </table>`;
  const _pb = m.querySelector(".gg-pub-btn");
  if (_pb) _pb.addEventListener("click", openGonggyoByPub);
  m.classList.add("open");
}

/* (출원사별) 26학년도 고2 선택과목 점유율 — 위 근거 팝업의 '[출원사별 점유율]' 버튼용 레이어. 데이터=gonggyo-data.js GONGGYO_BYPUB */
function openGonggyoByPub() {
  if (typeof GONGGYO_BYPUB === "undefined") return;
  const g = GONGGYO_BYPUB;
  const num = n => Number(n).toLocaleString("ko-KR");
  const pctv = v => (v * 100).toFixed(1) + "%";
  const P = g.publishers, NE = 0;   // NE능률 = 첫 열(강조)
  let m = document.getElementById("gonggyo-bypub-modal");
  if (!m) {
    m = document.createElement("div");
    m.id = "gonggyo-bypub-modal";
    m.className = "reason-modal";
    m.innerHTML = `
      <div class="reason-modal-backdrop"></div>
      <div class="reason-modal-box gg-box gg-pub-box" role="dialog" aria-modal="true" aria-label="출원사별 점유율">
        <div class="reason-modal-head"><span class="reason-modal-title"></span>
          <button class="reason-modal-close" type="button" aria-label="닫기">&times;</button></div>
        <div class="gg-body gg-pub-body"></div>
      </div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove("open");
    m.querySelector(".reason-modal-backdrop").addEventListener("click", close);
    m.querySelector(".reason-modal-close").addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
  m.querySelector(".reason-modal-title").textContent = g.title;
  const grpHead = P.map((p, i) => `<th colspan="2" class="gg-pub-grp${i === NE ? " ne" : ""}">${escape(p)}</th>`).join("");
  const subHead = P.map((_, i) => `<th class="${i === NE ? "ne" : ""}">부수</th><th class="${i === NE ? "ne" : ""}">점유율</th>`).join("");
  const cellsOf = cells => cells.map((c, i) => {
    const ne = i === NE ? " ne" : "";
    return c[0] ? `<td class="${ne}">${num(c[0])}</td><td class="${ne}">${pctv(c[1])}</td>`
                : `<td class="muted${ne}">-</td><td class="muted${ne}">-</td>`;
  }).join("");
  const body = g.subjects.map(s => `<tr><td>${escape(s.name)}</td>${cellsOf(s.cells)}<td>${num(s.total)}</td></tr>`).join("");
  const totRow = `<tr class="gg-tot"><td>${escape(g.total.name)}</td>${cellsOf(g.total.cells)}<td>${num(g.total.total)}</td></tr>`;
  m.querySelector(".gg-pub-body").innerHTML = `
    <div class="gg-sec-h">${escape(g.title)} <span class="gg-pub-cap">· 부수 / 점유율(=출원사 부수 ÷ 과목 합계)</span></div>
    <div class="gg-pub-scroll">
      <table class="gg-table gg-pub-table">
        <thead>
          <tr><th rowspan="2">(고3) 선택과목</th>${grpHead}<th rowspan="2">합계<br><span class="gg-pub-unit">(부수)</span></th></tr>
          <tr>${subHead}</tr>
        </thead>
        <tbody>${body}${totRow}</tbody>
      </table>
    </div>
    <p class="gg-pub-note">${escape(g.note)}</p>`;
  m.classList.add("open");
}