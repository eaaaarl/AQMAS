export const getBufferValue = (
  buffer: { type: string; data: number[] } | undefined
): number => {
  return buffer?.data?.[0] || 0;
};
