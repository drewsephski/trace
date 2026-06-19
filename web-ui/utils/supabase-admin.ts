import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdminClient: SupabaseClient | null = null;

function createSupabaseAdminClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url) {
		throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
	}

	if (!serviceRoleKey) {
		throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
	}

	return createClient(url, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
			detectSessionInUrl: false,
		},
		global: {
			headers: {
				"Content-Type": "application/json",
				apikey: serviceRoleKey,
			},
		},
	});
}

function getSupabaseAdminClient() {
	if (!supabaseAdminClient) {
		supabaseAdminClient = createSupabaseAdminClient();
	}

	return supabaseAdminClient;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
	get(_target, property) {
		const client = getSupabaseAdminClient();
		const value = client[property as keyof SupabaseClient];

		if (typeof value === "function") {
			return value.bind(client);
		}

		return value;
	},
}) as SupabaseClient;
