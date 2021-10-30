import { IpcRequest } from '../ipc/ipcRequest';
import { FileInfo } from '../services/FileWatcherService';

export interface FileRemoveRequest extends IpcRequest {
  fileInfo: FileInfo;
}
