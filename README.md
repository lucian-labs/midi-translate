# Midi Translate

**[Live demo →](https://midi-translate.lucianlabs.ca)** · [npm](https://www.npmjs.com/package/midi-translate) · [all packages](https://lucianlabs.ca/packages/)


## Features As Of Release 1.0.4

- Midi note number to english note string
- Midi note number to fundamental frequency
- English musical note to midi note number

# Concept

translate midi between different thingies - primarily for my personal use with tonejs

## TODO:

# ~~Milestone 1~~

- Midi Note Number <=> English Note String

# ~~Milestone 2~~

- note number to frequencies

# Milestone 3

- midi wrapper for incoming midi signals
- note string to frequencies helper

# Milestone 4

- add translations to non-english notes

Use:

```js
import { noteToString, noteToFrequency } from 'midi-translate'
let incomingNote = Midi.getNote('port1') // however you get midi notes, do that
let stringNote = noteToString(incomingNote)
let noteFrequency = noteToFrequency(incomingNote)
```

## API

```ts
noteToString(noteNumber: number): string | null
stringToNote(noteString: string): number | null
noteToFrequency(noteNumber: number, a4hz?: number): number
```

**`noteToString(60)` → `'c4'`.** Lowercase scientific pitch, sharps only.
Returns `null` for anything that is not an integer in the MIDI range 0-127.

**`stringToNote('c4')` → `60`.** Case-insensitive, sharps only, surrounding
whitespace ignored, so Tone.js-style `'C4'` parses. The name must be a whole
note name and nothing else — `'ac4'` and `'c 4'` are rejected rather than read
as middle C. Returns `null` when the string will not parse or the note falls
outside 0-127. **Test for `null`, not falsiness**: `0` is a valid note (`c-1`).

**`noteToFrequency(69)` → `440`.** Equal temperament against A4 = 440 Hz; pass
a second argument to tune elsewhere (`noteToFrequency(69, 432)` → `432`).
Fractional and out-of-range note numbers are allowed on purpose, for microtonal
and transposition maths, so this one is unbounded. Non-numeric input gives
`NaN`.

`stringToNote(noteToString(n)) === n` for every `n` from 0 to 127; the test
suite pins it.
