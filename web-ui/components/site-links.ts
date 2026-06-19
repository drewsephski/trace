export const DEMO_EMAIL = "demo@trace.app";
export const DASHBOARD_PATH = "/dashboard";
export const PROFILE_PATH = "/profile";
export const LOGIN_PATH = "/login";
export const PAYMENT_PATH = "/pay?plan=enterprise";
export const RESET_PASSWORD_PATH = `/reset-password?email=${encodeURIComponent(DEMO_EMAIL)}`;
export const VERIFY_EMAIL_PATH = `/verify-email?email=${encodeURIComponent(DEMO_EMAIL)}`;
export const UPDATE_PASSWORD_PATH = "/update-password";
export const PREVIEW_EMAIL_PATH = "/preview-email";

export function getLoginHref(nextPath?: string) {
	return nextPath ? `${LOGIN_PATH}?next=${encodeURIComponent(nextPath)}` : LOGIN_PATH;
}

export function getPrimaryCtaHref(isAuthenticated: boolean | null | undefined) {
	return isAuthenticated ? PAYMENT_PATH : getLoginHref(PAYMENT_PATH);
}

export const pageLinkGroups = [
	{
		title: "Public",
		links: [
			{ href: "/", label: "Home", description: "Landing page and product story" },
			{ href: LOGIN_PATH, label: "Login", description: "Sign in or create an account" },
		],
	},
	{
		title: "Product",
		links: [
			{ href: DASHBOARD_PATH, label: "Dashboard", description: "Subscription-aware workspace" },
			{ href: PROFILE_PATH, label: "Profile", description: "Account and billing management" },
			{ href: PAYMENT_PATH, label: "Pay", description: "Choose a billing plan" },
		],
	},
	{
		title: "Auth",
		links: [
			{ href: RESET_PASSWORD_PATH, label: "Reset password", description: "Send a recovery email" },
			{ href: UPDATE_PASSWORD_PATH, label: "Update password", description: "Set a new password" },
			{ href: VERIFY_EMAIL_PATH, label: "Verify email", description: "Confirm your inbox address" },
		],
	},
	{
		title: "Tools",
		links: [
			{ href: PREVIEW_EMAIL_PATH, label: "Preview email", description: "Inspect transactional templates" },
		],
	},
] as const;

export const landingQuickLinks = [
	{ href: LOGIN_PATH, label: "Login" },
	{ href: DASHBOARD_PATH, label: "Dashboard" },
	{ href: PROFILE_PATH, label: "Profile" },
	{ href: PAYMENT_PATH, label: "Pay" },
	{ href: RESET_PASSWORD_PATH, label: "Reset Password" },
	{ href: UPDATE_PASSWORD_PATH, label: "Update Password" },
	{ href: VERIFY_EMAIL_PATH, label: "Verify Email" },
	{ href: PREVIEW_EMAIL_PATH, label: "Preview Email" },
] as const;
