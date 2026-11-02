# Accessibility Baseline & Repository Architecture Audit

Starter monorepo for an evidence-based audit of a public-facing service website. Proposed target: [Passport Seva](https://www.passportindia.gov.in/).

**Important:** Audit is NOT STARTED. Do not claim findings or scores until personally verified.

## Boundaries
- `client/`: React UI, accessible interactions, presentation, client-side validation.
- `server/`: FastAPI routes, request validation, business logic, future persistence.
- `docs/`: audit evidence, findings, architecture decisions, screenshots.
- `tests/`: API, UI, and accessibility regression tests.

The client communicates with the server only through HTTP/JSON APIs. The server does not render or depend on React.

## Architecture tree
```text
accessibility-architecture-audit/
├── client/                 React + Vite frontend
│   └── src/                UI components and styles
├── server/                 FastAPI backend
│   └── app/                API application and routes
├── docs/                   Audit and architecture documentation
│   └── screenshots/        Lighthouse and keyboard evidence
└── tests/
    ├── client/
    └── server/
```

## Windows setup (VS Code)

Prerequisites: Node.js LTS, Python 3.11+, Git, Chrome.

### Start backend
```powershell
cd server
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```
API: http://127.0.0.1:8000/health ; docs: http://127.0.0.1:8000/docs

If PowerShell blocks activation, run:
`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### Start frontend (second terminal)
```powershell
cd client
npm install
npm run dev
```
Open the localhost URL printed by Vite (usually http://localhost:5173).

## First vertical feature slice
1. React loads and requests `GET /health`.
2. FastAPI returns `{"status":"ok"}`.
3. React displays the result in an accessible live status region.
4. `tests/server/test_health.py` verifies the API response.

## Audit workflow
1. Open Passport Seva and record the exact URL, date, browser, and viewport.
2. Chrome DevTools → Lighthouse → Accessibility → Generate report.
3. Save screenshots under `docs/screenshots/`.
4. Navigate using only Tab, Shift+Tab, Enter, Space, and arrow keys as appropriate.
5. Manually reproduce and verify each candidate issue. Lighthouse results are leads, not automatic proof of WCAG failure.
6. Document five verified findings in `docs/accessibility-audit.csv` and explain them in `docs/accessibility-audit.md`.

## Run API tests
```powershell
cd server
py -m pip install -r requirements.txt
py -m pytest ../tests/server -q
```

Frontend test runner is not configured yet; see `tests/client/README.md`.

## Publish to GitHub
```powershell
git init
git add .
git commit -m "Create accessibility audit project foundation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/accessibility-architecture-audit.git
git push -u origin main
```
Replace the remote with your own repository URL. Never commit credentials or `.env` files.
