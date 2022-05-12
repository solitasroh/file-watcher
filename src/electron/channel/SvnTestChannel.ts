import { IpcMainEvent } from 'electron';
// import SVNClient from '@taiyosen/easy-svn';
import { FileWatcherService } from '../services/FileWatcherService';
import { IpcRequest } from '../ipc/ipcRequest';
import { IpcChannel } from '../ipc/ipcChannel';




export interface SvnTestRequest extends IpcRequest {
  Command: string;
}

export class SvnTestChannel implements IpcChannel<SvnTestRequest> {
  private name: string;

  private service?: FileWatcherService;

  constructor() {
    this.name = 'svn-test';
    this.service = FileWatcherService.getInstance();
  }

  getName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: SvnTestRequest): void {
    const name  = this.getName()
    console.log(name);
    let svn = new SVNClient();
    
  }
}
