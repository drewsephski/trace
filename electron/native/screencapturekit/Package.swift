// swift-tools-version: 5.9

import PackageDescription

let package = Package(
	name: "TraceScreenCaptureKitHelper",
	platforms: [
		.macOS(.v13)
	],
	products: [
		.executable(
			name: "trace-screencapturekit-helper",
			targets: ["TraceScreenCaptureKitHelper"]
		),
		.executable(
			name: "trace-macos-cursor-helper",
			targets: ["TraceMacOSCursorHelper"]
		)
	],
	targets: [
		.executableTarget(
			name: "TraceScreenCaptureKitHelper",
			path: "Sources/TraceScreenCaptureKitHelper"
		),
		.executableTarget(
			name: "TraceMacOSCursorHelper",
			path: "Sources/TraceMacOSCursorHelper"
		)
	]
)
