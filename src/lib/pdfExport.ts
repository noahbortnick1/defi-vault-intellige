export function exportToPDF(elementId: string, filename: string) {
  window.print();
}

export function generatePDFFilename(prefix: string, identifier?: string): string {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  const id = identifier ? `_${identifier.slice(0, 8)}` : '';
  return `${prefix}${id}_${date}_${time}.pdf`;
}
