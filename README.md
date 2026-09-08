# 나의 드라마

중국 · 일본 · 한국 드라마를 나라별로 기록하는, 한 사람을 위한 모바일 웹사이트.
휴대폰 홈 화면에 앱처럼 추가해서 쓸 수 있습니다.

```
index.html       홈 (세 나라 선택)
cn.html          중국 드라마
jp.html          일본 드라마
kr.html          한국 드라마
css/base.css     공용 레이아웃 (모바일 기준)
css/cn|jp|kr.css 나라별 색
js/pwa.js        글꼴 확대 방지 + 홈 화면 추가(서비스워커) 등록
js/scenes.js     나라별 장면 그림 (단색 SVG)
js/config.js     Supabase 키 (여기만 채우면 됨)
js/app.js        기능 전체
sw.js            오프라인 캐시
manifest.json    홈 화면 앱 정보 (이름, 아이콘, 색)
icons/           앱 아이콘
supabase.sql     DB 만들기 SQL
```

기능: 포스터 업로드(자동 리사이즈), 제목/원제, 시청 상태(보는 중·완주·찜·중단), 몇 화까지 봤는지(진행바),
줄거리, 후기, 반 개 단위 별점, 태그, 시작일·완주일, 명대사·장면 메모, 검색·정렬·태그 필터, 통계, JSON 내보내기.

---

## 1. Supabase 준비 (10분)

1. https://supabase.com 에서 **New project** 생성 (무료). Region은 Northeast Asia (Seoul/Tokyo) 추천.
2. 왼쪽 **SQL Editor → New query** 에 `supabase.sql` 내용 전체를 붙여넣고 **Run**.
   → `dramas` 테이블, 보안 정책(RLS), `posters` 스토리지 버킷이 만들어져요.
3. **Authentication → Users → Add user → Create new user** 로 본인 이메일 계정 하나 생성 (비밀번호는 비워도 됨).
   (Auto Confirm User 체크)
4. **Authentication → Sign In / Providers → Email** 에서 **Allow new users to sign up** 을 **끄기**.
   → 이제 나 말고는 아무도 가입/저장할 수 없어요.
5. **Project Settings → API** 에서 `Project URL` 과 `anon public` 키를 복사해서 `js/config.js` 에 붙여넣기:

```js
window.SHELF_CONFIG = {
  SUPABASE_URL: "https://xxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi...",
};
```

> anon 키는 공개돼도 괜찮아요. RLS 정책 때문에 로그인한 본인 데이터만 읽고 쓸 수 있습니다.

## 2. GitHub Pages 배포

1. 새 저장소 만들고 이 폴더 전체를 push.
2. **Settings → Pages → Source: Deploy from a branch → main / (root)** → Save.
3. 1~2분 뒤 `https://아이디.github.io/저장소이름/` 에서 열림.

## 3. 휴대폰 홈 화면에 추가 (갤럭시)

- **삼성 인터넷**: 주소를 연 뒤 메뉴(≡) → **현재 페이지 추가** → **홈 화면**.
- **Chrome**: 메뉴(⋮) → **홈 화면에 추가** (또는 "앱 설치").
- 카카오톡으로 링크를 받았다면 오른쪽 위 메뉴 → **다른 브라우저로 열기** 후 위처럼 추가.
- 추가하면 주소창 없이 앱처럼 열리고, 아이콘은 `icons/` 폴더의 그림이 쓰여요.
- https 주소여야 합니다 (GitHub Pages는 기본 https).

## 4. 사용

- 처음 열면 로그인 화면 → 이메일 입력 → 메일로 온 링크 누르기. 비밀번호는 없습니다.
- 무료 요금제의 기본 메일은 1시간에 2통까지만 보내지므로, 한 번 로그인하면 그 브라우저에서는 계속 유지됩니다. 홈 화면에 추가하기 전에 먼저 로그인해 두세요.
- `+ 추가` → 포스터 탭해서 선택 → 정보 입력 → 저장.
- 카드 탭 → 상세 보기 / 수정 / 삭제.
- 상태를 "완주"로 바꾸면 완주일이 오늘로 자동 입력돼요.

## 미리보기 모드

`config.js` 를 채우기 전에는 화면 아래에 "미리보기 모드"라고 뜨고 데이터가 **이 기기 브라우저에만** 저장돼요.
로컬에서 디자인만 먼저 보고 싶을 때 쓰세요. (`python3 -m http.server` 등으로 열기)

## 글꼴 확대 방지

카카오톡 인앱 브라우저나 휴대폰 "글자 크기" 설정 때문에 글씨가 커지는 것을 `js/pwa.js` 가 상쇄합니다.
두 손가락 확대도 꺼져 있습니다 (`viewport` 의 `maximum-scale=1, user-scalable=no`).

## 커스터마이즈

- 색: `css/cn.css`, `jp.css`, `kr.css` 의 `:root` 변수만 바꾸면 전체가 바뀜.
- 앱 이름·아이콘: `manifest.json`, `icons/`.
- 상태 종류·정렬 종류 추가: `js/app.js` 맨 위 `STATUS`, `SORTS`.
