class ErrorPacket {
  static packetizer(err: string, errNo: number): Buffer {
    const recvBuf = Buffer.alloc(5 + err.length);
    recvBuf.writeUInt16BE(5);
    recvBuf.writeUInt16BE(errNo, 2);
    recvBuf.write(err, 4, 'ascii');
    recvBuf[recvBuf.length - 1] = 0;
    console.log(`send error packet`);
    return recvBuf;
  }
}

export default ErrorPacket;
