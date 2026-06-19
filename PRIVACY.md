# Privacy Policy

**Last updated:** June 18, 2026

## Overview

Trace is an open-source screen recording and video editing application. This privacy policy explains what data the application accesses, how it is processed, and what (if anything) is shared with third parties.

**Trace processes all data locally on your device. No personal information, recordings, or usage data is sent to any remote server.**

## Data Collection

### What Trace Accesses

| Data | Purpose | Storage |
|------|---------|---------|
| Screen content | Recording selected windows or displays | Local files only |
| Camera feed | Picture-in-picture webcam overlay during recordings | Local files only |
| Microphone audio | Voiceover narration during recordings | Local files only |
| System audio | Computer audio output during recordings | Local files only |
| Cursor position/frames | Auto-zoom and cursor effects | Local files only |

### What Trace Does NOT Collect

- No account registration or personal information
- No analytics or telemetry
- No crash reports (unless you explicitly use the "Save Diagnostic" feature)
- No email addresses, names, or contact data
- No IP addresses or network identifiers
- No usage statistics

## Data Processing

All recording, editing, and export operations are performed entirely on your device:

- **AI captions** are generated on-device using local models. No audio data is uploaded.
- **Export** writes final video files to your chosen location (Downloads folder by default).
- **Project files** (.trace) are stored locally and contain references to your media files.

## Third-Party Services

Trace does not integrate any third-party analytics, advertising, or tracking services.

The only network access Trace may perform:

- **Auto-update checks** (macOS DMG / Windows builds): queries the GitHub Releases API to check for new versions.
- **AI caption model downloads**: caption model files are fetched from a content delivery network on first use. No identifying information is included in these requests.

## Data Retention

- Recordings and projects remain on your device until you delete them.
- Temporary files in the application's data directory may be cleaned up on app restart.
- You can delete all recordings and projects at any time through the app or file system.

## Your Control

- All recordings, projects, and exported files are yours. You can delete, share, or modify them as you wish.
- You can revoke camera, microphone, and screen recording permissions at any time through System Settings (macOS) or Settings > Privacy (Windows).

## Open Source

Trace is open-source software under the MIT License. The complete source code is available at [https://github.com/drewsephski/trace](https://github.com/drewsephski/trace). Anyone can verify that the application behaves as described in this policy.

## Updates

This privacy policy may be updated occasionally. Changes will be noted in the application's changelog and version history.

## Contact

For questions about this policy, open an issue on GitHub:

[https://github.com/drewsephski/trace/issues](https://github.com/drewsephski/trace/issues)
