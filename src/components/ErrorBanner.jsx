import './ErrorBanner.css'

// onRetry is optional. It is only passed when trying again makes sense,
// for example when the list could not be loaded.
function ErrorBanner({ meddelande, onRetry, onClose }) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-banner-icon" aria-hidden="true">
        !
      </span>
      <p className="error-banner-text">{meddelande}</p>

      <div className="error-banner-actions">
        {onRetry && (
          <button type="button" className="btn" onClick={onRetry}>
            Försök igen
          </button>
        )}
        <button
          type="button"
          className="btn error-banner-close"
          onClick={onClose}
          aria-label="Stäng felmeddelandet"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ErrorBanner
