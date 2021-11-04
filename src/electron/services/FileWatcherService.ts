import { app, nativeImage, Notification } from 'electron';
import * as fs from 'fs';
import * as fsPromise from 'fs/promises';
import * as path from 'path';
import { GET_FILE_LISTS } from '../ipc-channel.elec';
import IpcService from './ipc-service';

export interface FileInfo {
  key: number;
  fileName: string;
  filePath: string;
  mDate: string;
  fileIconUrl?: string;
}

export class FileWatcherService {
  static TFTP_ROOT = path.join(app.getPath('userData'), '/tftpboot/');

  static FILE_INFO = path.join(app.getPath('userData'), 'files');

  static instance: FileWatcherService;

  private files: FileInfo[] = [];
  private itemCount: number;

  constructor() {
    FileWatcherService.InitTFTPDir();

    if (!this.loadFileList()) {
      this.saveFileList();
    }
  }

  private static async InitTFTPDir(): Promise<void> {
    try {
      await fsPromise.access(FileWatcherService.TFTP_ROOT);
    } catch (error) {
      await fsPromise.mkdir(FileWatcherService.TFTP_ROOT);
    }
  }

  private static async IsValidFiles(filePath: string): Promise<boolean> {
    try {
      await fsPromise.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  private static generateTftpFilePath(filePath: string): string {
    return path.join(FileWatcherService.TFTP_ROOT, path.basename(filePath));
  }

  private loadFileList(): boolean {
    try {
      if (FileWatcherService.IsValidFiles(FileWatcherService.FILE_INFO)) {
        const buffer = fs.readFileSync(FileWatcherService.FILE_INFO);
        const bufferJson = buffer.toString();
        const result = JSON.parse(bufferJson);
        this.files = result;
        this.itemCount = this.files.length;
        let key = 1;
        this.files.forEach(async (fi) => {
          const fiTmp = fi;
          this.watchFile(fi.filePath);
          const dest = FileWatcherService.generateTftpFilePath(fi.filePath);
          const fileIcon = await app.getFileIcon(fi.filePath);
          fiTmp.fileIconUrl = fileIcon.toDataURL();

          if (fiTmp.key === 0 || fiTmp.key === undefined) {
            fiTmp.key = key;
            key += 1;
          }

          fs.copyFile(fi.filePath, dest, (e) => {
            if (e) console.log(`copy file error = ${e}`);
          });

          // const fileIcon = await app.getFileIcon(fi.filePath, {
          //   size: 'normal',
          // });
          const fileStats = await fs.statSync(fi.filePath);

          // eslint-disable-next-line no-param-reassign
          fi.mDate = fileStats.mtime.toLocaleString();
          console.log(fi.key);
        });
      }
    } catch (err) {
      console.log(err);
      return false;
    }

    console.log('load files successfully');
    return true;
  }

  private saveFileList(): boolean {
    try {
      const fileJson = JSON.stringify(this.files);
      fs.writeFileSync(FileWatcherService.FILE_INFO, fileJson);
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  getFilesName(): Array<string> {
    return this.files.map((fi) => path.basename(fi.filePath));
  }

  getFileInfos(): Array<FileInfo> {
    return this.files;
  }

  InsertWatchFile(file: string): void {
    const isExists = this.files.find((f) => f.filePath === file);

    const stat = fs.statSync(file);
    const fileInfo: FileInfo = {
      fileName: path.basename(file),
      mDate: stat.mtime.toLocaleString(),
      filePath: file,
      key: this.itemCount + 1,
    };
    this.itemCount += 1;

    if (isExists) {
      return;
    }

    const dest = FileWatcherService.generateTftpFilePath(file);

    this.files.push(fileInfo);

    fs.copyFile(file, dest, (e) => {
      if (e) console.log(`copy a file error = ${e}`);
    });

    this.watchFile(file);
    this.saveFileList();
  }

  RemoveWatchFile(key: number): void {
    try {
      const fileInfo = this.files.find((f) => f.key === key);
      if (fileInfo == null || fileInfo === undefined) return;
      fs.unwatchFile(fileInfo.filePath);
      const index = this.files.findIndex((f) => f.filePath === fileInfo.filePath);
      if (index > -1) {
        this.files.slice(index);
      }
      fs.rmSync(FileWatcherService.generateTftpFilePath(fileInfo.filePath));
      this.saveFileList();
    } catch (error) {
      console.log(error);
    }
  }

  private watchFile(file: string) {
    console.log(`watch ${file} file...`);

    fs.watchFile(file, async (curr, prev) => {
      console.log(`file is changed. cp files.. (${curr.mtime}, ${prev.mtime})`);
      const stat = fs.statSync(file);
      const dest = FileWatcherService.generateTftpFilePath(file);

      fs.copyFile(file, dest, (e) => {
        if (e) console.log(`copy file error = ${e}`);
      });

      const target = this.files.find((f) => f.filePath === file);
      try {
        target.mDate = stat.mtime.toLocaleString();
      } catch (e) {
        console.log(e);
      }
      const fileIcon = await app.getFileIcon(target.filePath);
      const iconImage = nativeImage.createFromPath('./src/assets/icons/win/icon.ico');
      const noti = new Notification({
        title: `update file`,
        body: `${target.fileName} is updated`,
        icon: iconImage,
      });
      target.fileIconUrl = fileIcon.toDataURL();
      noti.show();

      const ipcService = IpcService.getInstance();
      ipcService.sendToRender(GET_FILE_LISTS, {
        files: this.files,
        updateFile: target.fileName,
      });
    });
  }

  static getInstance(): FileWatcherService {
    if (this.instance == null) {
      this.instance = new FileWatcherService();
    }
    return this.instance;
  }
}
