import { IpcMainEvent } from 'electron';
import { REMOVE_FILE } from '../ipc-channel.elec';
import { IpcChannel } from '../ipc/ipcChannel';
import { FileWatcherService } from '../services/FileWatcherService';
import { FileRemoveRequest } from './FileRemoveRequest';

class FileRemoveChannel implements IpcChannel<FileRemoveRequest> {
  private name: string;

  private fileService?: FileWatcherService;

  constructor() {
    this.name = REMOVE_FILE;
    this.fileService = FileWatcherService.getInstance();
  }

  getName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: FileRemoveRequest): void {
    try {
      this.fileService.RemoveWatchFile(request.uuid);

      event.sender.send(request.responseChannel, {
        fileInfos: this.fileService.getFileInfos(),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default FileRemoveChannel;
