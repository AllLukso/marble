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
