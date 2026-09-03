/**
 * Utility to print Project Proposal cleanly as an isolated PDF
 * with pure white paper background, crisp typography, and zero dark margins.
 */
export function printProposalDocument(customTitle: string = "Project Proposal") {
  const sourceElement = document.getElementById("proposal-printable-document");
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
  let iframe = document.getElementById("proposal-print-isolated-iframe") as HTMLIFrameElement;
  if (iframe) {
    iframe.remove();
  }

  iframe = document.createElement("iframe");
  iframe.id = "proposal-print-isolated-iframe";
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "210mm";
  iframe.style.height = "auto";
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
            margin: 12mm 15mm 15mm 15mm !important;
          }
          *, *:before, *:after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #111827 !important;
          }
          #proposal-printable-document {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
            box-shadow: none !important;
            background-color: #ffffff !important;
            color: #111827 !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          table, th, td {
            border: 1px solid #4b5563 !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body style="background: #ffffff !important; color: #111827 !important;">
        ${clone.outerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Temporarily set document title for default save filename in browser print dialog
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
