# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.1] - 2026-10-31

### Fixed

- Resending a user message no longer sends the wrong queued copy. The resend now
  goes through the official composer path (`session.beginSubmission` with a
  `requestId` followed by `session.prompt`) instead of a bare `prompt(..., 'queue')`
  call, which the Host treated as an unidentified next-turn input and could merge
  with, or replace by, an adjacent queued message. Resending while a turn is
  running is refused with a clear "wait for the turn to end" notice instead.

## [0.2.0] - 2026-10-26

### Added

- Image attachments are re-sent with the message: the plugin reads the bytes back
  from the Session attachment store, re-encodes them canonically, and keeps the
  original order for multiple images.

## [0.1.0] - 2026-10-26

### Added

- A "resend" action on user messages in DeepSeek Harness Chat, next to the time
  and copy actions.
- Re-sends the message text in its original order, including `@path` and
  `@"path with spaces"` file mentions.
- Follows the DSH language setting for its UI copy.

[0.2.1]: https://github.com/yrui-ql/dsh-user-resend/releases/tag/v0.2.1
[0.2.0]: https://github.com/yrui-ql/dsh-user-resend/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yrui-ql/dsh-user-resend/releases/tag/v0.1.0
