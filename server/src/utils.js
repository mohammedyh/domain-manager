import dns from "node:dns/promises";
import https from "node:https";
import whoiser from "whoiser";

export async function getWhoisData(domain) {
  try {
    await dns.lookup(domain);
    const whoisData = await whoiser.domain(domain, { follow: 1 });
    let selectedWhoisData;
    for (const registry in whoisData) {
      const expiryDate = whoisData[registry]["Expiry Date"];
      const createdDate = whoisData[registry]["Created Date"];
      const updatedDate = whoisData[registry]["Updated Date"] ?? null;
      const registrar = whoisData[registry]["Registrar"];
      selectedWhoisData = {
        expiryDate: expiryDate && new Date(expiryDate),
        createdDate: createdDate && new Date(createdDate),
        updatedDate: updatedDate && new Date(updatedDate),
        registrar: registrar,
      };
    }
    return selectedWhoisData;
  } catch {
    throw new Error("Domain doesn't exist");
  }
}

export async function getSSLCertificate(domain) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: domain,
      port: 443,
      rejectUnauthorized: true,
      agent: false,
      timeout: 5000,
    };
    https
      .get(requestOptions, (res) => {
        const certificate = res.socket.getPeerCertificate();
        const {
          issuer,
          valid_from: validFrom,
          valid_to: validTo,
          subjectaltname,
        } = certificate;
        const daysRemaining = dateDiffInDays(validFrom, validTo);
        const validFor = subjectaltname?.replaceAll("DNS:", "").split(", ");
        resolve({ issuer, validFrom, validTo, validFor, daysRemaining });
      })
      .on("error", (err) => {
        if (err.code === "ENOTFOUND") {
          reject({ message: "Domain not found" });
        }

        if (err.code === "CERT_HAS_EXPIRED") {
          reject({ message: "Certificate has expired" });
        }

        reject({ message: err.message, code: err.code });
      })
      .on("timeout", () => reject({ message: "Request took too long" }));
  });
}

function dateDiffInDays(from, to) {
  const SECONDS_IN_A_DAY = 8.64e7;
  const diffInSeconds = Date.parse(to) - Date.parse(from);
  return Math.round(diffInSeconds / SECONDS_IN_A_DAY);
}
