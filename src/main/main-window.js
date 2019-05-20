/* eslint-disable no-unused-vars */
import { Tray, Menu, app, powerSaveBlocker } from 'electron';
import { resolve } from 'path';
import BaseWindow from './base-window';
import PopupWindow from './popup-window';
import { formatPathAsUrl } from './utils';

const minWidth = 1200;
const minHeight = 740;

class MainWindow extends BaseWindow {
  constructor(options = {}) {
    const opts = Object.assign({
      width           : minWidth,
      height          : minHeight,
      minWidth,
      minHeight,
      show            : false, // 窗口创建的时候是否显示
      backgroundColor : '#fff',
      webPreferences  : {
        nodeIntegration : true,
      },
    }, options);

    super(opts);

    this.popups = [];
    // 省电拦截器
    // prevent-app-suspension
    // 仅防止应用程序被挂起。保持操作系统处于活动状态, 但允许操作系统关闭屏幕。（下载）
    // prevent-display-sleep
    // 阻止操作系统关闭显示器，即同时保持系统和屏幕处于活动状态。（播放视频）
    this.blocker = powerSaveBlocker.start('prevent-app-suspension');
    this.initTray();
    this.initEvent();
    this.loadUrl();
  }

  initTray() {
    this.tray = new Tray(resolve('public', 'favicon.ico'));
    this.tray.setToolTip('Sketch Center');
    const contextMenu = Menu.buildFromTemplate([
      { label: '测试Tray', type: 'radio' },
    ]);

    this.tray.setToolTip('This is my application.');
    this.tray.setContextMenu(contextMenu);
    this.tray.on('click', () => this.restoreWindow());
  }

  initEvent() {
    app.on('before-quit', () => {
      if (this.blocker && powerSaveBlocker.isStarted(this.blocker)) {
        powerSaveBlocker.stop(this.blocker);
        this.blocker = null;
      }
      if (this.tray && !this.tray.isDestroyed()) {
        this.tray.destroy();
        this.tray = null;
      }
    });

    this.window.on('focus', () => this.window.webContents.send('focus'));
    this.window.on('blur', () => this.window.webContents.send('blur'));

    this.window.webContents.on(
      'new-window',
      (event, url, frameName, disposition, options, additionalFeatures) => {
        // 启用 Chromium 的实验功能
        options.webPreferences.experimentalFeatures = false;
        // 是否使用原生的window.open().
        // 如果设置为 true, 那么子窗口的 webPreferences将永远与父窗口的相同, 不论什么参数被传至window.open()
        options.webPreferences.nativeWindowOpen = false;
        // 是否完整的支持 node
        options.webPreferences.nodeintegration = false;
        // 是否在Web工作器中启用了Node集成
        options.webPreferences.nodeIntegrationInWorker = false;
        // 窗口创建的时候是否显示
        options.show = false;

        switch (frameName) {
          case '': break;
          default: break;
        }

        event.preventDefault();

        const readyEvent = `${frameName}-ready`;
        const popup = new PopupWindow(options);

        popup.load(null, readyEvent);

        popup.on('did-finish-load', () => {
          popup.show();
        });

        this.popups.push(popup);
      }
    );
  }

  loadUrl() {
    console.warn('http://localhost:9080');
    super.load(
      process.env.NODE_ENV === 'development'
        ? process.env.WEBPACK_DEV_SERVER_URL
        : formatPathAsUrl(__dirname, 'index.html')
    );
  }
}

export default MainWindow;
