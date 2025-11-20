import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BidForm from './BidForm';
import LikeButton from './LikeButton';
import { API_BASE_URL } from '@/src/lib/config/api';

interface Item {
	id: string;
	name: string;
	description: string;
	ownerId: string;
	imageUrl?: string;
	price: number;
	bids: number;
	likes: number;
	endingAt: string | number;
	createdAt: string | number;
	highestBidUserId?: string;
}

interface BidHistoryPoint {
	createdAt: string;
	amount: number;
}

interface ItemResponse {
	item: Item;
	userHasHighBid?: boolean;
	userLikes?: boolean;
	history?: BidHistoryPoint[];
	similarItems?: Item[];
}

const currency = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

async function fetchItem(id: string): Promise<ItemResponse> {
	const incomingHeaders = await headers();
	const cookieHeader = incomingHeaders.get('cookie') ?? undefined;

	const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
		cache: 'no-store',
		headers: cookieHeader ? { Cookie: cookieHeader } : undefined
	});

	if (response.status === 404) {
		notFound();
	}

	if (!response.ok) {
		throw new Error('Unable to load item');
	}

	return response.json();
}

function formatRelativeTime(value: string | number) {
	const target = typeof value === 'number' ? value : Date.parse(value);

	if (Number.isNaN(target)) {
		return '--';
	}

	const diffSeconds = Math.floor((target - Date.now()) / 1000);

	if (diffSeconds <= 0) {
		return 'Ended';
	}

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const ranges: Array<{ unit: Intl.RelativeTimeFormatUnit; value: number }> = [
		{ unit: 'day', value: 86400 },
		{ unit: 'hour', value: 3600 },
		{ unit: 'minute', value: 60 },
		{ unit: 'second', value: 1 }
	];

	for (const range of ranges) {
		if (diffSeconds >= range.value || range.unit === 'second') {
			const delta = Math.round(diffSeconds / range.value);
			return rtf.format(delta, range.unit).replace(/^in\s/, '');
		}
	}

	return 'Ending soon';
}

function BidHistory({ history }: { history?: BidHistoryPoint[] }) {
	if (!history?.length) {
		return <p className="text-gray-500">No bids yet.</p>;
	}

	return (
		<div className="space-y-3">
			{history.map((point, idx) => (
				<div
					key={`${point.createdAt}-${idx}`}
					className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 shadow-sm"
				>
					<span className="font-semibold text-gray-900">
						{currency.format(point.amount)}
					</span>
					<span className="text-sm text-gray-500">
						{new Date(point.createdAt).toLocaleString()}
					</span>
				</div>
			))}
		</div>
	);
}

function SimilarItems({ items }: { items?: Item[] }) {
	if (!items?.length) {
		return <p className="text-gray-500">No similar items yet.</p>;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{items.map((item) => (
				<Link
					key={item.id}
					href={`/items/${item.id}`}
					className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
				>
					<div className="h-48 bg-gray-100">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={item.imageUrl || 'https://placehold.co/600x400?text=Item'}
							alt={item.name}
							className="h-full w-full object-cover transition group-hover:scale-[1.02]"
						/>
					</div>

					<div className="flex flex-col gap-2 p-4">
						<h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
						<p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>

						<div className="flex items-center justify-between text-sm">
							<span className="font-semibold text-indigo-600">
								{currency.format(item.price)}
							</span>
							<span className="text-gray-500">{item.bids} bids</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await fetchItem(id);
	const endingIn = formatRelativeTime(data.item.endingAt);
	const minimumBid = data.item.price + 0.01;

	return (
		<div className="flex flex-col gap-12 py-10">
			<div className="flex flex-col gap-10 lg:flex-row">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={data.item.imageUrl || 'https://placehold.co/600x400?text=Item'}
					alt={data.item.name}
					className="w-full max-w-xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
				/>

				<div className="flex flex-1 flex-col gap-6">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<h1 className="text-3xl font-semibold text-gray-900">{data.item.name}</h1>

							<LikeButton
								itemId={data.item.id}
								initialLikes={data.item.likes ?? 0}
								initialUserLikes={Boolean(data.userLikes)}
							/>
						</div>

						<Link
							href={`/users/${data.item.ownerId}`}
							className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
						>
							See the seller
						</Link>

						<p className="leading-relaxed text-gray-700">{data.item.description}</p>

						<hr className="border-gray-200" />

						<div className="grid gap-4 sm:grid-cols-3">
							<div className="rounded-xl bg-gray-50 p-4 shadow-sm">
								<div className="text-xs uppercase text-gray-500">High Bid</div>
								<div className="text-2xl font-bold text-gray-900">
									{currency.format(data.item.price)}
								</div>
							</div>

							<div className="rounded-xl bg-amber-50 p-4 shadow-sm">
								<div className="text-xs uppercase text-gray-600"># Bids</div>
								<div className="text-2xl font-bold text-amber-600">{data.item.bids}</div>
							</div>

							<div className="rounded-xl bg-violet-50 p-4 shadow-sm">
								<div className="text-xs uppercase text-gray-600">Ending In</div>
								<div className="text-2xl font-bold text-violet-600">{endingIn}</div>
							</div>
						</div>

						{data.userHasHighBid && (
							<div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
								You have the highest bid!
							</div>
						)}

						<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
							<h2 className="mb-4 text-lg font-semibold text-gray-900">Place a Bid</h2>
							<BidForm itemId={data.item.id} minimumBid={minimumBid} />
						</div>
					</div>
				</div>
			</div>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-900">Bid History</h2>
				<BidHistory history={data.history} />
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold text-gray-900">Similar Items</h2>
				<SimilarItems items={data.similarItems} />
			</section>
		</div>
	);
}
