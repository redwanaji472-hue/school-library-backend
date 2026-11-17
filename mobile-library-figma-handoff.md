# School Library Mobile — Figma handoff

## Import the visual board

Import [`mobile-library-figma.svg`](./mobile-library-figma.svg) into Figma (File → Place image, or drag the SVG onto a Figma page). The four phone artboards are arranged on one board for review. Text and vector shapes are SVG objects and can be ungrouped and adjusted. The artboard uses Arabic RTL content and sample data; the phone viewport is 370 × 790 px.

## Screens and backend mapping

| Screen | Intended content | Existing API support |
| --- | --- | --- |
| Home | Welcome, suggested books, current reading points | `GET /api/books`; `GET /api/points/balance/:studentId`; `GET /api/points/leaderboard` |
| Browse books | Search/category chips, availability, book cards | `GET /api/books`, `GET /api/books/:id`; availability inferred from book copies |
| My library | Active loans, due dates, pending reservations, cancel reservation | `GET /api/loans/active`, `GET /api/reservations`, `PATCH /api/reservations/:id/cancel` |
| Points | Balance, transaction history, reading activity submission | `GET /api/points/balance/:studentId`, `GET /api/points/student/:studentId`, `POST /api/reading-activities` |

All listed routes except login require a bearer token. Login uses `POST /api/auth/login` with `username` and `password`, returning `access_token` and a staff user/role.

## Backend gaps to resolve before a student app can use real accounts

- There is no student login or student-to-user identity link. The existing JWT belongs to a system user, while points and reservations require a separate `studentId` supplied by the caller.
- Loan, reservation, and book list endpoints return collection-level data; there is no endpoint that scopes these records to the signed-in student. Add authenticated `me` endpoints or enforce student ownership server-side before using them in the app.
- Book browse has no search or category-filter query contract. The client can filter a fetched catalogue, or the API can add query parameters.
- Loan checkout currently accepts student and book-copy QR codes, matching a librarian scanning a student and copy. A student self-checkout flow is not represented by this endpoint.
- Due-date reminders, reading goals, reward thresholds, and availability labels are presentation examples. Reminders/goals/rewards need product rules or API support; current loan data does include `dueDate` and current book data includes copies.

## Visual tokens

- Deep green: `#1D6656`
- Ink: `#183B35`
- Warm accent: `#E8AD4E`
- Canvas: `#F6F8F6`
- Card radius: 16–24 px; phone cards use generous spacing and high contrast.
- Typography: system Arabic sans-serif (Tahoma/Arial fallback); align Arabic labels right and keep numeric/date values legible.

The cover illustrations, names, dates, points, and sample student are illustrative content only.
