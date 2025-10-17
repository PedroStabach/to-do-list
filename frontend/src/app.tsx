import "./App.css";
import { Account } from "./Components/Account";
import { Task } from "./Components/Tasks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./Routes/PrivateRoute";
import { Register } from "./Components/Register";

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
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
