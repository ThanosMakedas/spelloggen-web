import './StatusBadge.css'

// One class per status, so each status gets its own neon color in the CSS.
const klasser = {
  'Spelar aktivt': 'badge-aktiv',
  Pausad: 'badge-pausad',
  Slutat: 'badge-slutat',
  'Vill testa': 'badge-vill-testa',
}

function StatusBadge({ status }) {
  return <span className={`badge ${klasser[status] ?? ''}`}>{status}</span>
}

export default StatusBadge
