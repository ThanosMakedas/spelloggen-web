import { bildUrl } from '../api.js'
import './SpelCard.css'

// "2026-09-14T00:00:00" becomes "14 sep. 2026".
function formateraDatum(datum) {
  return new Date(datum).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function SpelCard({ spel }) {
  const bild = bildUrl(spel)

  return (
    <article className="card">
      <div className="card-cover">
        {bild && <img src={bild} alt={`Omslag för ${spel.titel}`} loading="lazy" />}
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
      </div>
    </article>
  )
}

export default SpelCard
