# W26: exact journeys, rabbit duty and workdays

Site: https://ngort.github.io/w26-planning/ · repository Ngort/Ngort.github.io, master, w26-planning/.

## Operate

Start in **Explore**, which shows one destination at a time. **Selected trip** contains its exact flights and full work calendar; **Care & settings** contains detailed costs, private notes, import/export and sources. The sticky navigation changes sections without a long page of all controls. Flight cards and the date matrix start collapsed; cards show three per page.

Hover/focus a colored scatter dot to inspect its information panel; click/tap it to select. There are no permanent dot labels. Color by destination/combined trip or nonstop/connecting/combined. Exact amounts and days appear in the panel. Nearby points have a small horizontal visual offset to remain selectable; the exact values are unchanged. Every card, inspected dot and selected itinerary includes a daily work/holiday timeline with a separate gold rabbit-care strip. Calendar cells expose exact dates/meaning via accessible labels and tooltips. Extra care days without dates are counted but not assigned invented calendar dates.

**Hide this option** removes an itinerary from scatter, results, selector and date-grid quotes. **Manage flights** restores individual flights; **Restore hidden flights** clears the hidden list. These view preferences persist under `w26-view-v3` in browser localStorage, separately from substantive private state. JSON exports include budgets/costs/work, not view preferences; Copy LLM handoff also includes the current hidden IDs and destination. Filtering or hiding the selected option selects the first remaining matching option; an empty result set switches to the home baseline.

**Explore Virginia + Europe** shows three combined plans and the separate adjustable $1,500 example cap (`settings.combinedBudget`). It does not change the single-trip cap. Old v2 imports gain the new cap and itinerary IDs automatically. Combined plans include Christmas Virginia + NYE London, Christmas Virginia + January London, and a two-night Virginia version + January London. They use existing saved quotes; recheck both. Each plan returns home before departing for Europe, with no same-day self-transfer. The carry-on rule applies to each separate trip: the two-night Virginia version has a personal-item baseline, while London requires a carry-on.

Combined care counts the union of actual absent Boston calendar dates, excluding fully-at-home gaps. Weekly professional supplements round up separately per continuous care interval. Paid friend care, holiday-rated days, first meeting and care-transfer inputs are whole-plan amounts; enter all necessary transfers. Additional care days increase the total and final interval's weekly supplement count but lack assigned dates. Combined remote/leave calculations include all four travel directions, and home workdays in the gap are marked home. Combined fare/ground overrides are separate from component itinerary overrides; edit the combined plan's total when source component prices change.

Choose an itinerary in the comparison or selector. The widgets show travel-plus-rabbit cost components, proportional flight/connection timelines, and each calendar day classified as holiday, weekend, remote candidate, leave/flex or home. Flight labels always show each local date/time and zone; elapsed durations use UTC offsets. Exact-date operating carriers remain unverified unless a source says otherwise. Marketing flight numbers are not proof of pet eligibility.

Public defaults are illustrative; actual budget, employer calendar, hosts and care arrangements stay in browser-local/private exported state. Import a private file to populate actual constraints. A closure is inclusive: Dec24–31 covers all eight dates in that example. Jan1 is a workday until separately marked as a confirmed employer holiday. No employer name or private answers are published.

Only these costs count: intercity fare, travel ground transfers, required baggage, rabbit care and care transfers. Meals, gifts, entertainment, ordinary living costs, accommodation, entry documents, insurance and generic contingency are excluded. Costs outside this deliberately narrow scope are not represented as zero or waived. Accommodation is assumed covered for these examples.

The carry-on rule is mandatory: a stay of **3 destination nights or more requires 1 cabin carry-on**, included in the fare or added as a verified fee. Under 3 nights, use a personal-item-only baseline. Nights run from destination-local arrival date to destination-local return departure date, not number of care days. An unknown bag allowance cannot unlock a feasible recommendation, even if a displayed subtotal is below cap. Airline all-fare cabin policies can establish inclusion when applicable to every selected carrier/segment; cite the official policy and dimensions/weight. Do not guess a domestic United Basic Economy carry-on surcharge: a different fare may be required.

