# SailPDF

SailPDF e una pagina web dedicata alla lavorazione di file PDF direttamente dal browser.
Il servizio permette agli utenti di caricare documenti PDF, modificarne la struttura e scaricare nuovi file PDF generati dalle operazioni richieste.

## Obiettivo

L'obiettivo del progetto e offrire uno strumento semplice, rapido e accessibile per gestire operazioni comuni sui PDF senza installare software aggiuntivo.

La prima versione del servizio si concentra su cinque funzionalita principali:

- unione di piu file PDF in un unico documento;
- divisione di un PDF multipagina in uno o piu file separati;
- compressione di un file PDF per ridurne le dimensioni;
- conversione di un PDF in immagini JPEG;
- conversione di file in PDF con scelta della compressione.

## Funzionalita

### 1. Merge PDF

La funzione Merge consente all'utente di caricare piu file PDF e unirli in un unico documento finale.

L'utente puo:

- selezionare due o piu file PDF;
- visualizzare l'elenco dei file caricati;
- scegliere l'ordine in cui i PDF devono essere uniti;
- rimuovere eventuali file caricati per errore;
- generare e scaricare un nuovo PDF unico.

### 2. Split PDF

La funzione Split consente all'utente di dividere un PDF composto da piu pagine in diversi file PDF.

L'utente puo:

- caricare un singolo file PDF multipagina;
- scegliere se estrarre tutte le pagine come file separati;
- indicare un intervallo specifico di pagine da estrarre;
- generare uno o piu PDF a partire dal documento originale;
- scaricare i file PDF risultanti.

### 3. Compress PDF

La funzione Compress consente all'utente di ridurre le dimensioni di un file PDF.

L'utente puo:

- caricare un singolo file PDF;
- scegliere il livello di compressione, se disponibile;
- visualizzare una stima o un confronto tra dimensione originale e dimensione finale;
- generare e scaricare il PDF compresso.

### 4. PDF to Images

La funzione PDF to Images consente all'utente di trasformare le pagine di un PDF in file immagine JPEG.

L'utente puo:

- caricare un singolo file PDF;
- scegliere se convertire tutte le pagine;
- indicare una o piu pagine specifiche da convertire;
- generare un file JPEG per ogni pagina selezionata;
- scaricare le immagini risultanti.

### 5. File to PDF

La funzione File to PDF consente all'utente di trasformare una o piu immagini in un documento PDF.

L'utente puo:

- caricare una o piu immagini da convertire;
- scegliere il livello di compressione del PDF finale;
- generare un nuovo documento PDF;
- scaricare il file PDF risultante.

## Esperienza utente

La pagina web deve essere chiara e immediata.

La homepage presenta all'utente le funzioni disponibili:

- Merge PDF;
- Split PDF;
- Compress PDF;
- PDF to Images;
- File to PDF.

L'utente sceglie la funzione che vuole utilizzare e viene poi indirizzato a una pagina dedicata per l'upload del file da lavorare.

Ogni pagina funzione deve guidare l'utente attraverso pochi passaggi essenziali:

- caricamento del file o dei file;
- scelta delle opzioni specifiche;
- elaborazione;
- download del risultato.

## Note tecniche iniziali

La lavorazione dei PDF puo essere gestita lato client, direttamente nel browser, cosi da evitare l'invio dei documenti a un server.
Questa scelta migliora la privacy dell'utente e riduce la complessita infrastrutturale della prima versione.

Una possibile libreria JavaScript per la manipolazione dei PDF e `pdf-lib`.

## Motore PDF attuale

La bozza ora include una prima implementazione reale lato browser:

- Merge PDF: unisce piu PDF in un unico file usando `pdf-lib`;
- Split PDF: divide un PDF in singole pagine dentro uno ZIP oppure estrae pagine selezionate in un nuovo PDF usando `pdf-lib` e `JSZip`;
- PDF to Images: converte le pagine selezionate in JPEG usando `pdf.js`;
- File to PDF: prima versione dedicata alle immagini, con una o piu immagini convertite in un PDF usando `pdf-lib`.

La compressione PDF resta una funzione da implementare in una fase successiva. Una compressione PDF completa e affidabile richiede spesso un backend o strumenti specializzati; lato browser si puo comunque realizzare una versione base orientata soprattutto ai PDF composti da immagini.

Le librerie sono caricate da CDN nella pagina HTML, quindi per usare il motore PDF serve una connessione internet attiva.

## Avvio locale

La bozza attuale e una pagina statica senza dipendenze esterne.

Per avviarla in locale:

```bash
python3 -m http.server 5174 --bind 127.0.0.1
```

Poi aprire:

```text
http://127.0.0.1:5174
```
