import { useState } from 'react'
import './SpelForm.css'

const PLATTFORMAR = ['PC', 'PS5', 'Switch']
const STATUSAR = ['Spelar aktivt', 'Pausad', 'Slutat', 'Vill testa']

// Today as "2026-09-15". The Swedish date format happens to be exactly
// what <input type="date"> wants, and it uses local time instead of UTC.
function idag() {
  return new Date().toLocaleDateString('sv-SE')
}

// The game being edited, or an empty form when a new game is added.
function startvarden(spel) {
  return {
    titel: spel?.titel ?? '',
    plattform: spel?.plattform ?? 'PC',
    status: spel?.status ?? 'Spelar aktivt',
    rank: spel?.rank ?? '',
    speladeTimmar: spel?.speladeTimmar ?? 0,
    senastSpelad: spel ? spel.senastSpelad.slice(0, 10) : idag(),
    anteckningar: spel?.anteckningar ?? '',
  }
}

// One form for both adding and editing. spel is null when adding.
// onSave returns a promise. If it fails, the form stays open and shows why.
function SpelForm({ spel, onSave, onCancel }) {
  const [varden, setVarden] = useState(() => startvarden(spel))
  const [sparar, setSparar] = useState(false)
  const [fel, setFel] = useState(null)

  function andra(event) {
    const { name, value } = event.target
    setVarden((v) => ({ ...v, [name]: value }))
  }

  async function skicka(event) {
    event.preventDefault()
    setSparar(true)
    setFel(null)

    try {
      await onSave({
        ...varden,
        titel: varden.titel.trim(),
        // An empty rank is sent as null, which means "no rank" in the API.
        rank: varden.rank.trim() || null,
        speladeTimmar: Number(varden.speladeTimmar) || 0,
        senastSpelad: `${varden.senastSpelad}T00:00:00`,
      })
    } catch (err) {
      // Keep what the user typed and show the message from the API.
      setFel(err.message)
      setSparar(false)
    }
  }

  return (
    <div className="form-overlay">
      <form className="form" onSubmit={skicka}>
        <h2>{spel ? 'Redigera spel' : 'Lägg till spel'}</h2>

        {fel && (
          <p className="form-error" role="alert">
            {fel}
          </p>
        )}

        <label className="form-field form-wide">
          <span>Titel</span>
          <input name="titel" value={varden.titel} onChange={andra} required maxLength={200} />
        </label>

        <label className="form-field">
          <span>Plattform</span>
          <select name="plattform" value={varden.plattform} onChange={andra}>
            {PLATTFORMAR.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Status</span>
          <select name="status" value={varden.status} onChange={andra}>
            {STATUSAR.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>
            Rank <small>(valfri)</small>
          </span>
          <input
            name="rank"
            value={varden.rank}
            onChange={andra}
            maxLength={100}
            placeholder="t.ex. Ascendant"
          />
        </label>

        <label className="form-field">
          <span>Spelade timmar</span>
          <input
            name="speladeTimmar"
            type="number"
            min="0"
            value={varden.speladeTimmar}
            onChange={andra}
          />
        </label>

        <label className="form-field form-wide">
          <span>Senast spelad</span>
          <input
            name="senastSpelad"
            type="date"
            value={varden.senastSpelad}
            onChange={andra}
            required
          />
        </label>

        <label className="form-field form-wide">
          <span>Anteckningar</span>
          <textarea name="anteckningar" rows="3" value={varden.anteckningar} onChange={andra} />
        </label>

        <div className="form-actions form-wide">
          <button type="button" className="btn" onClick={onCancel} disabled={sparar}>
            Avbryt
          </button>
          <button type="submit" className="btn btn-primary" disabled={sparar}>
            {sparar ? 'Sparar...' : 'Spara'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SpelForm
