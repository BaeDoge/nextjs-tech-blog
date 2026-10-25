# 함께 공부합시다

개발 과정에서 마주친 문제와 해결 방법, 알고리즘 풀이를 기록하는 한국어 기술 블로그입니다. Next.js App Router와 MDX를 기반으로 구성했으며, Vercel 배포를 지원합니다.

- **운영 사이트:** https://baejoon.vercel.app
- **콘텐츠:** 알고리즘 풀이, 개발 트러블슈팅
- **배포:** GitHub push를 통한 Vercel 자동 배포

## 주요 기능

- 반응형 블로그 메인, 카테고리 목록, 글 상세 페이지
- 카테고리별 MDX 콘텐츠 관리
- 제목, 요약, 발행일 기반 메타데이터
- 사이트 내 검색, 관련 글, 읽기 시간 표시
- canonical URL, sitemap, robots.txt, TechArticle 구조화 데이터
- 소개, 문의, 개인정보 처리방침 페이지

## 기술 스택

- Next.js App Router
- React
- MDX
- JavaScript
- Vercel

## 로컬 실행

Node.js 20 이상을 권장합니다.

```bash
npm install
```

환경 변수 파일을 만들고 사이트 URL을 설정합니다.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS / Linux:

```bash
cp .env.example .env.local
```

`.env.local`의 `NEXT_PUBLIC_SITE_URL`에 실제 운영 도메인을 입력한 뒤 실행합니다.

```bash
npm run dev
```

배포 빌드 확인:

```bash
npm run build
```

## 콘텐츠 추가

1. `content/algorithm/` 또는 `content/troubleshooting/`에 MDX 파일을 추가합니다.
2. 아래 frontmatter 형식을 사용합니다.

```yaml
---
title: "글 제목"
publishedAt: "2026-10-20"
summary: "글의 핵심 내용을 설명하는 요약"
tag: "Troubleshooting"
---
```

3. 로컬에서 빌드를 확인한 뒤 변경사항을 GitHub에 push합니다.
4. 저장소와 연결된 Vercel 프로젝트가 새 버전을 배포합니다.

## 프로젝트 구조

```text
app/                  페이지 및 라우팅
components/           공통 UI 컴포넌트
content/
  algorithm/          알고리즘 풀이
  troubleshooting/    개발 트러블슈팅
public/               정적 자산
```

## 운영 설정 확인

- `.env.local`의 사이트 URL이 실제 운영 도메인과 일치하는지 확인합니다.
- 문의 페이지의 연락처와 개인정보 처리방침을 실제 운영 방식에 맞게 유지합니다.
- 새 콘텐츠를 배포하기 전에 코드 예제, 링크, 출처와 빌드 결과를 확인합니다.

## 라이선스

저장소의 `LICENSE` 파일을 참고하세요.
