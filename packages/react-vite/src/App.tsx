import { ErrorBoundary, withProfiler } from '@sentry/react'
import Comp1 from './Comp1'

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <button>Break the world</button>
        <Comp1 />
      </div>
    </ErrorBoundary>
  )
}

export default withProfiler(App)
