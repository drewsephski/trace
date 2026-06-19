"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getLoginHref } from "./site-links";

interface CheckoutButtonProps {
	planId: string;
	className?: string;
	children: ReactNode;
}

export function CheckoutButton({ planId, className, children }: CheckoutButtonProps) {
	const router = useRouter();
	const { user } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleClick = async () => {
		setError(null);

		if (!user) {
			router.push(getLoginHref(`/pay?plan=${encodeURIComponent(planId)}`));
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planId }),
			});

			const payload = (await response.json()) as { url?: string; error?: string };

			if (!response.ok || !payload.url) {
				if (response.status === 401) {
					router.push(getLoginHref(`/pay?plan=${encodeURIComponent(planId)}`));
					return;
				}
				throw new Error(payload.error ?? "Unable to create checkout session");
			}

			window.location.assign(payload.url);
		} catch (checkoutError) {
			setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-3">
			<button
				type="button"
				onClick={handleClick}
				disabled={isSubmitting}
				className={className}
			>
				{isSubmitting ? "Redirecting…" : children}
			</button>
			{error && <p className="text-sm text-red-300">{error}</p>}
		</div>
	);
}
