import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';
import ScrollRestoration from './ScrollRestoration';
import CartDrawer from '../cart/CartDrawer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
      <CartDrawer />
    </div>
  );
}
