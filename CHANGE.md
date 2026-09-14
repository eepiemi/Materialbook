## Astryxbook - v1.0.0

<ins>**Changelog:**</ins>

* Feature: Rebrand to Astryxbook — new name, applicationId, and an original "A" monogram launcher icon (not Facebook's trademarked logo, to avoid impersonation/trademark issues).
* Tweak: Change default settings — 'Material You' theming and 'AMOLED Black' now ship off by default, so the app matches Facebook's own original look out of the box. Both remain available as opt-in toggles for anyone who preferred the previous look.
* Tweak: Native screens (splash, settings, dialogs) now use Facebook's blue instead of Material You's dynamic/purple fallback colors when Material You is off.
* Tweak: Tightened native typography to better match Facebook's own, denser type scale.
* Tweak: Removed the 'Support my work! ☕' button — not relevant to this fork.
* Fix: Runtime-fetched scripts now come from this fork's own repo instead of upstream Materialbook's.
* Non-app related: Added a test suite covering the rebrand — defaults, theme colors, app identity/strings, launcher icon, applicationId, and script source.
* Non-app related: Updated README, issue templates, and the release workflow for the new branding.

---

## Materialbook - v1.0.0

<ins>**Changelog:**</ins>

* Feature: Add 'Material You' setting that themes Facebook's blues using your MY colors.
* Feature: Hide more login screen distractions.
* Tweak: Settings are now a full page, with visual sections of settings. (upstream)
* Tweak: Settings use Material You fallback colors on Android 10 or below.
* Tweak: Change the button at the bottom of settings to a 'Support my work! ☕' button.
* Tweak: Change settings gear's icon and color.
* Tweak: Change default settings.
* Tweak: Make loading bar's background transparent.
* Tweak: Increase settings header vertical padding
* Tweak: Make settings header use default background color
* Fix: Navigation bar's color follows the settings' background color when inside settings.
* Fix: Improve AMOLED Black.
* Non-app related: Improved the README.

> [!NOTE]
> I'm sorry this update has taken multiple months.
>
> The Material You script was not good enough to publish by my standards
> (even when it did get the job done), so as I got better I did a full rewrite
> and made it 4x shorter and increased the coverage.

> [!TIP]
> Did you find a place that isn't AMOLED Black or Material You? Comment
> in [this discussion](https://github.com/eepiemi/Materialbook/discussions/1).
>
> Or maybe you're dissatisfied with the lack of translations for some elements? Help
> me get everything translated by commenting in
> [this discussion](https://github.com/eepiemi/Materialbook/discussions/2).
> Any help with the large amount of gaps that are present will be HIGHLY APPRECIATED!!
>
> Or you just have an issue? File an issue [here](https://github.com/eepiemi/Materialbook/issues/new/choose).
> I can't guarantee I'll be able to fix it with my current Kotlin + Jetpack Compose skills though 😅

I REALLY hope you enjoy what has become the biggest project of my life! 🥹