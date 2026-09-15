// Every call to the API goes through this file, so the address
// and the error handling live in one place.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5080'

async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, options)
  } catch {
    // fetch only throws when no response came back at all,
    // which is what happens when the API is not running.
    throw new Error('Kunde inte nå API:et. Kontrollera att det är startat.')
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  // 204 No Content has no body to read.
  if (response.status === 204) return null

  return response.json()
}

// Turns an error response from the API into one readable Swedish sentence.
async function readErrorMessage(response) {
  if (response.status === 404) {
    return 'Spelet hittades inte. Det kan ha tagits bort.'
  }

  const text = await response.text()

  try {
    const problem = JSON.parse(text)

    // Validation errors look like { errors: { Titel: ["Titel måste fyllas i."] } }.
    if (problem.errors) return Object.values(problem.errors).flat().join(' ')
    if (typeof problem === 'string') return problem
  } catch {
    // Not JSON. The upload endpoint sends its messages as plain text.
    if (text) return text
  }

  return `Något gick fel i API:et (${response.status}).`
}

export function getAllaSpel() {
  return request('/api/spel')
}

export function getSpel(id) {
  return request(`/api/spel/${id}`)
}

export function skapaSpel(spel) {
  return request('/api/spel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spel),
  })
}

export function uppdateraSpel(id, spel) {
  return request(`/api/spel/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spel),
  })
}

export function laddaUppBild(id, fil) {
  const form = new FormData()
  form.append('fil', fil)

  // No Content-Type header here. The browser sets it, including the multipart boundary.
  return request(`/api/spel/${id}/bild`, { method: 'POST', body: form })
}

// The API stores paths like "/uploads/pubg.svg". The web app runs on another port,
// so the path needs the API address in front of it.
export function bildUrl(spel) {
  return spel.bildUrl ? `${API_URL}${spel.bildUrl}` : null
}
