'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/src/lib/config/api';

const durationOptions = [
  { label: 'One Minute', value: 60 },
  { label: 'Ten Minutes', value: 60 * 10 },
  { label: 'One Day', value: 60 * 60 * 24 },
  { label: 'One Week', value: 60 * 60 * 24 * 7 }
];

export default function NewItemPage() {
  const router = useRouter();
  const [name, setName] = useState('Chair');
  const [description, setDescription] = useState(
    'This is a fantastic chair that you would be quite happy with!'
  );
  const [duration, setDuration] = useState(durationOptions[0].value);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/items/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, description, duration })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to create item');
      }

      router.replace(`/items/${data.id}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create a New Auction Item</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="font-bold text-gray-800 mb-1">
            Item Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            minLength={3}
            maxLength={60}
            required
            className="rounded-lg border border-gray-300 py-2 px-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="font-bold text-gray-800 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            minLength={3}
            maxLength={600}
            required
            className="rounded-lg border border-gray-300 py-2 px-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item Description"
            rows={5}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="duration" className="font-bold text-gray-800 mb-1">
            Duration
          </label>
          <select
            id="duration"
            name="duration"
            className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
