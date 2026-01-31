import './App.css'
import Main from "./pages/Main.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Transactions from "./pages/Transactions.tsx";
import Wallets from "./pages/Wallets.tsx";
import Settings from "./pages/Settings.tsx";
function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Main/>}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="wallets" element={<Wallets />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="settings" element={<Settings />} />
              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
