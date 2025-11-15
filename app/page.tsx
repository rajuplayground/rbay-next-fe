import { getSessionFromCookies } from "@/src/lib/middleware/session";

export default async function Home() {
  const session = await getSessionFromCookies();
  const isLoggedIn = !!session?.userId;

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoggedIn && (
        <section className="mb-10 rounded-xl bg-amber-50 p-8 shadow">
          <h2 className="text-2xl font-semibold mb-2">Welcome back, {session?.username}!</h2>
          <p className="text-gray-700 mb-6">
            This is your dashboard preview. Here we&apos;ll eventually surface your selling stats,
            drafts, and recommended actions. For now, it&apos;s a placeholder to confirm you&apos;re signed in.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-3xl font-bold text-amber-500">0</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-3xl font-bold text-amber-500">0</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Watchlist</p>
              <p className="text-3xl font-bold text-amber-500">0</p>
            </div>
          </div>
        </section>
      )}

      <h1 className="text-3xl font-bold mb-8">Most Expensive</h1>
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for expensive items</p>
        </div>
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for expensive items</p>
        </div>
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for expensive items</p>
        </div>
      </div>

      <hr className="my-8" />

      <h1 className="text-3xl font-bold mb-8">Ending Soonest</h1>
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for ending soon items</p>
        </div>
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for ending soon items</p>
        </div>
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for ending soon items</p>
        </div>
      </div>

      <hr className="my-8" />

      <h1 className="text-3xl font-bold mb-8">Most Views</h1>
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for most viewed items</p>
        </div>
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for most viewed items</p>
        </div>
        <div className="flex-1 bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-500">Placeholder for most viewed items</p>
        </div>
      </div>
    </div>
  );
}
