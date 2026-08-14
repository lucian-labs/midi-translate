/* midi-translate demo — https://midi-translate.lucianlabs.ca
 *
 * NOTE the import shape. midi-translate ships CommonJS only (module.exports,
 * no ESM build, no "exports" map), so a namespace import resolves to an empty
 * object under a bundler. The default import is the whole module.exports.
 */

import mt from 'midi-translate'

const { noteToString, stringToNote, noteToFrequency } = mt as {
  noteToString: (n: number) => string | false
  stringToNote: (s: string) => number
  noteToFrequency: (n: number) => number
}

declare const waveloop: { ready: (...tags: string[]) => Promise<unknown> }

const app = document.getElementById('app') as HTMLElement

const h = (tag: string, cls?: string, text?: string) => {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text != null) n.textContent = text
  return n
}

const section = (title: string) => {
  const s = document.createElement('wl-section')
  s.setAttribute('title', title)
  app.append(s)
  return s
}

waveloop.ready().then(boot)

/* ── audio ──────────────────────────────────────────────────────────────── */

let ac: AudioContext | null = null

/** Play the frequency the library computed, so the conversion is audible
 *  rather than just printed. Created lazily — a browser will not start an
 *  AudioContext before a gesture. */
const play = (freq: number) => {
  if (!ac) ac = new AudioContext()
  if (ac.state === 'suspended') ac.resume()
  const now = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'triangle'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)
  osc.connect(gain).connect(ac.destination)
  osc.start(now)
  osc.stop(now + 1)
}

function boot() {
  installSection()
  keyboardSection()
  converterSection()
  tableSection()
  apiSection()
}

function installSection() {
  const s = section('install')
  const install = document.createElement('wl-install')
  install.setAttribute('pkg', 'midi-translate')
  const c = document.createElement('wl-code')
  c.textContent = `// CommonJS
const { noteToString, noteToFrequency } = require('midi-translate')

// ESM — default import only; there is no ESM build
import mt from 'midi-translate'

mt.noteToString(60)      // 'c4'
mt.stringToNote('c4')    // 60
mt.noteToFrequency(69)   // 440`
  s.append(install, c)
}

/* ── the keyboard ───────────────────────────────────────────────────────── */

const BLACK = new Set([1, 3, 6, 8, 10])

function keyboardSection() {
  const s = section('keyboard')
  s.append(
    h(
      'p',
      'wl-muted',
      'Two octaves from MIDI 48. Click a key: the readouts are what the library ' +
        'returns for that note number, and the tone you hear is noteToFrequency.'
    )
  )

  const hud = document.createElement('wl-hud')
  hud.style.height = '190px'
  hud.setAttribute('tl', 'MIDI 48 → 72')
  hud.setAttribute('br', 'CLICK TO SOUND')

  const keys = h('div')
  keys.style.position = 'absolute'
  keys.style.inset = '0'
  keys.style.display = 'flex'
  keys.style.alignItems = 'stretch'
  keys.style.padding = '2.6rem 0.6rem 0.6rem'
  keys.style.gap = '2px'
  hud.append(keys)
  s.append(hud)

  const readouts = h('div', 'wl-grid')
  readouts.style.marginTop = '0.75rem'
  const rNum = document.createElement('wl-readout')
  rNum.setAttribute('label', 'note number')
  const rName = document.createElement('wl-readout')
  rName.setAttribute('label', 'noteToString')
  const rFreq = document.createElement('wl-readout')
  rFreq.setAttribute('label', 'noteToFrequency')
  const rBack = document.createElement('wl-readout')
  rBack.setAttribute('label', 'stringToNote (round trip)')
  readouts.append(rNum, rName, rFreq, rBack)
  s.append(readouts)

  const select = (n: number) => {
    const name = noteToString(n)
    const freq = noteToFrequency(n)
    rNum.setAttribute('value', String(n))
    rName.setAttribute('value', String(name))
    rFreq.setAttribute('value', `${freq.toFixed(3)} Hz`)
    rBack.setAttribute('value', typeof name === 'string' ? String(stringToNote(name)) : '—')
    hud.setAttribute('tr', `${String(name).toUpperCase()} · ${freq.toFixed(1)} HZ`)
    play(freq)
  }

  for (let n = 48; n <= 72; n++) {
    const black = BLACK.has(n % 12)
    const key = h('button')
    key.setAttribute('aria-label', String(noteToString(n)))
    key.style.flex = black ? '0 0 1.5%' : '1'
    key.style.minWidth = black ? '10px' : '0'
    key.style.border = '1px solid var(--wl-line)'
    key.style.background = black ? 'var(--wl-bg-deep)' : 'var(--wl-surface-lift)'
    key.style.color = 'var(--wl-muted)'
    key.style.fontFamily = 'var(--wl-font-head)'
    key.style.fontSize = '0.8rem'
    key.style.textTransform = 'uppercase'
    key.style.cursor = 'pointer'
    key.style.display = 'flex'
    key.style.alignItems = 'flex-end'
    key.style.justifyContent = 'center'
    key.style.paddingBottom = '0.3rem'
    key.style.transition = 'background 120ms ease'
    key.textContent = black ? '' : String(noteToString(n))
    key.addEventListener('pointerdown', () => {
      key.style.background = 'var(--wl-accent)'
      select(n)
    })
    const off = () => {
      key.style.background = black ? 'var(--wl-bg-deep)' : 'var(--wl-surface-lift)'
    }
    key.addEventListener('pointerup', off)
    key.addEventListener('pointerleave', off)
    keys.append(key)
  }

  select(60)
}

