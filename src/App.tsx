import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardOverviewPage } from "./pages/dashboard/OverviewPage";
import { DashboardPage } from "./pages/dashboard";
import { RecordsListPage } from "./pages/records/RecordsListPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { BatchLogPage } from "./pages/records/BatchLogPage";

/**
 * Root application entry with authentication routing.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/overview"
            element={
              <ProtectedRoute>
                <DashboardOverviewPage />
              </ProtectedRoute>
            }
          />

          <Route path="/records" element={<Navigate to="/records/sensor" replace />} />
          <Route
            path="/records/sensor"
            element={
              <ProtectedRoute>
                <RecordsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/records/batch"
            element={
              <ProtectedRoute>
                <BatchLogPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
