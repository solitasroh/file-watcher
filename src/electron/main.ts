import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import { FileWatcherService } from './services/FileWatcherService';
import TftpService from './services/tftp-service';
import { IpcChannel } from './ipc/ipcChannel';
import { IpcRequest } from './ipc/ipcRequest';
import { FileOpenChannel } from './channel/FileOpenChannel';
import IpcService from './services/ipc-service';
import { GetFileChannel } from './channel/GetFileChannel';
import FileRemoveChannel from './channel/FileRemoveChannel';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

class Main {
  private mainWindow: BrowserWindow;

  private tftpService: TftpService;

  private fileWatcherService: FileWatcherService;

  private ipcService: IpcService;

  init(ipcChannels: IpcChannel<IpcRequest>[]) {
    this.tftpService = new TftpService();
    this.fileWatcherService = FileWatcherService.getInstance();

    app.on('ready', (): void => {
      this.createWindow();
    });

    app.on('window-all-closed', this.onWindowClosed);
    app.on('activate', this.onActivate);

    this.registerIpcChannels(ipcChannels);

    this.tftpService.Start();
  }

  private onWindowClosed = (): void => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  };

  private onActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  }

  private createWindow() {
    const iconImage = nativeImage.createFromPath('./src/assets/icons/win/icon.ico');
    console.log(iconImage);

    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 360,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nativeWindowOpen: true,
      },
      icon: iconImage,
    });
    // and load the index.html of the app.
    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // Open the DevTools.
    this.mainWindow.webContents.openDevTools({ mode: 'detach' });
    this.ipcService = IpcService.getInstance();
    this.ipcService.registerCallback((channel, ...args) => {
      this.mainWindow.webContents.send(channel, ...args);
    });
  }

  private registerIpcChannels = (ipcChannels: IpcChannel<IpcRequest>[]): void => {
    ipcChannels.forEach((channel) => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  };
}

new Main().init([new FileOpenChannel(), new GetFileChannel(), new FileRemoveChannel()]);
