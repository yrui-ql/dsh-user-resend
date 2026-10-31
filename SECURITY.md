# Security

## Reporting a vulnerability

Please do not open a public issue for security problems. Report them privately to
the repository owner through GitHub Security Advisories.

## Data

`dsh-user-resend` is a Client-only DeepSeek Harness plugin:

- it reads the content of a user message that is already in the current Session
  (text, image attachment references, `@` file mentions) and re-submits it
  through the same `session.beginSubmission` / `session.prompt` path the composer
  uses;
- image bytes are read back from the local Session attachment store and sent to
  the same local Harness process; nothing is sent to a third party by the plugin;
- it writes no configuration files and stores no credentials or tokens.

The repository `.gitignore` excludes `node_modules`, logs, local databases and
local configuration so that no Session data or secrets can be committed by
accident.
