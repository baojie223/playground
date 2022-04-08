import { ErrorBoundary, withProfiler } from '@sentry/react'
import { useState } from 'react'
import Comp1 from './Comp1'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light')

  console.log(window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <ErrorBoundary>
      <div className="App">
        <button onClick={() => {
          const newTheme = theme === 'light' ? 'dark' : 'light'
          setTheme(theme === 'light' ? 'dark' : 'light')
          document.documentElement.setAttribute('data-theme', newTheme)
          localStorage.setItem('theme', newTheme)
        }}>{theme}</button>
        <h1>theme will change</h1>
      </div>
    </ErrorBoundary>
  )
}

export default withProfiler(App)