/* ── free-text converter ────────────────────────────────────────────────── */

function converterSection() {
  const s = section('stringToNote')
  s.append(
    h(
      'p',
      'wl-muted',
      'Parse a note name back to a number. Names are lowercase and sharps only — ' +
        'c4, f#3, a#-1. Anything it cannot parse comes back as -1.'
    )
  )

  const row = h('div', 'wl-row')
  const input = document.createElement('input')
  input.value = 'f#3'
  input.spellcheck = false
  input.style.flex = '1'
  input.style.minWidth = '180px'
  input.style.padding = '0.6rem 0.8rem'
  input.style.border = '1px solid var(--wl-line)'
  input.style.background = 'var(--wl-bg-deep)'
  input.style.color = 'var(--wl-text)'
  input.style.fontFamily = 'var(--wl-font-mono)'
  input.style.fontSize = '1rem'

  const out = document.createElement('wl-readout')
  out.setAttribute('label', 'note number')
  const outFreq = document.createElement('wl-readout')
  outFreq.setAttribute('label', 'frequency')

  const btn = h('button', 'wl-btn', 'sound')

  row.append(input, out, outFreq, btn)
  s.append(row)

  const update = () => {
    const n = stringToNote(input.value.trim())
    out.setAttribute('value', String(n))
    outFreq.setAttribute('value', n === -1 ? '—' : `${noteToFrequency(n).toFixed(3)} Hz`)
    return n
  }
  input.addEventListener('input', update)
  btn.addEventListener('click', () => {
    const n = update()
    if (n !== -1) play(noteToFrequency(n))
  })
  update()
}

/* ── reference table ────────────────────────────────────────────────────── */

function tableSection() {
  const s = section('reference')
  s.append(h('p', 'wl-muted', 'Every A, straight from the library — the octave doubling is the check that the maths is right.'))
  const api = document.createElement('wl-api')
  s.append(api)
  const rows = []
  for (let n = 21; n <= 117; n += 12) {
    rows.push({
      name: String(n),
      kind: String(noteToString(n)),
      signature: `${noteToFrequency(n).toFixed(3)} Hz`,
      about: n === 69 ? 'A4 — the reference pitch' : '',
    })
  }
  ;(api as HTMLElement & { rows: unknown }).rows = rows
}

function apiSection() {
  const s = section('api')
  const api = document.createElement('wl-api')
  s.append(api)
  ;(api as HTMLElement & { rows: unknown }).rows = [
    { name: 'noteToString', kind: 'function', signature: '(noteNumber: number) => string | false', about: 'MIDI number to lowercase note name, e.g. 60 → "c4". Returns false for a non-integer.' },
    { name: 'stringToNote', kind: 'function', signature: '(noteString: string) => number', about: 'Note name to MIDI number. Lowercase, sharps only. Returns -1 when unparseable.' },
    { name: 'noteToFrequency', kind: 'function', signature: '(noteNumber: number) => number', about: 'MIDI number to Hz, equal temperament against A4 = 440.' },
  ]
}
