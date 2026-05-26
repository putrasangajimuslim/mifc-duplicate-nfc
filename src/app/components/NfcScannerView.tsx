"use client";

import { useState } from "react";
import {
  Wifi,
  CreditCard,
  ShieldCheck,
  Copy,
  CheckCircle2,
  ScanLine,
  AlertCircle,
} from "lucide-react";

export default function NfcScannerView() {
  const [status, setStatus] = useState("Ready to scan NFC card");
  const [cardData, setCardData] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const scanCard = async () => {
    if (!("NDEFReader" in window)) {
      setStatus("Web NFC is not supported on this device");
      return;
    }

    try {
      setIsScanning(true);
      setStatus("Waiting NFC card...");

      // @ts-ignore
      const ndef = new NDEFReader();

      await ndef.scan();

      ndef.onreading = (event: any) => {
        const decoder = new TextDecoder();

        for (const record of event.message.records) {
          const text = decoder.decode(record.data);
          setCardData(text);
          setStatus("NFC card scanned successfully");
        }

        setIsScanning(false);
      };
    } catch (err) {
      console.error(err);
      setStatus("Failed to scan NFC card");
      setIsScanning(false);
    }
  };

  const writeCard = async () => {
    if (!cardData) {
      setStatus("No NFC data available");
      return;
    }

    if (!("NDEFReader" in window)) {
      setStatus("Web NFC is not supported on this device");
      return;
    }

    try {
      setIsWriting(true);
      setStatus("Tap new NFC card to write data...");

      // @ts-ignore
      const ndef = new NDEFReader();

      await ndef.write(cardData);

      setStatus("Data copied to NFC card successfully");
      setIsWriting(false);
    } catch (err) {
      console.error(err);
      setStatus("Failed to write NFC card");
      setIsWriting(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-10 lg:px-10">
        {/* Header */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-xl">
              <Wifi className="h-4 w-4" />
              NFC Smart System
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Modern NFC
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {" "}
                Scanner
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-gray-400 md:text-lg">
              Scan NFC cards, duplicate text data, and write information to
              another NFC card using Web NFC API with Next.js and Tailwind CSS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard icon={<ScanLine />} title="Fast Scan" />
            <StatCard icon={<Copy />} title="Copy Data" />
            <StatCard icon={<ShieldCheck />} title="Secure" />
          </div>
        </header>

        {/* Main Grid */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Scanner Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">NFC Reader & Writer</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Compatible with Android Chrome Web NFC.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/20">
                <CreditCard className="h-7 w-7" />
              </div>
            </div>

            {/* Status */}
            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                <span className="text-sm text-cyan-100">{status}</span>
              </div>
            </div>

            {/* NFC Visual */}
            <div className="relative mt-10 flex justify-center">
              <div className="absolute h-72 w-72 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 backdrop-blur-xl">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-[#0c1125] shadow-inner shadow-cyan-500/20">
                  <Wifi className="h-20 w-20 text-cyan-300" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <button
                onClick={scanCard}
                disabled={isScanning}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 p-[1px] transition hover:scale-[1.02]"
              >
                <div className="flex h-full items-center justify-center gap-3 rounded-2xl bg-[#0b1022] px-6 py-4 font-semibold">
                  <ScanLine className="h-5 w-5" />
                  {isScanning ? "Scanning..." : "Scan NFC Card"}
                </div>
              </button>

              <button
                onClick={writeCard}
                disabled={isWriting}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-[1px] transition hover:scale-[1.02]"
              >
                <div className="flex h-full items-center justify-center gap-3 rounded-2xl bg-[#0b1022] px-6 py-4 font-semibold">
                  <Copy className="h-5 w-5" />
                  {isWriting ? "Writing..." : "Write NFC Card"}
                </div>
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-8">
            {/* Card Data */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Card Data</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    NFC payload result.
                  </p>
                </div>

                <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-300">
                  <Copy className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 min-h-[220px] rounded-2xl border border-dashed border-white/10 bg-black/20 p-5">
                {cardData ? (
                  <pre className="whitespace-pre-wrap break-words text-sm text-cyan-100">
                    {cardData}
                  </pre>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                    <AlertCircle className="mb-3 h-8 w-8" />
                    Tap NFC card to start scanning.
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold">Features</h3>

              <div className="mt-5 space-y-4 text-sm text-gray-300">
                <Feature text="Modern responsive dashboard UI" />
                <Feature text="Realtime NFC scan interaction" />
                <Feature text="Copy data between NFC tags" />
                <Feature text="Web NFC API integration" />
                <Feature text="Optimized for Android Chrome" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function StatCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-300">
        {icon}
      </div>

      <p className="text-sm font-semibold text-white">{title}</p>
    </div>
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
