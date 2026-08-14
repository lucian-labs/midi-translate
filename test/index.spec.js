const assert = require('assert')
const { noteToString, stringToNote, noteToFrequency } = require('../src/index')

describe('noteToString()', () => {
  it('returns c-1 from 0', () => {
    assert.equal(noteToString(0), 'c-1')
  })

  it('returns a0 from 21', () => {
    assert.equal(noteToString(21), 'a0')
  })

  it('returns f#2 from 42', () => {
    assert.equal(noteToString(42), 'f#2')
  })

  it('returns a#7 from 106', () => {
    assert.equal(noteToString(106), 'a#7')
  })

  it('returns g9 from 127', () => {
    assert.equal(noteToString(127), 'g9')
  })

  it('returns null outside the midi range', () => {
    assert.strictEqual(noteToString(-1), null)
    assert.strictEqual(noteToString(128), null)
    assert.strictEqual(noteToString(1000), null)
  })

  it('returns null for non-integers and non-numbers', () => {
    assert.strictEqual(noteToString(60.5), null)
    assert.strictEqual(noteToString(NaN), null)
    assert.strictEqual(noteToString(null), null)
    assert.strictEqual(noteToString(undefined), null)
    assert.strictEqual(noteToString(true), null)
    assert.strictEqual(noteToString([]), null)
    assert.strictEqual(noteToString('60'), null)
  })
})

describe('stringToNote()', () => {
  it('returns 106 from a#7', () => {
    assert.equal(stringToNote('a#7'), 106)
  })
  it('returns 42 from f#2', () => {
    assert.equal(stringToNote('f#2'), 42)
  })
  it('returns 21 from a0', () => {
    assert.equal(stringToNote('a0'), 21)
  })
  it('returns 0 from c-1', () => {
    assert.equal(stringToNote('c-1'), 0)
  })

  it('accepts uppercase and surrounding whitespace', () => {
    assert.equal(stringToNote('C4'), 60)
    assert.equal(stringToNote(' F#3 '), 54)
  })

  it('resolves enharmonic sharps', () => {
    assert.equal(stringToNote('e#4'), 65)
    assert.equal(stringToNote('b#4'), 72)
  })

  it('returns null when the octave is missing or unparseable', () => {
    assert.strictEqual(stringToNote('c'), null)
    assert.strictEqual(stringToNote('a#'), null)
    assert.strictEqual(stringToNote('cb4'), null)
  })

  it('returns null for strings that merely contain a note letter', () => {
    assert.strictEqual(stringToNote('ac4'), null)
    assert.strictEqual(stringToNote('c 4'), null)
    assert.strictEqual(stringToNote('zz'), null)
    assert.strictEqual(stringToNote(''), null)
  })

  it('returns null outside the midi range', () => {
    assert.equal(stringToNote('g9'), 127)
    assert.strictEqual(stringToNote('g#9'), null)
    assert.strictEqual(stringToNote('c-2'), null)
  })

  it('returns null for non-strings instead of throwing', () => {
    assert.strictEqual(stringToNote(60), null)
    assert.strictEqual(stringToNote(null), null)
    assert.strictEqual(stringToNote(undefined), null)
  })
})

describe('round trip', () => {
  it('stringToNote(noteToString(n)) === n across the whole midi range', () => {
    for (let n = 0; n < 128; n++) {
      assert.strictEqual(stringToNote(noteToString(n)), n)
    }
  })
})

describe('noteToFrequency', () => {
  it('returns 27.500 from 21', () => {
    assert.equal(noteToFrequency(21), 27.5)
  })
  it('returns 55.000 from 33', () => {
    assert.equal(noteToFrequency(33), 55)
  })
  it('returns 110.000 from 45', () => {
    assert.equal(noteToFrequency(45), 110)
  })
  it('returns 220.000 from 57', () => {
    assert.equal(noteToFrequency(57), 220)
  })
  it('returns 440.000 from 69', () => {
    assert.equal(noteToFrequency(69), 440)
  })
  it('returns 880.000 from 81', () => {
    assert.equal(noteToFrequency(81), 880)
  })
  it('returns 1760.000 from 93', () => {
    assert.equal(noteToFrequency(93), 1760)
  })
  it('tunes against the given a4 reference', () => {
    assert.equal(noteToFrequency(69, 432), 432)
    assert.equal(noteToFrequency(81, 432), 864)
  })
  it('returns NaN for non-numeric input', () => {
    assert.ok(Number.isNaN(noteToFrequency(null)))
    assert.ok(Number.isNaN(noteToFrequency('69')))
    assert.ok(Number.isNaN(noteToFrequency(69, null)))
  })
})

