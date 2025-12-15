import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './Pages/LoginPage'
import { Route, Routes } from 'react-router-dom'
import AdminPannel from './Pages/AdminPannel'
import { useAuth } from './Context/AuthContext'
import { ToastContainer } from 'react-toastify'

function App() {
  const [count, setCount] = useState(0)
  const {token} = useAuth()


   return (
    <>
     <ToastContainer />
      {token === "" ? (
        <LoginPage />
      ) : (
        
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AdminPannel />} />
        </Routes>
      )}
    </>
  );
}

export default App
