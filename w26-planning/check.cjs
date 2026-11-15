const assert=require('node:assert/strict'),fs=require('node:fs'),m=require('./model.js'),d=require('./data.json');
const p={budget:950,care:'boarding',careTransfer:0,holidayCareDays:2,supplementRate:40,friendCareCost:0,workStart:9,workEnd:17,leadHours:3,arrivalHours:1.5,holidayStart:'2026-12-24',holidayEnd:'2026-12-31',careConfirmed:false,jan1Off:false};
const edit=s=>({id:s.id,fareOverride:null,ground:s.ground,bagAllowance:0,bagsConfirmed:false,extraCareDays:0,quoteNotes:'',workOverrides:[]});
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
