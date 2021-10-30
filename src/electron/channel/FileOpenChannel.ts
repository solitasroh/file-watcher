import { dialog, IpcMainEvent } from 'electron';
import { OpenDialogReturnValue } from 'electron/main';
import { FileInfo, FileWatcherService } from '../services/FileWatcherService';
import { IpcRequest } from '../ipc/ipcRequest';
import { IpcChannel } from '../ipc/ipcChannel';

export interface FileOpenRequest extends IpcRequest {
  fileName: FileInfo;
}

export class FileOpenChannel implements IpcChannel<FileOpenRequest> {
  private name: string;

  private service?: FileWatcherService;

  constructor() {
    this.name = 'file-open';
    this.service = FileWatcherService.getInstance();
  }

  getName(): string {
    return this.name;
  }

  async handle(event: IpcMainEvent, request: FileOpenRequest): Promise<void> {
    const returnValue: OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    });

    returnValue.filePaths.forEach((filePath) => {
      this.service.InsertWatchFile(filePath);
    });

    event.sender.send(request.responseChannel, {
      filePaths: this.service.getFileInfos(),
    });
  }
}
