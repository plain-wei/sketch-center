import { ipcMain, Menu, Tray, app, powerSaveBlocker } from 'electron';
import { resolve } from 'path';
import { BaseWindow } from './base-window';
import { PopupWindow } from './popup-window';
import { formatPathAsUrl } from './utils';
import { buildMenu } from './menu/build-menu';
import * as trayMenu from './menu/tray-menu';
import { getLanguage, setLanguage } from './language';

const minWidth = 1120;
const minHeight = 630;

export class AppWindow extends BaseWindow {
  constructor() {
    const windowOptions = {
      width           : minWidth,
      height          : minHeight,
      minWidth,
      minHeight,
      show            : false,
      // This fixes subpixel aliasing on Windows
      // See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
      backgroundColor : '#fff',
      webPreferences  : {
        // Disable auxclick event
        // See https://developers.google.com/web/updates/2016/10/auxclick
        disableBlinkFeatures : 'Auxclick',
        // Enable, among other things, the ResizeObserver
        experimentalFeatures : true,
        nativeWindowOpen     : true,
        webSecurity          : false,
      },
      acceptFirstMouse : true,
    };

    super(windowOptions);

    this.blocker = null;
    this.tray = null;
    this.quitting = false;

    this.blocker = powerSaveBlocker.start('prevent-app-suspension');
    // setup tray
    this.tray = new Tray(resolve(__public, 'favicon.png'));

    this.tray.setToolTip(process.env.VUE_APP_TITLE);

    buildMenu([
      trayMenu.showAppWindow,
      trayMenu.language,
      trayMenu.separator,
      trayMenu.quit,
    ]).then((menus) => {
      this.tray.setContextMenu(menus);
    });

    this.tray.on('click', () => this.restoreWindow());

    ipcMain.on('request-restore-window', () => this.restoreWindow());

    ipcMain.on(
      'menu-event',
      (event) => {
        switch (event.name) {
          case trayMenu.showAppWindow.id:
            this.restoreWindow();
            break;
          case trayMenu.quit.id:
            this.quitting = true;
            this.close();
            break;
          case trayMenu.joinConference.id:
          case trayMenu.logout.id:
            this.window.webContents.send('menu-event', event);
            break;
          case trayMenu.language.id:
            buildMenu([
              trayMenu.showAppWindow,
              trayMenu.language,
              trayMenu.separator,
              trayMenu.quit,
            ], event.menuItem.lang).then((menus) => {
              this.tray.setContextMenu(menus);
            });
            setLanguage(event.menuItem.lang);
            this.window.webContents.send('menu-event', event);
            break;
          default:
            break;
        }
      }
    );

    this.window.webContents.on(
      'update-tray-menu',
      (event, template) => {
        buildMenu(template).then((menus) => {
          this.tray.setContextMenu(menus);
        });
      }
    );
    // end of setup tray

    app.on('before-quit', () => {
      this.quitting = true;
      if (this.blocker && powerSaveBlocker.isStarted(this.blocker)) {
        powerSaveBlocker.stop(this.blocker);
        this.blocker = null;
      }
      if (this.tray && !this.tray.isDestroyed()) {
        this.tray.destroy();
        this.tray = null;
      }
    });

    ipcMain.on('will-quit', (event) => {
      this.quitting = true;
      event.returnValue = true;
    });

    ipcMain.on('request-locale', async(event) => {
      const lang = await getLanguage();

      event.sender.send('request-locale-reply', lang);
    });

    ipcMain.on('set-locale', async(event, lang) => {
      buildMenu([
        trayMenu.showAppWindow,
        trayMenu.language,
        trayMenu.separator,
        trayMenu.quit,
      ], lang).then((menus) => {
        this.tray.setContextMenu(menus);
      });

      await setLanguage(lang);


      event.sender.send('request-locale-reply', lang);
    });

    // on macOS, when the user closes the window we really just hide it. This
    // lets us activate quickly and keep all our interesting logic in the
    // renderer.
    if (__DARWIN__) {
      this.window.on('close', (e) => {
        if (!this.quitting) {
          e.preventDefault();
          Menu.sendActionToFirstResponder('hide:');
        }
      });
    }

    this.window.on('focus', () => this.window.webContents.send('focus'));
    this.window.on('blur', () => this.window.webContents.send('blur'));

    this.window.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
      options.webPreferences.experimentalFeatures = false;
      options.webPreferences.nativeWindowOpen = false;
      options.webPreferences.nodeintegration = false;
      options.webPreferences.nodeIntegrationInWorker = false;
      // prevent popup window from showing before web is ready.
      options.show = false;

      console.log(additionalFeatures);

      switch (frameName) {
        case 'screen-share':
          options.minWidth = 528;
          options.minHeight = 297;
          break;
        case 'notification':
          options.minWidth = 320;
          options.minHeight = 180;
          options.width = options.minWidth;
          options.height = options.minHeight;
          options.resizable = false;
          break;
        case 'share-controls':
          options.minWidth = 614;
          options.minHeight = 56;
          options.width = options.minWidth;
          options.height = options.minHeight;
          options.backgroundColor = '#00ffffff';
          options.resizable = false;
          options.transparent = true;
          break;
        default:
          options.minWidth = 0;
          options.minHeight = 0;
          options.resizable = false;
          break;
      }

      event.preventDefault();

      const readyEvent = `${frameName}-ready`;
      const popup = new PopupWindow(options);

      popup.load(null, readyEvent);
      popup.onDidLoad(() => {
        popup.show();
      });

      event.newGuest = popup.window;
    });
  }

  load(url) {
    // TODO: This should be scoped by the window.
    ipcMain.once(
      'renderer-ready',
      (event, readyTime) => {
        this.rendererReadyTime = readyTime;
        this.hasFinishedRendering = true;

        this.maybeEmitDidLoad();
      }
    );
    
    if (process.env.NODE_ENV === 'development') {
      url = process.env.WEBPACK_DEV_SERVER_URL;
    }
    else {
      url = formatPathAsUrl(__dirname, 'index.html');
    }

    super.load(url);
  }

  /** Send the app launch timing stats to the renderer. */
  sendLaunchTimingStats(stats) {
    logger.info(
      'launch-timing-stat loadTime: %s, mainReadyTime: %s, rendererReadyTime: %s',
      stats.loadTime,
      stats.mainReadyTime,
      stats.rendererReadyTime,
    );
    this.window.webContents.send('launch-timing-stats', { stats });
  }

  sendSystemConfig(config) {
    logger.info(
      'system-config updateChannel: %s, ytmsHostAddress: %s',
      config.updateChannel,
      config.ytmsHostAddress,
    );
    this.window.webContents.send('system-config', { config });
  }
}
