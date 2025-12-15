# Changelog

## 0.3.0 (2025-12-15)
- Major internal cleanup and preparation for stable release
- Unified state/object hierarchy (device → channels → states)
- Added global axios timeout and adapter-safe timers
- Improved ID sanitization for ioBroker object compatibility
- Logging fully converted to English and ASCII-safe
- Removed emojis from logging (adapter-check requirement)
- Updated jsonConfig and documentation structure
- Added English and German docs under `docs/`
- General code refactoring and stability improvements

## 0.2.15 (2025-11-02)
- Cleaned up admin/jsonConfig for adapter-check
- Added missing `size` attributes
- Added `.commitinfo` to `.gitignore`
- No functional changes

## 0.2.14 (2025-11-01)
- Updated development tooling:
  - release-script v5
  - ESLint 9, TypeScript 5.9, Prettier 3
- No functional changes

## 0.2.13 (2025-10-29)
- Fixed JSON syntax error in `io-package.json`
- Updated VSCode JSON schema reference
- Revalidated jsonConfig size attributes

## 0.2.12 (2025-10-29)
- Corrected jsonConfig schema URL
- Added missing responsive size attributes
- Updated minimum system requirements

## 0.2.11 (2025-10-28)
- Minor code corrections
- Improved stability and maintainability
