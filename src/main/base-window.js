import { BrowserWindow } from 'electron';
import { EventEmitter } from 'events';
import delegates from 'delegates';

class BaseWindow extends EventEmitter {
  constructor(options) {
    super();

    this.window = null;
    this.options = options;
    this.options.frame = false;

    this.window = new BrowserWindow(options);

    const lastContentSize = {
      width  : this.options.width,
      height : this.options.height,
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

    this.window.webContents.on('did-finish-load', () => {
      this.window.webContents.setVisualZoomLevelLimits(1, 1);
    });

    this.window.webContents.on('crashed', (event, killed) => {
      this.emit('crashed', killed);
    });

    // 将 this.window 里面的如下方法代理到 this 上
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
    if (url) {
      this.window.loadURL(url);
    }
    this.window.webContents.once('did-finish-load', () => {
      if (process.env.NODE_ENV === 'development') {
        this.window.webContents.openDevTools();
      }
      this.restoreWindow();
    });
  }

  restoreWindow() {
    if (this.isMinimized()) {
      this.restore(); // 将窗口重最小化回复到原来的状态
    }

    if (!this.isVisible()) {
      this.show();
    }

    this.focus();
  }
}

export default BaseWindow;
