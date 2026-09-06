# RC commit-ready inventory — 2026-09-06

## Summary

- Total git status entries: 183
- Commit candidates: 70
- Local/raw artifacts not staged by default: 2
- Needs manual review: 111

This inventory prepares a clean RC package. It does not push or merge.

## Files

- `inventory.json` — full classification.
- `commit-candidate-paths.txt` — candidate paths for `git add`.
- `local-artifact-paths.txt` — raw/local/review-heavy paths excluded by default.
- `needs-manual-review-paths.txt` — unclear paths.

## Rule

Stage only approved RC source/data/tests/docs/evidence. Exclude raw corpus, exported zips, screenshots, `test-results/`, and generated browser artifacts unless explicitly needed.
