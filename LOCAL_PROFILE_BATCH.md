# Local Profiles batch preparation

Membership stays in `rosterprofiles`; names, gender overrides and saved sets stay in `pokemontools`. There is no schema migration. Batch previews preserve group IDs and never transfer a removed species' nickname to its replacement. Names remain stored for possible reuse. New species start with their existing saved name, or no nickname.

- Edit members in bulk: replace the whole group, replace checked members, add members, or remove a pasted list. Base species include their eligible Mega and Gmax forms under the existing import convention.
- Preview lists additions/removals. Cancel writes no membership changes. Unknown species block the complete batch; repeated species are deduplicated.
- Apply reads the latest local preferences, checks the linked profile and target membership, and preserves unrelated groups/settings/names/drafts. A changed/deleted target requires a fresh preview. Storage failures do not apply an in-memory batch. This is local browser storage, not a multi-device transactional service; it does not claim atomic cross-tab compare-and-swap against unrelated legacy writers.
- Undo notices are library-scoped and dismissible. Undo reads the latest saved preferences and retains the existing newer-entry conflict check.

## Live roster boundary: disabled

The live-roster connection, publisher and public-lock adapters are absent. Membership edits only update local browser preferences; they never read or write league ownership.

The shelved recovery bundle was inspected read-only. No archived routes, rooms, database code, credentials, schedulers or publication code were restored.

Before live integration: separately approve the public projection/ownership contract, stable public IDs and scope; implement freshness/version/error handling and explicit profile linking; review privacy and retire/reassign behavior; test conflicts and offline operation; separately authorize any backend deployment, migrations, enrollment and publication. Automatic placement, lock updates and live synchronization remain off. None of these steps is enabled by this preparation.
