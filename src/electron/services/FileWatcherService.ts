import { app } from "electron";
import * as fs from "fs";
import * as path from "path";

export interface FileInfo {
  fileName: string;
  filePath: string;
  mDate: string;
}

export class FileWatcherService {
  static instance: FileWatcherService;
  private files: FileInfo[] = [];

  constructor() {
    const rootPath = path.join(app.getPath("userData"), "/tftpboot/");

    fs.mkdir(rootPath, (err) => {
      console.log(`make dir error = ${err}`);
    });

    if (!this.loadFileList()) {
      this.saveFileList();
    }
  }

  private loadFileList(): boolean {
    try {
      const dir = path.join(app.getPath("userData"), "files");
      const buffer = fs.readFileSync(dir);
      const bufferJson = buffer.toString();
      const result = JSON.parse(bufferJson);
      this.files = result;
      this.files.forEach((fi) => {
        this.watchFile(fi.filePath);
        const dest = path.join(
          app.getPath("userData"),
          "/tftpboot/",
          fi.fileName
        );
        fs.copyFile(fi.filePath, dest, (e) => {
          if (e) console.log(`copy file error = ${e}`);
        });
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    console.log("load files successfully");
    return true;
  }

  private saveFileList(): boolean {
    try {
      const fileJson = JSON.stringify(this.files);
      const dir = path.join(app.getPath("userData"), "files");
      fs.writeFileSync(dir, fileJson);
    } catch (error) {
      console.log(error);
      return false;
    }

    console.log("save files successfully");
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
    };

    console.log(`is exists = ${file} ${isExists}`);

    if (isExists) {
      return;
    }
    console.log("file is inserted successfully");

    const dest = path.join(
      app.getPath("userData"),
      "/tftpboot/",
      path.basename(file)
    );

    console.log(`cp file ${dest}`);
    this.files.push(fileInfo);

    fs.copyFile(file, dest, (e) => {
      if (e) console.log(`copy file error = ${e}`);
    });

    this.watchFile(file);
    this.saveFileList();
  }

  private watchFile(file: string) {
    console.log(`watch ${file} file...`);

    fs.watchFile(file, (curr, prev) => {
      console.log(`file is changed. cp files.. (${curr.mtime}, ${prev.mtime})`);
      const stat = fs.statSync(file);
      const dest = path.join(
        app.getPath("userData"),
        "/tftpboot/",
        path.basename(file)
      );

      fs.copyFile(file, dest, (e) => {
        if (e) console.log(`copy file error = ${e}`);
      });

      const target = this.files.find((f) => f.filePath === file);
      try {
        target.mDate = stat.mtime.toLocaleString();
      } catch (e) {
        console.log(e);
      }
    });
  }

  static getInstance(): FileWatcherService {
    if (this.instance == null) {
      this.instance = new FileWatcherService();
    }
    return this.instance;
  }
}
