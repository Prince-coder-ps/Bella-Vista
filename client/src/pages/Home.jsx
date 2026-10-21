import Hero from '../components/home/Hero';
import Highlights from '../components/home/Highlights';
import FeaturedMenu from '../components/home/FeaturedMenu';
import AboutPreview from '../components/home/AboutPreview';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Highlights />
      <FeaturedMenu />
      <AboutPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
