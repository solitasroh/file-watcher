import { IpcRendererEvent } from 'electron';
import { useRef, useEffect } from 'react';
import IpcService from '../../electron/services/ipc-service';

type ipcRenderCallbackType = (event: IpcRendererEvent, ...args: any[]) => void;

function usePolling(channel: string, callbackFunction: ipcRenderCallbackType): void {
  const savedHandler = useRef<ipcRenderCallbackType>();

  useEffect(() => {
    savedHandler.current = callbackFunction;
  }, [callbackFunction]);

  useEffect(() => {
    const listener = (event: IpcRendererEvent, ...args: any[]) => {
      savedHandler.current(event, ...args);
    };

    const ipcService = IpcService.getInstance();
    ipcService.on(channel, listener);

    return () => {
      ipcService.unregisterListener(channel, listener);
    };
  }, [channel]);
}

export default usePolling;
