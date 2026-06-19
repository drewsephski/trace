# Trace v1.5.0 — Production Readiness Assessment

> **Audit Date:** June 18, 2026
> **App:** Trace v1.5.0 — Electron screen recording + video editor
> **Target:** macOS App Store (primary), cross-platform builds (secondary)

---

## Problem

Is Trace v1.5.0 ready to publish to the App Store? This document captures a comprehensive audit across 7 dimensions of production readiness, conducted via structured brainstorming with the developer.

---

## Findings by Branch

### 1. Code Quality & Testing

**Status: 🟡 Needs Work**

| Metric | Status |
|--------|--------|
| TypeScript compilation | ✅ Clean — zero errors |
| Unit/integration tests | ✅ 225 tests across 31 files, all passing |
| Linting | ⚠️ 11 errors (confined to `web/` directory) |
| Error handling | ❌ Unhandled promise rejections, missing try/catch in IPC handlers |
| TypeScript strictness | ❌ Loose `any` usage, type gaps across IPC boundaries |
| Testing depth | ❌ Missing coverage for core recording, export, and preference flows |

**Top priorities:**
- Audit and harden error handling across all IPC handlers and async operations
- Tighten TypeScript strictness and eliminate `any` usage
- Add unit/integration tests for core recording, export, and preferences

---

### 2. Build & Packaging

**Status: 🔴 Not Ready for App Store**

| Area | Status |
|------|--------|
| Code signing (Developer ID) | 🟡 Partially configured (CI has cert import) |
| Code signing (MAS) | ❌ Not configured |
| Notarization | ❌ `"notarize": false` in electron-builder.json5 |
| MAS target | ❌ Missing — only DMG target configured |
| Provisioning profiles | ❌ Not set up |
| Entitlements | 🟡 Have hardened runtime entitlements, but missing MAS sandbox entitlements |

**Top priorities:**
- Provision Mac App Store distribution certificate + production provisioning profile
- Add `mas` target to electron-builder configuration
- Set up MAS-specific entitlements (sandbox + screen recording exceptions)
- Fill in Apple ID credentials in `.env` and CI secrets

---

### 3. Feature Completeness

**Status: ✅ Ready for Launch**

All core features are assessed as launch-ready:
- Screen recording (ScreenCaptureKit on macOS, WGC on Windows)
- Window/screen source selection
- Microphone + system audio capture
- Webcam overlay (picture-in-picture, mirroring, shapes)
- Auto-zoom with cursor tracking
- Cursor effects (smoothing, click effects, themes)
- AI captions (on-device, offline-capable)
- Video editor (timeline, trim, speed control, annotations)
- GIF + MP4 export
- Keyboard shortcuts (customizable)
- Project save/load
- 13 language translations
- System tray integration

---

### 4. Distribution & Deployment

**Status: 🔴 Not Ready**

| Area | Status |
|------|--------|
| App Store Connect setup | ❌ Metadata, screenshots, pricing not configured |
| Code signing (mas) | ❌ Not configured |
| Notarization pipeline | ❌ Not enabled |
| Installer types | 🟡 DMG works; MAS/PKG not configured |
| Auto-updater | ❌ Not configured (no electron-updater, no Sparkle) |
| Crash reporting | ❌ Not configured |
| CI/CD pipeline | ✅ Fully working (lint → typecheck → test → build) |

**Top priorities:**
- Configure App Store Connect listing (screenshots, descriptions, pricing, categories)
- Enable notarization in CI pipeline
- Build and validate MAS `.pkg` installer
- (Future) Add auto-updater for direct-download channel

---

### 5. Legal, Licensing & Documentation

**Status: 🔴 Not Ready**

| Area | Status |
|------|--------|
| LICENSE file | 🟡 MIT license exists (copyright held by original author) |
| EULA | ❌ Missing (Apple requires one for macOS App Store) |
| Privacy policy | ❌ Missing (critical for screen recording app) |
| Terms of Service | ❌ Missing |
| Third-party license attribution | ❌ Not audited |
| App Store privacy disclosures | ❌ Not drafted |
| README | ⚠️ Warns "not production-grade" — needs rewrite for launch |
| User documentation | ⚠️ Minimal |
| Changelog | ⚠️ Not published |
| Legal/Copyright notices | ❌ Missing updated copyright for fork maintainer |

