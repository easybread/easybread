export function parseBreadId(breadId: string) {
  const [_, userId] = breadId.split(':');
  return { userId };
}
