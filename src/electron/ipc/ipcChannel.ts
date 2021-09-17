import { IpcMainEvent } from "electron";
import { IpcRequest } from "./ipcRequest";

export interface IpcChannel<T extends IpcRequest> {
  getName(): string;
  handle(event: IpcMainEvent, request: T): void;
}