**Top priorities:**
- Create EULA, Privacy Policy, and Terms of Service
- Update LICENSE file to reflect current fork ownership
- Draft Apple-required privacy disclosures about screen recording data handling
- Run third-party license audit (`license-checker` or similar)
- Rewrite README to remove "not production-grade" warning
- Create changelog for v1.5.0

---

### 6. Platform-Specific Requirements

**Status: 🔴 Not Ready**

| Requirement | Status |
|-------------|--------|
| macOS sandbox entitlements | ❌ Not configured |
| macOS App Store compliance | ❌ Hardened runtime + sandbox not tested |
| Notarization | ❌ Not enabled |
| Windows signing / Store | ❌ Not configured |
| Linux packaging | 🟡 AppImage/deb/pacman configured but untested |
| Auto-update | ❌ Not configured |

**Key blockers for App Store submission:**
- macOS sandbox entitlements (`com.apple.security.app-sandbox`) must be added
- Screen recording requires special entitlement handling (`com.apple.security.device.camera`, `com.apple.security.temporary-exception`)
- Apple will reject an app that can capture screen content without sandbox restrictions and proper privacy disclosures
- Notification of user consent, permission prompts, and data handling must be documented and visible

---

### 7. UX & Polish

**Status: 🟡 Needs Work**

| Area | Status |
|------|--------|
| Onboarding / first-run experience | ❌ Missing |
| Error handling / user-facing messages | ❌ Needs improvement |
| Menubar/tray polish | 🟡 Functional but rough |
| App icon & branding | 🟡 Rebranding in progress (OpenScreen → Trace) |
| Permissions flow | 🟡 Implemented but edge cases need handling |
| Loading / empty states | 🟡 Partially present |

**Top priorities:**
- Design onboarding flow guiding users through permissions and first recording
- Audit all error states and replace technical errors with user-friendly messages
- Polish menubar interactions (icon states for recording/idle, menu items, click behavior)
- Finalize app icon and visual branding (dock icon, tray icon, retina assets)

---

## Recommendation

**Trace v1.5.0 is NOT ready to publish to the App Store.**

The app has a solid foundation — features are complete, tests pass, TypeScript compiles clean — but there are significant gaps across every non-code dimension that Apple's review process will catch.

### Critical Path (Estimated: 2-4 weeks)

1. **Build pipeline:** Configure `mas` target in electron-builder, provision MAS certificates, set up provisioning profiles
2. **Entitlements:** Add macOS sandbox entitlements alongside existing hardened runtime entitlements
3. **Notarization:** Enable notarization pipeline (fill Apple ID credentials, test dry-run)
4. **Legal:** Create Privacy Policy, EULA, ToS; draft App Store privacy disclosures; audit third-party licenses
5. **App Store Connect:** Set up store listing with screenshots, descriptions, pricing, and privacy policy links
6. **Documentation:** Rewrite README (remove "not production-grade"), create changelog, add user-facing docs
7. **Error handling:** Audit and harden error handling across all async paths

### Should Do Before Launch (Estimated: 1-2 weeks)

8. **Onboarding:** Build first-run flow for permissions and initial recording
9. **UX polish:** Refine error messages, menubar interactions, empty/loading states
10. **Branding:** Finalize app icons (dock, menubar, retina)
11. **Testing:** Add coverage for core recording/preferences/export flows
12. **TypeScript:** Tighten strictness, eliminate `any` usage

### Nice to Have (Post-Launch)

- Auto-updater (electron-updater or Sparkle)
- Crash reporting integration
- Windows App Store submission
- Linux distribution packaging polish

---

## Appendix: Current Strengths

Despite the gaps, the project has significant strengths that make it worth shipping:

- ✅ **Full CI/CD pipeline** — lint, typecheck, test, build all automated in GitHub Actions
- ✅ **225 passing tests** — strong foundation of unit/integration tests
- ✅ **Zero TypeScript errors** — clean compilation
- ✅ **Complete feature set** — recording, editing, captions, export all working
- ✅ **Cross-platform build config** — macOS, Windows, and Linux targets defined
- ✅ **macOS code signing pipeline** — CI-ready, just needs certs filled in
- ✅ **13 language translations** — broad internationalization
- ✅ **Native platform recording** — ScreenCaptureKit (macOS) and WGC (Windows)
- ✅ **MIT open source** — no licensing ambiguity
- ✅ **Modern stack** — React 18, Vite 7, Electron 41, Tailwind CSS
- ✅ **Pre-commit hooks** — Husky + lint-staged prevents bad commits
