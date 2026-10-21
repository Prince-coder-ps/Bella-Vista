import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import PageTransition from './components/ui/PageTransition';

import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Reservation from './pages/Reservation';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import MyAccount from './pages/MyAccount';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import ManageMenu from './admin/pages/ManageMenu';
import ManageReservations from './admin/pages/ManageReservations';
import ManageOrders from './admin/pages/ManageOrders';

function withTransition(element) {
  return <PageTransition>{element}</PageTransition>;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: '12px',
            background: '#2c3e50',
            color: '#fff',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#e74c3c', secondary: '#fff' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={withTransition(<Home />)} />
            <Route path="/menu" element={withTransition(<Menu />)} />
            <Route path="/about" element={withTransition(<About />)} />
            <Route path="/reservation" element={withTransition(<Reservation />)} />
            <Route path="/contact" element={withTransition(<Contact />)} />
            <Route path="/checkout" element={withTransition(<Checkout />)} />
            <Route path="/login" element={withTransition(<Login />)} />
            <Route path="/register" element={withTransition(<Register />)} />

            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={withTransition(<MyAccount />)} />
            </Route>
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<ManageMenu />} />
              <Route path="reservations" element={<ManageReservations />} />
              <Route path="orders" element={<ManageOrders />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
