import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import Summary from "./pages/Summary";
import EditHistory from "./pages/EditHistory";
import Subscriptions from "./pages/Subscriptions";
import FixedExpenses from "./pages/FixedExpenses";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/history" element={<EditHistory />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/fixed-expenses" element={<FixedExpenses />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;