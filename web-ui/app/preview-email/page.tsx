"use client";

import { motion } from "framer-motion";
import { render } from "@react-email/components";
import { useEffect, useState } from "react";
import PageFrame from "@/components/PageFrame";
import {
	BillingConfirmationEmail,
	CancellationConfirmationEmail,
	WelcomeEmail,
} from "@/emails/templates";

type EmailTemplate = "welcome" | "billing" | "cancellation";

const welcomeData = {
	userName: "Sean",
	dashboardUrl: "https://my-full-stack-app-iota.vercel.app/dashboard",
};

const billingData = {
	firstName: "Sean",
	tierName: "Pro",
	firstChargeDate: "February 16, 2026",
	dashboardUrl: "https://my-full-stack-app-iota.vercel.app/dashboard",
	billingUrl: "https://my-full-stack-app-iota.vercel.app/profile",
};

const cancellationData = {
	firstName: "Sean",
	retentionDays: 14,
	resubscribeUrl: "https://my-full-stack-app-iota.vercel.app/pay",
};

const templates: { id: EmailTemplate; label: string }[] = [
	{ id: "welcome", label: "Welcome" },
	{ id: "billing", label: "Billing" },
	{ id: "cancellation", label: "Cancellation" },
];

export default function EmailPreviewPage() {
	const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>("welcome");
	const [emailHtml, setEmailHtml] = useState<string>("");

	useEffect(() => {
		const renderEmail = async () => {
			let html = "";
			switch (selectedTemplate) {
				case "welcome":
					html = await render(WelcomeEmail(welcomeData));
					break;
				case "billing":
					html = await render(BillingConfirmationEmail(billingData));
					break;
				case "cancellation":
					html = await render(CancellationConfirmationEmail(cancellationData));
					break;
			}
			setEmailHtml(html);
		};

		renderEmail();
	}, [selectedTemplate]);

	return (
		<PageFrame
			title="Email previews"
			description="Inspect transactional email templates."
			compact
		>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
				className="space-y-6"
			>
				<div className="flex flex-wrap gap-2">
					{templates.map((template) => (
						<button
							key={template.id}
							onClick={() => setSelectedTemplate(template.id)}
							className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
							style={
								selectedTemplate === template.id
									? { backgroundColor: "var(--gold)", color: "var(--ink)", borderColor: "transparent" }
									: { borderColor: "var(--hairline)", color: "var(--muted)" }
							}
						>
							{template.label}
						</button>
					))}
				</div>

				<div className="overflow-hidden rounded-[28px] border border-[var(--hairline)] bg-white">
					{emailHtml ? (
						<iframe
							srcDoc={emailHtml}
							title="Email Preview"
							className="h-[900px] w-full border-0"
						/>
					) : (
						<div className="flex h-[600px] items-center justify-center">
							<p className="text-sm text-slate-500">Loading preview…</p>
						</div>
					)}
				</div>
			</motion.div>
		</PageFrame>
	);
}
