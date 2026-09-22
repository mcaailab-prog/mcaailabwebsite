'use client';

import { useEffect, useMemo, useState } from 'react';

const initialFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  affiliation: '',
  role: '',
  interests: '',
  projectSummary: '',
  availability: '',
  motivation: '',
};

const steps = [
  { id: 1, title: 'Personal details' },
  { id: 2, title: 'Research & goals' },
  { id: 3, title: 'Availability' },
];

export default function MCAAIApplicationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  useEffect(() => {
    if (submitStatus?.type === 'success') {
      const timer = window.setTimeout(() => {
        setSubmitStatus(null);
      }, 8000);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [submitStatus]);

  const progress = useMemo(() => (step / steps.length) * 100, [step]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep((current) => Math.min(steps.length, current + 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          subject: 'MCAAI Application Submission',
          message: `Affiliation: ${formData.affiliation}\nRole: ${formData.role}\nInterests: ${formData.interests}\nProject Summary: ${formData.projectSummary}\nAvailability: ${formData.availability}\nMotivation: ${formData.motivation}`,
        }),
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Your application has been submitted successfully. Our team will review it and contact you soon.',
      });
      setFormData(initialFormValues);
      setStep(1);
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Unable to submit your application right now. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-headline-lg text-[28px] text-university-deep-blue">Join MCAAI</h3>
            <p className="font-body-md text-on-surface-variant">
              Complete this quick application to share your goals, interests, and availability.
            </p>
          </div>
          <span className="text-sm font-semibold text-on-surface-variant">Step {step} of {steps.length}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-surface-container-low border border-outline-variant/30">
          <div className="h-full rounded-full bg-mcaai-teal transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {submitStatus && (
        <div className={`rounded-xl px-4 py-4 text-body-md ${submitStatus.type === 'success' ? 'bg-mcaai-green/10 text-mcaai-green border border-mcaai-green/20' : 'bg-university-gold/10 text-university-gold border border-university-gold/20'}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">First name</span>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
                placeholder="First name"
              />
            </label>
            <label className="space-y-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Last name</span>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
                placeholder="Last name"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Email address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
                placeholder="name@organization.com"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Affiliation</span>
              <input
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
                placeholder="University, company, or organization"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <label className="space-y-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Proposed role or opportunity</span>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
                placeholder="Fellowship, internship, collaboration, etc."
              />
            </label>
            <label className="space-y-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Areas of interest</span>
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal resize-none"
                placeholder="Tell us what research or AI topics matter most to you"
              />
            </label>
            <label className="space-y-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Project summary</span>
              <textarea
                name="projectSummary"
                value={formData.projectSummary}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal resize-none"
                placeholder="Describe your idea, research direction, or collaboration goals"
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <label className="space-y-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Availability</span>
              <input
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal"
                placeholder="Timing, start date, or preferred engagement period"
              />
            </label>
            <label className="space-y-2">
              <span className="font-label-sm text-label-sm text-university-deep-blue uppercase tracking-wider">Why MCAAI?</span>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md outline-none focus:border-mcaai-teal focus:ring-1 focus:ring-mcaai-teal resize-none"
                placeholder="Why are you interested in joining or collaborating with MCAAI?"
              />
            </label>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-full border border-outline-variant px-6 py-3 text-body-md text-university-deep-blue transition hover:border-mcaai-teal disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            {step < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-mcaai-teal px-6 py-3 text-body-md font-bold text-white transition hover:bg-mcaai-teal/90"
              >
                Continue
              </button>
            ) : null}
          </div>

          <div className="flex gap-3 flex-wrap justify-end">
            {step === steps.length ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-university-deep-blue px-6 py-3 text-body-md font-bold text-white transition hover:bg-university-deep-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting application…' : 'Submit Application'}
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
