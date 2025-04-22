"use client";

import React, { useState } from 'react';

/**
 * Newsletter subscription form component
 * Client component to handle email input and form submission
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setEmail('');
      setMessage('Thank you for subscribing!');
      
      // In a real app, you would call your API here:
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // 
      // if (response.ok) {
      //   setEmail('');
      //   setMessage('Thank you for subscribing!');
      // } else {
      //   const data = await response.json();
      //   setMessage(data.message || 'Something went wrong. Please try again.');
      // }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
      <div className="flex-grow relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50"
          suppressHydrationWarning
        />
        {message && (
          <div className={`mt-2 text-sm ${message.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-70"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
