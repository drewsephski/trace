export default function LoadingSpinner() {
	return (
		<div className="flex min-h-[50vh] items-center justify-center px-6">
			<div className="flex items-center gap-3 rounded-full border border-[var(--hairline)] bg-[var(--ink-card)] px-4 py-3 text-sm text-[var(--muted)]">
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
				Loading
			</div>
		</div>
	);
}
