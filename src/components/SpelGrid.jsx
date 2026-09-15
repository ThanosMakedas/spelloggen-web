import SpelCard from './SpelCard.jsx'
import './SpelGrid.css'

function SpelGrid({ spel, onEdit }) {
  if (spel.length === 0) {
    return <p className="grid-empty">Inga spel i loggen än. Lägg till ditt första!</p>
  }

  return (
    <div className="grid">
      {spel.map((s) => (
        <SpelCard key={s.id} spel={s} onEdit={onEdit} />
      ))}
    </div>
  )
}

export default SpelGrid
