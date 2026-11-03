import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/AuthShell.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [notice, setNotice] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  function handleLogout() {
    logout()
    showToast('You have been signed out.')
    navigate('/login', { replace: true })
  }

  function handleAvatarUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setNotice('Choose an image file to update your profile photo.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice('That image is too large. Choose a file under 2 MB.')
      return
    }
    setNotice('Photo preview updated. File uploads need a storage service to persist.')
    setAvatar(URL.createObjectURL(file))
    showToast('Profile photo preview updated.')
  }

  function simulateEmailVerification() {
    setEmailVerified(true)
    showToast('Email verification simulated for this demo.')
  }

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Recently'

  return (
    <main className="dashboard-page min-h-screen">
      <header className="dashboard-nav">
        <BrandMark />
        <div className="nav-right">
          <span className="nav-greeting">YOUR PERSONAL SPACE</span>
          <ThemeToggle />
          <button type="button" className="logout-button" onClick={handleLogout}>Log out <span>↗</span></button>
        </div>
      </header>
      <section className="dashboard-main">
        <div className="dashboard-intro">
          <p className="eyebrow">YOUR DASHBOARD <span className="intro-dot" /> MEMBER SINCE {joined.toUpperCase()}</p>
          <h1>Welcome to your<br /><em>own little corner,</em> {user?.fullName?.split(' ')[0] || 'friend'}.</h1>
          <p className="dashboard-description">This is your space. Make yourself at home.</p>
        </div>
        <div className="profile-layout">
          <section className="profile-card">
            <div className="profile-card-top"><span>YOUR PROFILE</span><span className="profile-status"><i /> ACTIVE MEMBER</span></div>
            <div className="profile-person">
              <div className="avatar-wrap">
                {avatar
                  ? <img className="profile-avatar" src={avatar} alt={`${user?.fullName}'s profile`} />
                  : <div className="profile-avatar avatar-fallback">{initials(user?.fullName)}</div>}
                <label className="avatar-edit" title="Update profile photo">
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} aria-label="Upload profile photo" />
                  <span>+</span>
                </label>
              </div>
              <div className="profile-info">
                <h2>{user?.fullName}</h2>
                <p>@{user?.username}</p>
              </div>
            </div>
            {notice && <p className="profile-notice" role="status">{notice}</p>}
            <div className="profile-divider" />
            <dl className="profile-details">
              <div><dt>EMAIL ADDRESS</dt><dd>{user?.email}</dd></div>
              <div><dt>MEMBER SINCE</dt><dd>{joined}</dd></div>
              <div>
                <dt>EMAIL STATUS</dt>
                <dd>
                  {emailVerified
                    ? <><span className="verified-mark">✓</span> Verified (demo)</>
                    : <><span>Not verified</span><button className="verify-button" type="button" onClick={simulateEmailVerification}>Simulate verification</button></>}
                </dd>
              </div>
            </dl>
            <div className="profile-card-bottom"><span>YOUR ACCOUNT, YOUR WAY.</span><span>✳</span></div>
          </section>
          <aside className="dashboard-aside">
            <div className="note-card">
              <span className="note-icon">✳</span>
              <p className="eyebrow">A NOTE FOR YOU</p>
              <h3>Progress looks<br />different on everyone.</h3>
              <p>Take your time. You’re exactly where you need to be.</p>
              <span className="note-scribble">keep going ↗</span>
            </div>
            <div className="aside-stats">
              <span className="aside-stat-number">01</span>
              <p>One small step<br />can change a day.</p>
            </div>
          </aside>
        </div>
        <footer className="dashboard-footer"><span>© 2026 NORTHSTAR</span><span>MADE FOR THE WAY YOU MOVE THROUGH LIFE <i>✳</i></span></footer>
      </section>
    </main>
  )
}
