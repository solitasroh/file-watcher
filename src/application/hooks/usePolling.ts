import { IpcService } from "./../../electron/services/ipc-service";
import { useRef, useEffect } from "react";

type ipcRenderCallbackType = (
  event: Electron.IpcRendererEvent,
  ...args: any[]
) => void;

export function usePolling(
  channel: string,
  callbackFunction: ipcRenderCallbackType
): void {
  const savedHandler = useRef<ipcRenderCallbackType>();

  useEffect(() => {
    savedHandler.current = callbackFunction;
  }, [callbackFunction]);

  useEffect(() => {
    const eventHandler = (event: Electron.IpcRendererEvent, ...args: any[]) => {
      savedHandler.current(event, ...args);
    };

    const ipcService = IpcService.getInstance();
    ipcService.on2(channel, eventHandler);

    return () => {
      ipcService.unregister(channel, eventHandler);
    };
  }, [channel]);
}
