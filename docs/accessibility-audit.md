# Accessibility Audit Report

**Target:** Passport Seva — https://www.passportindia.gov.in/  
**Audit date:** TO BE RECORDED  
**Auditor:** TO BE RECORDED  
**Status:** NOT STARTED

## Method
1. Record the exact URL, date, browser, and viewport.
2. Run Chrome Lighthouse with Accessibility selected.
3. Save screenshots in `docs/screenshots/`.
4. Perform a keyboard-only pass with Tab, Shift+Tab, Enter, Space, and arrow keys where applicable.
5. Manually reproduce each candidate issue and verify the applicable WCAG criterion.
6. Add five verified issues to `accessibility-audit.csv`.

## For each finding, record
- Exact page/component and reproducible steps.
- Screenshot or Lighthouse evidence filename.
- WCAG success criterion and why it applies.
- Affected users and the barrier they encounter.
- Smallest testable remediation.
- Severity, owner, and status.

## Evidence checklist
- [ ] Lighthouse screenshot saved
- [ ] Exact URL and date recorded
- [ ] Keyboard focus order checked
- [ ] Visible focus indicator checked
- [ ] Interactive controls usable without a mouse
- [ ] Form labels and validation messages checked
- [ ] Five findings manually verified
