/**
 * Convert a MIDI note number (0-127) to a lowercase scientific-pitch name,
 * sharps only — 60 -> 'c4'. Returns null for a non-integer, a non-number, or
 * anything outside the MIDI range.
 */
export declare function noteToString(noteNumber: number): string | null

/**
 * Parse a scientific-pitch name back to a MIDI note number — 'c4' -> 60.
 * Case-insensitive, sharps only, surrounding whitespace ignored. Returns null
 * for a non-string, an unparseable name, or a note outside 0-127. Note that 0
 * ('c-1') is a valid result, so test for null rather than falsiness.
 */
export declare function stringToNote(noteString: string): number | null

/**
 * Equal-temperament frequency in Hz for a MIDI note number, tuned against
 * A4 = 440 Hz unless another reference is given. Fractional and out-of-range
 * note numbers are allowed on purpose (microtonal and transposition maths);
 * non-numeric input returns NaN.
 */
export declare function noteToFrequency(noteNumber: number, a4hz?: number): number
