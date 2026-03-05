import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import MemoryExplorer from "./pages/MemoryExplorer";
import CreateApp from "./pages/createApp";
import ManageApps from "./pages/ManageApps";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Clerk UI Routes */}
            <Route
              path="/login"
              element={
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
                  <SignIn routing="path" path="/login" signUpUrl="/signup" />
                </div>
              }
            />

            <Route
              path="/signup"
              element={
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
                  <SignUp routing="path" path="/signup" signInUrl="/login" />
                </div>
              }
            />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            <Route
              path="/explorer"
              element={
                <>
                  <SignedIn>
                    <DashboardLayout>
                      <MemoryExplorer />
                    </DashboardLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            <Route
              path="/create-app"
              element={
                <SignedIn>
                  <DashboardLayout>
                    <CreateApp />
                  </DashboardLayout>
                </SignedIn>
              }
            />

            <Route
              path="/manage-apps"
              element={
                <SignedIn>
                  <DashboardLayout>
                    <ManageApps />
                  </DashboardLayout>
                </SignedIn>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
