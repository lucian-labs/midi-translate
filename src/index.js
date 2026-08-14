const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']

const MIDI_MIN = 0
const MIDI_MAX = 127
const A4_MIDI = 69
const A4_HZ = 440

// Anchored so junk containing a note letter ('ac4', 'c 4') is rejected rather
// than resolving to a plausible-looking note.
const NOTE_PATTERN = /^([a-g])(#?)(-?\d+)$/

const noteToString = noteNumber => {
  if (typeof noteNumber !== 'number' || !Number.isInteger(noteNumber)) return null
  if (noteNumber < MIDI_MIN || noteNumber > MIDI_MAX) return null

  const octave = Math.floor(noteNumber / 12) - 1
  return `${notes[noteNumber % 12]}${octave}`
}

const stringToNote = noteString => {
  if (typeof noteString !== 'string') return null

  const match = NOTE_PATTERN.exec(noteString.trim().toLowerCase())
  if (!match) return null

  const [, letter, sharp, octave] = match
  // Adding 1 for the sharp instead of looking up 'e#'/'b#' keeps the enharmonic
  // spellings working: 'e#4' -> f4, 'b#4' -> c5.
  const note = notes.indexOf(letter) + (sharp ? 1 : 0)
  const noteNumber = note + 12 * parseInt(octave, 10) + 12

  if (noteNumber < MIDI_MIN || noteNumber > MIDI_MAX) return null
  return noteNumber
}

const noteToFrequency = (noteNumber, a4hz = A4_HZ) => {
  if (!Number.isFinite(noteNumber) || !Number.isFinite(a4hz)) return NaN

  return 2 ** ((noteNumber - A4_MIDI) / 12) * a4hz
}

module.exports = { noteToString, stringToNote, noteToFrequency }
