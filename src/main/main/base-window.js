import { BrowserWindow, ipcMain, Menu, app, powerSaveBlocker } from 'electron';
import { EventEmitter } from 'events';
import Path from 'path';
import delegates from 'delegates';
import { now } from './utils';

export class BaseWindow extends EventEmitter {
  constructor(windowOptions = {}) {
    super();

    this.window = null;
    this.windowOptions = windowOptions;

    this.hasFinishedLoading = false;
    this.hasFinishedRendering = false;
    this.loadTime = null;
    this.rendererReadyTime = null;

    if (__DARWIN__) {
      this.windowOptions.titleBarStyle = 'hidden';
    }
    else if (__WIN32__) {
      this.windowOptions.frame = false;
    }
    else if (__LINUX__) {
      this.windowOptions.icon = Path.resolve(__public, 'favicon.png');
    }

    this.window = new BrowserWindow(windowOptions);

    if (__WIN32__) {
      // workaround for known issue with fullscreen-ing the app and restoring
      // is that some Chromium API reports the incorrect bounds, so that it
      // will leave a small space at the top of the screen on every other
      // maximize
      //
      // adapted from https://github.com/electron/electron/issues/12971#issuecomment-403956396
      //
      // can be tidied up once https://github.com/electron/electron/issues/12971
      // has been confirmed as resolved
      const lastContentSize = {
        width  : this.windowOptions.width,
        height : this.windowOptions.height,
      };

      this.window.once('ready-to-show', () => {
        this.window.on('unmaximize', () => {
          setTimeout(() => {
            this.window.setContentSize(lastContentSize.width, lastContentSize.height);

            const bounds = this.window.getBounds();

            bounds.width += 1;
            this.window.setBounds(bounds);
            bounds.width -= 1;
            this.window.setBounds(bounds);
          }, 5);
        });
        this.window.on('maximize', () => {
          setTimeout(() => {
            const bounds = this.window.getNormalBounds();
            
            lastContentSize.width = bounds.width;
            lastContentSize.height = bounds.height;
          }, 5);
        });
      });
    }

    this.window.webContents.on('did-finish-load', () => {
      this.window.webContents.setVisualZoomLevelLimits(1, 1);
    });

    this.window.webContents.on('crashed', (event, killed) => {
      this.emit('crashed', killed);
    });

    this.window.webContents.on('did-fail-load', () => {
      if (process.env.NODE_ENV === 'development') {
        this.window.webContents.openDevTools();
        this.window.show();
      }
      else {
        this.emit('did-fail-load');
      }
    });

    // TODO: change F12 into more complicate key combination
    this.window.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown') {
        switch (input.key) {
          case 'F12':
            if (input.control) {
              const child = new BrowserWindow({ show: true });

              child.loadURL('chrome://webrtc-internals');
            }
            else {
              this.window.webContents.toggleDevTools();
            }
            break;
          default:
            break;
        }
      }
    });

    delegates(this, 'window')
      .method('isMinimized')
      .method('isVisible')
      .method('restore')
      .method('focus')
      .method('show')
      .method('close')
      .method('destroy');
  }

  load(url) {
    let startLoad = 0;

    // We only listen for the first of the loading events to avoid a bug in
    // Electron/Chromium where they can sometimes fire more than once. See
    // See
    // https://github.com/desktop/desktop/pull/513#issuecomment-253028277. This
    // shouldn't really matter as in production builds loading _should_ only
    // happen once.
    this.window.webContents.once('did-start-loading', () => {
      this.loadTime = null;
      this.rendererReadyTime = null;

      startLoad = now();
    });

    this.window.webContents.once('did-finish-load', () => {
      if (process.env.NODE_ENV === 'development') {
        this.window.webContents.openDevTools();
      }

      this.loadTime = now() - startLoad;
      this.hasFinishedLoading = true;

      this.maybeEmitDidLoad();
    });

    if (url) {
      this.window.loadURL(url);
    }
  }
  
  restoreWindow() {
    if (this.isMinimized()) {
      this.restore();
    }

    if (!this.isVisible()) {
      this.show();
    }

    this.focus();
  }

  sendMessage(...args) {
    return this.window.webContents.send(...args);
  }

  /** Is the page loaded and has the renderer signalled it's ready? */
  get rendererLoaded() {
    return this.hasFinishedLoading && this.hasFinishedRendering;
  }

  /**
   * Emit the `onDidLoad` event if the page has loaded and the renderer has
   * signalled that it's ready.
   */
  maybeEmitDidLoad() {
    if (!this.rendererLoaded) return;
    this.emit('did-load', null);
  }

  onClose(fn) {
    if (!fn) return;
    this.window.on('closed', fn);
  }

  onFailedToLoad(fn) {
    if (!fn) return;
    this.on('did-fail-load', fn);
  }

  onCrashed(fn) {
    if (!fn) return;
    this.on('crashed', fn);
  }

  /**
   * Register a function to call when the window is done loading. At that point
   * the page has loaded and the renderer has signalled that it is ready.
   */
  onDidLoad(fn) {
    if (!fn) return;
    this.on('did-load', fn);
  }
}
