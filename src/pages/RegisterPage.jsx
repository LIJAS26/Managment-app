import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { validateRegistration } from '../utils/validation.js'

function RegistrationField({ label, name, type = 'text', value, onChange, error, placeholder, autoComplete, trailing, hint }) {
  const inputState = error ? 'invalid' : value ? 'valid' : ''
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={`input-wrap ${inputState}`}>
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
      <span className={`field-message ${error ? 'field-error' : ''}`}>{error || (value ? 'Looks good' : hint || '\u00a0')}</span>
    </label>
  )
}

export default function RegisterPage() {
  const { user, register, checkUsername, isLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState({ username: '', fullName: '', email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [usernameCheck, setUsernameCheck] = useState({ username: '', status: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const errors = validateRegistration(values)

  useEffect(() => {
    const username = values.username.trim()
    if (errors.username || !touched.username) {
      return undefined
    }

    let active = true
    const timer = window.setTimeout(async () => {
      try {
        const available = await checkUsername(username)
        if (active) setUsernameCheck({ username, status: available ? 'available' : 'taken' })
      } catch {
        if (active) setUsernameCheck({ username, status: 'unavailable' })
      }
    }, 350)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [values.username, touched.username, errors.username, checkUsername])
  const usernameStatus = usernameCheck.username === values.username.trim() ? usernameCheck.status : ''

  if (!isLoading && user) return <Navigate to="/dashboard" replace />

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setTouched((current) => ({ ...current, [name]: true }))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({ username: true, fullName: true, email: true, password: true })
    if (Object.values(errors).some(Boolean) || usernameStatus === 'taken') return
    setSubmitting(true)
    setFormError('')
    try {
      await register(values)
      showToast('Your account is ready.')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(error.message)
      if (error.message.includes('username')) {
        setUsernameCheck({ username: values.username.trim(), status: 'taken' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const usernameError = touched.username
    ? errors.username || (usernameStatus === 'taken' ? 'That username is already in use.' : '')
    : ''

  return (
    <AuthShell mode="register">
      <div className="form-heading">
        <span className="eyebrow">YOUR SPACE STARTS HERE</span>
        <h1>Let’s get to know you.</h1>
        <p>A few details, then you’re in.</p>
      </div>
      <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
        <RegistrationField
          label="Full name"
          name="fullName"
          value={values.fullName}
          onChange={updateField}
          error={touched.fullName ? errors.fullName : ''}
          placeholder="Your name"
          autoComplete="name"
        />
        <RegistrationField
          label="Username"
          name="username"
          value={values.username}
          onChange={updateField}
          error={usernameError}
          placeholder="Choose a username"
          autoComplete="username"
          hint="3–20 characters"
          trailing={
            usernameStatus === 'available' && !errors.username
              ? <span className="username-available" aria-label="Username is available">✓</span>
              : null
          }
        />
        {usernameStatus === 'unavailable' && <p className="inline-notice">Username availability could not be checked. Try again shortly.</p>}
        <RegistrationField
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={updateField}
          error={touched.email ? errors.email : ''}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <RegistrationField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={updateField}
          error={touched.password ? errors.password : ''}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          hint="6 characters minimum"
          trailing={
            <button className="input-action" type="button" onClick={() => setShowPassword((shown) => !shown)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />
        {formError && <p className="form-alert" role="alert">{formError}</p>}
        <button className="primary-button" type="submit" disabled={submitting || usernameStatus === 'taken'}>
          {submitting ? <><span className="button-spinner" /> Creating account...</> : <>Create account <span>→</span></>}
        </button>
      </form>
      <p className="switch-auth">Already have an account? <Link to="/login">Sign in <span>↗</span></Link></p>
      <p className="form-note">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
    </AuthShell>
  )
}
