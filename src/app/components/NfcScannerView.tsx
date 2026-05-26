"use client";

import { useEffect, useRef, useState } from "react";
import {
  Wifi,
  Copy,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MessageCircle,
} from "lucide-react";

export default function NfcScannerView() {
  const ndefRef = useRef<any>(null);

  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState("Initializing NFC...");
  const [cardData, setCardData] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  // ================= WHATSAPP =================
  const sendWhatsApp = (message: string) => {
    const phone = "6282117633116";

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  // ================= INIT NFC =================
  useEffect(() => {
    initNFC();
  }, []);

  const initNFC = async () => {
    try {
      if (!("NDEFReader" in window)) {
        setSupported(false);
        setStatus("Web NFC is not supported");
        return;
      }

      // @ts-ignore
      ndefRef.current = new NDEFReader();

      await startFastScan();
    } catch (err) {
      console.error(err);
      setStatus("Failed initialize NFC");
    }
  };

  // ================= FAST SCAN =================
  const startFastScan = async () => {
    try {
      setIsScanning(true);
      setStatus("Ready • Tap NFC card");

      await ndefRef.current.scan();

      ndefRef.current.onreading = (event: any) => {
        try {
          const decoder = new TextDecoder();

          let payload = "";

          for (const record of event.message.records) {
            payload += decoder.decode(record.data);
          }

          setCardData(payload);

          setStatus("Card scanned successfully");

          // ================= SEND TO WHATSAPP =================
          sendWhatsApp(
            `✅ NFC SCAN SUCCESS

📌 Data:
${payload}

🕒 Time:
${new Date().toLocaleString()}`
          );
        } catch (err) {
          console.error(err);
          setStatus("Failed reading NFC");
        }
      };

      ndefRef.current.onreadingerror = () => {
        setStatus("Cannot read NFC card");
      };
    } catch (err) {
      console.error(err);
      setStatus("NFC permission denied");
    }
  };

  // ================= WRITE NFC =================
  const writeNFC = async () => {
    try {
      if (!cardData) {
        setStatus("No card data available");
        return;
      }

      setIsWriting(true);

      setStatus("Tap new NFC card to write");

      await ndefRef.current.write(cardData);

      setStatus("NFC written successfully");

      // ================= SEND WA AFTER WRITE =================
      sendWhatsApp(
        `✅ NFC WRITE SUCCESS

📌 Data:
${cardData}

🕒 Time:
${new Date().toLocaleString()}`
      );

      setIsWriting(false);
    } catch (err) {
      console.error(err);

      setStatus("Failed writing NFC");

      setIsWriting(false);
    }
  };

  // ================= COPY =================
  const copyData = async () => {
    if (!cardData) return;

    await navigator.clipboard.writeText(cardData);

    setStatus("Copied to clipboard");
  };

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[450px] w-[450px] rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 lg:px-10">
        {/* HEADER */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-xl">
              <Wifi className="h-4 w-4" />
              NFC Smart System
            </div>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              NFC Smart
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {" "}
                Scanner
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">
              Scan NFC cards, write NFC tags, and automatically send results to
              WhatsApp.
            </p>
          </div>

          {/* STATUS CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500">
                <CreditCard className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm text-gray-400">NFC Status</p>

                <h3 className="font-semibold text-cyan-300">{status}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:p-8">
            {/* VISUAL */}
            <div className="relative flex justify-center">
              <div className="absolute h-72 w-72 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[#0a1122] shadow-inner shadow-cyan-500/20">
                  <Wifi
                    className={`h-20 w-20 ${
                      isScanning
                        ? "animate-pulse text-cyan-300"
                        : "text-violet-300"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <button
                onClick={startFastScan}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 p-[1px] transition hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#0b1022] px-6 py-4 font-semibold">
                  <ScanLine className="h-5 w-5" />
                  Scan
                </div>
              </button>

              <button
                onClick={writeNFC}
                disabled={isWriting}
                className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-[1px] transition hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#0b1022] px-6 py-4 font-semibold">
                  <Copy className="h-5 w-5" />
                  {isWriting ? "Writing..." : "Write"}
                </div>
              </button>

              <button
                onClick={() =>
                  sendWhatsApp(
                    `📌 Manual NFC Report

                  Data:
                  ${cardData || "No data"}`
                                    )
                }
                className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-[1px] transition hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#0b1022] px-6 py-4 font-semibold">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </div>
              </button>
            </div>

            {/* INFO */}
            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-cyan-300" />

                <span className="text-sm text-cyan-100">
                  Persistent NFC scanner optimized for faster response and
                  WhatsApp integration.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* DATA */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">NFC Payload</h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Realtime NFC result
                  </p>
                </div>

                <button
                  onClick={copyData}
                  className="rounded-xl bg-cyan-500/10 p-3 text-cyan-300 transition hover:scale-110"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 min-h-[250px] rounded-2xl border border-dashed border-white/10 bg-black/20 p-5">
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

            {/* FEATURES */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6 backdrop-blur-2xl">
              <h3 className="text-xl font-bold">Features</h3>

              <div className="mt-5 space-y-4 text-sm text-gray-300">
                <Feature text="Persistent NFC scanner" />
                <Feature text="Fast NFC response" />
                <Feature text="Automatic WhatsApp sender" />
                <Feature text="Modern glassmorphism UI" />
                <Feature text="Responsive mobile layout" />
              </div>
            </div>

            {/* SUPPORT */}
            {!supported && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
                <h3 className="font-bold text-red-300">
                  Web NFC Unsupported
                </h3>

                <p className="mt-2 text-sm text-red-200">
                  Use Android Chrome latest version and enable NFC.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
      <div className="h-2 w-2 rounded-full bg-cyan-400" />
      <span>{text}</span>
    </div>
  );
}