// ESM entry. The implementation stays CommonJS; this wrapper exists so the
// `exports.import` condition points at a real module instead of relying on
// cjs-module-lexer inferring named exports from the CJS file.
import mod from './index.js'

export const noteToString = mod.noteToString
export const stringToNote = mod.stringToNote
export const noteToFrequency = mod.noteToFrequency

export default mod
