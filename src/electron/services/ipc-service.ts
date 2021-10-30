import { IpcRenderer, IpcRendererEvent } from 'electron';
import * as ipc from '../ipc/ipcRequest';

type senderCallback = (channel: string, ...args: any[]) => void;
type ipcEventCallback = (event: IpcRendererEvent, ...args: any[]) => void;

class IpcService {
  private static instance: IpcService;

  static getInstance(): IpcService {
    if (this.instance == null) {
      this.instance = new IpcService();
    }
    return this.instance;
  }

  private ipcRenderer?: IpcRenderer;

  private renderSendCallback?: senderCallback;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    console.log('construct');
  }

  public send<T>(channel: string, request: ipc.IpcRequest = {}): Promise<T> {
    if (!this.ipcRenderer) {
      this.initIpcRenderer();
    }

    if (!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`;
    }
    const { ipcRenderer } = this;
    ipcRenderer.send(channel, request);

    return new Promise((resolve) => {
      ipcRenderer.once(request.responseChannel, (event, response) => resolve(response));
    });
  }

  public on(channel: string, eventhandler: ipcEventCallback): void {
    this.ipcRenderer.on(channel, eventhandler);
  }

  public registerCallback(senderFunction: senderCallback): void {
    this.renderSendCallback = senderFunction;
  }

  public sendToRender(channel: string, ...args: any[]): void {
    if (this.renderSendCallback != null) {
      try {
        this.renderSendCallback(channel, ...args);
      } catch (error) {
        console.log(error);
      }
    }
  }

  public unregisterListener(channel: string, eventHandler: (...args: any[]) => void): void {
    this.ipcRenderer.removeListener(channel, eventHandler);
  }

  private initIpcRenderer() {
    console.log('init ipc renderers');
    if (!window || !window.process || !window.require) {
      throw new Error('Unable to require renderer process');
    }

    this.ipcRenderer = window.require('electron').ipcRenderer;
  }
}

export default IpcService;
