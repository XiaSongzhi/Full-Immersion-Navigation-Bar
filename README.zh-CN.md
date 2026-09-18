[English](README.md) | **简体中文**

# iOS Bar Expressive

> 本项目基于开源项目 **iosbar-immersive** 独立维护，进行了 SystemUI Hook 重写、KernelSU WebUI、Monet 动态取色和运行时样式调节等修改。  
> 原作者版权声明和 GPL-3.0 许可继续保留。

**版本：** 1.0.0  
**原项目：** [iosbar-immersive](<https://github.com/murongruyan/iosbar-immersive>)  
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
```

Release APK 通常输出在：

```text
app/build/outputs/apk/release/
```

本仓库按 GPL-3.0 提供对应源码。  
如果分发修改后的 APK，也必须按 GPL-3.0 提供对应源码。

---

## 与原项目 `iosbar-immersive` 的关系

本项目基于开源项目 `iosbar-immersive`，并进行了大量修改，包括：

- SystemUI Hook 重写
- KernelSU WebUI
- Monet 动态取色
- 运行时样式调节
- 全局设置读取
- 透明度、圆角和位置偏移控制

保留的内容：

- v0.4.1 核心行为和字段修改方式
- 相同的 SystemUI 类名和字段
- 默认宽度 `180dp`
- 默认厚度 `6.4dp`
- 透明遮罩处理
- 导航栏 Insets 处理

不同的内容：

- Hook 框架：传统 Xposed API，而不是 LibXposed API 102
- Hook 调用方式：使用 `hookAllMethods` 风格，而不是逐个筛选方法
- 横条更新时机：新版会在绘制和生命周期中重新读取设置
- 圆角计算：新版默认 `3.2dp`，不是实际像素高度的一半
- 底部位置：使用 ColorOS 原生资源，属于 v0.4.2 的行为
- 新增 KernelSU WebUI 和运行时配置

项目定位：基于 `iosbar-immersive` 的独立维护分支。

---

## 许可证与合规说明

- 许可证：**GPL-3.0**
- 保留原作者版权声明。
- 不声称代码完全由本分支从零独立编写。
- 公开说明与 `iosbar-immersive` 的代码继承关系。
- 本仓库提供对应源码。
- 不得闭源分发。
- 不得删除原作者版权和 GPL-3.0 条款。

详见 [LICENSE](LICENSE)。

---

## 免责声明

- 本模块会修改 SystemUI 行为，请自行承担风险。
- 请提前备份，并确保自己有能力处理 SystemUI 崩溃或卡开机问题。
- 本项目与 Apple Inc. 无关，“iOS”是 Apple Inc. 的商标。
- 原项目 `iosbar-immersive` 作者不对本分支负责。
- 本分支维护者不对因使用不当造成的任何损失负责。

---

## 致谢

- 原项目：[iosbar-immersive](<ORIGINAL_REPO_URL>)
- 感谢 `iosbar-immersive` 原作者和所有贡献者
- 本分支由 `<YOUR_NAME>` 独立维护
