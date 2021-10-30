import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../ipc/ipcChannel';
import { IpcRequest } from '../ipc/ipcRequest';
import { FileInfo, FileWatcherService } from '../services/FileWatcherService';

export interface GetFilesRequest extends IpcRequest {
  dummy: FileInfo;
}

export class GetFileChannel implements IpcChannel<GetFilesRequest> {
  private name: string;

  private fileService?: FileWatcherService;

  constructor() {
    this.name = 'file-lists';
    this.fileService = FileWatcherService.getInstance();
  }

  getName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: GetFilesRequest): void {
    event.sender.send(request.responseChannel, {
      filePaths: this.fileService.getFileInfos(),
    });
  }
}
