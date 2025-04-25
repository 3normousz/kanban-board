import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/protectedRoute';
import LoginPage from './app/(auth-pages)/login/page';
import SignUpPage from './app/(auth-pages)/signup/page';
import { Home } from './app/page';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route 
            path="/signup"
            element={<SignUpPage />}
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
