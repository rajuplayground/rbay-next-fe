'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Button from './Button';
import Search from './Search';
import { API_BASE_URL } from '@/src/lib/config/api';

interface Session {
	id: string;
	userId: string | null;
	username: string;
}

export default function Header() {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		fetch(`${API_BASE_URL}/api/sessions`, {
			cache: 'no-store',
			credentials: 'include'
		})
			.then(res => res.json())
			.then(data => {
				setSession(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, [pathname]);

	const handleLogout = async () => {
		await fetch(`${API_BASE_URL}/api/auth/signout`, {
			method: 'POST',
			credentials: 'include'
		});
		setSession(null);
		router.replace('/');
		router.refresh();
	};

	if (loading) {
		return (
			<div className="w-full p-2 shadow-sm bg-amber-500 mb-8">
				<div className="container mx-auto flex flex-row items-center justify-between">
					<Link href="/">
						<div className="ml-8 text-lg text-white flex">RBay</div>
					</Link>
					<Search />
					<div className="hidden md:flex items-center mr-8 gap-4">
						<div className="text-white">Loading...</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full p-2 shadow-xs bg-amber-500 mb-8">
			<div className="container mx-auto flex flex-row items-center justify-between">
				<Link href="/">
					<div className="ml-8 text-lg text-white flex">RBay</div>
				</Link>
				<Search />
				<div className="hidden md:flex items-center mr-8 gap-4">
					{session && session.userId ? (
						<>
							<p className="text-white">{session.username}</p>
							<Link href="/dashboard/items/new">
								<Button>New</Button>
							</Link>
							<Link href="/dashboard/items">
								<Button>Dashboard</Button>
							</Link>
							<Button role="secondary" onClick={handleLogout}>Logout</Button>
						</>
					) : (
						<>
							<Link href="/auth/signin">
								<Button>Sign In</Button>
							</Link>
							<Link href="/auth/signup">
								<Button>Sign Up</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
