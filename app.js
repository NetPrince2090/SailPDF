const tools = {
  merge: {
    title: "Merge PDF",
    kicker: "Unisci documenti",
    icon: "M",
    description: "Carica piu PDF, scegli l'ordine finale e prepara un unico documento.",
    uploadTitle: "Carica due o piu PDF",
    uploadCopy: "Trascina i file qui oppure selezionali dal computer. Potrai riordinare l'elenco prima di generare il risultato.",
    accept: "application/pdf",
    multiple: true,
    processLabel: "Unisci PDF",
    resultCopy: "PDF unito generato e scaricato.",
    features: [
      "Upload multiplo di file PDF",
      "Ordine modificabile dall'utente",
      "Rimozione dei file caricati per errore",
      "Download del PDF finale"
    ],
    options: [
      {
        type: "hint",
        text: "Usa le frecce accanto ai file caricati per definire l'ordine di unione."
      }
    ]
  },
  split: {
    title: "Split PDF",
    kicker: "Dividi documenti",
    icon: "S",
    description: "Estrai tutte le pagine o solo un intervallo da un PDF multipagina.",
    uploadTitle: "Carica un PDF multipagina",
    uploadCopy: "Seleziona il documento da dividere, poi scegli se estrarre tutte le pagine o solo una parte.",
    accept: "application/pdf",
    multiple: false,
    processLabel: "Dividi PDF",
    resultCopy: "PDF diviso e scaricato.",
    features: [
      "Upload di un singolo PDF",
      "Estrazione di tutte le pagine",
      "Estrazione di intervalli specifici",
      "Download dei file PDF generati"
    ],
    options: [
      {
        id: "splitMode",
        label: "Modalita di divisione",
        type: "select",
        choices: [
          ["all", "Ogni pagina in un PDF separato"],
          ["range", "Estrai pagine selezionate in un PDF"]
        ]
      },
      {
        id: "splitRange",
        label: "Pagine da estrarre",
        type: "text",
        placeholder: "Esempio: 1-3, 5, 8-10",
        hint: "Puoi indicare pagine singole o intervalli separati da virgola."
      }
    ]
  },
  compress: {
    title: "Compress PDF",
    kicker: "Riduci dimensioni",
    icon: "C",
    description: "Riduci il peso di un PDF ricostruendo le pagine come immagini JPEG compresse.",
    uploadTitle: "Carica un PDF da comprimere",
    uploadCopy: "Seleziona il documento e imposta quanto vuoi privilegiare qualita o dimensione finale. Attenzione: questa compressione rasterizza le pagine, quindi e ideale per PDF scansionati o ricchi di immagini, ma il testo potrebbe non restare selezionabile.",
    accept: "application/pdf",
    multiple: false,
    processLabel: "Comprimi PDF",
    resultCopy: "PDF compresso generato e scaricato.",
    features: [
      "Upload di un singolo PDF",
      "Scelta del livello di compressione",
      "Compressione eseguita direttamente nel browser",
      "Download del PDF compresso"
    ],
    options: [
      {
        id: "compression",
        label: "Compressione",
        type: "range",
        min: 1,
        max: 3,
        value: 2,
        hint: "1 qualita alta, 2 bilanciata, 3 file piu leggero. Il testo del PDF viene rasterizzato."
      }
    ]
  },
  "pdf-to-images": {
    title: "PDF to Images",
    kicker: "Da PDF a JPEG",
    icon: "I",
    description: "Trasforma le pagine selezionate di un PDF in immagini JPEG.",
    uploadTitle: "Carica un PDF da convertire",
    uploadCopy: "Scegli il documento e indica quali pagine devono diventare immagini.",
    accept: "application/pdf",
    multiple: false,
    processLabel: "Crea JPEG",
    resultCopy: "Immagini JPEG generate e scaricate.",
    features: [
      "Conversione di tutte le pagine",
      "Conversione di pagine selezionate",
      "Un JPEG per ogni pagina",
      "Download delle immagini generate"
    ],
    options: [
      {
        id: "imagePages",
        label: "Pagine da trasformare",
        type: "text",
        placeholder: "Tutte oppure 1-4, 7",
        hint: "Lascia vuoto per convertire tutte le pagine del PDF."
      },
      {
        id: "imageQuality",
        label: "Qualita JPEG",
        type: "select",
        choices: [
          ["0.92", "Alta"],
          ["0.8", "Bilanciata"],
          ["0.65", "Leggera"]
        ]
      }
    ]
  },
  "file-to-pdf": {
    title: "File to PDF",
    kicker: "Converti in PDF",
    icon: "P",
    description: "Trasforma una o piu immagini in PDF e scegli la compressione del risultato.",
    uploadTitle: "Carica una o piu immagini",
    uploadCopy: "Seleziona immagini JPG, PNG o WebP. Ogni immagine diventera una pagina del PDF finale.",
    accept: "image/*",
    multiple: true,
    processLabel: "Crea PDF",
    resultCopy: "PDF creato dalle immagini e scaricato.",
    features: [
      "Upload di una o piu immagini",
      "Scelta della compressione finale",
      "Generazione di un nuovo PDF",
      "Download del documento convertito",
      "Prima versione dedicata alla conversione immagini"
    ],
    options: [
      {
        id: "pdfCompression",
        label: "Compressione PDF",
        type: "select",
        choices: [
          ["high-quality", "Qualita alta"],
          ["balanced", "Bilanciata"],
          ["small", "Dimensione ridotta"]
        ]
      }
    ]
  }
};

