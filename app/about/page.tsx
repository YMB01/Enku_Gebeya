"use client"; // This directive marks the component as a Client Component, allowing the use of React hooks.

import React, { useState, useEffect } from "react";
import { Phone, MapPin, Instagram, Facebook, Link, Info, Lightbulb, Users, Leaf, ChevronLeft, ChevronRight, Quote } from 'lucide-react'; // Added Quote icon
import Navbar from "../components/Navbar"; // Assuming Navbar is also styled without Tailwind

// Hero Slider Data
const heroSlides = [
  {
    image: "https://placehold.co/1920x1080/FFA500/FFFFFF?text=Innovation", // Placeholder image 1
    title: "Innovate. Inspire. Impact.",
    description: "We are a passionate team dedicated to crafting exceptional solutions that drive growth and create lasting value.",
    buttonText: "Learn More",
  },
  {
    image: "https://placehold.co/1920x1080/FF8C00/FFFFFF?text=Creativity", // Placeholder image 2
    title: "Unleashing Creativity",
    description: "Discover how our unique approach fosters groundbreaking ideas and transforms visions into reality.",
    buttonText: "Our Work",
  },
  {
    image: "https://placehold.co/1920x1080/FF7F50/FFFFFF?text=Future", // Placeholder image 3
    title: "Building the Future Together",
    description: "Join us on a journey to redefine possibilities and build a sustainable, impactful future for everyone.",
    buttonText: "Get Started",
  },
];

// Testimonials data (updated with larger images for the new design)
const testimonials = [
  {
    name: "John Doe",
    title: "CEO at TechCorp",
    message: "This company exceeded our expectations in every way. Their dedication to innovation and customer satisfaction is truly commendable. A fantastic partner!",
    image: "https://placehold.co/400x400/D1D5DB/4B5563?text=John+Doe", // Larger placeholder image
  },
  {
    name: "Jane Smith",
    title: "Marketing Director at Brandify",
    message: "Working with them was a game-changer for our brand. Truly innovative, trustworthy, and incredibly customer-focused. Highly recommend their services!",
    image: "https://placehold.co/400x400/D1D5DB/4B5563?text=Jane+Smith", // Larger placeholder image
  },
  {
    name: "Albert Flores", // Added from the image
    title: "Web Designer at Watt Design", // Added from the image
    message: "We have been operating for over an providin top-notch services to our clients and build strong track record in the industry. We have been operating for over a decad providi ina top-notch We have been operating",
    image: "https://placehold.co/400x400/D1D5DB/4B5563?text=Albert+Flores", // Placeholder for Albert Flores
  },
  {
    name: "Sarah Lee",
    title: "Lead Developer at CodeFlow",
    message: "An outstanding partner! Their expertise and collaborative approach made our complex project a smooth and successful journey. We're thrilled with the results.",
    image: "https://placehold.co/400x400/D1D5DB/4B5563?text=Sarah+Lee", // Larger placeholder image
  },
  {
    name: "Michael Brown",
    title: "Product Manager",
    message: "Their team's responsiveness and ability to quickly adapt to our evolving needs were truly impressive. A pleasure to work with!",
    image: "https://placehold.co/400x400/D1D5DB/4B5563?text=Michael+Brown", // Larger placeholder image
  },
  {
    name: "Emily White",
    title: "Creative Lead",
    message: "The creative solutions they delivered were beyond our expectations, perfectly capturing our brand's essence. Highly artistic and professional.",
    image: "https://placehold.co/400x400/D1D5DB/4B5563?text=Emily+White", // Larger placeholder image
  },
];

