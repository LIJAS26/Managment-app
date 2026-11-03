import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { validateLogin } from '../utils/validation.js'

function Field({ label, name, type = 'text', value, onChange, error, placeholder, autoComplete, trailing }) {
  const stateClass = error ? 'invalid' : value ? 'valid' : ''
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={`input-wrap ${stateClass}`}>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
        />
        {trailing}
      </span>
      <span className={`field-message ${error ? 'field-error' : ''}`}>{error || (value ? 'Looks good' : '\u00a0')}</span>
    </label>
  )
}

export default function LoginPage() {
  const { user, login, isLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const errors = validateLogin(values)

  if (!isLoading && user) return <Navigate to="/dashboard" replace />

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setTouched((current) => ({ ...current, [name]: true }))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (Object.values(errors).some(Boolean)) return
    setSubmitting(true)
    setFormError('')
    try {
      await login({ ...values, remember })
      showToast('Welcome back.')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell mode="login">
      <div className="form-heading">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Good to see you.</h1>
        <p>Pick up right where you left off.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={updateField}
          error={touched.email ? errors.email : ''}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={updateField}
          error={touched.password ? errors.password : ''}
          placeholder="Enter your password"
          autoComplete="current-password"
          trailing={
            <button className="input-action" type="button" onClick={() => setShowPassword((shown) => !shown)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />
        <div className="form-options">
          <label className="check-label">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <span className="custom-check" /> Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        {formError && <p className="form-alert" role="alert">{formError}</p>}
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? <><span className="button-spinner" /> Signing in...</> : <>Sign in <span>→</span></>}
        </button>
      </form>
      <p className="switch-auth">New around here? <Link to="/register">Create an account <span>↗</span></Link></p>
      <p className="form-note">Your account is private, secure, and yours alone.</p>
    </AuthShell>
  )
}
