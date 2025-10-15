import './App.css'
import { Account } from './Components/Account'
import { Task } from './Components/Tasks'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './Routes/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* rota protegida */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Task />
            </PrivateRoute>
          }
        />

        {/* rota pública */}
        <Route path="/login" element={<Account />} />
      </Routes>
    </Router>
  )
}

export default App
