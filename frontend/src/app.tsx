import "./App.css";
import { Account } from "./Components/Account";
import { Task } from "./Components/Tasks";
import { Register } from "./Components/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./Routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota protegida */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Task />
            </PrivateRoute>
          }
        />

        {/* Rotas públicas */}
        <Route path="/login" element={<Account />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
