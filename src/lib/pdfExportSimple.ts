export function exportReportToPDF(elementId: string, title: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Report element not found');
  }

  window.print();
}

export function generateReportFilename(prefix: string, identifier?: string): string {
  const date = new Date().toISOString().split('T')[0];
  const id = identifier ? `_${identifier.slice(0, 8)}` : '';
  return `${prefix}${id}_${date}`;
}
