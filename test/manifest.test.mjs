/**
 * Manifest sanity check for the public repository: package identity, bundle
 * exports, DSH declarations and localized display metadata.
 */
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(join(root, path), 'utf8')
const pkg = JSON.parse(read('package.json'))

assert.equal(pkg.name, 'dsh-user-resend')
assert.match(pkg.version, /^\d+\.\d+\.\d+$/)
assert.equal(pkg.type, 'module')
assert.equal(pkg.license, 'MIT')
assert.equal(typeof pkg.description, 'string')
assert.ok(pkg.description.length > 20)

// Bundle manifest: the patch the plugin manager reads and the two halves.
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
assert.equal(pkg.dsh.client.platform, 'web')
assert.equal(pkg.dsh.client.immediately, true)
assert.ok(Array.isArray(pkg.dsh.client.inject))
assert.ok(pkg.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-chat'))

// Every exported and packaged path exists (wildcard subpath patterns are skipped).
for (const target of Object.values(pkg.exports)) {
  if (target.includes('*')) continue
  assert.equal(statSync(join(root, target)).isFile(), true, 'missing export target: ' + target)
}
for (const entry of pkg.files) {
  if (entry.includes('*')) continue
  assert.equal(statSync(join(root, entry)).isFile(), true, 'missing packaged file: ' + entry)
}

// Client module identity and host half shape.
const client = read('client.js')
assert.match(client, /window\.__ModuleLoader__\.load\(/)
assert.match(client, /id:\s*'dsh-user-resend'/)
const host = read('index.js')
assert.match(host, /export function apply\(\)/)

// Display metadata for both shipped locales.
for (const locale of ['zh', 'en']) {
  const meta = JSON.parse(read('locale/' + locale + '.json'))
  assert.equal(typeof meta.meta.title, 'string', locale + ' meta.title')
  assert.ok(meta.meta.title.length > 0)
  assert.equal(typeof meta.meta.description, 'string', locale + ' meta.description')
  assert.ok(meta.meta.description.length > 20)
}

// Icon must be an SVG document.
const icon = read('icon.svg')
assert.match(icon, /^<svg[\s>]/)

console.log('dsh-user-resend manifest: all assertions passed')
