"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { BillingPlanId } from "@/lib/billing/plans";

interface CheckoutButtonProps {
	planId: BillingPlanId;
	className?: string;
	children: React.ReactNode;
}

export function CheckoutButton({ planId, className, children }: CheckoutButtonProps) {
	const { user } = useAuth();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		if (!user) {
			router.push(`/login?redirect=${encodeURIComponent(`/pay?plan=${planId}`)}`);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ planId }),
			});

			const payload = (await response.json()) as { url?: string; error?: string };

			if (!response.ok || !payload.url) {
				throw new Error(payload.error ?? "Unable to start checkout");
			}

			window.location.assign(payload.url);
		} catch (error) {
			console.error("Checkout error:", error);
			setIsLoading(false);
		}
	};

	return (
		<button type="button" onClick={handleClick} disabled={isLoading} className={className}>
			{isLoading ? "Redirecting to Stripe…" : children}
		</button>
	);
}
