# Clover Phrase Reading / Back Up Rules

## Purpose
Back Up is for saying English from meaning chunks without Japanese-order backtracking. English and Japanese are therefore shown in the same information order.

## Display contract
Each Back Up item has three layers:

1. English chunks
2. Forward Japanese chunks, one-to-one with the English chunks
3. Natural Japanese translation

The English and forward-Japanese arrays must always have the same number of chunks.

## Default scope
- Short sentence: 1–2 chunks, usually the full sentence.
- Normal sentence: 2–4 chunks, usually the full sentence.
- Long or structurally heavy sentence: 3–6 chunks, or a grammar-focused clause/phrase when full memorization would overload students.
- Conversation: preserve meaningful turns; do not split a fixed expression merely to make more chunks.

## Where to split
Prefer boundaries where meaning can be received once:
- punctuation
- before a new clause introduced by conjunctions
- before relative clauses
- independent adverbial prepositional phrases
- independent to-infinitive phrases
- participial phrases
- after a long subject
- around long objects/complements when this improves forward processing

## Do not split inside
- article + noun
- adjective + noun
- possessive + noun
- preposition + object
- modal + verb
- to + verb
- phrasal verbs
- idioms/fixed expressions
- short verb + object
- short be + complement

## Length
3–8 words is only a rough guide. Meaning and grammar outrank word count. Avoid many one-word chunks.

## Japanese forward translation
- Match one Japanese chunk to each English chunk.
- Preserve English information order as much as possible.
- Translate the phrase meaning, not word by word.
- Add only minimal pronouns/connectives when needed for comprehension.
- Relationship clauses may use forward explanatory Japanese, e.g. `a boy / who came from Australia` → `ある男の子に / その子はオーストラリアから来ていて`.
- The natural translation may use normal Japanese word order and may differ from the forward translation.

## Source protection
The authoritative problem, completed English, answer, and official translation are not rewritten by Back Up editing. Teacher edits are overrides for presentation/practice only.

## Teacher editing
AI output is an initial proposal, not a locked answer. Teacher edits in the Sentence Bank override the initial Back Up for that browser/class context and update:
- displayed English chunks
- forward Japanese chunks
- hiding units
- Back Up audio

The teacher can reset to the AI/default baseline at any time.

## Validation
Before release, confirm:
- English source text has not been silently rewritten
- English/Japanese chunk counts match
- protected grammatical units are not split
- chunks are not needlessly fine
- forward Japanese supports left-to-right comprehension
- natural Japanese preserves the source meaning
