# Dev Notes — MDX 기술 블로그 스타터

Next.js App Router + MDX로 만든 한국어 기술 블로그입니다. Vercel 배포를 기준으로 구성했습니다.

## 포함 기능

- 반응형 메인, 카테고리 목록, 글 상세 페이지
- `content/algorithm/*.mdx`, `content/troubleshooting/*.mdx` 파일 자동 로딩
- 제목/요약/날짜 기반 메타데이터 및 canonical URL
- 자동 `sitemap.xml`, `robots.txt`, TechArticle JSON-LD
- 사이트 내 검색, 관련 글, 읽기 시간 표시
- AdSense 승인 후 연결할 광고 슬롯 자리표시자
- 소개, 문의, 개인정보 처리방침 기본 페이지

## 실행 방법

Node.js 20 이상 권장.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell에서는 `Copy-Item .env.example .env.local`을 사용하세요. `.env.local`의 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정합니다.

## 새 글 발행

1. `content/algorithm/` 또는 `content/troubleshooting/`에 `.mdx` 파일을 추가합니다.
2. 아래 frontmatter 형식을 유지합니다.

```yaml
---
title: "글 제목"
publishedAt: "2026-10-20"
summary: "검색 결과와 목록에 노출할 구체적인 요약"
tag: "Troubleshooting"
---
```

3. `npm run build`로 빌드를 확인하고 GitHub에 push하면 Vercel이 재배포합니다.

## 배포 전 꼭 바꿀 항목

- `.env.local`의 사이트 도메인
- `Dev Notes` 브랜딩/사이트 이름
- `app/contact/page.js`, `app/privacy/page.js`의 운영자 이메일 및 실제 정책
- 광고 승인 후 `components/AdSlot.js`를 실제 AdSense 광고 코드로 교체
- Google Search Console에 사이트 등록 후 sitemap 제출

## 광고 관련 주의

현재 광고 박스는 레이아웃 확인용 자리표시자이며 광고를 실제로 송출하지 않습니다. AdSense 승인 전에는 광고 스크립트를 임의로 넣지 말고, 승인 후 발급받은 publisher ID와 광고 단위 코드를 적용하세요. 콘텐츠는 자동 생성만으로 대량 발행하기보다 정확성, 독창성, 코드 실행 여부, 출처를 확인한 후 발행하는 것을 권장합니다. 광고 승인은 보장되지 않습니다.

## MDX 보안

MDX는 JSX를 포함할 수 있으므로 신뢰할 수 있는 작성자가 만든 파일만 저장소에 추가하세요. 외부 사용자가 임의로 제출한 MDX를 검증 없이 빌드/렌더링하지 마세요.
