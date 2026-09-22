'use client';

import { useState } from 'react';

interface ContactFormProps {
  showTitle?: boolean;
  title?: string;
  submitButtonText?: string;
}

export default function ContactForm({
  showTitle = true,
  title = 'Get In Touch',
  submitButtonText = 'Send Message',
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Request failed');
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.',
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      {showTitle && (
        <>
          <h2 className="font-headline-lg text-[32px] text-university-deep-blue mb-4">
            {title}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Have questions, collaboration ideas, or want to learn more about our work?
            We&apos;d love to hear from you.
          </p>
        </>
      )}

      {/* Status Message */}
      {submitStatus && (
        <div className={`
          mb-4 p-4 rounded-lg
          ${submitStatus.type === 'success'
            ? 'bg-mcaai-green/10 text-mcaai-green border border-mcaai-green/30'
            : 'bg-university-gold/10 text-university-gold border border-university-gold/30'}
        `}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="font-label-sm text-label-sm mb-2 block">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant focus:border-mcaai-teal/50 focus:ring-mcaai-teal/20 transition-all"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="font-label-sm text-label-sm mb-2 block">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant focus:border-mcaai-teal/50 focus:ring-mcaai-teal/20 transition-all"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="subject" className="font-label-sm text-label-sm mb-2 block">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant focus:border-mcaai-teal/50 focus:ring-mcaai-teal/20 transition-all"
            placeholder="Enter a subject for your message"
          />
        </div>

        <div>
          <label htmlFor="message" className="font-label-sm text-label-sm mb-2 block">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant focus:border-mcaai-teal/50 focus:ring-mcaai-teal/20 transition-all"
            placeholder="Enter your message here..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-university-deep-blue text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm font-bold hover:bg-university-deep-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : submitButtonText}
        </button>
      </form>
    </div>
  );
}