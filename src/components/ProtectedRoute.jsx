import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="dashboard-page skeleton-page" aria-label="Loading your profile">
        <div className="skeleton-nav"><span /><span /></div>
        <div className="skeleton-content">
          <i className="skeleton-line skeleton-short" />
          <i className="skeleton-line skeleton-title" />
          <i className="skeleton-line skeleton-caption" />
          <div className="skeleton-card"><span /><span /><span /></div>
        </div>
      </div>
    )
  }

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}
