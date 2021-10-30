import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../ipc/ipcChannel';
import { FileWatcherService } from '../services/FileWatcherService';
import { FileRemoveRequest } from './FileRemoveRequest';

class FileRemoveChannel implements IpcChannel<FileRemoveRequest> {
  private name: string;

  private fileService?: FileWatcherService;

  constructor() {
    this.name = 'file-remove';
    this.fileService = FileWatcherService.getInstance();
  }

  getName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: FileRemoveRequest): void {
    try {
      this.fileService.RemoveWatchFile(request.fileInfo);

      event.sender.send(request.responseChannel, {
        fileInfos: this.fileService.getFileInfos(),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default FileRemoveChannel;
