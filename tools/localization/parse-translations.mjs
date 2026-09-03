function normalizeHeader(value) {
  return value.trim().replace(/^\[|\]$/g, '').toLowerCase()
}

function isSectionRow(columns) {
  const populated = columns.filter((column) => column.trim() !== '')
  return populated.length === 1 && /^\[.+\]$/.test(populated[0].trim())
}

function findHeader(columns) {
  const normalized = columns.map(normalizeHeader)
  const enIndex = normalized.indexOf('en')
  const zhIndex = normalized.indexOf('zh')
  // Both language columns are present in the exports. Requiring both avoids
  // mistaking a translated data cell whose entire value is "en" or "zh" for
  // a repeated header.
  if (enIndex < 0 || zhIndex < 0) return null

  // Hero Siege exports put the identity column immediately before English.
  // Its heading is commonly blank, a section marker, or "Unnamed: 0".
  const keyIndex = Math.max(0, enIndex - 1)
  return { keyIndex, enIndex, zhIndex }
}

/**
 * Parse Hero Siege's pipe-delimited translation exports. A malformed row is
 * skipped and reported instead of invalidating the rest of the file.
 */
export function parseTranslations(source, sourceName = 'translations.csv') {
  const entries = []
  const warnings = []
  const seen = new Set()
  let header = null

  for (const [zeroBasedLine, rawLine] of source.replace(/^\uFEFF/, '').split(/\r?\n/).entries()) {
    const line = zeroBasedLine + 1
    if (rawLine.trim() === '') continue
    const columns = rawLine.split('|')
    const possibleHeader = findHeader(columns)
    if (possibleHeader) {
      header = possibleHeader
      continue
    }
    if (isSectionRow(columns)) continue
    if (!header) {
      warnings.push(`${sourceName}:${line}: row before a usable header was ignored`)
      continue
    }

    const highestIndex = Math.max(header.keyIndex, header.enIndex, header.zhIndex)
    if (columns.length <= highestIndex) {
      warnings.push(`${sourceName}:${line}: malformed row was ignored`)
      continue
    }
    const key = (columns[header.keyIndex] ?? '').trim()
    if (!key || /^unnamed:/i.test(key)) continue
    if (seen.has(key)) {
      warnings.push(`${sourceName}:${line}: duplicate key "${key}" was ignored`)
      continue
    }
    seen.add(key)
    const en = header.enIndex >= 0 ? columns[header.enIndex]?.trim() : undefined
    const zhTW = header.zhIndex >= 0 ? columns[header.zhIndex]?.trim() : undefined
    if (!en && !zhTW) continue
    entries.push({ key, ...(en ? { en } : {}), ...(zhTW ? { zhTW } : {}) })
  }

  if (!header) throw new Error(`${sourceName}: no usable en/zh header found`)
  return { entries, warnings }
}
