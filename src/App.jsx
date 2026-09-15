import { useEffect, useState } from 'react'
import { getAllaSpel } from './api.js'
import Header from './components/Header.jsx'
import Loading from './components/Loading.jsx'
import SpelGrid from './components/SpelGrid.jsx'

function App() {
  // null until the API has answered, so "no games" and "not loaded yet"
  // are not mixed up.
  const [spel, setSpel] = useState(null)
  const [laddar, setLaddar] = useState(true)

  useEffect(() => {
    getAllaSpel()
      .then(setSpel)
      .finally(() => setLaddar(false))
  }, [])

  return (
    <div className="container">
      <Header antal={spel?.length ?? null} onAdd={() => {}} />
      {laddar && <Loading />}
      {spel && <SpelGrid spel={spel} />}
    </div>
  )
}

export default App
