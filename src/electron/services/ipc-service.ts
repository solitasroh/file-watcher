import * as ipc from "../ipc/ipcRequest";
import { IpcRenderer } from "electron";

type senderCallback = (channel: string, ...args: any[]) => void;
type unregisterCallback = (channel: string) => void;
export class IpcService {
  private static instance: IpcService;
  static getInstance(): IpcService {
    if (this.instance == null) {
      this.instance = new IpcService();
    }
    return this.instance;
  }

  private constructor() {
    //this.initIpcRenderer();
  }

  private ipcRenderer?: IpcRenderer;
  private renderSendCallback?: senderCallback;
  private unregisterCallbackFunc?: unregisterCallback;
  public send<T>(channel: string, request: ipc.IpcRequest = {}): Promise<T> {
    if (!this.ipcRenderer) {
      this.initIpcRenderer();
    }

    if (!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`;
    }
    const ipcRenderer = this.ipcRenderer;
    ipcRenderer.send(channel, request);

    return new Promise((resolve) => {
      ipcRenderer.once(request.responseChannel, (event, response) =>
        resolve(response)
      );
    });
  }

  public on<T>(channel: string): Promise<T> {
    if (!this.ipcRenderer) {
      this.initIpcRenderer();
    }
    const ipcRenderer = this.ipcRenderer;
    return new Promise((resolve) => {
      ipcRenderer.on(channel, (event, response) => {
        resolve(response);
      });
    });
  }
  public on2(
    channel: string,
    eventhandler: {
      (event: any, rest: any): void;
      (event: Electron.IpcRendererEvent, ...args: any[]): void;
    }
  ): void {
    this.ipcRenderer.on(channel, eventhandler);
  }

  public registerCallback(senderFunction: senderCallback): void {
    this.renderSendCallback = senderFunction;
  }

  public sendToRender(channel: string, ...args: unknown[]): void {
    if (this.renderSendCallback != null) {
      try {
        console.log("send to render");
        this.renderSendCallback(channel, ...args);
      } catch (error) {
        console.log(error);
      }
    }
  }

  public registerRemoveCallback(callback: unregisterCallback): void {
    this.unregisterCallbackFunc = callback;
  }

  public unregister(
    channel: string,
    eventHandler: (...args: any[]) => void
  ): void {
    this.ipcRenderer.removeListener(channel, eventHandler);
  }

  private initIpcRenderer() {
    if (!window || !window.process || !window.require) {
      throw new Error("Unable to require renderer process");
    }

    this.ipcRenderer = window.require("electron").ipcRenderer;
  }
}
