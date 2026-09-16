import SpelCard from './SpelCard.jsx'
import './SpelGrid.css'

function SpelGrid({ spel, onEdit, onUpload, onError }) {
  if (spel.length === 0) {
    return <p className="grid-empty">Inga spel i loggen än. Lägg till ditt första!</p>
  }

  return (
    <div className="grid">
      {spel.map((s) => (
        <SpelCard key={s.id} spel={s} onEdit={onEdit} onUpload={onUpload} onError={onError} />
      ))}
    </div>
  )
}

export default SpelGrid
