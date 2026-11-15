const assert=require('node:assert/strict'),fs=require('node:fs'),m=require('./model.js'),d=require('./data.json');
const p={budget:950,combinedBudget:1500,care:'boarding',careTransfer:0,holidayCareDays:2,supplementRate:40,friendCareCost:0,workStart:9,workEnd:17,leadHours:3,arrivalHours:1.5,holidayStart:'2026-12-24',holidayEnd:'2026-12-31',careConfirmed:false,jan1Off:false};
const edit=s=>({id:s.id,fareOverride:null,ground:s.ground,bagAllowance:0,petExtras:0,petLogisticsConfirmed:false,bagsConfirmed:false,extraCareDays:0,quoteNotes:'',workOverrides:[]});
const roa=d.scenarios.find(s=>s.id==='roa28');let r=m.calculate(roa,p,edit(roa));
assert.deepEqual(r.total,[649,739]);assert.equal(r.careDays,6);assert.equal(r.careEnd,'2026-12-29');assert.equal(r.remote,0);assert.equal(r.leave,0);assert.equal(r.nights,4);assert(r.carryOnRequired);assert(!r.bagRequirementVerified);
r=m.calculate(roa,{...p,arrivalHours:0},edit(roa));assert.equal(r.careDays,5);
const london=d.scenarios.find(s=>s.id==='lon-n');r=m.calculate(london,p,edit(london));assert.equal(r.remote,2);assert.equal(r.leave,1);assert(r.work.find(x=>x.date==='2027-01-01').kind==='remote');
r=m.calculate(london,{...p,jan1Off:true},edit(london));assert.equal(r.remote,1);assert.equal(r.leave,1);
const berlin=d.scenarios.find(s=>s.id==='ber-n');r=m.calculate(berlin,p,edit(berlin));assert.equal(r.careDays,10);assert.equal(r.work.find(x=>x.date==='2027-01-06').kind,'home');
const early=d.scenarios.find(s=>s.id==='roa23');assert.equal(m.calculate(early,p,edit(early)).leave,1);
r=m.calculate(roa,{...p,care:'friend'},edit(roa));assert.equal(r.care,40);
r=m.calculate(roa,{...p,care:'visits'},edit(roa));assert.equal(r.care,415);
const short=JSON.parse(JSON.stringify(roa));short.inbound.forEach(x=>{x.departure=x.departure.replace('2026-12-28','2026-12-26');x.arrival=x.arrival.replace('2026-12-28','2026-12-26');});assert.equal(m.nights(short),2);assert(!m.calculate(short,p,edit(short)).carryOnRequired);
const three=JSON.parse(JSON.stringify(short));three.inbound.forEach(x=>{x.departure=x.departure.replace('2026-12-26','2026-12-27');x.arrival=x.arrival.replace('2026-12-26','2026-12-27');});assert(m.calculate(three,p,edit(three)).carryOnRequired);
const paid={...edit(roa),bagAllowance:70,bagsConfirmed:true};r=m.calculate(roa,p,paid);assert.equal(r.total[0],719);assert(r.bagRequirementVerified);
const v={schemaVersion:2,updatedAt:'2026-11-15T00:00:00Z',selected:'roa28',settings:p,answers:{priorities:'',work:'',confirmations:'',limits:''},scenarios:d.scenarios.map(edit)},ids=d.scenarios.map(x=>x.id);m.validate(v,ids);
for(const change of [x=>x.scenarios.pop(),x=>x.scenarios[0].ground=[100,10],x=>x.settings.holidayStart='2026-02-30',x=>x.settings.workEnd=8,x=>x.scenarios[0].bagAllowance=-5]){const t=JSON.parse(JSON.stringify(v));change(t);assert.throws(()=>m.validate(t,ids));}
for(const s of d.scenarios){const c=m.calculate(s,p,edit(s));if(c.total)assert(c.total[0]<=c.total[1]);for(const legs of [s.outbound,s.inbound])for(let i=0;i<legs.length;i++){assert(Date.parse(legs[i].arrival)>Date.parse(legs[i].departure));if(i)assert(Date.parse(legs[i].departure)>Date.parse(legs[i-1].arrival));}}
for(const f of ['data.json','sources.json','plan.schema.json'])JSON.parse(fs.readFileSync(__dirname+'/'+f));console.log('Passed: travel-only sums, midnight care, closure/Jan1, remote/leave conflicts, two/three-night baggage boundary, fees and invalid state.');

