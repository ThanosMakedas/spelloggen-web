import { useRef } from 'react'

const MAX_STORLEK = 5 * 1024 * 1024

// A normal button that opens the file picker. The real <input type="file">
// is hidden, because it cannot be styled like the other buttons.
function ImageUpload({ harBild, laddarUpp, onUpload, onError }) {
  const inputRef = useRef(null)

  function valjFil(event) {
    const fil = event.target.files[0]

    // Reset, so picking the same file again still triggers onChange.
    event.target.value = ''
    if (!fil) return

    // Same limit as the API, checked here so a big file is not sent for nothing.
    if (fil.size > MAX_STORLEK) {
      onError('Filen är större än 5 MB.')
      return
    }

    onUpload(fil)
  }

  let text = harBild ? 'Byt bild' : 'Ladda upp bild'
  if (laddarUpp) text = 'Laddar upp...'

  return (
    <>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={valjFil} hidden />
      <button
        type="button"
        className="btn"
        onClick={() => inputRef.current.click()}
        disabled={laddarUpp}
      >
        {text}
      </button>
    </>
  )
}

export default ImageUpload
