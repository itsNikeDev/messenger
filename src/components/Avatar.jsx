const COLORS = ['#7B61FF', '#FF7A59', '#2FBF71', '#3FA2F7', '#F73F8F', '#F7A93F']

function colorFor(name) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function Avatar({ name }) {
  const initial = (name.trim()[0] || '?').toUpperCase()
  return (
    <span className="avatar" style={{ backgroundColor: colorFor(name) }}>
      {initial}
    </span>
  )
}
