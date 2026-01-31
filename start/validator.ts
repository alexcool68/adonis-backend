// start/validator.ts
import { verifyPasswordRule } from '#validators/rules/verify_password'
import { VineString } from '@vinejs/vine'

// Extension de la classe VineString
VineString.macro('verifyPassword', function (this: VineString) {
  return this.use(verifyPasswordRule())
})

// Typage pour TypeScript
declare module '@vinejs/vine' {
  interface VineString {
    verifyPassword(): this
  }
}
