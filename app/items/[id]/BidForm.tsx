'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { API_BASE_URL } from '@/src/lib/config/api';

interface BidFormProps {
	itemId: string;
	minimumBid: number;
}

export default function BidForm({ itemId, minimumBid }: BidFormProps) {
	const router = useRouter();
	const [amount, setAmount] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setMessage('');

		const parsed = parseFloat(amount);

		if (Number.isNaN(parsed) || parsed <= 0) {
			setError('Enter a valid amount');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/api/items/${itemId}/bids`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount: parsed })
			});

			if (!response.ok) {
				const payload = await response.json().catch(() => ({}));
				throw new Error(payload.error || 'Unable to place bid');
			}

			setAmount('');
			setMessage('Success! You have the winning bid');
			router.refresh();
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Something went wrong while bidding';
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input
				value={amount}
				onChange={(event) => setAmount(event.target.value)}
				className="rounded-lg border border-gray-300 py-2 px-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
				placeholder={`$${minimumBid.toFixed(2)} minimum`}
			/>

			{error && <div className="text-sm font-semibold text-red-600">{error}</div>}
			{message && <div className="text-sm font-semibold text-green-600">{message}</div>}

			<button
				type="submit"
				disabled={loading}
				className="rounded-lg bg-indigo-600 py-2 px-4 text-white font-semibold shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
			>
				{loading ? 'Submitting...' : 'Place Bid'}
			</button>
		</form>
	);
}