// Combined journeys charge only actual absence days, retaining home gaps in work.
function combo(a,b){return{id:'test-combo',trips:[a,b],outbound:a.outbound,inbound:b.inbound,fare:a.fare+b.fare,ground:a.ground.map((g,i)=>g+b.ground[i])};}
const byId=id=>d.scenarios.find(s=>s.id===id);
const firstCombo=combo(byId('roa-aa'),byId('lon-dec30-jan7'));
r=m.calculate(firstCombo,p,edit(firstCombo));
assert.equal(r.nights,11);assert.equal(r.careDays,14);assert.equal(r.care,420);
assert.equal(r.leave,1);assert.equal(r.remote,4);assert.equal(m.travelBlocks(firstCombo,p).length,4);
assert.deepEqual(r.careIntervals,[{start:'2026-12-24',end:'2026-12-28',days:5},{start:'2026-12-30',end:'2027-01-07',days:9}]);
assert(!m.span(firstCombo,p).includes('2026-12-29'));
assert.equal(r.work.find(x=>x.date==='2026-12-29').conflict,false);
assert.deepEqual(r.total,[2007,2157]);
assert.equal(m.calculate(firstCombo,{...p,budget:9999,combinedBudget:1500},edit(firstCombo)).status,'Over cap');
assert.equal(m.calculate(firstCombo,{...p,budget:1,combinedBudget:9999},edit(firstCombo)).status,'Within cap provisionally');
r=m.calculate(firstCombo,{...p,care:'friend',friendCareCost:25,careTransfer:10},edit(firstCombo));
assert.equal(r.care,155); // ceil(5/7)+ceil(9/7) supplements, one friend fee + transfer.
const secondCombo=combo(byId('roa-short26'),byId('lon-post-holiday'));
r=m.calculate(secondCombo,p,edit(secondCombo));
assert.equal(r.nights,9);assert.equal(r.careDays,13);assert.equal(r.care,390);
assert.equal(r.work.find(x=>x.date==='2027-01-01').kind,'home');
assert.equal(r.work.find(x=>x.date==='2026-12-29').kind,'holiday');
assert.equal(r.work.find(x=>x.date==='2027-01-04').kind,'leave');
assert.equal(r.careIntervals.length,2);assert.equal(r.careIntervals[0].end,'2026-12-27');
assert.equal(r.remote,5);assert.equal(r.leave,2);
r=m.calculate(secondCombo,{...p,care:'friend',friendCareCost:20,careTransfer:12},edit(secondCombo));assert.equal(r.care,152);
// Two short components do not require a cabin bag merely because summed nights >=3.
const shortPair=combo(short,short);assert.equal(m.nights(shortPair),4);assert(!m.calculate(shortPair,p,edit(shortPair)).carryOnRequired);
assert.equal(m.calculate(shortPair,p,edit(shortPair)).careDays,m.calculate(short,p,edit(short)).careDays);
const overridden={...edit(secondCombo),workOverrides:[{date:'2027-01-01',kind:'leave'}]};assert.equal(m.calculate(secondCombo,p,overridden).work.find(x=>x.date==='2027-01-01').kind,'leave');
for(const combinedBudget of [-1,Infinity,'1500',undefined]){const bad=JSON.parse(JSON.stringify(v));bad.settings.combinedBudget=combinedBudget;assert.throws(()=>m.validate(bad,ids));}
console.log('Passed: combined itinerary care intervals, home gaps, weekly rounding, work conflicts, component bag rules and separate combined budget.');
const homePlan=d.scenarios.find(s=>s.id==='home');r=m.calculate(homePlan,p,edit(homePlan));assert.deepEqual(r.total,[0,0]);assert.equal(r.careDays,0);assert.equal(r.remote,0);assert.equal(r.leave,0);assert(r.work.some(day=>day.date==='2026-12-25'&&day.kind==='holiday'));assert(r.work.some(day=>day.date==='2027-01-01'&&day.kind==='home'));
const freePrefs={...p,care:'free',careTransfer:80,friendCareCost:120,supplementRate:55};r=m.calculate(london,freePrefs,edit(london));assert.equal(r.care,0);assert(r.careDays>0);assert.deepEqual(r.total,london.ground.map(g=>london.fare+g));assert.equal(freePrefs.careConfirmed,false);m.validate({...v,settings:freePrefs},ids);
console.log('Passed: Boston Christmas home baseline and zero-cost daily care without erasing coverage days.');

// Rabbit accompanies its owner on an explicit domestic pet itinerary. The
// human work/travel timeline remains intact; boarding and sitter charges do not.
const petFixture={...JSON.parse(JSON.stringify(early)),id:'pet-fixture',fare:566,ground:[0,0],groundStatus:'unpriced_pet_transfer',petTravel:{fee:298}};
const petEdit={...edit(petFixture),extraCareDays:3};
for(const care of ['boarding','visits','friend','free']){
 const prefs={...p,care,careTransfer:90,friendCareCost:110};
 r=m.calculate(petFixture,prefs,petEdit);
 assert.equal(r.rabbitWithOwner,true);assert.equal(r.careDays,0);assert.equal(r.care,0);
 assert.equal(r.petFee,298);assert.equal(r.petExtras,0);assert(r.petLogisticsPending);
 assert.deepEqual(r.careIntervals,[]);assert.equal(r.careStart,null);assert.equal(r.careEnd,null);
 assert.deepEqual(r.total,[864,864]);assert.equal(r.status,'Pet logistics unresolved');
 assert.equal(r.leave,m.calculate(early,p,edit(early)).leave);
 assert.deepEqual(r.work,m.calculate(early,p,edit(early)).work);
 assert(m.span(petFixture,prefs).length>0);
}
r=m.calculate(petFixture,p,{...petEdit,ground:[180,240],petExtras:85,bagAllowance:30,petLogisticsConfirmed:true});
assert.deepEqual(r.total,[1159,1219]);assert.equal(r.petExtras,85);assert.equal(r.petLogisticsPending,false);assert.equal(r.status,'Over cap');
assert.deepEqual(m.calculate(petFixture,p,{...petEdit,fareOverride:600}).total,[898,898]);
r=m.calculate(london,p,edit(london));assert(!r.rabbitWithOwner);assert.equal(r.petFee,0);assert.equal(r.petExtras,0);assert(!r.petLogisticsPending);assert(r.care>0);assert(r.careDays>0);
r=m.calculate(firstCombo,p,edit(firstCombo));assert(!r.rabbitWithOwner);assert.equal(r.care,420);
for(const change of [e=>delete e.petExtras,e=>e.petExtras=-1,e=>e.petExtras=Infinity,e=>e.petExtras='20',e=>delete e.petLogisticsConfirmed,e=>e.petLogisticsConfirmed='yes']){const bad=JSON.parse(JSON.stringify(v));change(bad.scenarios[0]);assert.throws(()=>m.validate(bad,ids));}
console.log('Passed: explicit rabbit-with-owner trip fees, unresolved logistics, owner workdays, no sitter charges, and strict pet inputs.');
