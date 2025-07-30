'use client';

import Link from 'next/link';
import { useState,useEffect} from 'react';
import Image from 'next/image';
import Navbar from './components/Navbar';
import { Phone, MapPin, Instagram, Globe, Facebook, Info, Lightbulb, Users, Leaf, ChevronLeft, ChevronRight, Quote } from 'lucide-react'; // Replaced Web with Globe


export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000); // Hide message after 3s
    }
  };
  const images = [
    '/images/enku_placeholder.png',
    '/images/prodact_placeholder.jpg',
    '/images/prodact_placeholder2.jpg',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, 4000); // Change image every 4 seconds

  return () => clearInterval(interval);
}, []);
  const products = [
    {
      id: 1,
      name: 'Wall Art',
      
      image: '/images/prodact_placeholder.jpg',
      description: 'Beautifully crafted basket made by local artisans.',
    },
    {
      id: 2,
      name: 'sphone coffee maker',
   
      image: '/images/prodact_placeholder3.webp',
      description: 'Freshly roasted coffee from Ethiopian highlands.',
    },
    {
      id: 3,
      name: 'Nion light',
    
      image: '/images/prodact_placeholder2.jpg',
      description: 'Comfortable, handmade sandals for everyday wear.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}

     <section className="container mx-auto px-4 py-6 sm:py-8 mt-12 sm:mt-16">
      <div className="relative overflow-hidden rounded-3xl shadow-lg bg-white">
        {/* Flex layout: stacked on mobile, side-by-side on md+ */}
        <div className="flex flex-col md:flex-row h-auto min-h-[400px] md:h-[500px] lg:h-[600px]">

          {/* Left Side - Welcome Message */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col items-center justify-center text-center md:text-left z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Welcome to <span className="text-[#FFA500]">Enku Gebeya</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 max-w-md mx-auto md:mx-0">
              Discover a new era of marketplace excellence. Enku Gebeya is your trusted platform for quality and convenience.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href="/products">
                <button
                  className="w-full sm:w-auto bg-[#FFA500] text-white px-6 py-3 rounded-full shadow hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition duration-300 font-medium"
                >
                   Products
                </button>
              </Link>
              <Link href="/about">
                <button
                  className="w-full sm:w-auto bg-gray-100 text-[#FFA500] px-6 py-3 rounded-full border border-[#FFA500] hover:bg-orange-50 focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition duration-300 font-medium"
                >
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          {/* Animated Divider (only on desktop) */}
          <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-4 z-20">
            <div className="h-full w-full animate-pulse bg-gradient-to-b from-orange-400 via-orange-500 to-yellow-400 rounded-full shadow-lg blur-sm"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full animate-bounce opacity-20">
              <div className="w-full h-full bg-gradient-to-b from-[#FFA500] to-white rounded-full blur-md"></div>
            </div>
          </div>

          {/* Right Side - Image Slider */}
          <div className="relative w-full md:w-1/2 h-64 sm:h-80 md:h-auto flex items-center justify-center">
            {/* Glowing Background */}
            <div className="absolute inset-0 rounded-r-3xl z-0 pointer-events-none">
              <div className="w-full h-full rounded-r-3xl bg-gradient-to-br from-orange-400 via-yellow-300 to-orange-500 blur-2xl opacity-30 animate-pulse"></div>
            </div>

            {/* Image Slider */}
            <div className="relative w-full h-full overflow-hidden rounded-r-3xl z-10">
              {images.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover object-center rounded-r-3xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>


{/* Glowing Horizontal SVG Divider */}
<div className="hidden md:block w-full overflow-hidden relative -mt-2">
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className="w-full h-12 text-orange-400 rotate-180"
    style={{
      filter: 'drop-shadow(0 0 6px #FFA500) drop-shadow(0 0 10px #FFA500)',
    }}
  >
    <path
      d="M0,50 C30,0 70,100 100,50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
</div>


{/* Product Showcase */}
<section className="py-20 bg-gray-50 relative z-10">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
      Featured Products
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition duration-300"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-56 object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <Link
                href="/products"
                className="bg-[#FFA500] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="text-center mt-12">
      <Link
        href="/products"
        className="text-[#FFA500] text-lg font-semibold hover:underline transition"
      >
        See All Products
      </Link>
    </div>
  </div>
</section>


{/* Glowing Horizontal SVG Divider */}
<div className="hidden md:block w-full overflow-hidden relative -mt-2">
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className="w-full h-12 text-orange-400 rotate-180"
    style={{
      filter: 'drop-shadow(0 0 6px #FFA500) drop-shadow(0 0 10px #FFA500)',
    }}
  >
    <path
      d="M0,50 C30,0 70,100 100,50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
</div>
{/* Testimonial Section */}
<section className="py-16 bg-gradient-to-b from-gray-100 to-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
      What Our Customers Are Saying
    </h2>

    <div className="flex flex-wrap justify-center gap-10">
      {/* Testimonial 1 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs transform hover:scale-105 transition duration-300">
        <div className="relative mb-4">
          <Image
            src="/images/enku_placeholder.png"
            alt="Customer 1"
            width={100}
            height={100}
            className="rounded-full border-4 border-orange-400 mx-auto"
          />
        </div>
        <p className="text-lg text-gray-600 mb-4">
          "Enku Gebeya has changed the way I shop online. Their products are of
          incredible quality, and their service is outstanding!"
        </p>
        <p className="text-xl font-semibold text-gray-800">Jane Doe</p>
        <p className="text-gray-500">Frequent Shopper</p>
      </div>

      {/* Testimonial 2 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs transform hover:scale-105 transition duration-300">
        <div className="relative mb-4">
          <Image
             src="/images/enku_placeholder.png"
            alt="Customer 2"
            width={100}
            height={100}
            className="rounded-full border-4 border-orange-400 mx-auto"
          />
        </div>
        <p className="text-lg text-gray-600 mb-4">
          "The quality and craftsmanship of the items on Enku Gebeya are second
          to none. Highly recommend for anyone looking for authentic products."
        </p>
        <p className="text-xl font-semibold text-gray-800">John Smith</p>
        <p className="text-gray-500">Small Business Owner</p>
      </div>

      {/* Testimonial 3 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs transform hover:scale-105 transition duration-300">
        <div className="relative mb-4">
          <Image
            src="/images/enku_placeholder.png"
            alt="Customer 3"
            width={100}
            height={100}
            className="rounded-full border-4 border-orange-400 mx-auto"
          />
        </div>
        <p className="text-lg text-gray-600 mb-4">
          "Fast, efficient, and reliable. I will definitely be a repeat customer.
          Enku Gebeya offers an unparalleled shopping experience."
        </p>
        <p className="text-xl font-semibold text-gray-800">Sara Lee</p>
        <p className="text-gray-500">Lifestyle Blogger</p>
      </div>
    </div>


  </div>
</section>


{/* Glowing Horizontal SVG Divider */}
<div className="hidden md:block w-full overflow-hidden relative -mt-2">
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className="w-full h-12 text-orange-400 rotate-180"
    style={{
      filter: 'drop-shadow(0 0 6px #FFA500) drop-shadow(0 0 10px #FFA500)',
    }}
  >
    <path
      d="M0,50 C30,0 70,100 100,50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
</div>
  {/* 3. Contact Section (Integrated ContactCard) */}
      <section style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ContactCard />
      </section>

{/* Glowing Horizontal SVG Divider */}
<div className="hidden md:block w-full overflow-hidden relative -mt-2">
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className="w-full h-12 text-orange-400 rotate-180"
    style={{
      filter: 'drop-shadow(0 0 6px #FFA500) drop-shadow(0 0 10px #FFA500)',
    }}
  >
    <path
      d="M0,50 C30,0 70,100 100,50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
</div>
          {/* 4. Map Section */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#F9FAFB' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem', color: '#111827' }}>Find Us Here</h2>
        <div style={{ width: '100%', maxWidth: '64rem', margin: '0 auto', height: '24rem', boxShadow: '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)', borderRadius: '1rem', overflow: 'hidden', border: '4px solid #FFA500' }}>
          <iframe
            title="Company Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.210459733075!2d144.9630576153163!3d-37.81627997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b260905e97%3A0x5045678462939d0!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1678854321000!5m2!1sen!2sau" // Example Google Maps embed URL
            width="100%"
            height="100%"
            loading="lazy"
            style={{ border: 0, width: '100%', height: '100%' }}
          ></iframe>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Enku Gebeya. All rights reserved.</p>
        
        </div>
      </footer>
    </div>
  );
}

// ContactCard component (reused from previous request)
const ContactCard = () => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '70rem', backgroundColor: '#FFA500', color: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Absolute positioned circles for a modern design touch */}
      <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '8rem', height: '8rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', filter: 'blur(4px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-4rem', left: '-4rem', width: '8rem', height: '8rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', filter: 'blur(4px)' }}></div>

      {/* Contact Title */}
      <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center', letterSpacing: '-0.025em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        Contact Us
      </h2>

      {/* Contact Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '42rem' }}>
        {/* Phone Number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', transition: 'all 300ms ease-in-out' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Phone size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>123-456-7890</span>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', transition: 'all 300ms ease-in-out' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <MapPin size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>123 Main St, Anytown</span>
        </div>

        {/* Instagram */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', transition: 'all 300ms ease-in-out' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Instagram size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>@your_instagram</span>
        </div>

        {/* TikTok - Using Globe icon as a generic web/social icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', transition: 'all 300ms ease-in-out' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Globe size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>@your_tiktok</span>
        </div>

        {/* Facebook */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', transition: 'all 300ms ease-in-out' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Facebook size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>/your_facebook</span>
        </div>

        {/* Other */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', transition: 'all 300ms ease-in-out' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Info size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>Additional Info Here</span>
        </div>
      </div>

      {/* Optional: A small footer or call to action */}
      <p style={{ marginTop: '2rem', color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', fontSize: '0.875rem' }}>
        Reach out to us for more information!
      </p>
    </div>
  );
};