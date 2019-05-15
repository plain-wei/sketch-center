import { app, ipcMain, BrowserWindow } from 'electron';

export function command(mainWindow, winURL) {
  // 设置app名称
  app.setName('Sketch Center');
  // 关闭window窗口
  ipcMain.on('window-close', event => {
    app.quit();
  });
  // 最大化window窗口
  ipcMain.on('window-max', event => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    }
    else {
      mainWindow.maximize();
    }
  });
  // 最小化window窗口
  ipcMain.on('window-min', event => {
    if (!mainWindow.isMinimized()) {
      mainWindow.minimize();
    }
  });
}
