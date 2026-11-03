import { useTheme } from '../contexts/ThemeContext.jsx'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <span>{isDark ? '☼' : '☾'}</span>
      <span className="theme-toggle-label">{isDark ? 'LIGHT' : 'DARK'}</span>
    </button>
  )
}
