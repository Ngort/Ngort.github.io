# W26 planning desk

Public site: https://ngort.github.io/w26-planning/
Repository: Ngort/Ngort.github.io, branch master, directory w26-planning.

A static, dependency-free holiday comparison tool. The public dataset uses fictional example journeys from Boston to Roanoke, London and Berlin in winter 2026/27, a demonstration budget, hosted accommodation and a rabbit-care example. No sample dates, budget, invitations or work arrangements describe a confirmed personal itinerary. Actual user facts belong only in a private imported working state.

## Operate the page

1. Set budget, care mode, surcharges, contingency and any document/insurance fees. Zero document cost is a placeholder, not a statement that none apply.
2. Review the complete-itinerary cards. All cost ranges except published care unit rates are planning estimates; none is a live travel quote. A budget label is separate from host/care/transport feasibility.
3. Expand a card to edit dates and low/high costs. Transport includes bags/seat fees; daily includes food/local travel/activities; extras includes airport/final transfers, gifts/events. Keep components disjoint.
4. Record priorities, exact work calendar, host windows, rabbit coverage and journey limits below the cards. Nothing is sent to a server. Changes save in localStorage on this browser/origin, not GitHub or other devices. Opening private browsing/clearing storage can lose changes.
5. Export JSON to retain/share the working state. Export before importing another assistant’s changes. Import checks dates, IDs, nonnegative ordered ranges, care mode and settings before replacing state. Import/reset ask locally before replacement. Export files contain private answers.
6. Use “Copy LLM handoff” for a prompt containing the current state, or follow the manual/API process below. The page has no built-in chat service or automatic LLM calls.

At a tight cap, start with a local fallback and compare domestic rail versus air before international options. Use the separate Roanoke rail card to compare a long train journey against the flight card; both start with unverified allowances. Staying in Europe longer saves money only if fare reduction exceeds additional daily spending and rabbit care. Do not add two full cards to represent a combined trip: use the split or two-Europe card, or explicitly reconcile duplicated legs/care days.

## Cost arithmetic

All money is USD. For each plan:

`cash = transport + days × daily + extras + care + documents/insurance + friend subsidy`

`planning total = ceil(cash × (1 + contingency / 100))`

Days are inclusive calendar days including both departure and return, not nights. Care uses the same conservative span; extend dates or care extras for boarding dropoff, late returns or disruption. Home has no care/documents charge; daily home spending represents optional celebrations, not a travel requirement. Accommodation is zero in the demonstration; verify actual hosting and windows privately. Normal home food spending is not subtracted: these are gross cash budgets, not incremental costs. Friend's own food/local costs are excluded unless you add them to extras.

Care alternatives (never added together): boarding $30/day; two daily professional visits $60/day + $20/holiday-rated day + $15 first meeting; daily friend plus one professional visit per started week at $30–40 each, plus an optional friend thank-you. Transfer/supplies are added to each away plan. Weekly professionals require a daily carer; the confirmation box does not prove that coverage exists. Sources and availability gates are in sources.json. Work timezone overlap: Boston 9–5 is London 14–22 / Berlin 15–23 in winter. Exact employer leave/remote days cannot be calculated until its calendar and required hours are provided.

For non-USD quotes record original currency, conversion rate, date and source in the private evidence notes; convert to USD before entering costs. Compare entire quote totals, including baggage and ground access. A range crossing the chosen cap means uncertainty; low above the cap means over budget; entire range below cap means only within the *planning* budget. No label means booking-ready.

## LLM operation, any harness

Read AGENTS.md, data.json, sources.json, plan.schema.json and exported private state. Ask at most three questions per round. Never overwrite confirmed user facts with inference. Current highest-value missing inputs: top two priorities; exact employer shutdown and required meetings; daily rabbit carer/boarding availability; host date windows.

Use this prompt with ChatGPT, Claude, Codex or another harness:

> Act as a holiday feasibility consultant. Read the attached operation instructions, source ledger, seed scenarios and private working state. Use the private state for actual budget, accommodation, origin, dates and transport constraints; public defaults are fictional examples. Preserve confirmed facts. Ask at most three unresolved high-impact questions. Establish care and host coverage before treating an itinerary as feasible. Compare Boston, short Roanoke Christmas and the preferred Europe option. Do not assume NYE is cheaper. Return the COMPLETE working-state JSON conforming to plan.schema.json with every scenario ID retained. Preserve unknowns in private answer text. Put recommendations, evidence and change explanation in a SEPARATE message. Label planning estimates and actual quotes distinctly. No bookings, messages to others or executable code.

Quote evidence in the separate response must include exact dates, traveler count, airports/stations, routing and operating carrier, baggage, transfers, total/currency, search timestamp/timezone, source URL, refund terms and availability limitations. Search links are not available fares. Explain every changed component and corresponding source ID. Keep private quote evidence in the `confirmations` answer or a private companion file; sources.json is the public research ledger, not a place for personal itineraries.

### Explicit API call (optional, local only)

Requires Python 3 with standard library. No dependencies. Put the API key in `OPENAI_API_KEY` using your secret manager/environment; never commit it or paste it into the browser. Set `OPENAI_MODEL` to a model available to your account. Calls incur provider charges. The helper sends README.md, AGENTS.md, source ledger, schema, data and **your private export** to OpenAI only when explicitly run.

```sh
cd w26-planning
python3 llm_call.py /private/path/w26-private-plan.json /private/path/llm-response.txt
```

The script calls `POST https://api.openai.com/v1/responses`, requests a structured JSON working state using plan.schema.json, and writes model text to the specified private file. It never edits source or deploys. Structured output is still untrusted: validate, review the differences, then import. If the selected model does not support JSON schema responses, use the manual harness prompt instead of weakening validation. For another provider, use its own API/CLI with the same instructions, state and schema; there is no requirement to use OpenAI.

```sh
node validate-state.cjs /private/path/llm-response.txt
node check.cjs
```

The validator checks runtime invariants used by import. Review even valid output for factual accuracy, new assumptions and updated source evidence before import. Maintain a private prior export as rollback. A valid low airfare figure without dated evidence is not a quote.

## Develop and publish

No build or npm install is required. From a checkout root run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/w26-planning/ (do not open index.html through file:// because JSON fetches require HTTP). Run `node w26-planning/check.cjs` and `node --check w26-planning/app.js` before publishing. The checks exercise budget arithmetic, care alternatives, invalid imports and date boundaries. Browser testing, when available, should cover filters, cost edits, storage reload, export/import, invalid JSON and mobile widths.

To publish an update in an authenticated checkout:

```sh
git add w26-planning
git commit -m "Update winter 2026 holiday planner"
git push origin master
```

GitHub Pages must publish from master / root for the expected URL; preserve the repository’s configured source. Check Pages deployment status after pushing. No Sites hosting account, server, API keys or build service is necessary. Keep all changes in this directory; preserve unrelated site content. Initial deployment uses GitHub’s Git-data connector with a parent commit and expected-head check when shell networking is unavailable. Do not force-push over concurrent changes.

Public seed dates are illustrative windows, not booked absence dates. Keep actual addresses, caregiver identities, home-access instructions, medical documents, employer calendar details and exact confirmed absences in private exports rather than committed data. No travel is purchased, nobody is contacted, and no recurring automation is configured by this tool.