const app = document.querySelector("#app");

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
}

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function setActiveNav(route) {
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${route}`);
  });
}

function renderHome() {
  const template = document.querySelector("#home-template").content.cloneNode(true);
  const grid = template.querySelector("[data-tool-grid]");

  Object.entries(tools).forEach(([id, tool]) => {
    const card = document.createElement("a");
    card.className = "tool-card";
    card.href = `#${id}`;
    card.innerHTML = `
      <span class="tool-card-icon">${tool.icon}</span>
      <span>
        <h3>${tool.title}</h3>
        <p>${tool.description}</p>
      </span>
    `;
    grid.append(card);
  });

  app.replaceChildren(template);
  setActiveNav("home");
}

function renderOptions(panel, tool) {
  panel.replaceChildren();

  tool.options.forEach((option) => {
    if (option.type === "hint") {
      const hint = document.createElement("p");
      hint.className = "hint";
      hint.textContent = option.text;
      panel.append(hint);
      return;
    }

    const group = document.createElement("div");
    group.className = "option-group";

    const label = document.createElement("label");
    label.setAttribute("for", option.id);
    label.textContent = option.label;
    group.append(label);

    let field;
    if (option.type === "select") {
      field = document.createElement("select");
      option.choices.forEach(([value, text]) => {
        const item = document.createElement("option");
        item.value = value;
        item.textContent = text;
        field.append(item);
      });
    } else {
      field = document.createElement("input");
      field.type = option.type;
      if (option.placeholder) field.placeholder = option.placeholder;
      if (option.min) field.min = option.min;
      if (option.max) field.max = option.max;
      if (option.value) field.value = option.value;
    }

    field.id = option.id;
    group.append(field);

    if (option.hint) {
      const hint = document.createElement("p");
      hint.className = "hint";
      hint.textContent = option.hint;
      group.append(hint);
    }

    panel.append(group);
  });
}

function getFieldValue(id) {
  return document.querySelector(`#${id}`)?.value?.trim() || "";
}

