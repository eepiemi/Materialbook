<h1 align=center>
    Materialbook
</h1>
![Downloads](https://img.shields.io/github/downloads/eepiemi/Materialbook/total?link=https%3A%2F%2Fgithub.com%2Feepiemi%2FMaterialbook%2Freleases)

<p align="center">
  <img src='images/materialbook_github_cover.png' height='200' alt="materialbook_cover">
</p>

<div align="center">Materialbook is a lightweight Android application to browse facebook, with material you theming!</div>

## Changes over Nobook

*  Implemented Material You theming for the app icon
*  Brought back Material You theming in the settings page (reverted the switches back to the default MY switch)
*  Made the dialog on the no internet screen follow the M3 specification
*  Made the splash screen, the no internet screen and the settings page, along with its "Customize feed" submenu Amoled Black
*  Removed the ```elevation``` property of the "Apply Immediately?" button in the settings page (unintended visual bug ycngmn missed)

## Features

*  Blocks sponsored ads.
*  Blocks suggested posts.
*  Downloads media.
*  And more.

## Installation

[<img src='images/get-it-on-github.png' alt='Get it on GitHub' height = "90">](https://github.com/eepiemi/Materialbook/releases/latest)

## Setup

1.  **Clone the repository**
    * In Android Studio:
      * File > New > Project from Version Control
      * Paste `https://github.com/eepiemi/Materialbook.git` and clone.
    * Or via terminal: 
    ```
    git clone https://github.com/eepiemi/Materialbook.git
    cd Nobook-material-you
    ``` 
2.  **Open in Android Studio.** (only if cloned via terminal)
    * Select Open an Existing Project and choose the cloned folder.
3.  **Sync the project** to download dependencies.
4.  **Run the app** in a device or emulator.

## Acknowledgement :
> [!NOTE]
> [@KevinnZou/compose-webview-multiplatform](https://github.com/KevinnZou/compose-webview-multiplatform) is at the core of this project.
> Developing Nobook and now Materialbook would have been much harder and time-consuming without it.
> If you like the app, please consider supporting that project as well.