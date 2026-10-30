#Requires -Version 5.1
<#
.SYNOPSIS
  Prepare Frame One's dedicated Android QA debug signing key on a trusted Windows PC.
.DESCRIPTION
  Default mode is read-only. -CreateKey generates a NEW local key (never in the repo).
  -ProvisionSecret sends its BASE64 encoding via STDIN to an encrypted GitHub
  Actions secret using GitHub CLI. Neither private bytes nor encoded bytes are
  printed or passed on the command line. Never use for Play Store signing.
  Public APK publication remains MANUAL and needs real upgrade/phone evidence.
#>
[CmdletBinding()]
param(
  [switch] $CreateKey,
  [switch] $ProvisionSecret,
  [switch] $BackupConfirmed,
  [string] $KeystorePath = ""
)

$ErrorActionPreference = 'Stop'
$Repo = 'rayadinaveen98-ship-it/frame-one'
$SecretName = 'FRAMEONE_QA_DEBUG_KEYSTORE_B64'

function Stop-Safely([string]$Reason) { throw "BLOCKED: $Reason" }
function Find-Executable([string]$Name) {
  $tool = Get-Command $Name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($null -eq $tool) { return $null }
  return $tool.Source
}

if ($env:OS -ne 'Windows_NT') { Stop-Safely 'This signing setup is Windows-only.' }
if ($CreateKey -and $ProvisionSecret) {
  Stop-Safely 'Generate first, make and verify a private encrypted backup, then provision in a separate command.'
}
if ($ProvisionSecret -and -not $BackupConfirmed) {
  Stop-Safely 'Before provisioning, independently back up the key. Re-run with -BackupConfirmed only after doing so.'
}
if ([string]::IsNullOrWhiteSpace($KeystorePath)) {
  if ([string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) { Stop-Safely 'LOCALAPPDATA is missing.' }
  $KeystorePath = Join-Path $env:LOCALAPPDATA 'FrameOne\QA\frameone-qa-debug.keystore'
}
$ResolvedKeyPath = [IO.Path]::GetFullPath($KeystorePath)
$RepoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd([IO.Path]::DirectorySeparatorChar)
$repoPrefix = $RepoRoot + [IO.Path]::DirectorySeparatorChar
if ($ResolvedKeyPath.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase) -or
    [string]::Equals($ResolvedKeyPath, $RepoRoot, [StringComparison]::OrdinalIgnoreCase)) {
  Stop-Safely 'A private signing key must never be stored inside the Git repository.'
}
$Keytool = Find-Executable 'keytool.exe'
$Gh = Find-Executable 'gh.exe'

# Read-only inspection can be used before installing tools. It never connects
# to GitHub, asks for a key password or alters a local file.
if (-not $CreateKey -and -not $ProvisionSecret) {
  Write-Host 'Frame One QA signing readiness (read-only)'
  Write-Host "Local key present: $(Test-Path -LiteralPath $ResolvedKeyPath -PathType Leaf)"
  Write-Host "JDK keytool available: $($null -ne $Keytool)"
  Write-Host "GitHub CLI available: $($null -ne $Gh)"
  Write-Host "Local key location: $ResolvedKeyPath"
  Write-Host 'No key or secret has been created, uploaded or modified.'
  exit 0
}
if ($null -eq $Keytool) { Stop-Safely 'JDK keytool.exe not found in PATH; install a JDK first.' }

if ($CreateKey) {
  if (Test-Path -LiteralPath $ResolvedKeyPath) {
    Stop-Safely 'Signing key already exists. Will not overwrite or rotate the Android QA identity.'
  }
  $directory = Split-Path -Parent $ResolvedKeyPath
  New-Item -ItemType Directory -Path $directory -Force | Out-Null
  # Android DEBUG signing uses the conventional public "android" passwords.
  # These are not production credentials. Never substitute a Play signing key.
  & $Keytool -genkeypair -keystore $ResolvedKeyPath -storetype JKS -storepass android `
    -alias androiddebugkey -keypass android -keyalg RSA -keysize 3072 `
    -validity 3650 -dname 'CN=Frame One QA, OU=Android Test, O=Frame One, C=IN' 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $ResolvedKeyPath -PathType Leaf)) {
    Stop-Safely 'JDK key generation did not complete. Do not provision this identity.'
  }
  Write-Host 'PASS: created the dedicated Android QA test key locally.'
  Write-Host "Location: $ResolvedKeyPath"
  Write-Host 'NEXT: Make and VERIFY an encrypted backup on a different secure location.'
  Write-Host 'Do not paste the key, its base64, or its bytes into chat or the repository.'
  exit 0
}

if (-not (Test-Path -LiteralPath $ResolvedKeyPath -PathType Leaf)) {
  Stop-Safely 'Local signing key is missing. Refusing to provision an empty secret.'
}
& $Keytool -list -keystore $ResolvedKeyPath -storetype JKS -storepass android `
  -alias androiddebugkey 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Stop-Safely 'Existing key does not have the expected Android QA debug alias or password.' }
if ($null -eq $Gh) { Stop-Safely 'GitHub CLI gh.exe not found in PATH; install GitHub CLI.' }
& $Gh auth status --hostname github.com 1>$null 2>$null
if ($LASTEXITCODE -ne 0) { Stop-Safely 'GitHub CLI not signed in. Run gh auth login on this PC.' }

# Provision using STDIN, never --body, shell arguments, environment variables,
# logged file copies or Git commits. The GitHub Secret API encrypts this value.
$EncodedKey = [Convert]::ToBase64String([IO.File]::ReadAllBytes($ResolvedKeyPath))
try {
  $EncodedKey | & $Gh secret set $SecretName --repo $Repo
  if ($LASTEXITCODE -ne 0) { Stop-Safely 'GitHub CLI could not set the Actions secret.' }
} finally {
  Remove-Variable EncodedKey -ErrorAction SilentlyContinue
}
Write-Host "PASS: GitHub Actions secret '$SecretName' provisioned for $Repo."
Write-Host 'No APK was built or published by this script.'
Write-Host 'NEXT: manually dispatch the Android debug workflow and inspect its PUBLIC signing receipt.'
Write-Host 'Never select public APK release approval until separate-build emulator + real-phone QA passes.'
