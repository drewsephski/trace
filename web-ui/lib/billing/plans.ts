export type BillingPlanId = "pro" | "enterprise" | "custom";

export interface BillingPlan {
	id: BillingPlanId;
	name: string;
	price: string;
	interval: string;
	description: string;
	features: string[];
	cta: string;
	popular: boolean;
}

export const BILLING_PLANS: BillingPlan[] = [
	{
		id: "pro",
		name: "Pro",
		price: "$19",
		interval: "/month",
		description: "Perfect for small teams and startups",
		features: [
			"All template features",
			"Priority support",
			"Custom branding",
			"Analytics dashboard",
			"Team collaboration",
		],
		cta: "Get Started",
		popular: false,
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: "$49",
		interval: "/month",
		description: "For larger organizations",
		features: [
			"Everything in Pro",
			"Advanced security",
			"Custom integrations",
			"24/7 support",
			"SLA guarantee",
		],
		cta: "Start Trial",
		popular: true,
	},
	{
		id: "custom",
		name: "Custom",
		price: "Custom",
		interval: "",
		description: "Tailored to your needs",
		features: [
			"Custom development",
			"Dedicated support",
			"Custom SLA",
			"On-premise options",
			"Training sessions",
		],
		cta: "Contact Sales",
		popular: false,
	},
];

export function isBillingPlanId(planId: string | null | undefined): planId is BillingPlanId {
	return BILLING_PLANS.some((plan) => plan.id === planId);
}

export function getBillingPlan(planId: string | null | undefined): BillingPlan {
	if (!isBillingPlanId(planId)) {
		return BILLING_PLANS[1];
	}

	return BILLING_PLANS.find((plan) => plan.id === planId) ?? BILLING_PLANS[1];
}
