import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from 'fs'
import path from 'path'

const rootDir = path.resolve(process.cwd())
const rootNodeModules = path.join(rootDir, 'node_modules')
const dbNodeModules = path.join(rootDir, 'packages', 'db', 'node_modules')

if (!existsSync(rootNodeModules)) {
  console.error('Root node_modules not found at', rootNodeModules)
  process.exit(1)
}

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

ensureDir(path.dirname(dbNodeModules))

if (existsSync(dbNodeModules)) {
  const stats = lstatSync(dbNodeModules)
  if (stats.isSymbolicLink()) {
    const currentTarget = readlinkSync(dbNodeModules)
    const absoluteTarget = path.resolve(path.dirname(dbNodeModules), currentTarget)
    if (absoluteTarget === rootNodeModules) {
      process.exit(0)
    }
    rmSync(dbNodeModules)
  } else {
    rmSync(dbNodeModules, { recursive: true, force: true })
  }
}

const type = process.platform === 'win32' ? 'junction' : 'dir'
symlinkSync(rootNodeModules, dbNodeModules, type)
