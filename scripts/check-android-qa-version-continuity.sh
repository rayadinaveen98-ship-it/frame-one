#!/usr/bin/env bash
# Frame One public Android versionCode gate: public receipts only, NO private keys.
set -euo pipefail

if (( $# < 1 || $# > 2 )); then
  echo "Usage: check-android-qa-version-continuity.sh NEW_RECEIPT [PREVIOUS_RECEIPT]" >&2
  exit 2
fi

new_receipt="$1"
prior_receipt=""
if (( $# == 2 )); then prior_receipt="$2"; fi

fail() { echo "::error::$*" >&2; exit 1; }

read_version() {
  local path="$1" count version
  [[ -s "$path" ]] || fail "Missing Android receipt: $path"
  count="$(grep -c '^Android versionCode: ' "$path" || true)"
  [[ "$count" = 1 ]] || fail "Missing or duplicate Android versionCode receipt in $path"
  version="$(sed -n 's/^Android versionCode: //p' "$path")"
  [[ "$version" =~ ^[1-9][0-9]*$ ]] || fail "Invalid Android versionCode in $path"
  (( $(printf '%s' "$version" | wc -c) <= 10 )) || fail "Android versionCode too long in $path"
  (( version <= 2100000000 )) || fail "Android versionCode exceeds supported limit in $path"
  printf '%s' "$version"
}

new_code="$(read_version "$new_receipt")"
(( new_code > 100000 )) || fail "New QA build must use generated versionCode above 100000"

if [[ -n "$prior_receipt" && -e "$prior_receipt" ]]; then
  [[ -s "$prior_receipt" ]] || fail "Previous Android receipt is empty"
  if grep -q '^Android versionCode: ' "$prior_receipt"; then
    prior_code="$(read_version "$prior_receipt")"
    (( new_code > prior_code )) || fail "BLOCKED: Android versionCode $new_code must exceed published $prior_code"
  else
    # Existing v0.12A2 release predates versionCode receipts. This exception is
    # valid only for the ONE-TIME transition from temporary to permanent signing.
    grep -Fxq 'Persistent QA signer: NO (temporary runner signer; not upgrade-safe)' "$prior_receipt" \
      || fail "Previous versionCode-less receipt must be from the legacy temporary preview"
    grep -Fxq 'Persistent QA signer: YES (managed by GitHub Secret)' "$new_receipt" \
      || fail "Legacy preview replacement requires the first permanent signer"
    echo "::notice::Legacy temporary preview lacks versionCode receipt; one-time permanent transition with code $new_code."
  fi
fi

echo "Android QA versionCode continuity accepted: $new_code"
