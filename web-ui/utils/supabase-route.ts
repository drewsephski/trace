import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseRouteClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll() {
					// Route handlers in this app only need read access to the session.
					// The auth callback handles cookie writes when exchanging OAuth codes.
				},
			},
		},
	);
}
