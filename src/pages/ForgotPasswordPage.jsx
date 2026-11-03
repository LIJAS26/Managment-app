import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { validateEmail } from '../utils/validation.js'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  function handleSubmit(event) {
    event.preventDefault()
    const validationError = validateEmail(email)
    setError(validationError)
    if (validationError) return
    setSubmitted(true)
    showToast('Reset request simulated.')
  }

  return (
    <AuthShell mode="login">
      <div className="form-heading">
        <span className="eyebrow">ACCOUNT SUPPORT</span>
        <h1>Let’s get you back in.</h1>
        <p>Enter your account email to start a password reset.</p>
      </div>
      {submitted ? (
        <div className="reset-success" role="status">
          <span>✓</span>
          <h2>Check your inbox</h2>
          <p>If an account exists for <strong>{email}</strong>, reset instructions would be sent. This demo does not send email.</p>
          <Link to="/login">Back to sign in</Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field-label">Email address</span>
            <span className={`input-wrap ${error ? 'invalid' : email ? 'valid' : ''}`}>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                placeholder="you@example.com"
                aria-invalid={Boolean(error)}
              />
            </span>
            <span className={`field-message ${error ? 'field-error' : ''}`}>{error || '\u00a0'}</span>
          </label>
          <button className="primary-button" type="submit">Send reset instructions <span>→</span></button>
          <p className="switch-auth"><Link to="/login">← Back to sign in</Link></p>
        </form>
      )}
    </AuthShell>
  )
}
