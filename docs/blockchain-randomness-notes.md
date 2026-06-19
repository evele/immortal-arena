# Blockchain Randomness Notes

Randomness is useful for several Immortal Arena systems, including combat tie-breakers, target selection, hit/miss resolution, damage variation, rewards, and possibly market generation.

However, randomness does not fit naturally with blockchain execution. On-chain randomness can be predictable, manipulable, expensive, or dependent on external services.

Current direction:

- Random events are allowed in the game design for now.
- Combat can remain off-chain initially, which makes random resolution easier for the MVP.
- Any event that later needs to be settled or verified on-chain will need a specific randomness strategy.
- The randomness strategy is not decided yet.

Open options to evaluate later:

- Off-chain server-generated randomness with signed battle results.
- Commit-reveal schemes.
- Verifiable randomness services such as VRF.
- Deterministic pseudo-randomness from agreed seeds.
- Hybrid approaches where only important outcomes are committed on-chain.

Design note: whenever a mechanic uses randomness, we should mark whether it is MVP-only off-chain randomness or whether it needs future on-chain verification.
