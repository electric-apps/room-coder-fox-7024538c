#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/7024538c-78a7-4c88-94a4-c074eeda8eb3/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 0e18d84db9d1e7d9d064f990139ef18a9732168a7ef40f955014f5f15a719176" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0