'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/src/lib/config/api';

export default function SignUpPage() {
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || 'Signup failed');
				setLoading(false);
				return;
			}

			// Cookie is already set by the backend response
			// router.refresh() will re-fetch server components with the new session
			router.replace('/');
			router.refresh();
			setLoading(false);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'An error occurred';
			setError(message);
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col mx-auto items-center max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
			<div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
				Create a new account
			</div>
			<span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
				Already have an account ?{' '}
				<Link href="/auth/signin" className="text-sm text-blue-500 underline hover:text-blue-700">
					Sign in
				</Link>
			</span>
			<div className="p-6 mt-8">
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col mb-2">
						<div className="relative">
							<input
								type="text"
								id="create-account-pseudo"
								className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
								name="username"
								placeholder="User Name"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
					</div>
					<div className="flex flex-col mb-2">
						<div className="relative">
							<input
								type="password"
								id="password"
								className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>

					{error && <div className="my-4 text-red-600">{error}</div>}

					<div className="flex w-full my-4">
						<button
							type="submit"
							disabled={loading}
							className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50"
						>
							{loading ? 'Signing up...' : 'Sign Up'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
