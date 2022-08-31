export function getIPFSUrl(url?: string) {
  if (!url) return url;
  return `https://ipfs.io/ipfs/${url.substring(7)}`;
}

export function getUserHash(address?: string) {
  if (!address) return address;
  const l = address.length;
  if (l < 20) return address;
  return address.substring(2, 6);
}

export function abridgeAddress(address?: string) {
  if (!address) return address;
  const l = address.length;
  if (l < 20) return address;
  return `${address.substring(0, 6)}...${address.substring(l - 4, l)}`;
}

export function abridgeMessage(message?: string, charCount: number = 100) {
  if (!message) return message;
  return `${message.substring(0, charCount)}...`;
}
