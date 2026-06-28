declare module "qz-tray" {
  interface QzSecurity {
    setCertificatePromise(
      promiseHandler: (resolve: (value: string) => void, reject: (reason?: unknown) => void) => void
    ): void;
    setSignatureAlgorithm(algorithm: "SHA1" | "SHA256" | "SHA512"): void;
    setSignaturePromise(
      promiseFactory: (
        toSign: string
      ) => (resolve: (value: string) => void, reject: (reason?: unknown) => void) => void
    ): void;
  }

  interface QzWebsocket {
    isActive(): boolean;
    connect(options?: unknown): Promise<void>;
  }

  interface QzPrinters {
    find(query?: string): Promise<string[]>;
    getDefault(): Promise<string | null>;
  }

  interface QzConfigs {
    create(printer: string, options?: unknown): unknown;
  }

  interface QzPrintData {
    type: string;
    format: string;
    data: string;
  }

  interface Qz {
    security: QzSecurity;
    websocket: QzWebsocket;
    printers: QzPrinters;
    configs: QzConfigs;
    print(config: unknown, data: QzPrintData[]): Promise<void>;
  }

  const qz: Qz;
  export default qz;
}
