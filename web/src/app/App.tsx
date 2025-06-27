import AppLayout from "@/components/Layout/AppLayout";
import CustomerNamePage from "@/features/kiosk/components/CustomerNamePage";
import KioskPage from "@/features/kiosk/components/KioskPage";
import TicketPage from "@/features/kiosk/components/TicketPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/customer-name" element={<CustomerNamePage />} />
        <Route path="/ticket" element={<TicketPage />} />
      </Route>

    </Routes>
  );
}

export default App;