import { FileInfo, FileWatcherService } from "./../services/FileWatcherService";
import { IpcRequest } from "../ipc/ipcRequest";
import { IpcChannel } from "../ipc/ipcChannel";
import { dialog } from "electron";
import { OpenDialogReturnValue } from "electron/main";

export interface FileOpenRequest extends IpcRequest {
  fileName: FileInfo;
}

export class FileOpenChannel implements IpcChannel<FileOpenRequest> {
  private name: string;
  constructor() {
    this.name = "file-open";
  }

  getName(): string {
    return this.name;
  }

  async handle(
    event: Electron.IpcMainEvent,
    request: FileOpenRequest
  ): Promise<void> {
    const returnValue: OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
    });
    const service = FileWatcherService.getInstance();
    returnValue.filePaths.map((filePath) => {
      service.InsertWatchFile(filePath);
    });

    event.sender.send(request.responseChannel, {
      filePaths: service.getFileInfos(),
    });
  }
}
