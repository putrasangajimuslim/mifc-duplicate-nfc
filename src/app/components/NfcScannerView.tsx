"use client";

import { useEffect, useRef, useState } from "react";
import {
  Wifi,
  Copy,
  ScanLine,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function NfcScannerView() {
  const ndefRef = useRef<any>(null);

  const [status, setStatus] = useState(
    "Press START NFC"
  );

  const [cardData, setCardData] = useState("");

  const [isScanning, setIsScanning] =
    useState(false);

  // ================= READ RECORD SAFELY =================
  const parseRecord = async (record: any) => {
    try {
      // TEXT
      if (record.recordType === "text") {
        const textDecoder = new TextDecoder(
          record.encoding || "utf-8"
        );

        return textDecoder.decode(record.data);
      }

      // URL
      if (record.recordType === "url") {
        const textDecoder = new TextDecoder();

        return textDecoder.decode(record.data);
      }

      // MIME
      if (record.recordType === "mime") {
        const textDecoder = new TextDecoder();

        return textDecoder.decode(record.data);
      }

      // UNKNOWN/BINARY
      if (record.data) {
        const textDecoder = new TextDecoder();

        return textDecoder.decode(record.data);
      }

      return "Unsupported NFC format";
    } catch (err) {
      console.error(err);

      return "Cannot parse NFC data";
    }
  };

  // ================= START NFC =================
  const startScan = async () => {
    try {
      if (!("NDEFReader" in window)) {
        setStatus("Web NFC not supported");

        return;
      }

      setIsScanning(true);

      setStatus("Requesting permission...");

      // @ts-ignore
      const ndef = new NDEFReader();

      ndefRef.current = ndef;

      // MUST FROM BUTTON CLICK
      await ndef.scan();

      setStatus("Ready • Tap NFC card");

      ndef.onreading = async (event: any) => {
        try {
          let finalPayload = "";

          for (const record of event.message.records) {
            const parsed = await parseRecord(
              record
            );

            finalPayload += `
TYPE: ${record.recordType}
DATA: ${parsed}

`;
          }

          setCardData(finalPayload);

          setStatus(
            "NFC scanned successfully"
          );

          console.log(finalPayload);
        } catch (err) {
          console.error(err);

          setStatus("Failed reading NFC");
        }
      };

      ndef.onreadingerror = () => {
        setStatus("Cannot read this NFC card");
      };
    } catch (err: any) {
      console.error(err);

      setIsScanning(false);

      if (err?.name === "NotAllowedError") {
        setStatus("Permission denied");
      } else {
        setStatus("Failed start NFC");
      }
    }
  };

  // ================= WRITE NFC =================
  const writeNFC = async () => {
    try {
      if (!cardData) {
        setStatus("No NFC data");

        return;
      }

      if (!ndefRef.current) {
        setStatus("Start NFC first");

        return;
      }

      setStatus("Tap NFC card to write");

      await ndefRef.current.write({
        records: [
          {
            recordType: "text",
            data: cardData,
          },
        ],
      });

      setStatus("NFC write success");
    } catch (err) {
      console.error(err);

      setStatus("Failed writing NFC");
    }
  };

  return (
    <>
     <div className="mx-auto max-w-6xl px-5 py-10">
        {/* HEADER */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            <Wifi className="h-4 w-4" />
            NFC FIXED READER
          </div>

          <h1 className="text-4xl font-black md:text-6xl">
            NFC Smart Scanner
          </h1>

          <p className="mt-4 text-gray-400">
            Fully fixed NFC parser for text,
            URL, MIME, and binary NFC records.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            {/* VISUAL */}
            <div className="flex justify-center">
              <div className="flex h-56 w-56 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                <Wifi
                  className={`h-20 w-20 ${
                    isScanning
                      ? "animate-pulse text-cyan-300"
                      : "text-violet-300"
                  }`}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <button
                onClick={startScan}
                className="rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-black transition hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center gap-2">
                  <ScanLine className="h-5 w-5" />
                  START NFC
                </div>
              </button>

              <button
                onClick={writeNFC}
                className="rounded-2xl bg-violet-500 px-6 py-4 font-bold transition hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center gap-2">
                  <Copy className="h-5 w-5" />
                  WRITE NFC
                </div>
              </button>
            </div>

            {/* STATUS */}
            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-cyan-300" />

                <span className="text-sm">
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                NFC Data
              </h2>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    cardData
                  )
                }
                className="rounded-xl bg-cyan-500/10 p-3 text-cyan-300"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 min-h-[350px] rounded-2xl border border-dashed border-white/10 bg-black/20 p-5">
              {cardData ? (
                <pre className="whitespace-pre-wrap break-words text-sm text-cyan-100">
                  {cardData}
                </pre>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                  <AlertCircle className="mb-3 h-8 w-8" />

                  Waiting NFC card...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}