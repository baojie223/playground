import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

async function setup() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  Sentry.init({
    dsn: 'https://850df65fcceb411bbe5b6325e4b6916f@o1128038.ingest.sentry.io/6170320',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    environment: 'development',
    initialScope: {
      user: { email: 'baojiedashuibi@gmail.com' }
    }
  })
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}

setup()
