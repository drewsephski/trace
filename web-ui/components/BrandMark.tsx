"use client";

import Image from "next/image";
import Link from "next/link";
import { LOGO_SRC } from "./constants";

interface BrandMarkProps {
	href?: string;
	className?: string;
	showWordmark?: boolean;
}

export default function BrandMark({
	href = "/",
	className = "",
	showWordmark = true,
}: BrandMarkProps) {
	const content = (
		<>
			<Image
				src={LOGO_SRC}
				alt="Trace"
				width={40}
				height={40}
				priority
				className="h-10 w-10 shrink-0 rounded-[14px] object-cover object-center"
			/>
			{showWordmark && (
				<span className="serif text-xl tracking-tight" style={{ fontWeight: 600 }}>
					Trace
				</span>
			)}
		</>
	);

	if (href) {
		return (
			<Link href={href} className={`flex items-center gap-3 ${className}`.trim()}>
				{content}
			</Link>
		);
	}

	return <div className={`flex items-center gap-3 ${className}`.trim()}>{content}</div>;
}
