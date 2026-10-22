export function tone(v) {
  if (v >= 7.5) return 'good'
  if (v >= 5) return 'mid'
  return 'low'
}

export default function ScoreBar({ label, hint, value }) {
  return (
    <div className="scorebar">
      <div className="scorebar-top">
        <span className="scorebar-label">{label}</span>
        <span className={`scorebar-value ${tone(value)}`}>{value.toFixed(1)}<small>/10</small></span>
      </div>
      <div className="scorebar-track">
        <div className={`scorebar-fill ${tone(value)}`} style={{ width: `${value * 10}%` }} />
      </div>
      {hint && <span className="scorebar-hint">{hint}</span>}
    </div>
  )
}
