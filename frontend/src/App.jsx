import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './lib/themeContext'
import { checkHealth } from './lib/api'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './components/pages/LandingPage'
import AnalysisConsolePage from './components/pages/AnalysisConsolePage'
import FeedbackPage from './components/pages/FeedbackPage'
import TermsPage from './components/pages/TermsPage'
import AboutPage from './components/pages/AboutPage'
import Toast from './components/ui/Toast'

export default function App() {
  const [activePage, setActivePage] = useState('landing') // 'landing' | 'console' | 'feedback' | 'terms' | 'about'
  const [initialSampleTrigger, setInitialSampleTrigger] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking' | 'connected' | 'disconnected'

  const refreshBackendHealth = async () => {
    setBackendStatus('checking')
    const health = await checkHealth()
    setBackendStatus(health.ok ? 'connected' : 'disconnected')
  }

  useEffect(() => {
    refreshBackendHealth()
    const timer = setInterval(async () => {
      const health = await checkHealth()
      setBackendStatus(health.ok ? 'connected' : 'disconnected')
    }, 12000)
    return () => clearInterval(timer)
  }, [])

  const handleTriggerDemoFromLanding = (sampleType) => {
    setInitialSampleTrigger(sampleType)
    setActivePage('console')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateToConsole = () => {
    setInitialSampleTrigger(null)
    setActivePage('console')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoHome = () => {
    setInitialSampleTrigger(null)
    setActivePage('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const isLanding = activePage === 'landing'

  return (
    <ThemeProvider>
      <div className="min-h-screen font-sans bg-slate-50 text-slate-900 dark:bg-canvas-dark dark:text-slate-100 transition-colors duration-200 selection:bg-brand-primary/25 selection:text-brand-primary">
        {/* If Landing Page: Fullscreen Layout with Footer */}
        {isLanding ? (
          <div className="flex flex-col min-h-screen">
            <Navbar
              activePage="landing"
              isLanding={true}
              onOpenConsole={handleNavigateToConsole}
              backendStatus={backendStatus}
              onRetryHealth={refreshBackendHealth}
            />

            <main className="flex-1 w-full">
              <LandingPage
                onNavigateToConsole={handleNavigateToConsole}
                onTriggerDemo={handleTriggerDemoFromLanding}
              />
            </main>

            {/* Footer is only rendered on the Home / Landing page */}
            <Footer setActivePage={setActivePage} />
          </div>
        ) : (
          /* Workspace Pages: Sidebar on Left, Content on Right (No Footer) */
          <div className="flex min-h-screen">
            <Sidebar
              activePage={activePage}
              setActivePage={(page) => {
                setInitialSampleTrigger(null)
                setActivePage(page)
              }}
              isOpen={mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
              onGoHome={handleGoHome}
            />

            <div className="flex-1 flex flex-col min-w-0">
              <Navbar
                activePage={activePage}
                isLanding={false}
                onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                backendStatus={backendStatus}
                onRetryHealth={refreshBackendHealth}
              />

              <main className="flex-1 w-full pb-12">
                {activePage === 'console' && (
                  <AnalysisConsolePage
                    initialSampleTrigger={initialSampleTrigger}
                    onCopyToast={showToast}
                    backendStatus={backendStatus}
                    onRetryHealth={refreshBackendHealth}
                  />
                )}

                {activePage === 'feedback' && (
                  <FeedbackPage onToast={showToast} />
                )}

                {activePage === 'terms' && (
                  <TermsPage />
                )}

                {activePage === 'about' && (
                  <AboutPage />
                )}
              </main>
            </div>
          </div>
        )}

        {/* Global Toast Feedback */}
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </ThemeProvider>
  )
}
