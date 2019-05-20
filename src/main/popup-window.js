/* eslint-disable no-unused-vars */
import { ipcMain } from 'electron';
import BaseWindow from './base-window';

const minWidth = 100;
const minHeight = 100;

class PopupWindow extends BaseWindow {
  constructor(options = {}) {
    const opts = Object.assign({
      width           : minWidth,
      height          : minHeight,
      show            : false,
      alwaysOnTop     : true,
      backgroundColor : '#fff',
      webPreferences  : {
        experimentalFeatures    : false,
        nativeWindowOpen        : false,
        nodeintegration         : false,
        nodeIntegrationInWorker : false,
        webSecurity             : false,
      },
      minWidth,
      minHeight,
    }, options);

    if (process.platform === 'win32') {
      opts.type = 'toolbar';
    }

    super(opts);
    this.options = opts;
  }

  load(url, readyEvent) {
    // TODO: This should be scoped by the window.
    ipcMain.once(
      readyEvent,
      (event, options) => {
        this.window.setAlwaysOnTop(true);
        this.window.setBackgroundColor(this.options.backgroundColor || '#ffffff');
      }
    );

    super.load(url);
  }
}

export default PopupWindow;
