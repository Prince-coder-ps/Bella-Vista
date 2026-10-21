export const RESTAURANT = {
  name: 'Bella Vista',
  tagline: 'Authentic Italian Cuisine',
  address: '123 Italian Street, City Center, NY 10001',
  phone: '(555) 123-4567',
  email: 'info@bellavista.com',
  hours: [
    { days: 'Monday – Thursday', time: '11:00 AM – 10:00 PM' },
    { days: 'Friday – Saturday', time: '11:00 AM – 11:00 PM' },
    { days: 'Sunday', time: '12:00 PM – 9:00 PM' },
  ],
  social: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
  },
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
  { label: 'Reservation', to: '/reservation' },
  { label: 'Contact', to: '/contact' },
];

export const ORDER_STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
export const RESERVATION_STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

export const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM',
];
