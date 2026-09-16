import { useCallback, useEffect, useState } from 'react'
import { getAllaSpel, laddaUppBild, skapaSpel, uppdateraSpel } from './api.js'
import ErrorBanner from './components/ErrorBanner.jsx'
import Header from './components/Header.jsx'
import Loading from './components/Loading.jsx'
import SpelForm from './components/SpelForm.jsx'
import SpelGrid from './components/SpelGrid.jsx'

// Same order as the API: most recently played first.
function sortera(lista) {
  return [...lista].sort((a, b) => b.senastSpelad.localeCompare(a.senastSpelad))
}

function App() {
  // null until the API has answered, so "no games" and "not loaded yet"
  // are not mixed up.
  const [spel, setSpel] = useState(null)
  const [laddar, setLaddar] = useState(true)

  // { meddelande, kanForsokaIgen } or null.
  const [fel, setFel] = useState(null)

  // The open form: { spel: null } when adding a new game,
  // { spel } when editing one, null when the form is closed.
  const [form, setForm] = useState(null)

  // Every setState in here runs after the API has answered, never straight away,
  // so it is safe to call from the effect. useCallback keeps the same function
  // between renders, so the effect only runs once.
  const hamtaSpel = useCallback(() => {
    return getAllaSpel()
      .then(setSpel)
      .catch((err) => {
        // Show the problem on the page instead of crashing or loading forever.
        setFel({ meddelande: err.message, kanForsokaIgen: true })
      })
      .finally(() => setLaddar(false))
  }, [])

  useEffect(() => {
    hamtaSpel()
  }, [hamtaSpel])

  function forsokIgen() {
    setLaddar(true)
    setFel(null)
    hamtaSpel()
  }

  // Called by SpelForm, both for a new game and for an edited one. If the API call
  // fails, the error goes back to the form, which stays open and shows it.
  async function sparaSpel(data) {
    if (form.spel) {
      const id = form.spel.id
      await uppdateraSpel(id, data)

      // PUT answers 204 without a body, so merge the changes into the game we have.
      // The cover is not part of the form, so bildUrl stays as it was.
      setSpel((lista) => sortera(lista.map((s) => (s.id === id ? { ...s, ...data } : s))))
    } else {
      const nytt = await skapaSpel(data)
      setSpel((lista) => sortera([...(lista ?? []), nytt]))
    }

    setForm(null)
  }

  // The card shows "Laddar upp..." while this runs. An error is shown in the banner
  // instead of being thrown back, so the card can go back to its normal state.
  async function laddaUpp(id, fil) {
    try {
      const uppdaterat = await laddaUppBild(id, fil)
      setSpel((lista) => lista.map((s) => (s.id === id ? uppdaterat : s)))
      setFel(null)
    } catch (err) {
      setFel({ meddelande: err.message, kanForsokaIgen: false })
    }
  }

  // Used when the file is rejected in the browser, before it is sent.
  function visaFel(meddelande) {
    setFel({ meddelande, kanForsokaIgen: false })
  }

  return (
    <div className="container">
      <Header antal={spel?.length ?? null} onAdd={() => setForm({ spel: null })} />

      {fel && (
        <ErrorBanner
          meddelande={fel.meddelande}
          onRetry={fel.kanForsokaIgen ? forsokIgen : undefined}
          onClose={() => setFel(null)}
        />
      )}

      {laddar && <Loading />}

      {spel && (
        <SpelGrid
          spel={spel}
          onEdit={(s) => setForm({ spel: s })}
          onUpload={laddaUpp}
          onError={visaFel}
        />
      )}

      {form && <SpelForm spel={form.spel} onSave={sparaSpel} onCancel={() => setForm(null)} />}
    </div>
  )
}

export default App
