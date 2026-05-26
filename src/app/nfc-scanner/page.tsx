"use client";
import NfcScannerView from "../components/NfcScannerView";
export default function NFCScannerPage() {

  return (
     <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <NfcScannerView/>
    </main>
  );
}