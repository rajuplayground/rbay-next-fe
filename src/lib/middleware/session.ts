import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/src/lib/config/api';

export interface Session {
	id: string;
	userId: string | null;
	username: string;
}

export interface SessionContext {
	session: Session;
}

/**
 * Get session from cookies by fetching from backend API
 * This is the frontend-only approach - we don't query Redis directly
 */
export const getSessionFromCookies = async (): Promise<Session | null> => {
	const cookieStore = await cookies();
	const auth = cookieStore.get('auth')?.value;

	if (!auth) {
		return null;
	}

	try {
		// Fetch session from backend API
		const response = await fetch(`${API_BASE_URL}/api/sessions`, {
			cache: 'no-store',
			headers: {
				Cookie: `auth=${auth}`
			}
		});

		if (!response.ok) {
			return null;
		}

		const session = await response.json();
		return session;
	} catch (error) {
		console.error('Failed to fetch session:', error);
		return null;
	}
};
