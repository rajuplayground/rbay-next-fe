'use client';

import { useState } from 'react';

import { API_BASE_URL } from '@/src/lib/config/api';

interface LikeButtonProps {
	itemId: string;
	initialLikes: number;
	initialUserLikes?: boolean;
}

export default function LikeButton({
	itemId,
	initialLikes,
	initialUserLikes = false
}: LikeButtonProps) {
	const [liked, setLiked] = useState(initialUserLikes);
	const [count, setCount] = useState(initialLikes);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toggleLike = async () => {
		if (pending) {
			return;
		}

		setPending(true);
		setError(null);

		try {
			const response = await fetch(`${API_BASE_URL}/api/items/${itemId}/likes`, {
				method: liked ? 'DELETE' : 'POST',
				credentials: 'include'
			});

			if (!response.ok) {
				const payload = await response.json().catch(() => ({}));
				throw new Error(payload.error || payload.message || 'Unable to update like');
			}

			const payload = await response.json();

			const nextLiked = payload.userLikes ?? !liked;
			const nextCount =
				payload.item?.likes ??
				(nextLiked ? count + 1 : Math.max(0, count - 1));

			setLiked(nextLiked);
			setCount(nextCount);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unable to update like');
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="flex flex-col items-end gap-1">
			<div className="flex items-center">
				<button
					type="button"
					onClick={toggleLike}
					disabled={pending}
					className={`flex items-center gap-2 rounded-l-full border border-rose-200 px-4 py-2 font-semibold transition ${
						liked
							? 'bg-rose-600 text-white'
							: 'bg-white text-rose-600 hover:bg-rose-50'
					} ${pending ? 'opacity-60' : ''}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
					>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
					{liked ? 'Liked' : 'Like'}
				</button>
				<div className="rounded-r-full border border-l-0 border-rose-200 bg-white px-4 py-2 font-semibold text-rose-600">
					{count}
				</div>
			</div>
			{error && <p className="text-xs text-red-600">{error}</p>}
		</div>
	);
}
