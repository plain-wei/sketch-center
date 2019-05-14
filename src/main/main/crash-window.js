import { ipcMain } from 'electron';
import { BaseWindow } from './base-window';
import { formatPathAsUrl } from './utils';

const minWidth = 600;
const minHeight = 500;

export class CrashWindow extends BaseWindow {
  constructor(errorType, error) {
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
        // Explicitly disable experimental features for the crash process
        // since, theoretically it might be these features that caused the
        // the crash in the first place. As of writing we don't use any
        // components that relies on experimental features in the crash
        // process but our components which relies on ResizeObserver should
        // be able to degrade gracefully.
        experimentalFeatures : false,
      },
    };

    super(windowOptions);
    
    this.error = error;
    this.errorType = errorType;

    ipcMain.on('crash-quit', (event) => {
      this.window.close();
    });
  }

  load(url) {
    // TODO: This should be scoped by the window.
    ipcMain.once(
      'crash-ready',
      (event, readyTime) => {
        this.rendererReadyTime = readyTime;
        this.hasFinishedRendering = true;
        
        this.sendError();
        this.maybeEmitDidLoad();
      }
    );

    if (process.env.NODE_ENV === 'development') {
      url = `${process.env.WEBPACK_DEV_SERVER_URL}crash.html`;
    }
    else {
      url = formatPathAsUrl(__dirname, 'crash.html');
    }

    super.load(url);
  }

  /** Report the error to the renderer. */
  sendError() {
    // `Error` can't be JSONified so it doesn't transport nicely over IPC. So
    // we'll just manually copy the properties we care about.
    const friendlyError = {
      stack   : this.error.stack,
      message : this.error.message,
      name    : this.error.name,
    };

    const details = {
      type  : this.errorType,
      error : friendlyError,
    };

    this.window.webContents.send('error', details);
  }
}
