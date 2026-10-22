# JupyterLite 알고리즘 실습실

이 디렉터리는 Next.js 블로그와 분리해서 배포하는 JupyterLite 정적 사이트입니다. Python 코드는 독자의 브라우저에서 실행되며 별도의 Python 실행 서버는 필요하지 않습니다.

## 로컬 빌드 (Windows PowerShell)

Python 3.10 이상 환경에서 실행하세요.

```powershell
cd jupyterlite
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
jupyter lite build --contents content --output-dir dist
python -m http.server 8000 --directory dist
```

브라우저에서 `http://localhost:8000/lab/index.html?path=algorithm/assign-cookies.ipynb`를 엽니다.

## Vercel 배포

1. Vercel에서 이 Git 저장소를 새 프로젝트로 가져옵니다.
2. **Root Directory**를 `jupyterlite`로 지정합니다.
3. Framework Preset을 `Other`로 설정합니다. `vercel.json`이 빌드 명령과 `dist` 출력 폴더를 지정합니다.
4. 배포 후 `https://<실습-프로젝트-주소>/lab/index.html?path=algorithm/assign-cookies.ipynb`로 Python 커널 실행을 확인합니다.
5. Next.js 블로그 Vercel 프로젝트의 환경 변수 `NEXT_PUBLIC_JUPYTERLITE_URL`에 실습 사이트의 기본 URL을 입력합니다. 예: `https://your-jupyterlite-project.vercel.app` (끝의 슬래시는 있어도 됩니다.)
6. 블로그 프로젝트를 다시 배포합니다.

## 노트북 추가

새 `.ipynb` 파일을 `content/algorithm/` 아래에 추가합니다. 블로그 게시글의 frontmatter에 다음 메타데이터를 추가하면 해당 게시글에 실습 버튼이 표시됩니다.

```yaml
notebook: "algorithm/assign-cookies.ipynb"
```

브라우저 저장소는 사이트와 브라우저에 종속되며 다른 기기와 자동 동기화되지 않습니다. 중요한 작업은 노트북 파일로 다운로드해 보관하도록 안내하세요.

## 제약 사항

- Python 커널은 Pyodide를 통해 브라우저 안에서 실행됩니다.
- 일반적인 알고리즘 연습에는 적합하지만 GPU, 임의의 시스템 명령, 네이티브 확장에 의존하는 모든 패키지가 지원되는 것은 아닙니다.
- 첫 실행 시 커널 자산을 내려받기 때문에 첫 로딩이 오래 걸릴 수 있습니다.
