import AppLayout from "@/components/Layout/AppLayout";
import ServicePage from "@/features/service/components/ServicePage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/services" element={<ServicePage />} />

        {/* You can add more service-related routes here */}
        {/* <Route path="/services/:serviceId" element={<ServiceDetailPage />} /> */}
        {/* <Route path="/services/transactions" element={<TransactionsPage />} /> */}
      </Route>

      {/* Auth routes would typically go outside the AppLayout */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}

export default App;