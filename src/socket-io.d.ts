declare module "socket.io-client" {
  interface Socket {
    on(event: string, callback: (...args: any[]) => void): Socket;
    emit(event: string, ...args: any[]): Socket;
    disconnect(): Socket;
    removeListener(event: string, callback: (...args: any[]) => void): Socket;
  }

  interface ConnectOpts {
    query?: string;
    [key: string]: any;
  }

  function io(url: string, opts?: ConnectOpts): Socket;
  export = io;
}
