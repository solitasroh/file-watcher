import { IpcRequest } from '../ipc/ipcRequest';

export interface FileRemoveRequest extends IpcRequest {
  key: number;
}
