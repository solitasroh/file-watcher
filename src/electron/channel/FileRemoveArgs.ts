import { FileRemoveRequest } from './FileRemoveRequest';

class FileRemoveArgs implements FileRemoveRequest {
  constructor(key: number) {
    this.key = key;
  }

  key: number;

  responseChannel?: string;
}

export default FileRemoveArgs;
