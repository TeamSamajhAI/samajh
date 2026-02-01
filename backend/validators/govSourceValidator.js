const ALLOWED_SUFFIXES = [".gov.in", ".nic.in"];

function isOfficialGovURL(url) {
  try {
    const { hostname, protocol } = new URL(url);

    if (protocol !== "https:") return false;

    return ALLOWED_SUFFIXES.some(s =>
      hostname.toLowerCase().endsWith(s)
    );
  } catch {
    return false;
  }
}

module.exports = { isOfficialGovURL };