Each complete fare is a saved quote for one adult economy, not guaranteed current availability. Quoted totals are Axel-exclusive; any airline comparison is the provider's reported Google Flights comparison, not independently checked. Cached date pages often show much lower prices: they are not used as current quotes. Recheck the exact selected itinerary and fare rules before purchase. No booking or contact occurs in this app.

Expand travel costs to enter a verified manual fare override, transfer low/high range and required bag charge, and record evidence. Ground transfers are planning allowances, not quotes. A $0 bag input with an unchecked requirement means unresolved, not free. The chart remains a provisional subtotal until baggage and daily care are confirmed. Only one complete itinerary is selected: the cap covers the entire choice, never each leg separately. Combined examples sum two complete saved return quotes with a return home through Boston; they are separate bookings, not a newly quoted protected multi-city fare.

Care counts all home-time calendar dates from the pre-airport departure buffer through arrival-home buffer, plus extra care days. A 23:59 Boston landing with a 1.5h home buffer needs coverage into the next day. Boarding is published $30/calendar day subject to availability. Two professional visits/day cost $60/day + $20 per holiday-rated day + $15 first meeting. Daily friend care plus a weekly professional supplement charges one visit per started week at the entered rate, plus any actual paid friend-care amount. Weekly professional visits alone are insufficient. Ordinary rabbit food/litter used at home is excluded. Airport/boarding transfers are separate actual trip costs.

Work uses Monday–Friday and the entered Boston work window, winter EST. Travel blocks run from first departure minus the pre-airport buffer to last arrival plus the arrival buffer, including every connection. Any overlap with a work window suggests one leave/flex day; other away workdays are remote candidates. No partial-day payroll claim is made. You can assign remote/leave manually; a remote override during travel retains a warning. Remote work is not assumed possible on a flight. A late-night arrival home before the following work window does not create an extra remote day. London is +5h and Berlin +6h in winter. Required meetings, international remote-work permission and recovery days remain user decisions.

## Portable state and LLM handoff

Use Export private JSON before importing/replacing state. State saves on this browser/origin only, not GitHub, cloud sync or other devices. Exports include private answers. The page never calls an LLM automatically. Copy LLM handoff contains the current state; or use this provider-neutral prompt:

> Read README.md, AGENTS.md, data.json, sources.json, plan.schema.json and the private working state. Preserve confirmed user facts. Scope is travel + rabbit only. Require one carry-on for at least 3 destination nights; under 3 nights, personal-item baseline. Respect the private budget and closure dates; Jan1 is separate. Return a COMPLETE v2 state with all scenario IDs. Keep recommendations/evidence separate. Research exact whole itineraries, linked fares and timestamped segments; never join a price to unrelated flights. Bag inclusion/fee and daily care are feasibility gates. Ask at most three high-impact questions. No bookings or contacts.

For quote research record: source URL, retrieval UTC time, quote time, traveler count/cabin, complete outbound and return, marketing and operating carriers, local ISO timestamps with UTC offsets, connections, taxes, total currency, baggage dimensions/weight/fees, and change/refund terms. Unknowns remain explicit. For non-USD fares record conversion rate/date/source before entering USD. New flight/date proposals require reviewed data.json updates; a state-only fare override does not change flight dates or source quote status. Explain every override in quoteNotes.

Version1 imports migrate the budget, care mode and private notes into v2. Old daily/gift/extras/contingency costs, old trip dates and fare allowances are discarded because the v2 options are specific researched itineraries. Review closure and work assumptions after migration. The original v1 localStorage remains untouched for rollback; v2 saves separately.

### Explicit local LLM API call

Requires Python3, no packages. Use environment credentials from a secret manager; never put a key in source/browser/storage. Set OPENAI_API_KEY and OPENAI_MODEL to an available model. This optional command sends instructions, public data/schema and the private input to OpenAI and may incur charges:

```sh
cd w26-planning
python3 llm_call.py /private/path/input-v2.json /private/path/model-output.json
node validate-state.cjs /private/path/model-output.json
```

