'use client';

import { useState } from 'react';
import type { DatasetType } from '@/lib/api-types';

interface DatasetRequestFormProps {
  dataset?: DatasetType;
}

export default function DatasetRequestForm({ dataset }: DatasetRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    department: '',
    role: '',
    purpose: '',
    use_case: '',
    project_title: '',
    data_security: 'Yes',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      const requestData = {
        dataset: dataset ? ((dataset as any).id ?? (dataset as any)._id ?? null) : null,
        ...formData,
      };

      const res = await fetch('/api/datasets/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) throw new Error('Request failed');
      setSubmitStatus({
        type: 'success',
        message: 'Your access request has been submitted successfully! We will review it and get back to you soon.',
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        institution: '',
        department: '',
        role: '',
        purpose: '',
        use_case: '',
        project_title: '',
        data_security: 'Yes',
      });
    } catch (_) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit request. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {submitStatus && (
        <div
          className={`rounded-lg border px-3 py-2 text-sm ${
            submitStatus.type === 'success'
              ? 'border-slate-200 bg-slate-50 text-slate-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
              placeholder="you@example.org"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="institution" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Institution
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
              placeholder="University or organization"
            />
          </div>

          <div>
            <label htmlFor="department" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Department / lab
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
              placeholder="AI / NLP / Data science"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="role" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Researcher / student / staff"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="project_title" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Project title
            </label>
            <input
              type="text"
              id="project_title"
              name="project_title"
              value={formData.project_title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label htmlFor="purpose" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            Purpose of use
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
            placeholder="Describe the project or research objective"
          />
        </div>

        <div>
          <label htmlFor="use_case" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            Intended use case
          </label>
          <textarea
            id="use_case"
            name="use_case"
            value={formData.use_case}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
            placeholder="Explain how the data will be used and shared"
          />
        </div>

        <div>
          <label htmlFor="data_security" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            Data security confirmation
          </label>
          <select
            id="data_security"
            name="data_security"
            value={formData.data_security}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
          >
            <option value="Yes">Yes, I confirm secure handling</option>
            <option value="No">No, I need clarification</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-sky-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting request...' : 'Submit access request'}
        </button>
      </form>
    </div>
  );
}