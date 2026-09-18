const KEYS = {
  width: 'iosbar_width_dp',
  height: 'iosbar_height_dp',
  radius: 'iosbar_radius_dp',
  offset: 'iosbar_bottom_offset_dp',
  alpha: 'iosbar_alpha'
};

const defaults = { width: 180, height: 6.4, radius: 3.2, offset: 0, alpha: 1 };
const ranges = Object.fromEntries(Object.keys(KEYS).map(name => [name, document.getElementById(`${name}Range`)]));
const outputs = Object.fromEntries(Object.keys(KEYS).map(name => [name, document.getElementById(`${name}Output`)]));
const status = document.getElementById('status');
const preview = document.getElementById('previewHandle');
const summary = document.getElementById('previewSummary');
const restartDialog = document.getElementById('restartDialog');

async function shell(command, options = {}) {
  if (!window.ksu || typeof window.ksu.exec !== 'function') {
    return { errno: -1, stdout: '', stderr: 'KernelSU WebUI bridge unavailable' };
  }
  return new Promise(resolve => {
    const name = `iosbar_exec_${Date.now()}_${shell.counter++}`;
    const finish = result => {
      clearTimeout(timer);
      delete window[name];
      resolve(result);
    };
    const timer = setTimeout(() => finish({ errno: -1, stdout: '', stderr: '执行超时' }), 15000);
    window[name] = (errno, stdout, stderr) => finish({ errno: Number(errno), stdout, stderr });
    try {
      window.ksu.exec(command, JSON.stringify(options), name);
    } catch (error) {
      finish({ errno: -1, stdout: '', stderr: String(error) });
    }
  });
}
shell.counter = 0;

function toast(message) {
  try {
    if (window.ksu && typeof window.ksu.toast === 'function') window.ksu.toast(message);
  } catch (_) {}
}

function format(name, value) {
  if (name === 'alpha') return `${Math.round(value * 100)}%`;
  const digits = name === 'height' || name === 'radius' ? 1 : 0;
  return `${Number(value).toFixed(digits)} dp`;
}

function updatePreview() {
  const value = Object.fromEntries(Object.entries(ranges).map(([name, input]) => [name, Number(input.value)]));
  for (const name of Object.keys(value)) outputs[name].textContent = format(name, value[name]);
  preview.style.width = `${Math.min(88, Math.max(34, value.width / 2.5))}%`;
  preview.style.height = `${Math.max(2, value.height * .72)}px`;
  preview.style.borderRadius = `${value.radius * .72}px`;
  preview.style.bottom = `${14 + value.offset * .45}px`;
  preview.style.opacity = String(value.alpha);
  summary.textContent = `${value.width} × ${value.height.toFixed(1)} dp · ${value.offset === 0 ? '原生位置' : `偏移 ${value.offset > 0 ? '+' : ''}${value.offset} dp`}`;
  status.textContent = '有未保存的调整';
}

async function readSettings() {
  let failed = false;
  for (const [name, key] of Object.entries(KEYS)) {
    const result = await shell(`settings get global ${key}`);
    const raw = String(result.stdout || '').trim();
    const parsed = raw === '' || raw === 'null' ? NaN : Number(raw);
    failed ||= result.errno !== 0;
    ranges[name].value = result.errno === 0 && Number.isFinite(parsed) ? parsed : defaults[name];
  }
  updatePreview();
  status.textContent = failed ? '预览模式：请在 KernelSU 中打开' : '已读取当前设置';
}

async function saveSettings() {
  for (const [name, key] of Object.entries(KEYS)) {
    const value = Number(ranges[name].value);
    if (!Number.isFinite(value)) continue;
    const result = await shell(`settings put global ${key} ${value} && settings get global ${key}`);
    if (result.errno !== 0 || Number(String(result.stdout).trim()) !== value) {
      status.textContent = '保存失败';
      toast('设置写入失败');
      return;
    }
  }
  status.textContent = '已保存，等待重启';
  toast('样式设置已保存');
}

function resetSettings() {
  for (const [name, value] of Object.entries(defaults)) ranges[name].value = value;
  updatePreview();
}

function parseColor(output) {
  const match = String(output || '').match(/(?:#|0x)(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6})\b/);
  if (!match) return null;
  return `#${match[0].slice(-6)}`;
}

async function applyMonet() {
  const dark = themes[themeIndex] === 'dark' || (themes[themeIndex] === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  const lookups = {
    '--primary': 'system_accent1_600',
    '--primary-container': 'system_accent1_100',
    '--surface': 'system_neutral1_10',
    '--surface-low': 'system_neutral1_50',
    '--surface-high': 'system_neutral1_100',
    '--on-surface': 'system_neutral1_900',
    '--on-surface-variant': 'system_neutral2_700'
  };
  Object.assign(lookups, dark ? {
    '--primary': 'system_accent1_200', '--on-primary': 'system_accent1_800',
    '--primary-container': 'system_accent1_700', '--on-primary-container': 'system_accent1_100',
    '--surface': 'system_neutral1_900', '--surface-low': 'system_neutral1_800',
    '--surface-high': 'system_neutral1_700', '--on-surface': 'system_neutral1_50',
    '--on-surface-variant': 'system_neutral2_200'
  } : { '--on-primary': 'system_accent1_0', '--on-primary-container': 'system_accent1_900' });
  for (const variable of Object.keys(lookups)) document.body.style.removeProperty(variable);
  for (const [variable, resource] of Object.entries(lookups)) {
    const result = await shell(`cmd overlay lookup android android:color/${resource}`);
    const color = parseColor(result.stdout);
    if (color) document.body.style.setProperty(variable, color);
  }
}

const themes = ['auto', 'light', 'dark'];
let themeIndex = Math.max(0, themes.indexOf(localStorage.getItem('iosbar-theme') || 'auto'));
function applyTheme() {
  const theme = themes[themeIndex];
  document.body.dataset.theme = theme === 'auto' ? '' : theme;
  document.getElementById('themeButton').textContent = theme === 'auto' ? '自动' : theme === 'light' ? '浅色' : '深色';
  localStorage.setItem('iosbar-theme', theme);
}

for (const input of Object.values(ranges)) input.addEventListener('input', updatePreview);
document.getElementById('saveButton').addEventListener('click', saveSettings);
document.getElementById('resetButton').addEventListener('click', resetSettings);
document.getElementById('restartButton').addEventListener('click', () => restartDialog.showModal());
document.getElementById('confirmRestart').addEventListener('click', async () => {
  status.textContent = '正在重启系统界面';
  const result = await shell("pids=$(pidof com.android.systemui); [ -n \"$pids\" ] && kill -TERM $pids");
  status.textContent = result.errno === 0 ? '已发送重启指令' : '重启失败，请检查 Root 权限';
});
document.getElementById('themeButton').addEventListener('click', () => {
  themeIndex = (themeIndex + 1) % themes.length;
  applyTheme();
  applyMonet();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyMonet());

applyTheme();
await applyMonet();
await readSettings();
