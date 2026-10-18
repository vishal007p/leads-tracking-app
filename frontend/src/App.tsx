import { Route, Routes } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Leads from "./pages/leads/Leads";
import LeadDetails from "./pages/leadDetail/LeadDetail";
import NotFound from "./pages/notFound/NotFound";
import AddLead from "./pages/leads/AddLead";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />

        {/* Add Lead */}
        <Route path="leads/new" element={<AddLead />} />

        {/* Lead Details */}
        <Route path="leads/:id" element={<LeadDetails />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}