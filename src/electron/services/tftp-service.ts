import dgram from "dgram";
import { app } from "electron";
import * as path from "path";
import { ReadRequest } from "./tftp/ReadRequest";

interface tftpPacket {
  type: number;
}

export class TftpService {
  PORT = 69;
  BUF_SIZE = 512;
  private server: dgram.Socket;
  readRequest: ReadRequest = new ReadRequest(this);

  constructor() {
    this.server = dgram
      .createSocket("udp4")
      .on("error", (err: Error) => {
        console.log(err);
      })
      .on("listening", this.listening)
      .on("message", this.message);
  }

  Write(buffer: Buffer, rInfo: dgram.RemoteInfo): void {
    //console.log(`write = ${buffer.at(0)}`);
    this.server.send(buffer, rInfo.port, rInfo.address, (err, bytes) => {
      console.log(`send bytes = ${bytes} error = ${err}`);
    });
  }

  private listening(): void {
    console.log("listening");
  }

  private message(msg: Buffer, rInfo: dgram.RemoteInfo): void {
    const op = msg.readUInt16BE(0);
    if (op === 1) {
      this.readRequest.depacketizer(msg, rInfo);
      this.readRequest.request(1);
    } else if (op === 4) {
      const blockNumber = msg.readUInt16BE(2);
      this.readRequest.request(blockNumber + 1);
    }
  }

  Start(): void {
    const ROOT = path.join(app.getPath("userData"), "/tftpboot/");
    console.log(`server start (port: ${this.PORT}, dir: ${ROOT})`);
    this.server.bind(this.PORT);
  }
}
