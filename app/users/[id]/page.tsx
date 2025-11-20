import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { API_BASE_URL } from '@/src/lib/config/api';

interface Item {
	id: string;
	name: string;
	description: string;
	imageUrl?: string;
	price: number;
	bids: number;
	likes: number;
	endingAt: number | string;
	createdAt: number | string;
}

interface ProfileResponse {
	username: string;
	sharedItems: Item[];
	likedItems: Item[];
}

const currency = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

async function fetchProfile(userId: string): Promise<ProfileResponse> {
	const incomingHeaders = await headers();
	const cookies = incomingHeaders.get('cookie') ?? undefined;

	const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
		cache: 'no-store',
		headers: cookies ? { Cookie: cookies } : undefined
	});

	if (response.status === 404) {
		notFound();
	}

	if (!response.ok) {
		throw new Error('Unable to load user profile');
	}

	return response.json();
}

function ItemCard({ item }: { item: Item }) {
	return (
		<Link
			href={`/items/${item.id}`}
			className="group flex w-full max-w-xs flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={item.imageUrl || 'https://placehold.co/600x400?text=Item'}
				alt={item.name}
				className="h-48 w-full object-cover transition group-hover:scale-[1.02]"
			/>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
				<p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
				<div className="flex items-center justify-between text-sm text-gray-600">
					<span className="font-semibold text-indigo-600">{currency.format(item.price)}</span>
					<span>{item.bids} bids</span>
				</div>
			</div>
		</Link>
	);
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await fetchProfile(id);

	return (
		<div className="space-y-10 py-10">
			<div>
				<h1 className="text-3xl font-semibold text-gray-900">{data.username}&apos;s profile</h1>
				<p className="text-gray-500">See what you both like and what they&apos;re into.</p>
			</div>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-900">
					Items you <span className="font-bold">both</span> like
				</h2>
				{data.sharedItems.length === 0 ? (
					<p className="text-gray-500">Nothing in common yet.</p>
				) : (
					<div className="flex flex-wrap gap-4">
						{data.sharedItems.map((item) => (
							<ItemCard key={`shared-${item.id}`} item={item} />
						))}
					</div>
				)}
			</section>

			<hr className="border-gray-200" />

			<section className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-900">Items {data.username} likes</h2>
				{data.likedItems.length === 0 ? (
					<p className="text-gray-500">{data.username} hasn&apos;t liked any items yet.</p>
				) : (
					<div className="flex flex-wrap gap-4">
						{data.likedItems.map((item) => (
							<ItemCard key={`liked-${item.id}`} item={item} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
