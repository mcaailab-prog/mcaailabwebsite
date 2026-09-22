'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import type { DatasetType } from '@/lib/api-types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextRenderer from '@/components/ui/RichTextRenderer';

interface DatasetDetailFormProps {
  dataset: DatasetType;
}

export default function DatasetDetailForm({ dataset }: DatasetDetailFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    purpose: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const requestData = {
        dataset: dataset.id ?? null,
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
        purpose: '',
      });
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit request. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dataset) {
    // In a server component we would call notFound(), but in client we can redirect
    router.replace('/404');
    return null;
  }

  return (
    <div className="w-full">
      {/* Back to Datasets Link */}
      <div className="mb-8">
        <Link href="/datasets">
          <a
            className="inline-flex items-center text-[#65C1CF] hover:text-[darken(#65C1CF,10%)]"
          >
            ← Back to Datasets
          </a>
        </Link>
      </div>

      {submitStatus && (
        <div className={`${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} p-4 mb-4 rounded-lg`}>
          {submitStatus.message}
        </div>
      )}

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#65C1CF]/10 rounded-full flex items-center justify-center text-[#65C1CF] shrink-0">
                {/* Dataset type icon based on format */}
                {dataset.format?.includes('audio') || dataset.format?.includes('wav') || dataset.format?.includes('mp3') ? (
                  <span className="text-2xl">🔊</span>
                ) : dataset.format?.includes('video') || dataset.format?.includes('mp4') ? (
                  <span className="text-2xl">🎥</span>
                ) : dataset.format?.includes('text') || dataset.format?.includes('json') || dataset.format?.includes('csv') ? (
                  <span className="text-2xl">📄</span>
                ) : (
                  <span className="text-2xl">🗃️</span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {dataset.name}
                </h1>
                <p className="text-lg text-[#65C1CF]">
                  {dataset.language}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Dataset Image/Placeholder */}
            <div className="relative">
              {/* In a real app, we might have a dataset thumbnail or representative image */}
              <div className="w-full h-[400px] bg-[#65C1CF]/20 rounded-lg flex items-center justify-center">
                <div className="text-4xl text-[#65C1CF]/50">
                  {/* Format-based icon */}
                  {dataset.format?.includes('audio') || dataset.format?.includes('wav') || dataset.format?.includes('mp3') ? (
                    <span>🔊</span>
                  ) : dataset.format?.includes('video') || dataset.format?.includes('mp4') ? (
                    <span>🎥</span>
                  ) : dataset.format?.includes('text') || dataset.format?.includes('json') || dataset.format?.includes('csv') ? (
                    <span>📄</span>
                  ) : (
                    <span>🗃️</span>
                  )}
                </div>
                <p className="text-sm text-[#65C1CF]/70 mt-2">
                  {dataset.size_description}
                </p>
              </div>
            </div>

            {/* Dataset Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Dataset Overview
                  </h3>
                  <RichTextRenderer
                    content={dataset.description}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-gray-600 space-y-1">
                      <span className="font-medium">Format:</span>
                      <span className="ml-2">{dataset.format}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 space-y-1">
                      <span className="font-medium">License:</span>
                      <span className="ml-2">{dataset.license}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 space-y-1">
                      <span className="font-medium">Access Type:</span>
                      <span className="ml-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            dataset.requires_request
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {dataset.requires_request ? 'Request Required' : 'Open Access'}
                        </span>
                      </span>
                    </p>
                  </div>

                  {dataset.associated_project && (
                    <div className="pt-4">
                      <p className="text-gray-600 space-y-1">
                        <span className="font-medium">Associated Project:</span>
                        <span className="ml-2">{dataset.associated_project?.title || 'Unknown Project'}</span>
                      </p>
                    </div>
                  )}
                </div>

                {dataset.download_url && !dataset.requires_request ? (
                  <div className="mt-6">
                    <a
                      href={dataset.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-6 py-3 bg-[#65C1CF] text-white rounded-lg hover:bg-[darken(#65C1CF,10%)] transition-colors"
                    >
                      Download Dataset
                    </a>
                  </div>
                ) : null}
              </div>

              {/* Access Request Form */}
              {dataset.requires_request && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Request Access
                  </h3>
                  <p className="text-gray-700 mb-4">
                    To access this dataset, please fill out the request form below.
                    Our team will review your request and get back to you with access instructions.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65C1CF] focus:border-[#65C1CF] transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65C1CF] focus:border-[#65C1CF] transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                        Institution/Organization (Optional)
                      </label>
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65C1CF] focus:border-[#65C1CF] transition-colors"
                        placeholder="Enter your institution or organization"
                      />
                    </div>

                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                        Purpose of Use
                      </label>
                      <textarea
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65C1CF] focus:border-[#65C1CF] transition-colors"
                        placeholder="Describe how you intend to use this dataset"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-[#65C1CF] text-white font-medium rounded-lg hover:bg-[darken(#65C1CF,10%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}