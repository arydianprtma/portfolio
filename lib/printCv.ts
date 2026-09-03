/**
 * Utility to print CV cleanly as an exact, isolated 1-page A4 PDF
 * without browser headers/footers, dark margins, or dashboard UI elements.
 */
export function printCvDocument(customTitle: string = "Curriculum Vitae") {
  const sourceElement = document.getElementById("cv-printable-document");
  if (!sourceElement) {
    const origTitle = document.title;
    document.title = customTitle;
    window.print();
    setTimeout(() => {
      document.title = origTitle;
    }, 1500);
    return;
  }

  // Check or create isolated printing iframe
  let iframe = document.getElementById("cv-print-isolated-iframe") as HTMLIFrameElement;
  if (iframe) {
    iframe.remove();
  }

  iframe = document.createElement("iframe");
  iframe.id = "cv-print-isolated-iframe";
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  // Extract all page stylesheets and font links
  const styleElements = Array.from(
    document.querySelectorAll("link[rel='stylesheet'], style")
  )
    .map((el) => el.outerHTML)
    .join("\n");

  // Clone document and reset scale/transforms
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${customTitle}</title>
        ${styleElements}
        <style>
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          *, *:before, *:after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #111827 !important;
            overflow: hidden !important;
          }
          #cv-printable-document {
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            transform: none !important;
            box-shadow: none !important;
            background-color: #ffffff !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Temporarily set document title so browser print dialog default save filename is "Curriculum Vitae"
  const origTitle = document.title;
  document.title = customTitle;

  // Trigger print once fonts and styles are parsed
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.title = origTitle;
    }, 2000);
  }, 400);
}
