import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LoginForm } from './components/login-form'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </>
  )
}

export default App
