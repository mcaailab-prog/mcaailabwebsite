'use client';

import { useState } from 'react';

const AREAS_OF_INTEREST = [
  'Research Collaboration',
  'Capacity Building',
  'Sponsorship',
  'Technology Licensing',
  'Student Training',
];

export default function PartnershipForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    areaOfInterest: AREAS_OF_INTEREST[0],
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: `Partnership Inquiry - ${formData.areaOfInterest}`,
        message: `Organization: ${formData.organization}\nArea of Interest: ${formData.areaOfInterest}\n\n${formData.message}`,
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your partnership inquiry has been sent successfully. We will be in touch soon.',
      });
      setFormData({
        name: '',
        email: '',
        organization: '',
        areaOfInterest: AREAS_OF_INTEREST[0],
        message: '',
      });
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later or email us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-8 lg:p-10">
      <h3 className="font-headline-lg text-[28px] text-university-deep-blue mb-4">
        Submit a Partnership Inquiry
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8">
        Share your organisation’s goals, and our team will reach out with collaboration options.
      </p>

      {submitStatus && (
        <div className={`mb-6 rounded-xl px-4 py-4 text-body-md ${
          submitStatus.type === 'success'
            ? 'bg-mcaai-green/10 text-mcaai-green border border-mcaai-green/20'
            : 'bg-university-gold/10 text-university-gold border border-university-gold/20'
        }`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2">
            <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
              Full Name
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none transition focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
            />
          </label>

          <label className="space-y-2">
            <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
              Email Address
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@organization.com"
              className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none transition focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
            Organisation
          </span>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
            placeholder="Your organisation name"
            className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none transition focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
          />
        </label>

        <label className="space-y-2">
          <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
            Area of Interest
          </span>
          <select
            name="areaOfInterest"
            value={formData.areaOfInterest}
            onChange={handleChange}
            className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none transition focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
          >
            {AREAS_OF_INTEREST.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">
            Message / Proposal
          </span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Tell us about the opportunity and how we can partner together."
            className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none transition focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal resize-none"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-university-deep-blue px-6 py-4 text-body-md font-bold text-white transition hover:bg-university-deep-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending inquiry…' : 'Submit Partnership Inquiry'}
        </button>
      </form>
    </div>
  );
}
