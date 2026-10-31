/**
 * Host half of the dsh-user-resend bundle.
 *
 * The capability is a Client-only message action: it reads the user message
 * that is already rendered and re-sends its text through the Session client
 * (`session.beginSubmission` + `session.prompt`). That call path is the same
 * one the composer uses, so queue placement, pending-echo handling, and
 * failure reporting stay owned by the Host and Session Controller.
 */
export function apply() {}