function makeSafeName(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "file";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function bytesToBlob(bytes, type = "application/pdf") {
  return new Blob([bytes], { type });
}

function parsePageSelection(rawValue, pageCount) {
  const raw = rawValue.trim().toLowerCase();
  if (!raw || raw === "tutte" || raw === "all") {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const pages = new Set();
  raw.split(",").forEach((chunk) => {
    const part = chunk.trim();
    if (!part) return;

    if (part.includes("-")) {
      const [startRaw, endRaw] = part.split("-").map((value) => Number(value.trim()));
      if (!Number.isInteger(startRaw) || !Number.isInteger(endRaw)) {
        throw new Error(`Intervallo non valido: ${part}`);
      }
      const start = Math.min(startRaw, endRaw);
      const end = Math.max(startRaw, endRaw);
      for (let page = start; page <= end; page += 1) {
        if (page < 1 || page > pageCount) throw new Error(`Pagina fuori range: ${page}`);
        pages.add(page - 1);
      }
      return;
    }

    const page = Number(part);
    if (!Number.isInteger(page)) throw new Error(`Pagina non valida: ${part}`);
    if (page < 1 || page > pageCount) throw new Error(`Pagina fuori range: ${page}`);
    pages.add(page - 1);
  });

  if (pages.size === 0) throw new Error("Indica almeno una pagina valida.");
  return [...pages].sort((a, b) => a - b);
}

async function mergePdfs(files) {
  if (files.length < 2) throw new Error("Carica almeno due PDF da unire.");

  const mergedPdf = await PDFLib.PDFDocument.create();
  for (const file of files) {
    const sourcePdf = await PDFLib.PDFDocument.load(await file.arrayBuffer());
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const bytes = await mergedPdf.save();
  downloadBlob(bytesToBlob(bytes), "sailpdf-merge.pdf");
}

async function splitPdf(files) {
  if (files.length !== 1) throw new Error("Carica un solo PDF da dividere.");

  const file = files[0];
  const sourcePdf = await PDFLib.PDFDocument.load(await file.arrayBuffer());
  const pageCount = sourcePdf.getPageCount();
  const mode = getFieldValue("splitMode");
  const range = getFieldValue("splitRange");
  const sourceName = makeSafeName(file.name);

  if (mode === "range") {
    const selectedPages = parsePageSelection(range, pageCount);
    const outputPdf = await PDFLib.PDFDocument.create();
    const copiedPages = await outputPdf.copyPages(sourcePdf, selectedPages);
    copiedPages.forEach((page) => outputPdf.addPage(page));
    const bytes = await outputPdf.save();
    downloadBlob(bytesToBlob(bytes), `${sourceName}-estratto.pdf`);
    return;
  }

  const zip = new JSZip();
  for (let index = 0; index < pageCount; index += 1) {
    const outputPdf = await PDFLib.PDFDocument.create();
    const [page] = await outputPdf.copyPages(sourcePdf, [index]);
    outputPdf.addPage(page);
    const bytes = await outputPdf.save();
    zip.file(`${sourceName}-pagina-${String(index + 1).padStart(3, "0")}.pdf`, bytes);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${sourceName}-split.zip`);
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Impossibile generare il file immagine."));
      },
      type,
      quality
    );
  });
}

async function pdfToImages(files) {
  if (files.length !== 1) throw new Error("Carica un solo PDF da convertire in immagini.");

  const file = files[0];
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const selectedPages = parsePageSelection(getFieldValue("imagePages"), pdf.numPages);
  const quality = Number(getFieldValue("imageQuality") || 0.9);
  const baseName = makeSafeName(file.name);
  const outputs = [];

  for (const pageIndex of selectedPages) {
    const page = await pdf.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    outputs.push({
      filename: `${baseName}-pagina-${String(pageIndex + 1).padStart(3, "0")}.jpg`,
      blob
    });
  }

  if (outputs.length === 1) {
    downloadBlob(outputs[0].blob, outputs[0].filename);
    return;
  }

  const zip = new JSZip();
  outputs.forEach((output) => zip.file(output.filename, output.blob));
  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${baseName}-immagini.zip`);
}

function compressionQuality(value) {
  return {
    "high-quality": 0.95,
    balanced: 0.82,
    small: 0.65
  }[value] || 0.82;
}

function pdfCompressionSettings(value) {
  return {
    1: { quality: 0.88, scale: 1.8 },
    2: { quality: 0.72, scale: 1.45 },
    3: { quality: 0.55, scale: 1.15 }
  }[value] || { quality: 0.72, scale: 1.45 };
}

async function compressPdf(files) {
  if (files.length !== 1) throw new Error("Carica un solo PDF da comprimere.");

  const file = files[0];
  const { quality, scale } = pdfCompressionSettings(getFieldValue("compression"));
  const sourcePdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const outputPdf = await PDFLib.PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= sourcePdf.numPages; pageNumber += 1) {
    const sourcePage = await sourcePdf.getPage(pageNumber);
    const pageSize = sourcePage.getViewport({ scale: 1 });
    const renderSize = sourcePage.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(renderSize.width);
    canvas.height = Math.floor(renderSize.height);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await sourcePage.render({ canvasContext: context, viewport: renderSize }).promise;

    const imageBlob = await canvasToBlob(canvas, "image/jpeg", quality);
    const image = await outputPdf.embedJpg(await imageBlob.arrayBuffer());
    const outputPage = outputPdf.addPage([pageSize.width, pageSize.height]);
    outputPage.drawImage(image, {
      x: 0,
      y: 0,
      width: pageSize.width,
      height: pageSize.height
    });

    canvas.width = 1;
    canvas.height = 1;
  }

  const bytes = await outputPdf.save();
  const originalName = makeSafeName(file.name);
  downloadBlob(bytesToBlob(bytes), `${originalName}-compresso.pdf`);
}

async function normalizeImage(file, quality) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const maxSide = quality < 0.7 ? 1800 : quality < 0.9 ? 2400 : 3200;
  const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToBlob(canvas, "image/jpeg", quality);
  return {
    bytes: await blob.arrayBuffer(),
    width: canvas.width,
    height: canvas.height
  };
}

async function imagesToPdf(files) {
  if (files.length === 0) throw new Error("Carica almeno una immagine da convertire.");
  const invalidFile = files.find((file) => !file.type.startsWith("image/"));
  if (invalidFile) throw new Error(`File non supportato: ${invalidFile.name}`);

  const quality = compressionQuality(getFieldValue("pdfCompression"));
  const outputPdf = await PDFLib.PDFDocument.create();

  for (const file of files) {
    const image = await normalizeImage(file, quality);
    const embeddedImage = await outputPdf.embedJpg(image.bytes);
    const page = outputPdf.addPage([image.width, image.height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    });
  }

  const bytes = await outputPdf.save();
  downloadBlob(bytesToBlob(bytes), "sailpdf-immagini.pdf");
}

async function processTool(toolId, files) {
  if (!window.PDFLib || !window.JSZip) {
    throw new Error("Le librerie PDF non sono ancora disponibili. Controlla la connessione e ricarica la pagina.");
  }

  if (toolId === "merge") return mergePdfs(files);
  if (toolId === "split") return splitPdf(files);
  if (toolId === "compress" || toolId === "pdf-to-images") {
    if (!window.pdfjsLib) throw new Error("pdf.js non e disponibile. Controlla la connessione e ricarica la pagina.");
    if (toolId === "compress") return compressPdf(files);
    return pdfToImages(files);
  }
  if (toolId === "file-to-pdf") return imagesToPdf(files);
  throw new Error("Questa funzione non ha ancora un motore PDF collegato.");
}

function renderFileList(container, files, toolId, updateFiles) {
  container.hidden = files.length === 0;
  container.replaceChildren();

  files.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "file-item";

    const controls =
      toolId === "merge"
        ? `<button class="icon-button" type="button" data-move-up="${index}" aria-label="Sposta su">↑</button>
           <button class="icon-button" type="button" data-move-down="${index}" aria-label="Sposta giu">↓</button>`
        : "";

    item.innerHTML = `
      <span class="file-number">${index + 1}</span>
      <span>
        <span class="file-name">${file.name}</span>
        <span class="file-meta">${formatBytes(file.size)}</span>
      </span>
      <span class="file-actions">
        ${controls}
        <button class="icon-button" type="button" data-remove="${index}" aria-label="Rimuovi">×</button>
      </span>
    `;

    container.append(item);
  });

  container.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextFiles = files.filter((_, index) => index !== Number(button.dataset.remove));
      updateFiles(nextFiles);
    });
  });

  container.querySelectorAll("[data-move-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveUp);
      if (index === 0) return;
      const nextFiles = [...files];
      [nextFiles[index - 1], nextFiles[index]] = [nextFiles[index], nextFiles[index - 1]];
      updateFiles(nextFiles);
    });
  });

  container.querySelectorAll("[data-move-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.moveDown);
      if (index === files.length - 1) return;
      const nextFiles = [...files];
      [nextFiles[index + 1], nextFiles[index]] = [nextFiles[index], nextFiles[index + 1]];
      updateFiles(nextFiles);
    });
  });
}

