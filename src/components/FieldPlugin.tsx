import { FunctionComponent, useState, useCallback, useEffect } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'

type ValidationResult = {
  valid: boolean
  error?: string
  formatted?: string
}

const validateJson = (value: string): ValidationResult => {
  if (!value.trim()) {
    return { valid: true, formatted: '' }
  }
  try {
    const parsed = JSON.parse(value)
    return { valid: true, formatted: JSON.stringify(parsed, null, 2) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON'
    return { valid: false, error: msg }
  }
}

const FieldPlugin: FunctionComponent = () => {
  const plugin = useFieldPlugin({
    validateContent: (content: unknown) => {
      if (typeof content === 'string') {
        const result = validateJson(content)
        if (result.valid) {
          return { content }
        }
        return { content, error: result.error ?? 'Invalid JSON' }
      }
      if (content === undefined || content === null || content === '') {
        return { content: '' }
      }
      return { content: JSON.stringify(content, null, 2) }
    },
  })

  const [rawValue, setRawValue] = useState('')
  const [validation, setValidation] = useState<ValidationResult>({ valid: true })

  useEffect(() => {
    if (plugin.type === 'loaded') {
      const initial = plugin.data.content ?? ''
      const str = typeof initial === 'string' ? initial : JSON.stringify(initial, null, 2)
      setRawValue(str)
      setValidation(validateJson(str))
    }
  }, [plugin.type === 'loaded' ? undefined : plugin.type])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value
      setRawValue(next)
      const result = validateJson(next)
      setValidation(result)

      if (plugin.type === 'loaded') {
        plugin.actions.setContent(next)
      }
    },
    [plugin],
  )

  const handleFormat = useCallback(() => {
    if (validation.valid && validation.formatted) {
      setRawValue(validation.formatted)
      if (plugin.type === 'loaded') {
        plugin.actions.setContent(validation.formatted)
      }
    }
  }, [validation, plugin])

  if (plugin.type !== 'loaded') {
    return <div style={styles.loading}>Loading…</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>JSON</span>
        <div style={styles.actions}>
          {validation.valid && validation.formatted && (
            <button onClick={handleFormat} style={styles.formatBtn} type="button">
              Format
            </button>
          )}
          <span
            style={{
              ...styles.badge,
              backgroundColor: !rawValue.trim()
                ? '#6b7280'
                : validation.valid
                  ? '#059669'
                  : '#dc2626',
            }}
          >
            {!rawValue.trim() ? 'Empty' : validation.valid ? '✓ Valid' : '✗ Invalid'}
          </span>
        </div>
      </div>

      <textarea
        value={rawValue}
        onChange={handleChange}
        style={{
          ...styles.textarea,
          borderColor: !rawValue.trim() ? '#d1d5db' : validation.valid ? '#059669' : '#dc2626',
        }}
        placeholder='{ "key": "value" }'
        spellCheck={false}
      />

      {validation.error && <div style={styles.error}>{validation.error}</div>}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  actions: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  formatBtn: {
    fontSize: '11px',
    padding: '2px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    color: '#374151',
  },
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 500,
  },
  textarea: {
    width: '100%',
    minHeight: '160px',
    padding: '10px',
    fontSize: '13px',
    fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
    lineHeight: '1.5',
    border: '2px solid',
    borderRadius: '6px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fafafa',
  },
  error: {
    marginTop: '4px',
    fontSize: '12px',
    color: '#dc2626',
    fontFamily: 'monospace',
    padding: '4px 8px',
    backgroundColor: '#fef2f2',
    borderRadius: '4px',
  },
  loading: {
    padding: '16px',
    textAlign: 'center',
    color: '#6b7280',
  },
}

export default FieldPlugin
