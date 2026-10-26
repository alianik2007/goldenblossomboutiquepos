const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const sharedFolderSettingsPath = path.join(app.getPath('userData'), 'shared-folder.json');

function runGit(cmd, cwd = __dirname) {
  return new Promise((resolve) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        resolve({ ok: false, error: stderr.trim() || error.message, stdout: stdout.trim() });
      } else {
        resolve({ ok: true, stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });
  });
}

function getSharedFolderData() {
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(sharedFolderSettingsPath, 'utf8'));
  } catch (error) {
    return { path: '', data: null };
  }

  try {
    const dataPath = path.join(settings.path, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return { path: settings.path, data, error: '' };
  } catch (error) {
    return { path: settings.path, data: null, error: error.code === 'ENOENT' ? '' : error.message };
  }
}

ipcMain.on('shared-folder:load', event => {
  event.returnValue = getSharedFolderData();
});

ipcMain.handle('shared-folder:load-latest', () => getSharedFolderData());

ipcMain.handle('shared-folder:select', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] });
  if (result.canceled || result.filePaths.length === 0) return { canceled: true };

  const folderPath = result.filePaths[0];
  fs.mkdirSync(path.dirname(sharedFolderSettingsPath), { recursive: true });
  fs.writeFileSync(sharedFolderSettingsPath, JSON.stringify({ path: folderPath }, null, 2), 'utf8');

  return { path: folderPath, ...getSharedFolderData() };
});

ipcMain.handle('shared-folder:save', async (_event, data) => {
  try {
    const settings = JSON.parse(fs.readFileSync(sharedFolderSettingsPath, 'utf8'));
    if (!Array.isArray(data.products)) throw new Error('Invalid data payload');

    const jsonContent = JSON.stringify(data, null, 2) + '\n';
    const jsContent = 'window.GBB_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
    fs.writeFileSync(path.join(settings.path, 'data.json'), jsonContent, 'utf8');
    fs.writeFileSync(path.join(settings.path, 'data.js'), jsContent, 'utf8');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

// Local Git IPC handlers
ipcMain.handle('git:status', async () => {
  const branchRes = await runGit('git branch --show-current');
  const remoteRes = await runGit('git remote get-url origin');
  const statusRes = await runGit('git status --porcelain data.json data.js');
  return {
    ok: true,
    branch: branchRes.ok ? branchRes.stdout : 'main',
    remote: remoteRes.ok ? remoteRes.stdout : '',
    hasUnsavedChanges: statusRes.ok && statusRes.stdout.length > 0
  };
});

ipcMain.handle('git:set-remote', async (_event, remoteUrl) => {
  if (!remoteUrl || !remoteUrl.trim()) return { ok: false, error: 'Remote URL is required' };
  const cleanUrl = remoteUrl.trim();
  const check = await runGit('git remote get-url origin');
  let res;
  if (check.ok) {
    res = await runGit(`git remote set-url origin "${cleanUrl}"`);
  } else {
    res = await runGit(`git remote add origin "${cleanUrl}"`);
  }
  return res;
});

ipcMain.handle('git:commit-and-push', async (_event, commitMessage) => {
  const msg = (commitMessage || 'Auto-save boutique POS data').replace(/"/g, '\\"');
  const addRes = await runGit('git add data.json data.js');
  if (!addRes.ok) return addRes;

  const commitRes = await runGit(`git commit -m "${msg}"`);
  // If nothing to commit, that is not an error
  const pushRes = await runGit('git push origin main');
  return pushRes;
});

ipcMain.handle('git:pull', async () => {
  return await runGit('git pull --rebase origin main');
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Golden Blossom Boutique POS",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
