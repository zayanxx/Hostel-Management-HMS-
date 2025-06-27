import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import About from './components/common/About';
import Contact from './components/common/Contact';
import AdminLogin from './features/admin/AdminLogin';
import AdminRegister from './features/admin/AdminRegister';
import UserLogin from './features/auth/Login';
import Register from './features/auth/Register';
import Header from './components/common/Header';

// admin routes
import AdminDashboard from './features/admin/AdminDashboard';
import AdminLayout from './Layouts/AdminLayout';
import AdminAttendancePage from './features/admin/AdminAttendance';
import AdminBillingPage from './features/admin/AdminBillingPage';
import AdminBooking from './features/admin/AdminBooking';
import AdminComplaint from './features/admin/AdminComplaint';
import AdminFood from './features/admin/AdminFood';
import AdminFoodOrder from './features/admin/AdminFoodOrder';
import AdminInvoice from './features/admin/AdminInvoice';
import AdminMaintenance from './features/admin/AdminMaintenance';
import AdminPayment from './features/admin/AdminPayment';
import AdminResident from './features/admin/AdminResident';
import AdminRoom from './features/admin/AdminRoom';
import AdminStaff from './features/admin/AdminStaff';
import AdminSuggestion from './features/admin/AdminSuggestion';
import AdminProfile from './features/admin/AdminProfile';

// resident routes
import ResidentBilling from './features/resident/ResidentBilling';
import ResidentBooking from './features/resident/ResidentBooking';
import ResidentDashboard from './features/resident/ResidentDashboard';
import ResidentLayout from './Layouts/ResidentLayout';
import ResidentRoom from './features/resident/ResidentRoom';
import ResidentComplaint from './features/resident/ResidentComplaint';
import ResidentFoodOrder from './features/resident/ResidentFoodOrder';
import ResidentInvoice from './features/resident/ResidentInvoice';
import ResidentMaintenance from './features/resident/ResidentMaintenance';
import ResidentPayment from './features/resident/ResidentPayment';
import ResidentSuggestion from './features/resident/ResidentSuggestion';

// staff routes
import StaffLayout from './features/staff/StaffLayout';
import StaffDashboard from './features/staff/StaffDashboard';
import StaffAttendance from './features/staff/StaffAttendance';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendancePage />} />
          <Route path="billing" element={<AdminBillingPage />} />
          <Route path="booking" element={<AdminBooking />} />
          <Route path="complaint" element={<AdminComplaint />} />
          <Route path="food" element={<AdminFood />} />
          <Route path="food-order" element={<AdminFoodOrder />} />
          <Route path="invoice" element={<AdminInvoice />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          <Route path="payment" element={<AdminPayment />} />
          <Route path="resident" element={<AdminResident />} />
          <Route path="room" element={<AdminRoom />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="suggestion" element={<AdminSuggestion />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Resident Routes */}
        <Route path="/resident" element={<ResidentLayout/>}>
          <Route index element={<ResidentDashboard/>}/>
          <Route path="/resident/room" element={<ResidentRoom/>}/>
          <Route path="/resident/billing" element={<ResidentBilling/>}/>
          <Route path="/resident/bookings" element={<ResidentBooking/>}/>
          <Route path="/resident/complaints" element={<ResidentComplaint/>}/>
          <Route path="/resident/food-orders" element={<ResidentFoodOrder/>}/>
          <Route path="/resident/invoices" element={<ResidentInvoice/>}/>
          <Route path="/resident/maintenance" element={<ResidentMaintenance/>}/>
          <Route path="/resident/payments" element={<ResidentPayment/>}/>
          <Route path="/resident/suggestions" element={<ResidentSuggestion/>}/>
        </Route>

        {/* Staff Route */}
        <Route path="/staff" element={<StaffLayout />}>
         <Route index element={<StaffDashboard/>}/>
         <Route path="/staff/attendance" element={<StaffAttendance/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
