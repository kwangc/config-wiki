# Config Wiki — 배포 (GitHub Pages / Vercel)

정적 사이트이므로 **GitHub Pages** 또는 **Vercel** 무료 플랜으로 서빙할 수 있습니다.

---

## 공통: 빌드

```bash
cd wiki-site
npm install
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다.

---

## 1. GitHub Pages

### ⚠️ "Creating Pages deployment failed" / 404가 나올 때

`actions/deploy-pages@v4` 실행 시 **404 (Not Found)** 가 나오면, 대부분 **Pages가 켜져 있지 않거나 Source가 잘못된 경우**입니다.

1. 저장소 **Settings → Pages** 로 이동:  
   `https://github.com/<owner>/<repo>/settings/pages`  
   (예: `https://github.com/kwangc/config/settings/pages`)
2. **Build and deployment** 에서:
   - **Source** 를 반드시 **GitHub Actions** 로 선택합니다.  
     ("Deploy from a branch"가 아닌 **GitHub Actions** 여야 합니다.)
3. 저장 후 워크플로를 다시 실행해 보세요.

- **비공개(Private) 저장소**인 경우: GitHub Pages 배포는 **GitHub Pro/Team/Enterprise** 플랜이 필요합니다. 공개 repo로 두거나 Vercel 등 다른 호스팅을 쓰면 됩니다.

- **`/Config/en/` 접속 시 404**: GitHub Pages URL은 **대소문자 구분**합니다. 저장소 이름이 `config`(소문자)이면 `https://kwangc.github.io/config/en/` 로 접속해야 합니다. `astro.config.mjs`의 `base`를 `'/config'`로 맞춰 두었습니다.

---

### 저장소 이름이 config / Config 인 경우 (예: kwangc/config)

1. **astro.config.mjs** 확인:
   - `base: '/config'` — GitHub Pages URL은 **대소문자 구분**하므로 저장소 이름과 동일하게 (보통 소문자)
   - `site: 'https://<당신의 GitHub 아이디>.github.io'`

2. GitHub 저장소 **Settings → Pages**:
   - **Source**: GitHub Actions
   - 또는 **Source**: Deploy from a branch → Branch: `main` (또는 `gh-pages`), Folder: `/ (root)`가 아니라 **Actions로 배포** 권장

3. **Actions로 배포** 시: `.github/workflows/deploy-wiki.yml` 사용 (아래 참고).

### 커스텀 도메인 또는 저장소 이름이 다른 경우

- `base: '/'` 로 변경 후, Pages에서 `username.github.io` **repo**를 쓰면 루트에 배포됩니다.
- 서브폴더로 배포할 때만 `base: '/폴더명'` 을 사용하세요.

### GitHub Actions 워크플로우 예시

`.github/workflows/deploy-wiki.yml`:

```yaml
name: Deploy Wiki to GitHub Pages
on:
  push:
    branches: [main]
    paths:
      - 'wiki/**'
      - 'wiki-site/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: wiki-site/package-lock.json
      - run: npm ci
        working-directory: wiki-site
      - run: npm run build
        working-directory: wiki-site
        env:
          # base가 /config 이면 이미 astro.config.mjs에 설정됨 (선택)
          # BASE_URL: /config
      - uses: actions/upload-pages-artifact@v3
        with:
          path: wiki-site/dist
      - uses: actions/deploy-pages@v4
        if: github.ref == 'refs/heads/main'
```

저장소 Settings → Pages → Build and deployment → Source: **GitHub Actions** 선택 후, 위 워크플로우가 자동으로 `dist`를 배포합니다.

---

## 2. Vercel (무료 플랜)

1. [Vercel](https://vercel.com) 로그인 후 **Add New Project** → 저장소 연결 (또는 `wiki-site` 폴더만 배포하려면 로컬에서 `vercel` CLI 사용).

2. **Root Directory**:  
   - 전체 repo를 올렸다면 `wiki-site` 로 지정.  
   - 또는 repo 루트가 `wiki-site` 라면 비워두기.

3. **Build Command**: `npm run build`  
   **Output Directory**: `dist`  
   **Install Command**: `npm install`

4. **배포 후**:  
   - Vercel은 루트 URL을 제공하므로 **astro.config.mjs**에서 `base: '/'`, `site: 'https://<프로젝트명>.vercel.app'` 로 설정하세요.  
   - 루트가 repo 전체인 경우: Project Settings → Root Directory = `wiki-site` 로 설정.

5. (선택) 커스텀 도메인: Vercel 대시보드에서 도메인 연결.

---

## News 데이터 갱신

- **수동**: `wiki-site/src/data/news.json` 을 편집 후 빌드/배포.
- **자동**: `automation/scripts/` 에서 뉴스·논문 스크래핑 후 위 JSON을 덮어쓰고, 커밋하거나 CI에서 빌드하면 사이트에 반영됩니다.

---

*마지막 업데이트: 2026-03-15*
