import { IpcChannel } from "../ipc/ipcChannel";
import { IpcRequest } from "../ipc/ipcRequest";
import { FileInfo, FileWatcherService } from "../services/FileWatcherService";

export interface FileRemoveRequest extends IpcRequest {
  fileInfo: FileInfo;
}

export class FileRemoveArgs implements FileRemoveRequest {
  constructor(fileInfo: FileInfo) {
    this.fileInfo = fileInfo;
  }
  fileInfo: FileInfo;
  responseChannel?: string;
}

export class FileRemoveChannel implements IpcChannel<FileRemoveRequest> {
  private name: string;
  constructor() {
    this.name = "file-remove";
  }
  getName(): string {
    return this.name;
  }

  handle(event: Electron.IpcMainEvent, request: FileRemoveRequest): void {
    try {
      const fileService = FileWatcherService.getInstance();
      fileService.RemoveWatchFile(request.fileInfo);

      event.sender.send(request.responseChannel, {
        fileInfos: fileService.getFileInfos(),
      });
    } catch (err) {
      console.log(err);
    }
  }
}
