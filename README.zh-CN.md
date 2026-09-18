
```markdown
<!-- README.zh-CN.md -->
[English](README.md) | **简体中文**

# iOS Bar Expressive

> 本项目基于开源项目 **iosbar-immersive** 独立维护，进行了 SystemUI Hook 重写、KernelSU WebUI、Monet 动态取色和运行时样式调节等修改。  
> 原作者版权声明和 GPL-3.0 许可继续保留。

**版本：** 1.0.0  
**原项目：** [iosbar-immersive](<ORIGINAL_REPO_URL>)  
**许可证：** GPL-3.0  
**项目定位：** 基于 `iosbar-immersive` 的独立维护分支

本项目不是与原项目无关的原创项目，也不声称所有代码都是从零独立编写。  
它延续了 `iosbar-immersive` v0.4.x 的核心行为，并重写了 Hook、加入运行时配置功能。

---

## 功能特性

- 保留 v0.4.1 核心兼容行为：
  - 导航栏窗口处理
  - 横屏布局
  - 导航栏 Insets
  - SystemUI 横条 Hook
  - 透明遮罩处理
- 仍使用相同的 SystemUI 类名和字段：
  - `NavigationBar`
  - `NavigationBarTransitions`
  - `OplusNavigationHandle`
  - `mHeight`
  - `mHandleBottom`
  - `mRadius`
  - `mPortraitWidth`
  - `mLandscapeWidth`
- 默认宽度和厚度仍是 `180dp`、`6.4dp`。
- 新增全局设置读取和 KernelSU WebUI 调整。
- 新增透明度、圆角、位置偏移和运行时样式调节。
- 支持 Monet 动态取色（系统支持时）。
- 底部位置采用 ColorOS 原生资源，已经属于 v0.4.2 的行为。
- 改用传统 Xposed API 写法。原 v0.4.2 使用 LibXposed API 102，本分支实现不同，但手机实测能正常工作。
- 圆角说明：旧版使用“实际像素高度的一半”，新版默认读取 `3.2dp`，在某些屏幕密度下可能有 1 像素差异。

---

## 环境要求

- ColorOS / OPlus SystemUI，并且包含 `OplusNavigationHandle`。
- 支持 Xposed API 的框架。
- KernelSU，用于 WebUI 配置界面。
- Root 权限，以及 SystemUI 崩溃或卡开机后的恢复能力。
- 已在 ColorOS 真机实测。其他 ROM 和 SystemUI 版本不保证兼容。

---

## 安装步骤

1. 安装 APK。
2. 在 Xposed / LSPosed 类管理器中启用模块。
3. 重启手机，或重启 SystemUI。
4. 打开 KernelSU，进入模块 WebUI。
5. 根据需要调整宽度、厚度、圆角、透明度、位置偏移等选项。

---

## 配置项

已知默认值：

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `iosbar_width_dp` | `180` | 横条宽度，单位 dp |
| `iosbar_height_dp` | `6.4` | 横条厚度，单位 dp |
| `iosbar_radius_dp` | `3.2` | 圆角大小，单位 dp |
| 透明度 / 偏移 / Monet 等 | 以 WebUI 为准 | 可在 KernelSU WebUI 中调整，实际键名以源码为准 |

> 旧版使用 `radius = 实际像素高度 / 2`。  
> 新版默认 `3.2dp`，在某些屏幕密度下可能有 1 像素差异。

---

## 构建

需要：

- Android Studio / Android SDK
- JDK 17
- Gradle

构建命令：

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>
./gradlew assembleRelease