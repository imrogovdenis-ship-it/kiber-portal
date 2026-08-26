# KP-002: protected snapshot and restore evidence

- Created: 2026-08-26 UTC
- Linear: KIBER-2 / KP-002
- Canonical commit: `02d417a84a18c72b93c59f57ef01d6ee8d31797d`
- Tree: `afc7ea2c8fe70e83ac44bc7fa8fcea47064ceee1`
- Remote tag: `snapshot/kp-002-2026-08-26`
- Tracked paths in restored snapshot: 1062

## Recovery copies

Two independent recovery paths were created:

1. The annotated tag `snapshot/kp-002-2026-08-26` was pushed to the canonical GitHub remote.
2. A complete Git bundle was stored outside the working tree at `/root/work/backups/kiber-portal-kp-002-20260826/kiber-portal.bundle`.

Bundle evidence:

```text
size: 127M
sha256: 439f800231836007be5df28aeb010d41c2ffa7ee2b575a229e31893e2a7adeb2
history: complete
```

The historical audit described 155 untracked elements before the canonical repository was established. That original dirty worktree is not present in the clean GitHub clone, so the old untracked count cannot be independently repeated. This snapshot protects the complete canonical state into which the retained project material was committed; it does not claim that every item from the earlier dirty worktree was retained without a source-to-snapshot manifest.

## Restore test

The bundle was cloned into a new temporary directory and the snapshot tag was checked out. Both the commit and tree hashes matched the source:

```text
restored commit: 02d417a84a18c72b93c59f57ef01d6ee8d31797d
restored tree:   afc7ea2c8fe70e83ac44bc7fa8fcea47064ceee1
restored files:  1062
```

## Restore procedure

From GitHub:

```bash
git clone git@github.com:imrogovdenis-ship-it/kiber-portal.git
cd kiber-portal
git switch --detach snapshot/kp-002-2026-08-26
```

From the offline bundle:

```bash
sha256sum kiber-portal.bundle
git bundle verify kiber-portal.bundle
git clone kiber-portal.bundle kiber-portal-restored
cd kiber-portal-restored
git switch --detach snapshot/kp-002-2026-08-26
```

The expected SHA-256 must match the value above before using the offline bundle.
