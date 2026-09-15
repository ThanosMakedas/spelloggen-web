import './Header.css'

// antal is null while the list is not loaded yet, so no count is shown then.
function Header({ antal, onAdd }) {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">
          Spel<span>loggen</span>
        </h1>
        {antal != null && <p className="header-subtitle">{antal} spel i loggen</p>}
      </div>

      <button type="button" className="btn btn-primary" onClick={onAdd}>
        + Lägg till spel
      </button>
    </header>
  )
}

export default Header
