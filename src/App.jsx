import { useCallback, useEffect, useState } from 'react'
import { getAllaSpel } from './api.js'
import ErrorBanner from './components/ErrorBanner.jsx'
import Header from './components/Header.jsx'
import Loading from './components/Loading.jsx'
import SpelGrid from './components/SpelGrid.jsx'

function App() {
  // null until the API has answered, so "no games" and "not loaded yet"
  // are not mixed up.
  const [spel, setSpel] = useState(null)
  const [laddar, setLaddar] = useState(true)

  // { meddelande, kanForsokaIgen } or null.
  const [fel, setFel] = useState(null)

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

  return (
    <div className="container">
      <Header antal={spel?.length ?? null} onAdd={() => {}} />

      {fel && (
        <ErrorBanner
          meddelande={fel.meddelande}
          onRetry={fel.kanForsokaIgen ? forsokIgen : undefined}
          onClose={() => setFel(null)}
        />
      )}

      {laddar && <Loading />}
      {spel && <SpelGrid spel={spel} />}
    </div>
  )
}

export default App
