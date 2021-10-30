import { join } from 'path';
import * as dgram from 'dgram';
import * as fs from 'fs/promises';
import { app } from 'electron';
import ErrorPacket from './ErrorPacket';

const BLOCK_SZ = 512;
const OP_CODE__DATA = 3;
const ROOT = join(app.getPath('userData'), '/tftpboot/');

const getStringFromBuffer = (message: Buffer, startPos: number): { str: string; nextPos: number } => {
  let byte = 0;
  let asciiStr = '';
  let i = startPos;
  byte = message[i];

  while (byte !== 0) {
    if (byte === undefined) {
      throw Error('EBADMSG');
    }

    asciiStr += String.fromCharCode(byte);
    i += 1;
    byte = message[i];

    if (i > message.length) {
      throw Error('EMSGSZ');
    }
  }

  return {
    str: asciiStr,
    nextPos: i,
  };
};

class ReadRequest {
  fileName: string;

  readFilePos: number;

  opCode: number;

  mode: string;

  private fd: fs.FileHandle;

  private rInfo: dgram.RemoteInfo;

  private totalBlockCount: number;

  constructor() {
    console.log('ctr request');
  }

  depacketizer(message: Buffer, rInfo: dgram.RemoteInfo): void {
    const fileStr = getStringFromBuffer(message, 2);
    const mode = getStringFromBuffer(message, fileStr.nextPos);
    this.opCode = message.readUInt16BE(0);
    this.fileName = join(ROOT, fileStr.str);
    this.mode = mode.str;
    this.rInfo = rInfo;
  }

  async request(blockNum?: number): Promise<Buffer> {
    if (blockNum === 1) {
      try {
        const s = await fs.stat(this.fileName);
        this.totalBlockCount = Math.ceil(s.size / BLOCK_SZ);
        console.log(`get file request: ${this.fileName} (${this.totalBlockCount})`);
        this.fd = await fs.open(this.fileName, 'r');
      } catch (error) {
        return ErrorPacket.packetizer('file is not found', 1);
      }
    }

    return this.sendBlock(blockNum);
  }

  private async sendBlock(blockIdx: number): Promise<Buffer> {
    if (blockIdx > this.totalBlockCount) {
      return null;
    }

    const buffer: Buffer = Buffer.alloc(BLOCK_SZ);
    const readPos = (blockIdx - 1) * BLOCK_SZ;
    try {
      const ret = await this.fd.read(buffer, 0, BLOCK_SZ, readPos);
      if (ret.bytesRead < BLOCK_SZ) {
        this.fd.close();
      }

      const respBuf = Buffer.alloc(ret.bytesRead + 4);

      respBuf.writeUInt16BE(OP_CODE__DATA, 0);
      respBuf.writeUInt16BE(blockIdx, 2);

      buffer.copy(respBuf, 4, 0, ret.bytesRead);
      console.log(`send block (${blockIdx}) bytes=${ret.bytesRead}`);
      return respBuf;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default ReadRequest;
