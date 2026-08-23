[CmdletBinding()]
param(
    [string]$Owner = "14188769700lbk-dev",
    [string[]]$Repositories = @(
        "lineage-medic",
        "changefleet",
        "claustrace"
    )
)

$ErrorActionPreference = "Stop"

$credentialInput = "protocol=https`nhost=github.com`n`n"
$credentialLines = $credentialInput | & git credential fill
$tokenLine = $credentialLines |
    Where-Object { $_ -like "password=*" } |
    Select-Object -First 1

if (-not $tokenLine) {
    throw "A GitHub credential is required to read repository traffic statistics."
}

$token = $tokenLine.Substring("password=".Length)
$headers = @{
    Authorization          = "Bearer $token"
    Accept                 = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent"           = "LineageMedic-acquisition-audit"
}

try {
    $repositoriesOutput = foreach ($repository in $Repositories) {
        $baseUrl = "https://api.github.com/repos/$Owner/$repository"
        $metadata = Invoke-RestMethod -Uri $baseUrl -Headers $headers
        $views = Invoke-RestMethod -Uri "$baseUrl/traffic/views?per=day" -Headers $headers
        $clones = Invoke-RestMethod -Uri "$baseUrl/traffic/clones?per=day" -Headers $headers
        $referrers = Invoke-RestMethod -Uri "$baseUrl/traffic/popular/referrers" -Headers $headers
        $issues = Invoke-RestMethod -Uri "$baseUrl/issues?state=open&per_page=100" -Headers $headers

        $openIssues = @($issues | Where-Object { $null -eq $_.pull_request })
        $pilotIssues = @(
            $openIssues | Where-Object {
                @($_.labels | ForEach-Object { $_.name }) -contains "pilot-inquiry"
            }
        )

        [pscustomobject]@{
            repository          = "$Owner/$repository"
            stars               = $metadata.stargazers_count
            forks               = $metadata.forks_count
            subscribers         = $metadata.subscribers_count
            open_issues         = $openIssues.Count
            open_pilot_issues   = $pilotIssues.Count
            views_14d           = $views.count
            unique_views_14d    = $views.uniques
            clones_14d          = $clones.count
            unique_cloners_14d  = $clones.uniques
            referrers           = @($referrers | Select-Object referrer, count, uniques)
        }
    }

    [pscustomobject]@{
        generated_at_utc = [DateTime]::UtcNow.ToString("o")
        interpretation   = "GitHub traffic covers a rolling 14-day window and can include CI or owner activity. Clones and views are not inquiries, customers, awards, or revenue."
        repositories     = @($repositoriesOutput)
    } | ConvertTo-Json -Depth 6
}
finally {
    $token = $null
    $headers.Authorization = $null
}
