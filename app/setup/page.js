'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const setupDatabase = async () => {
    setLoading(true)
    setStatus('Setting up database...')

    try {
      const response = await fetch('/api/setup-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret: 'setup123' })
      })

      const data = await response.json()

      if (data.success) {
        setStatus('✅ Database setup complete! You can now use the app.')
      } else {
        setStatus('❌ Setup failed: ' + data.error)
      }
    } catch (error) {
      setStatus('❌ Setup failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Database Setup</h1>
        <p className="text-gray-300 mb-6">
          Click the button below to set up your database tables.
          <br />
          <strong>Only run this once!</strong>
        </p>
        
        <button
          onClick={setupDatabase}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Setting up...' : 'Setup Database'}
        </button>

        {status && (
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <p className="text-sm">{status}</p>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-400">
          After setup is complete, go to{' '}
          <a href="/" className="text-green-400 hover:underline">
            the main app
          </a>
        </div>
      </div>
    </div>
  )
}
