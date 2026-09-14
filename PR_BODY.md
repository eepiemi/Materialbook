# Rebrand to Astryxbook

Rebrand from Materialbook to Astryxbook, defaulting to Facebook's original
look instead of Material You, plus a test suite covering the changes.

## Defaults
- Material You theming and AMOLED Black now ship **off** by default
  (previously on). Both remain available as opt-in toggles.
- Fixed `-v31`/`-night-v31` themes.xml pulling Android's dynamic
  `system_accent1_*` color unconditionally, outside the settings toggle.

## Rebrand
- `applicationId` -> `com.astryx.book` (namespace left as
  `com.eepiemi.materialbook` to keep future upstream merges low-conflict)
- `app_name` -> "Astryxbook" across all 8 locales
- `Theme.Materialbook` -> `Theme.Astryxbook`
- New launcher icon: original "A" monogram on Facebook blue (not Facebook's
  trademarked logo), with a non-adaptive `mipmap-anydpi` fallback for API 21-25
- Native typography tightened to match Facebook's denser type scale

## Fixes
- `SCRIPT_SRC` was fetching live JS from eepiemi's repo at runtime instead of
  this fork's own; repointed to `ofirc73/Materialbook`
- `ExampleInstrumentedTest` hardcoded the old package name; now compares
  against `BuildConfig.APPLICATION_ID`
- Removed the Buy Me a Coffee button/link (not relevant to this project) and
  the `FUNDING.yml` entry pointing at it

## Tests
13 new/updated test files covering defaults, theme colors, app identity,
script source, applicationId, and the launcher icon.

## Docs / CI
- README updated (branding, links, testing section)
- Issue templates and release workflow updated for the new branding
- `CHANGE.md` updated with an Astryxbook v1.0.0 entry
