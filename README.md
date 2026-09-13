<p align="middle">
    <img src='./fastlane/metadata/android/en-US/images/featureGraphic.png' alt="Astryxbook banner" width="100%">
</p>

<h1 align="middle">
    📱 Download 
</h1>

<p align="middle">
    <a href='https://github.com/ofirc73/Materialbook/releases/latest'><img alt='Download' height='40' src='./assets/download.svg'/></a>
    <a href='https://grev.shehryar.ae/?owner=ofirc73&repo=Materialbook'><img alt='Downloads count' height='40' src='https://downloads-count.eepiemi.workers.dev'/></a>
</p>

<h2 align="middle">
    🙋 Have issues?
</h2>

<p align="middle">
    <a href='https://github.com/ofirc73/Materialbook/issues/new/choose'><img alt='Open issue' height='40' src='./assets/open_issue.svg'/></a>
</p>

<h2 align="middle">
    ✏️ This fork:
</h2>

*  Renames the app to **Astryxbook**, with an original "A" monogram launcher icon (Facebook blue, but not Facebook's own trademarked logo — avoids impersonation/trademark issues)
*  Restyles it to match **Facebook's own original Android look** — Material You theming and AMOLED Black now ship **off by default**, using Facebook's native blue instead of your wallpaper colors out of the box
*  Both settings remain available as opt-in toggles for anyone who preferred the upstream [Materialbook](https://github.com/eepiemi/Materialbook) look
*  Everything below still applies whenever those toggles are switched on

<h2 align="middle">
    ⚙️ Features
</h2>

If enabled, the app:
*  Uses Material You colors instead of Facebook's blues
*  Makes Facebook AMOLED Black
*  Blocks sponsored ads
*  Hides distractions like:
    *  Suggested posts
    *  Reels
    *  Stories
    *  Groups
    *  People you may know
*  Keeps the navigation bar at the top
*  Downloads media or copies it to the clipboard
*  And more!

<h2 align="middle">
    🛠️ Setup
</h2>

1.  **Clone the repository**
    * In Android Studio:
      * File > New > Project from Version Control
      * Paste `https://github.com/ofirc73/Materialbook.git` and clone.
    * Or via terminal: 
    ```
    git clone https://github.com/ofirc73/Materialbook.git
    cd Materialbook
    ``` 
2.  **Open in Android Studio.** (only if cloned via terminal)
    * Select Open an Existing Project and choose the cloned folder.
3.  **Sync the project** to download dependencies.
4.  **Run the app** in a device or emulator.

<h2 align="middle">
    ✅ Testing
</h2>

Covers the rebrand and default-behavior changes in this fork — defaults (Material You/AMOLED off), theme colors, app identity/strings, launcher icon, applicationId, and the pinned scripts source.

*  **Unit tests** (no device/emulator needed): `./gradlew test`
*  **Instrumented tests** (needs a connected device or running emulator): `./gradlew connectedAndroidTest`

<h2 align="middle">
    💗 Acknowledgement:
</h2>

*  This is a fork of [Materialbook](https://github.com/eepiemi/Materialbook) by eepiemi, itself a fork of [Nobook](https://github.com/ycngmn/Nobook) by ycngmn
*  [@KevinnZou/compose-webview-multiplatform](https://github.com/KevinnZou/compose-webview-multiplatform)  
