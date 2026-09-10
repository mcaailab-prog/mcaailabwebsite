'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from "@/lib/icons";
import { FaMapMarkedAlt, FaEnvelope, FaDatabase } from 'react-icons/fa';


export default function ContactPage() {
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      if (!res.ok) throw new Error();
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
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
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-university-deep-blue py-20" style={{ backgroundImage: "url('/MCAAI.png')", backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-container-max mx-auto  px-margin-mobile md:px-margin-desktop text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mcaai-teal/20 rounded-full border border-mcaai-teal/30 mb-6">
            <span className="font-label-sm text-label-sm text-mcaai-teal uppercase tracking-widest">
              Get In Touch
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl text-white mb-6">
            Contact  MCAAI
          </h1>
          <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto">
            Have questions, collaboration ideas, or want to learn more about
            our work? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto  px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* ── LEFT: Contact Info ─────────────────────────────── */}
            <div className="space-y-8">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-university-deep-blue mb-4">
                  Let&apos;s Connect
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Reach out to us directly or use the form to start a
                  conversation about research, partnerships, or datasets.
                </p>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-mcaai-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkedAlt />
                </div>
                <div>
                  <h3 className="font-body-md font-bold text-university-deep-blue mb-1">
                    Our Location
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Maseno Centre for Applied Artificial Intelligence (MCAAI)<br />
                    Maseno University, Kisumu-Busia Road<br />
                    Maseno, Kenya
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-mcaai-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="font-body-md font-bold text-university-deep-blue mb-1">
                    Email Inquiry
                  </h3>
                  <a
                    href="mailto:mcaai@maseno.ac.ke"
                    className="font-body-md text-body-md text-primary hover:underline"
                  >
                   mcaai@maseno.ac.ke
                  </a>
                </div>
              </div>

              {/* Dataset Access */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-mcaai-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaDatabase />
                </div>
                <div>
                  <h3 className="font-body-md font-bold text-university-deep-blue mb-1">
                    Dataset Access Request
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    To request access to our datasets, visit our{' '}
                    <Link
                      href="/datasets"
                      className="text-primary hover:underline"
                    >
                      Datasets page
                    </Link>
                    {' '}and use the access request form for restricted datasets.
                  </p>
                </div>
              </div>

             
            </div>

            {/* ── RIGHT: Form ────────────────────────────────────── */}
            <div className="bg-surface-container-low p-8 lg:p-12 rounded-2xl border border-outline-variant/30">
              <h3 className="font-headline-lg text-[28px] text-university-deep-blue mb-8">
                Send Us a Message
              </h3>

              {/* Status banner */}
              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg font-body-md text-body-md ${
                  submitStatus.type === 'success'
                    ? 'bg-mcaai-green/10 text-secondary border border-mcaai-green/20'
                    : 'bg-error-container text-on-error-container border border-error/20'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="space-y-2">
                  <label htmlFor="name" className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal outline-none transition-all bg-white font-body-md text-body-md"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@organization.com"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal outline-none transition-all bg-white font-body-md text-body-md"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal outline-none transition-all bg-white font-body-md text-body-md"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal outline-none transition-all bg-white font-body-md text-body-md resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-university-deep-blue text-on-primary py-4 rounded-lg font-body-md font-bold hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="progress_activity" className="animate-spin text-[20px]" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Icon name="send" size={20} />
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}