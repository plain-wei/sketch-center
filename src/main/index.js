import { app } from 'electron';
import MainWindow from './main-window';

let mainWindow = null;

function createWindow() {
  if (!mainWindow) {
    mainWindow = new MainWindow();

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }
  else {
    console.warn('the main window has already been created');
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  createWindow();
});


export default mainWindow;