function renderTool(toolId) {
  const tool = tools[toolId];
  if (!tool) {
    renderHome();
    return;
  }

  let selectedFiles = [];
  const template = document.querySelector("#tool-template").content.cloneNode(true);

  template.querySelector("[data-tool-kicker]").textContent = tool.kicker;
  template.querySelector("[data-tool-title]").textContent = tool.title;
  template.querySelector("[data-tool-description]").textContent = tool.description;
  template.querySelector("[data-upload-title]").textContent = tool.uploadTitle;
  template.querySelector("[data-upload-copy]").textContent = tool.uploadCopy;
  template.querySelector("[data-process-button]").textContent = tool.processLabel;
  template.querySelector("[data-result-copy]").textContent = tool.resultCopy;

  const features = template.querySelector("[data-tool-features]");
  tool.features.forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    features.append(item);
  });

  const input = template.querySelector("[data-file-input]");
  input.accept = tool.accept;
  input.multiple = tool.multiple;

  app.replaceChildren(template);
  setActiveNav(toolId);

  const uploadZone = app.querySelector("[data-upload-zone]");
  const uploadButton = app.querySelector("[data-upload-button]");
  const fileList = app.querySelector("[data-file-list]");
  const optionsPanel = app.querySelector("[data-options-panel]");
  const resetButton = app.querySelector("[data-reset-button]");
  const processButton = app.querySelector("[data-process-button]");
  const resultPanel = app.querySelector("[data-result-panel]");

  const updateFiles = (files) => {
    selectedFiles = tool.multiple ? files : files.slice(0, 1);
    renderFileList(fileList, selectedFiles, toolId, updateFiles);
    resultPanel.hidden = true;
  };

  renderOptions(optionsPanel, tool);

  uploadButton.addEventListener("click", () => input.click());
  uploadZone.addEventListener("click", (event) => {
    if (event.target === uploadZone) input.click();
  });
  input.addEventListener("change", () => updateFiles(Array.from(input.files || [])));

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadZone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadZone.classList.remove("is-dragging");
    });
  });

  uploadZone.addEventListener("drop", (event) => {
    updateFiles(Array.from(event.dataTransfer.files || []));
  });

  resetButton.addEventListener("click", () => {
    input.value = "";
    updateFiles([]);
  });

  processButton.addEventListener("click", async () => {
    resultPanel.hidden = false;
    const resultCopy = resultPanel.querySelector("[data-result-copy]");
    if (selectedFiles.length === 0) {
      resultCopy.textContent = "Carica almeno un file per completare questo flusso.";
      return;
    }

    processButton.disabled = true;
    processButton.textContent = "Elaborazione...";
    resultCopy.textContent = "Sto lavorando il file nel browser. Rimani su questa pagina.";

    try {
      await processTool(toolId, selectedFiles);
      resultCopy.textContent = tool.resultCopy;
    } catch (error) {
      resultCopy.textContent = error.message || "Qualcosa non ha funzionato durante l'elaborazione.";
    } finally {
      processButton.disabled = false;
      processButton.textContent = tool.processLabel;
    }
  });
}

function router() {
  const route = window.location.hash.replace("#", "") || "home";
  if (route === "home") {
    renderHome();
  } else {
    renderTool(route);
  }
}

window.addEventListener("hashchange", router);
router();
