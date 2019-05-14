import {
  ipcMain,
} from 'electron';
import {
  BaseWindow,
} from './base-window';
import {
  formatPathAsUrl,
} from './utils';

const minWidth = 100;
const minHeight = 100;

export class PopupWindow extends BaseWindow {
  constructor(options) {
    const windowOptions = options || {
      width           : minWidth,
      height          : minHeight,
      minWidth,
      minHeight,
      show            : false,
      alwaysOnTop     : true,
      // This fixes subpixel aliasing on Windows
      // See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
      backgroundColor : '#fff',
      webPreferences  : {
        // Disable auxclick event
        // See https://developers.google.com/web/updates/2016/10/auxclick
        disableBlinkFeatures    : 'Auxclick',
        // Explicitly disable experimental features for the crash process
        // since, theoretically it might be these features that caused the
        // the crash in the first place. As of writing we don't use any
        // components that relies on experimental features in the crash
        // process but our components which relies on ResizeObserver should
        // be able to degrade gracefully.
        experimentalFeatures    : false,
        nativeWindowOpen        : false,
        nodeintegration         : false,
        nodeIntegrationInWorker : false,
        webSecurity             : false,
      },
    };
    
    if (process.platform === 'win32') {
      windowOptions.type = 'toolbar';
    }

    super(windowOptions);
  }

  load(url, readyEvent) {
    // TODO: This should be scoped by the window.
    ipcMain.once(
      readyEvent,
      (event, readyTime) => {
        this.rendererReadyTime = readyTime;
        this.hasFinishedRendering = true;

        this.maybeEmitDidLoad();
        // electron bug ?
        // you have to set setAlwaysOnTop after window created
        // even it is declared in the window options
        this.window.setAlwaysOnTop(true);
        this.window.setBackgroundColor(this.windowOptions.backgroundColor || '#ffffff');
      }
    );

    super.load(url);
  }
}
