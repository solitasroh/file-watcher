import * as ipc from "../ipc/ipcRequest";
import { IpcRenderer } from "electron";

export class IpcService {
  private ipcRenderer?: IpcRenderer;

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

  private initIpcRenderer() {
    if (!window || !window.process || !window.require) {
      throw new Error("Unable to require renderer process");
    }

    this.ipcRenderer = window.require("electron").ipcRenderer;
  }
}
