<!-- README.md -->
**English** | [简体中文](README.zh-CN.md)

# iOS Bar Expressive

> An independently maintained fork based on the open-source **iosbar-immersive** project.  
> It contains substantial modifications, including a rewritten SystemUI hook and a KernelSU WebUI.  
> Original copyright notices and GPL-3.0 terms are preserved.

**Version:** 1.0.0  
**Original project:** [iosbar-immersive](<ORIGINAL_REPO_URL>)  
**License:** GPL-3.0  
**Project type:** Independently maintained fork based on `iosbar-immersive`

This is not an unrelated original project and does not claim that all code was written from scratch.  
It is a derivative work that continues the core behavior of `iosbar-immersive` v0.4.x, with rewritten hooks and new runtime configuration features.

---

## Features

- Keeps core v0.4.1-compatible behavior:
  - Navigation bar window handling
  - Landscape layout
  - Navigation bar Insets
  - SystemUI handle hook
  - Transparent mask handling
- Still targets the same SystemUI classes and fields:
  - `NavigationBar`
  - `NavigationBarTransitions`
  - `OplusNavigationHandle`
  - `mHeight`
  - `mHandleBottom`
  - `mRadius`
  - `mPortraitWidth`
  - `mLandscapeWidth`
- Default width and thickness remain `180dp` and `6.4dp`.
- Adds runtime settings reading and KernelSU WebUI configuration.
- Adds opacity, corner radius, position offset and style adjustments.
- Supports Monet dynamic color where available.
- Bottom position uses native ColorOS resources, matching v0.4.2 behavior.
- Rewritten with the traditional Xposed API. The original v0.4.2 used LibXposed API 102; this fork uses a different hook implementation but has been tested working on a real device.
- Radius note: the old version used actual pixel height / 2, while this fork defaults to `3.2dp`; a 1-pixel difference may occur on some screen densities.

---

## Requirements

- Android device with ColorOS / OPlus SystemUI that contains `OplusNavigationHandle`.
- Xposed-compatible framework.
- KernelSU for the WebUI configuration interface.
- Root access and a way to recover if SystemUI crashes or bootloops.
- Tested on a real ColorOS device. Other ROMs and SystemUI versions are not guaranteed.

---

## Installation

1. Install the APK.
2. Enable the module in your Xposed-compatible manager.
3. Reboot the device or restart SystemUI.
4. Open KernelSU and launch the module WebUI.
5. Adjust width, height, radius, opacity, offset and other options as needed.

---

## Configuration

Known default values:

| Key | Default | Description |
| --- | --- | --- |
| `iosbar_width_dp` | `180` | Bar width in dp |
| `iosbar_height_dp` | `6.4` | Bar thickness in dp |
| `iosbar_radius_dp` | `3.2` | Corner radius in dp |
| opacity / offset / Monet options | Varies | Available in the KernelSU WebUI; actual key names follow the source code |

> The old version used `radius = pixel height / 2`.  
> This fork defaults to `3.2dp`, so a small pixel difference may appear on some densities.

---

## Build

Requirements:

- Android Studio / Android SDK
- JDK 17
- Gradle

Build command:

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>
./gradlew assembleRelease