#!/usr/bin/env bash
# Fail-closed release policy for the public Android QA APK.
# The receipts contain *public* certificate digests and signing modes only.
# Never print, inspect or retrieve the private signing keystore.
set -euo pipefail

new_receipt="${1:?Usage: check-android-signing-continuity.sh NEW_RECEIPT [PRIOR_RECEIPT]}"
prior_receipt="${2:-}"

fail() {
  echo "::error::$*" >&2
  exit 1
}

read_digest() {
  local path="$1" digest
  [[ -s "$path" ]] || fail "Android signing receipt missing or empty: $path"
  digest="$(sed -n 's/^Signer #1 certificate SHA-256 digest: //p' "$path" | head -n 1)"
  [[ "$digest" =~ ^[0-9a-fA-F]{64}$ ]] || fail "Invalid Android signing certificate digest in $path"
  printf '%s' "${digest,,}"
}

read_mode() {
  local path="$1" persistent=0 temporary=0
  grep -Fxq 'Persistent QA signer: YES (managed by GitHub Secret)' "$path" && persistent=1 || true
  grep -Fxq 'Persistent QA signer: NO (temporary runner signer; not upgrade-safe)' "$path" && temporary=1 || true
  if (( persistent + temporary != 1 )); then
    fail "Missing or conflicting Android QA signer mode in $path"
  fi
  if (( persistent )); then printf persistent; else printf temporary; fi
}

new_cert="$(read_digest "$new_receipt")"
new_mode="$(read_mode "$new_receipt")"

if [[ -n "$prior_receipt" && -e "$prior_receipt" ]]; then
  prior_cert="$(read_digest "$prior_receipt")"
  prior_mode="$(read_mode "$prior_receipt")"
  if [[ "$prior_mode" == persistent && "$new_mode" != persistent ]]; then
    fail "BLOCKED: public preview already uses a permanent QA signer. Refusing to replace it with a temporary-signed APK. Restore the protected signing secret, do not uninstall users' apps."
  fi
  if [[ "$prior_mode" == persistent && "$new_cert" != "$prior_cert" ]]; then
    fail "BLOCKED: permanent QA signer certificate changed. Public preview must retain the same certificate to protect in-place upgrades."
  fi
  if [[ "$prior_mode" == temporary && "$new_mode" == temporary ]]; then
    fail "BLOCKED: public preview remains frozen while using temporary signing. Configure persistent QA signing before replacing the existing APK; keep existing testers' local work safe."
  fi
  if [[ "$prior_mode" == temporary && "$new_mode" == persistent ]]; then
    echo "::notice::First permanent QA signer: the currently installed temporary-signed APK will NOT upgrade in place; back up, reinstall once, then restore."
  elif [[ "$new_mode" == temporary ]]; then
    echo "::warning::Still using temporary Android signing. In-place upgrades are not guaranteed."
  fi
else
  echo "::notice::No earlier public preview signing receipt found; publishing first QA artifact."
fi

echo "QA signing continuity accepted: $new_mode; certificate SHA-256: $new_cert"
