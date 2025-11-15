'use client';

export default function Search() {
	return (
		<div className="relative h-10 w-96 ml-4 border border-gray-300 text-sm rounded-full flex bg-white">
			<input
				type="search"
				name="search"
				placeholder="Search"
				className="px-4 w-full rounded-full text-sm focus:outline-none"
			/>
		</div>
	);
}
