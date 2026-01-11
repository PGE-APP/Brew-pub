import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardOverviewPage } from './pages/DashboardOverviewPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'

/**
 * Root application entry rendering the dashboard page.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/overview" element={<DashboardOverviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
