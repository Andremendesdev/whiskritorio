"use client";

let initialized = false;

type QzTray = typeof import("qz-tray").default;

export async function setupQzSecurity(qz: QzTray): Promise<void> {
  if (initialized) return;
  initialized = true;

  qz.security.setCertificatePromise(() =>
    fetch("/qz/digital-certificate.txt", { cache: "no-store" }).then((response) => {
      if (!response.ok) {
        throw new Error("Certificado QZ não encontrado em /qz/digital-certificate.txt.");
      }
      return response.text();
    })
  );

  qz.security.setSignatureAlgorithm("SHA512");

  qz.security.setSignaturePromise((toSign) => (resolve, reject) => {
    fetch("/api/qz/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toSign }),
      cache: "no-store",
    })
      .then((response) => {
        if (response.ok) return response.text();
        return response.text().then((message) => Promise.reject(new Error(message)));
      })
      .then(resolve)
      .catch(reject);
  });
}