// Main App component
export default function App() {
  // State for Hero Slider
  const [currentHeroSlideIndex, setCurrentHeroSlideIndex] = useState(0);

  // State for Testimonial Slider
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Function to go to the next hero slide
  const goToNextHeroSlide = () => {
    setCurrentHeroSlideIndex((prevIndex) =>
      (prevIndex + 1) % heroSlides.length
    );
  };

  // Function to go to the previous hero slide
  const goToPrevHeroSlide = () => {
    setCurrentHeroSlideIndex((prevIndex) =>
      (prevIndex - 1 + heroSlides.length) % heroSlides.length
    );
  };

  // Auto-slide functionality for Hero Section
  useEffect(() => {
    const interval = setInterval(goToNextHeroSlide, 7000); // Change slide every 7 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentHeroSlideIndex]); // Restart interval if currentHeroSlideIndex changes

  // Function to go to the next testimonial
  const goToNextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      (prevIndex + 1) % testimonials.length
    );
  };

  // Function to go to the previous testimonial
  const goToPrevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-slide functionality for Testimonials
  useEffect(() => {
    const interval = setInterval(goToNextTestimonial, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentTestimonialIndex]); // Restart interval if currentTestimonialIndex changes

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', color: '#374151', fontFamily: 'sans-serif', paddingTop: '4rem' }}>
      <Navbar />

      {/* 0. Hero Section with Image Slider */}
      <section style={{ position: 'relative', width: '100%', height: '60vh', overflow: 'hidden' }}>
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'opacity 1000ms ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              backgroundImage: `url(${slide.image})`,
              opacity: i === currentHeroSlideIndex ? 1 : 0,
              zIndex: i === currentHeroSlideIndex ? 10 : -10,
            }}
          >
            {/* Overlay for better text readability */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>

            <div style={{ position: 'relative', zIndex: 20, maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.25rem', lineHeight: '2.5rem', fontWeight: '800', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              <span className="text-[#FFFFFF]">{slide.title}</span>  
              </h1>
              <p style={{ fontSize: '1.25rem', lineHeight: '1.75rem', maxWidth: '48rem', margin: '0 auto 2rem', opacity: 0.9, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {slide.description}
              </p>
              
            </div>
          </div>
        ))}

        {/* Slider Controls - Left */}
        <button
          onClick={goToPrevHeroSlide}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '9999px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 300ms',
            zIndex: 20,
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Slider Controls - Right */}
        <button
          onClick={goToNextHeroSlide}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '9999px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 300ms',
            zIndex: 20,
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>

        {/* Pagination Dots */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroSlideIndex(idx)}
              style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '9999px',
                transition: 'all 300ms ease-in-out',
                backgroundColor: idx === currentHeroSlideIndex ? '#FFA500' : 'rgba(255, 255, 255, 0.7)',
                transform: idx === currentHeroSlideIndex ? 'scale(1.25)' : 'scale(1)',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
              }}
              onMouseOver={(e) => { if (idx !== currentHeroSlideIndex) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'; }}
              onMouseOut={(e) => { if (idx !== currentHeroSlideIndex) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; }}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Modern Divider */}
      <div style={{ margin: '3rem auto', width: '12rem', height: '0.25rem', borderRadius: '9999px', background: 'linear-gradient(to right, #FB923C, #EC4899, #8B5CF6)', boxShadow: '0 0 12px rgba(255, 255, 255, 0.5)', animation: 'pulse-slow 4s infinite ease-in-out' }}>
        {/* Keyframes for pulse-slow animation. This would typically be in a CSS file. */}
        <style>{`
          @keyframes pulse-slow {
            0%, 100% {
              box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
            }
            50% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            }
          }
        `}</style>
      </div>

      {/* 1. Unique Value Proposition */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem', color: '#111827' }}>
          Our Core Values
        </h2>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#F9FAFB', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)', transition: 'all 300ms ease-in-out', border: '1px solid #F3F4F6' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-0.5rem)'; e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ fontSize: '3.125rem', marginBottom: '1.5rem', color: '#FFA500' }}>
              <Lightbulb size={64} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>Innovation</h3>
            <p style={{ color: '#4B5563', lineHeight: '1.625' }}>
              We constantly push boundaries, embracing new ideas and technologies to deliver cutting-edge solutions.
            </p>
          </div>
          <div style={{ backgroundColor: '#F9FAFB', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)', transition: 'all 300ms ease-in-out', border: '1px solid #F3F4F6' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-0.5rem)'; e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ fontSize: '3.125rem', marginBottom: '1.5rem', color: '#FFA500' }}>
              <Users size={64} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>Collaboration</h3>
            <p style={{ color: '#4B5563', lineHeight: '1.625' }}>
              Our strength lies in teamwork and open communication, fostering an environment where ideas flourish.
            </p>
          </div>
          <div style={{ backgroundColor: '#F9FAFB', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)', transition: 'all 300ms ease-in-out', border: '1px solid #F3F4F6' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-0.5rem)'; e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ fontSize: '3.125rem', marginBottom: '1.5rem', color: '#FFA500' }}>
              <Leaf size={64} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>Integrity</h3>
            <p style={{ color: '#4B5563', lineHeight: '1.625' }}>
              We operate with honesty, transparency, and a strong ethical compass in all our endeavors.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Divider */}
      <div style={{ margin: '3rem auto', width: '12rem', height: '0.25rem', borderRadius: '9999px', background: 'linear-gradient(to right, #FB923C, #EC4899, #8B5CF6)', boxShadow: '0 0 12px rgba(255, 255, 255, 0.5)', animation: 'pulse-slow 4s infinite ease-in-out' }}></div>

    <section style={{ padding: '4rem 1.5rem', backgroundColor: '#F3F4F6', position: 'relative', overflow: 'hidden' }}>
      <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem', color: '#111827' }}>What Our Clients Say</h2>

      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: window.innerWidth > 768 ? 'row' : 'column', // Desktop: row, Mobile: column
          gap: '2rem',
          alignItems: 'stretch', // Ensures columns have equal height
          height: window.innerWidth > 768 ? '25rem' : 'auto', // Fixed height for desktop, auto for mobile
        }}
      >
        {/* Left Column: Image Area / Name Display */}
        <div
          style={{
            flex: '1', // Take equal space
            position: 'relative',
            backgroundColor: '#EBECEC', // Lighter gray background
            borderRadius: '1rem',
            boxShadow: '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem', // Add padding for internal content
            width: '100%', // Ensure it takes full width on mobile
            maxHeight: window.innerWidth <= 768 ? '25rem' : 'auto', // Max height for image area on mobile
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Display Jane Smith's name directly */}
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6B7280' }}>
              {testimonials[currentTestimonialIndex].name}
            </p>
          </div>
        </div>

        {/* Right Column: Testimonial Text with Slider */}
        <div
          style={{
            flex: '1', // Take equal space
            position: 'relative',
            backgroundColor: '#FF8C00', // Orange background
            color: 'white',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)',
            padding: '2.5rem', // Adjusted padding
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%', // Ensure it takes full width on mobile
          }}
        >
          {/* Quote Icon */}
          <Quote size={64} style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', flexShrink: 0 }} />

          {/* Testimonial Text Content (Sliding) */}
          <div style={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transition: 'all 700ms ease-in-out',
                  opacity: i === currentTestimonialIndex ? 1 : 0,
                  transform: i === currentTestimonialIndex ? 'translateX(0)' : (i < currentTestimonialIndex ? 'translateX(-100%)' : 'translateX(100%)'),
                }}
              >
                <p style={{ fontStyle: 'italic', color: 'white', marginBottom: '1.5rem', fontSize: '1.125rem', lineHeight: '1.625' }}>
                  “{t.message}”
                </p>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>{t.name}</p>
                  <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>{t.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots (Instead of arrows, based on typical testimonial sliders) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', flexShrink: 0 }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: currentTestimonialIndex === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background-color 300ms',
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

 

      {/* Footer (Optional, but good practice) */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 300ms' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FFA500'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >Privacy Policy</a>
          <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 300ms' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FFA500'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

