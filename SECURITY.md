# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for a security problem.

Report it privately through GitHub:
**https://github.com/daniyal44/Resume-Builder/security/advisories/new**

Include the affected page or feature, the steps to reproduce, and the impact you
expect. You will get an acknowledgement within a few days, and credit in the fix
if you want it.

## Scope

OwnResume is a static, client-side app. There is no backend, no account system and
no database — resume content never leaves the visitor's browser.

In scope:

- Cross-site scripting through imported JSON or PDF content
- Leaking stored resume data to a third party
- Dependency vulnerabilities reachable from the built app

Out of scope:

- Findings that require a compromised browser, extension or device
- Missing headers on third-party preview hosts (report those to the host)
- Rate limiting or brute force — there are no accounts or login endpoints

## Supported versions

The deployed site always runs the latest `main`. Fixes are shipped there rather
than backported to older commits.
