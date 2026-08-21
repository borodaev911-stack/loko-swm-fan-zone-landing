# Event Privacy Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a concise policy that accurately describes personal-data processing for the FC Lokomotiv × SWM fan-zone event.

**Architecture:** Add a standalone static policy page under Vite's `public/` directory so it is emitted as `/privacy-policy.html` without changing the landing bundle. The existing footer link already targets that URL and therefore remains unchanged.

**Tech Stack:** Static HTML and CSS; Vite 5 public-directory copy.

## Global Constraints

- Operator: ООО «АСЦ», ОГРН 1257700197974, ИНН 7743470305, 125080, г. Москва, Волоколамское ш., д. 1, стр. 1, помещ. 55/8; `info@ascauto.ru` is the address for data-subject requests.
- The event collects only first name, last name, and telephone number through Telegram and MAX bots.
- Data purposes are registration, event participation, QR-code issuance, points accounting, awarding prizes, and communications about participation; do not add advertising purposes, cookies, analytics, employment, insurance, biometric data, or other unconfirmed processing.
- Personal data are kept indefinitely, until consent is withdrawn when further processing has no lawful basis.
- Identifiable photo and video may be published on this website and in the event's Telegram or MAX channels only under a separate consent for dissemination; ordinary registration consent does not cover publication.

---

### Task 1: Publish the scoped policy page

**Files:**

- Create: `landing-react/public/privacy-policy.html`
- Test: `landing-react/dist/privacy-policy.html`

**Interfaces:**

- Consumes: the existing footer URL `/privacy-policy.html` in `landing-react/src/App.jsx`.
- Produces: a self-contained UTF-8 HTML document with the title `Политика обработки персональных данных`.

- [x] **Step 1: Add the policy document**

Create `landing-react/public/privacy-policy.html`. It must identify the operator and contact details above; state the three collected fields, the five documented event purposes, consent as the legal basis, automated processing, indefinite storage subject to consent withdrawal and applicable law, data-subject rights, and the separate-consent requirement for publication of identifiable photo or video on the website or in Telegram/MAX.

- [x] **Step 2: Verify the production artifact**

Run:

```bash
cd landing-react
npm run build
test -f dist/privacy-policy.html
rg -q 'ООО «АСЦ»' dist/privacy-policy.html
rg -q 'Фамилия, имя, номер телефона' dist/privacy-policy.html
rg -q 'отдельного согласия' dist/privacy-policy.html
```

Expected: Vite completes successfully and all four checks return exit code 0.

## Self-Review

- Spec coverage: the plan gives the operator, documented fields, purposes, retention, rights contact, and photo/video dissemination rule; it deliberately excludes unconfirmed processing.
- Placeholder scan: the policy uses only confirmed facts and the official operator contact details, with no fields requiring later completion.
- Type consistency: the public file path emits exactly the footer's existing `/privacy-policy.html` URL.
