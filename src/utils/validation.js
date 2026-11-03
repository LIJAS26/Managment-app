const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address.'
  return ''
}

export function validateLogin(values) {
  return {
    email: validateEmail(values.email),
    password: values.password ? '' : 'Password is required.',
  }
}

export function validateRegistration(values) {
  const username = values.username.trim()
  const fullName = values.fullName.trim()
  return {
    username: !username
      ? 'Username is required.'
      : username.length < 3 || username.length > 20
        ? 'Use 3 to 20 characters.'
        : '',
    email: validateEmail(values.email),
    password: values.password
      ? values.password.length < 6
        ? 'Use at least 6 characters.'
        : ''
      : 'Password is required.',
    fullName: !fullName
      ? 'Full name is required.'
      : fullName.length < 2
        ? 'Use at least 2 characters.'
        : '',
  }
}
