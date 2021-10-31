import dgram from 'dgram';
import { app } from 'electron';
import * as path from 'path';
import ReadRequest from './tftp/ReadRequest';

class TftpService {
  PORT = 69;

  BUF_SIZE = 512;

  private server: dgram.Socket;

  private isListening: boolean;

  readRequest: ReadRequest;

  constructor() {
    this.server = dgram
      .createSocket('udp4')
      .on('error', (err: Error) => {
        console.log(err);
      })
      .on('listening', () => {
        console.log('listening...');
        this.isListening = true;
      })
      .on('message', (msg, rInfo) => {
        this.message(msg, rInfo);
      });

    this.readRequest = new ReadRequest();
  }

  private Write(buffer: Buffer, rInfo: dgram.RemoteInfo): void {
    this.server.send(buffer, rInfo.port, rInfo.address, (err, bytes) => {
      if (err) {
        console.log(`send bytes = ${bytes} error = ${err}`);
      }
    });
  }

  private async message(msg: Buffer, rInfo: dgram.RemoteInfo): Promise<void> {
    const op = msg.readUInt16BE(0);
    if (op === 1) {
      if (this.readRequest == null || this.readRequest === undefined) {
        this.readRequest = new ReadRequest();
      }
      this.readRequest.depacketizer(msg, rInfo);
      try {
        const respBuf = await this.readRequest.request(1);
        this.Write(respBuf, rInfo);
      } catch (err) {
        console.log(err);
      }
    } else if (op === 4) {
      const blockNumber = msg.readUInt16BE(2);
      try {
        const respBuf = await this.readRequest.request(blockNumber + 1);
        if (respBuf == null) {
          return;
        }
        this.Write(respBuf, rInfo);
      } catch (error) {
        console.log(error);
      }
    }
  }

  Start(): void {
    const ROOT = path.join(app.getPath('userData'), '/tftpboot/');
    console.log(`server start (port: ${this.PORT}, dir: ${ROOT})`);
    this.server.bind(this.PORT);
  }

  Stop(): void {
    if (this.server != null && this.isListening) this.server.close();
  }
}

export default TftpService;
