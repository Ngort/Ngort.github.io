const assert=require('node:assert/strict');const fs=require('node:fs');const m=require('./model.js');const d=require('./data.json');const p={budget:950,care:'boarding',careExtras:60,holidayDays:2,thankyou:0,contingency:15,documents:0,subsidy:0,careConfirmed:false};
assert.equal(m.days('2026-12-28','2027-01-06'),10);
assert.throws(()=>m.days('2027-01-06','2026-12-28'));
const roa=d.scenarios.find(s=>s.id==='roa-x');let r=m.calculate(roa,p);
assert.deepEqual(r.rows[3][1],[270,270]);assert.deepEqual(r.total,[880,1737]);assert.equal(r.status,'Budget uncertain');
r=m.calculate(roa,{...p,care:'visits'});assert.deepEqual(r.rows[3][1],[535,535]);
r=m.calculate({...roa,end:'2026-12-29'},{...p,care:'friend',thankyou:20});assert.deepEqual(r.rows[3][1],[140,160]);
const home=m.calculate(d.scenarios[0],p);assert.deepEqual(home.rows[3][1],[0,0]);
const friend=m.calculate(d.scenarios.find(s=>s.id==='lon-f'),{...p,subsidy:50});assert.deepEqual(friend.rows[5][1],[75,200]);
const state={schemaVersion:1,updatedAt:'2026-11-15T00:00:00Z',settings:p,answers:{priorities:'',work:'',confirmations:'',limits:''},scenarios:d.scenarios.map(s=>({id:s.id,start:s.start,end:s.end,transport:s.transport,daily:s.daily,extras:s.extras}))};const ids=d.scenarios.map(s=>s.id);assert.equal(m.validate(state,ids),state);
for(const mutate of [v=>v.scenarios.pop(),v=>v.scenarios[0].transport=[10,1],v=>v.scenarios[0].start='2026-02-30',v=>v.settings.budget=-1,v=>v.settings.care='weekly-only',v=>v.settings.careConfirmed='yes',v=>v.scenarios[1].id='home']){const v=JSON.parse(JSON.stringify(state));mutate(v);assert.throws(()=>m.validate(v,ids));}
for(const s of d.scenarios){const c=m.calculate(s,p);assert(c.total[0]<=c.total[1]);}
for(const f of ['data.json','sources.json','plan.schema.json'])JSON.parse(fs.readFileSync(__dirname+'/'+f));
console.log('Passed: care arithmetic, date boundaries, subsidy, cap classification, all scenarios and invalid imports.');
