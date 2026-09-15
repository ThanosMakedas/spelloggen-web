import { bildUrl } from '../api.js'
import StatusBadge from './StatusBadge.jsx'
import './SpelCard.css'

// "2026-09-14T00:00:00" becomes "14 sep. 2026".
function formateraDatum(datum) {
  return new Date(datum).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function SpelCard({ spel, onEdit }) {
  const bild = bildUrl(spel)

  return (
    <article className="card">
      <div className="card-cover">
        {/* BildUrl is nullable, so a game without a cover gets a placeholder instead. */}
        {bild ? (
          <img src={bild} alt={`Omslag för ${spel.titel}`} loading="lazy" />
        ) : (
          <div className="card-placeholder">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M20 22h24a10 10 0 0 1 9.8 8l2 10a6 6 0 0 1-10.3 5.2L41 41H23l-4.5 4.2A6 6 0 0 1 8.2 40l2-10A10 10 0 0 1 20 22z" />
              <path d="M22 29v8M18 33h8" />
            </svg>
            <span>Ingen bild</span>
          </div>
        )}
        <StatusBadge status={spel.status} />
      </div>

      <div className="card-body">
        <h2 className="card-title">{spel.titel}</h2>

        <dl className="card-facts">
          <div>
            <dt>Plattform</dt>
            <dd>{spel.plattform}</dd>
          </div>
          <div>
            <dt>Rank</dt>
            {/* Rank is nullable, so show a muted text instead of an empty field. */}
            <dd className={spel.rank ? '' : 'muted'}>{spel.rank ?? 'Ingen rank'}</dd>
          </div>
          <div>
            <dt>Spelade timmar</dt>
            <dd>{spel.speladeTimmar.toLocaleString('sv-SE')} h</dd>
          </div>
          <div>
            <dt>Senast spelad</dt>
            <dd>{formateraDatum(spel.senastSpelad)}</dd>
          </div>
        </dl>

        {spel.anteckningar && <p className="card-notes">{spel.anteckningar}</p>}

        <div className="card-actions">
          <button type="button" className="btn" onClick={() => onEdit(spel)}>
            Redigera
          </button>
        </div>
      </div>
    </article>
  )
}

export default SpelCard
