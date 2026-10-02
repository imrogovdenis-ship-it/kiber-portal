# KIBER owner approvals registry

This directory stores durable owner-approval records for KIBER PORTAL contracts and content decisions.

## Important rule

Chat, memory, preview links and Linear issues are not final approval sources. A decision becomes durable only when it is recorded here and tied to repository contract/source files.

## Status values

- `needs_owner_reconfirmation` — recorded from current project context but must be reviewed by Alexander before being treated as final owner approval.
- `owner_approved` — explicitly approved by Alexander and recorded here.
- `rejected` — explicitly rejected.
- `superseded` — replaced by a newer owner-approved rule.

## Review process

1. Review each contract file in `docs/contracts/`.
2. For each rule, Alexander either approves, rejects, or requests edits.
3. Update `owner-approvals.json` status/scope/source files.
4. Update the corresponding contract text.
5. Use only `owner_approved` entries as final approval truth.

## Current package status

Alexander approved the current article contract package as the working source of truth. Future corrections must be made by editing the relevant contract and approval entries, not by relying on chat memory.
