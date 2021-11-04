import { FileRemoveRequest } from './FileRemoveRequest';

class FileRemoveArgs implements FileRemoveRequest {
  constructor(uuid: string) {
    this.uuid = uuid;
  }

  uuid: string;

  responseChannel?: string;
}

export default FileRemoveArgs;