The helper calls POST https://api.openai.com/v1/responses with store:false and strict JSON-schema text format, then writes a new private output file. It never edits source, imports state or publishes. The API call has no browsing tools: it cannot refresh fares and must preserve quote evidence instead of inventing new results. For another provider/harness, use its API or CLI with the same prompt/schema/state. Review changes and validate before importing. The site supports JSON import, not executable model code.

## Development and publishing

No dependencies or build required. Serve a repository checkout root:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/w26-planning/; file:// cannot fetch JSON. Run:

```sh
node w26-planning/check.cjs
node --check w26-planning/app.js
node --check w26-planning/model.js
```

Checks cover travel-only arithmetic, time offsets, midnight care, inclusive closure, separate Jan1 handling, work conflicts, carry-on at the 2/3-night boundary, bag fees, and invalid imports. When browser tools are available test selecting plans, updating closure/care inputs, remote overrides, export/import and mobile widths. Without visual inspection, report that limit.

Publish only this directory, preserving unrelated site files:

```sh
git add w26-planning
git commit -m "Update exact holiday itineraries and cost/time widgets"
git push origin master
```

GitHub Pages deploys master/root. Check its workflow status and live assets. With connector Git APIs, use the current parent/base tree and an expected-head check; never force over concurrent edits. Keep actual private budgets, employer details, host identities, home-access instructions and confirmed absences in private exports, not public source.

## Flexible flight panel

Filter destination, earliest outbound date, latest arrival home, holiday nights, maximum stops and workday limits. Christmas/NYE filters require arrival by that local date and return departure after that date, so the night is included; they do not promise a whole day at destination. Select any result, date-grid price or chart button as the comparison baseline. Each row shows exact marketing flight numbers, local times, elapsed time, connections, airfare, travel-plus-care range, baggage status and remote/leave counts. Savings compare matching lower/upper transfer estimates, not guaranteed savings. Unknown baggage and unconfirmed care remain explicit even if the provisional subtotal fits the cap.

The budget and care controls at the top recalculate all results. For a money/time tradeoff choose “My money/time preference” and enter how much avoiding a remote or leave day is worth to you. This score changes ranking only, never cash costs. The chart can plot remote, leave or combined days; select a point to inspect it. Workday calendar overrides below update the panel and chart. Chart positions use lower transfer estimates; full ranges remain visible in rows. Filters/ranking preferences are session view controls; exported state preserves substantive budget/care/work and itinerary edits.

The date matrix shows only saved, complete, one-adult round-trip quotes. It shows source airfare, before care/transfers and any unverified baggage, rather than manual fare overrides. A Search cell opens an exact-date Google Flights query; it is unsearched, not unavailable. Quotes are a researched shortlist, not exhaustive live inventory. Current expansion includes earlier December departures and January returns, with post-holiday trips clearly labeled. The observed $400–$500 Roanoke United quotes still need cabin-bag verification for longer stays. No matching $400–$500 Europe round trip has been independently reproduced; cached teaser prices are not promoted into selectable quotes.

Existing v2 browser/import state automatically gains newly researched itinerary IDs while preserving edits for existing IDs. Export after loading the expanded data to generate a complete current schema. Private import remains necessary to carry actual personal constraints across devices. Source links preserve fare selections where the provider exposes them. Refresh quotes before relying on availability.

## Rail coverage and missing fares

The Explore view visibly includes a train alternative when viewing Virginia, combined trips, or all destinations. `data.json.railResearch` records attempted dates, sources and retrieval limitations. No date-matched December rail price was retrieved; generic route averages and November timetable examples must not be presented as Christmas quotes or used to conclude that flying is cheaper. Dated Wanderu HTTP requests were forbidden; the accessible Amtrak booking page exposed an application shell, not selected fares. Recheck official one-adult coach BOS/BBY–RNK departures Dec23/24 and return Dec26/28. A new selectable train option requires both exact schedules and fee-inclusive dated prices; preserve explicit source/check time and the railway baggage policy. Amtrak Wi-Fi is not assumed to make a whole travel workday remotely workable.
