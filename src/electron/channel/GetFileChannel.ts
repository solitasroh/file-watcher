import { IpcChannel } from "../ipc/ipcChannel";
import { IpcRequest } from "../ipc/ipcRequest";
import { FileInfo, FileWatcherService } from "../services/FileWatcherService";

export interface GetFilesRequest extends IpcRequest {
  dummy: FileInfo;
}

export class GetFileChannel implements IpcChannel<GetFilesRequest> {
  private name: string;
  constructor() {
    this.name = "file-lists";
  }
  getName(): string {
    return this.name;
  }
  handle(event: Electron.IpcMainEvent, request: GetFilesRequest): void {
    const service = FileWatcherService.getInstance();
    event.sender.send(request.responseChannel, {
      filePaths: service.getFileInfos(),
    });
  }
}
