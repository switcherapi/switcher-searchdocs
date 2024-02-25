***

<div align="center">
<b>Switcher SearchDocs API</b><br>
A remote document search engine that uses Skimming for Deno<br><br>
</div>

<div align="center">

[![Master CI](https://github.com/switcherapi/switcher-searchdocs/actions/workflows/master.yml/badge.svg)](https://github.com/switcherapi/switcher-searchdocs/actions/workflows/master.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=switcherapi_switcher-searchdocs&metric=alert_status)](https://sonarcloud.io/dashboard?id=switcherapi_switcher-searchdocs)
![Known Vulnerabilities](https://snyk.io/test/github/switcherapi/switcher-searchdocs/badge.svg)
[![Docker Hub](https://img.shields.io/docker/pulls/trackerforce/switcher-searchdocs.svg)](https://hub.docker.com/r/trackerforce/switcher-searchdocs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Slack: Switcher-HQ](https://img.shields.io/badge/slack-@switcher/hq-blue.svg?logo=slack)](https://switcher-hq.slack.com/)

</div>

***

# About

Switcher SearchDocs API uses [Skimming](https://github.com/petruki/skimming) and [Oak Middleware](https://github.com/oakserver/oak) modules to deliver a simple and efficient search engine.

## Running locally

1. Clone the repository
2. Run `deno task run:dev` or test with `deno task test`
3. Happy Deno hacking with SearchDocs!

## Usage

### Lockup API info
```
Request (GET)
{{url}}/api/check
```
**Sample response**
```json
{
    "status": "ok",
    "releaseTime": "today",
    "sslEnabled": false,
    "appSettings": {
        "url": "https://raw.githubusercontent.com/petruki/skimming/master/",
        "files": "README.md",
        "cacheExpDuration": "5",
        "cacheSize": "100"
    }
}
```

### From local content
```
Request (GET)
{{url}}/?query=Usage&previewLength=-1&ignoreCase=false&trimContent=true
```
 - query: value to search
 - previewLength: length of the content to be returned
   - When 0: it shows only the matched word
   - When -1: it shows the entire content from the first match
 - ignoreCase: ignore case
 - trimContent: prettify the response segment, basically
 - regex: enable regular expression searching method
 - skipCache: skip cache
 
**Sample response**
```json
{
    "message": "Success",
    "query": "Sk",
    "result": [
        {
            "file": "README.md",
            "segment": [
                "Skimming is a data fetcher for Deno. The idea is to provide a simple and efficient module to fetch content.",
                "Skimming from \"https://raw.githubusercontent.com/petruki/skimming/v1.0.0/mod.ts\";",
                "Skimming({ expireDuration: 10, size: 10 });"
            ],
            "found": 3,
            "cache": true
        }
    ]
}
```

### From remote content
```
Request (GET)
{{url}}/?url=https://raw.githubusercontent.com/denoland/deno/main/&files=README.md
```
 - url: Endpoint to be fetched
 - files: artifacts to be fetched
