import { FileInfo } from '../services/FileWatcherService';
import { FileRemoveRequest } from './FileRemoveRequest';

class FileRemoveArgs implements FileRemoveRequest {
  constructor(fileInfo: FileInfo) {
    this.fileInfo = fileInfo;
  }

  fileInfo: FileInfo;

  responseChannel?: string;
}

export default FileRemoveArgs;
