#!/usr/bin/env python3
"""Explicit local LLM request. Never invoked by the website."""
import json
import os
from pathlib import Path
import sys
import urllib.error
import urllib.request

if len(sys.argv) != 3:
    raise SystemExit('Usage: python3 llm_call.py PRIVATE_INPUT.json PRIVATE_OUTPUT.txt')
root = Path(__file__).resolve().parent
source = Path(sys.argv[1]).resolve()
output = Path(sys.argv[2]).resolve()
# Private inputs/outputs must not sit in this public web directory.
if source.is_relative_to(root) or output.is_relative_to(root):
    raise SystemExit('Keep private input/output outside the public planner directory.')
if output.exists():
    raise SystemExit('Output exists; choose a new filename to preserve prior results.')
key = os.environ.get('OPENAI_API_KEY')
model = os.environ.get('OPENAI_MODEL')
if not key or not model:
    raise SystemExit('Set OPENAI_API_KEY and OPENAI_MODEL in the local environment.')
state = json.loads(source.read_text())
schema = json.loads((root / 'plan.schema.json').read_text())
context = '\n\n'.join(f'FILE {name}\n{(root / name).read_text()}' for name in ['AGENTS.md', 'README.md', 'data.json', 'sources.json'])
prompt = context + '\n\nPRIVATE WORKING STATE\n' + json.dumps(state) + '\nReturn the complete updated working state only, conforming to the supplied schema. Use private state for actual constraints; public defaults are examples. Preserve confirmed facts. You have no live research tools in this call: do not invent fares, availability or fresh evidence. Record up to three useful follow-up questions in answers; keep prior answers. Preserve every scenario ID.'
body = {'model': model, 'store': False, 'input': prompt, 'text': {'format': {'type': 'json_schema', 'name': 'w26_working_state', 'strict': True, 'schema': schema}}}
req = urllib.request.Request('https://api.openai.com/v1/responses', data=json.dumps(body).encode(), headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=180) as response:
        result = json.load(response)
except urllib.error.HTTPError as exc:
    # Do not print response bodies, keys or private request content.
    raise SystemExit(f'Provider HTTP error {exc.code}. Check model access, schema support and account quota.') from None
except urllib.error.URLError:
    raise SystemExit('Provider connection failed. Private input was not changed.') from None
parts = [part.get('text', '') for item in result.get('output', []) for part in item.get('content', []) if part.get('type') == 'output_text']
text = '\n'.join(parts)
if not text:
    raise SystemExit('No output text returned; request may have been refused or interrupted.')
json.loads(text)  # Reject malformed JSON before writing.
with output.open('x', encoding='utf-8') as dest:
    dest.write(text + '\n')
print('Wrote response. Validate and review privately before import; no repository state changed.')
