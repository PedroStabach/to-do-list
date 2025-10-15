import './App.css'
import { Account } from './Components/Account'
import { Task } from './Components/Tasks'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './Components/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* rota protegida */}
        <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Task />
            </PrivateRoute>
          }
        />
  <Route path="/login" element={<Account />} />
</Routes>

        {/* rota pública */}
        <Route path="/login" element={<Account />} />
      </Routes>
    </Router>
  )
}

export default App
