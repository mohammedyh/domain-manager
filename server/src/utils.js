import dns from "node:dns/promises";
import whoiser from "whoiser";

export async function getWhoisData(domain) {
  try {
    await dns.lookup(domain);
    const whoisData = await whoiser.domain(domain, { follow: 1 });
    let selectedWhoisData;
    for (const registry in whoisData) {
      const expiryDate = whoisData[registry]["Expiry Date"];
      const createdDate = whoisData[registry]["Created Date"];
      const updatedDate = whoisData[registry]["Updated Date"];
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
