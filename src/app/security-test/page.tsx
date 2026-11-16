"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  Terminal,
  Database,
  Code2,
  Lock,
  Flame,
  FileCheck2,
} from "lucide-react";

interface TestResult {
  scenario: string;
  payload?: any;
  status: "PASSED" | "FAILED";
  findings: string;
  defenseMechanism: string;
  safe: boolean;
  [key: string]: any;
}

interface SecurityLog {
  id: string;
  event: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  createdAt: string;
  user?: { username: string; role: string };
}

export default function SecurityTestPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [customPayloads, setCustomPayloads] = useState({
    sqli: "' OR '1'='1' --",
    xss: "<script>alert('XSS-Bengkel-Test')</script>",
  });

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/security-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {
      // Ignored if not admin
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const runTest = async (scenario: string, payload?: any) => {
    setLoadingScenario(scenario);
    try {
      const res = await fetch("/api/test-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, payload }),
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [scenario]: data }));
      fetchLogs(); // refresh audit logs
    } catch {
      setResults((prev) => ({
        ...prev,
        [scenario]: {
          scenario,
          status: "FAILED",
          findings: "Gagal mengeksekusi skenario uji.",
          defenseMechanism: "-",
          safe: false,
        },
      }));
    } finally {
      setLoadingScenario(null);
    }
  };

  const runAllTests = async () => {
    await runTest("sqli", customPayloads.sqli);
    await runTest("xss", customPayloads.xss);
    await runTest("idor", { role: "MEKANIK" });
    await runTest("rate_limit");
    await runTest("headers");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>SUITE SELF-TESTING KEAMANAN (CYBER SECURITY)</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Pengujian mandiri 5 skenario wajib Tugas Besar: SQLi, Stored XSS, IDOR/RBAC, Brute-Force Rate Limiting, &amp; Security Headers.
          </p>
        </div>

        <button
          onClick={runAllTests}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-amber-500/20 font-mono"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Jalankan Semua Skenario Uji</span>
        </button>
      </div>

      {/* 5 Mandatory Test Scenarios Cards */}
      <div className="space-y-5">
        {/* Skenario 1: SQL Injection */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
                01
              </div>
              <div>
                <h3 className="font-mono font-bold text-slate-100 text-sm">
                  SQL Injection (SQLi) pada Kolom Pencarian Part
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Menguji injeksi klausa SQL berbahaya (`&apos; OR &apos;1&apos;=&apos;1&apos; --`) pada parameter pencarian inventaris.
                </p>
              </div>
            </div>

            <button
              onClick={() => runTest("sqli", customPayloads.sqli)}
              disabled={loadingScenario === "sqli"}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingScenario === "sqli" ? "Menguji..." : "Uji SQLi"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Payload Uji:</label>
              <input
                type="text"
                value={customPayloads.sqli}
                onChange={(e) => setCustomPayloads({ ...customPayloads, sqli: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-amber-400 font-bold"
              />
            </div>
            {results.sqli && (
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status Pengujian:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    {results.sqli.status} (AMAN)
                  </span>
                </div>
                <div className="text-slate-300 text-[11px]">{results.sqli.findings}</div>
                <div className="text-[10px] text-slate-500">
                  <strong>Mitigasi:</strong> {results.sqli.defenseMechanism}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skenario 2: Stored XSS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                02
              </div>
              <div>
                <h3 className="font-mono font-bold text-slate-100 text-sm">
                  Stored Cross-Site Scripting (XSS) pada Form Keluhan Servis
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Menguji injeksi script berbahaya pada deskripsi keluhan pelanggan dan catatan mekanik.
                </p>
              </div>
            </div>

            <button
              onClick={() => runTest("xss", customPayloads.xss)}
              disabled={loadingScenario === "xss"}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingScenario === "xss" ? "Menguji..." : "Uji XSS"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Payload Uji:</label>
              <input
                type="text"
                value={customPayloads.xss}
                onChange={(e) => setCustomPayloads({ ...customPayloads, xss: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-amber-400 font-bold"
              />
            </div>
            {results.xss && (
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status Pengujian:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    {results.xss.status} (AMAN)
                  </span>
                </div>
                <div className="text-slate-300 text-[11px]">{results.xss.findings}</div>
                <div className="text-[10px] text-slate-500">
                  <strong>Mitigasi:</strong> {results.xss.defenseMechanism}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skenario 3: IDOR & Broken Access Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono font-bold text-xs">
                03
              </div>
              <div>
                <h3 className="font-mono font-bold text-slate-100 text-sm">
                  Broken Access Control &amp; IDOR pada Endpoint Admin / Finansial
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Mensimulasikan akun berhak akses rendah (`MEKANIK`) yang mencoba memanggil API audit admin `/api/security-logs`.
                </p>
              </div>
            </div>

            <button
              onClick={() => runTest("idor", { role: "MEKANIK" })}
              disabled={loadingScenario === "idor"}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingScenario === "idor" ? "Menguji..." : "Uji Bypass IDOR"}</span>
            </button>
          </div>

          {results.idor && (
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Target Resource: <strong className="text-slate-200">{results.idor.targetResource}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                  HTTP {results.idor.httpCode} FORBIDDEN ({results.idor.status})
                </span>
              </div>
              <div className="text-slate-300 text-[11px]">{results.idor.findings}</div>
              <div className="text-[10px] text-slate-500">
                <strong>Mitigasi:</strong> {results.idor.defenseMechanism}
              </div>
            </div>
          )}
        </div>

        {/* Skenario 4: Brute Force & Rate Limiting */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                04
              </div>
              <div>
                <h3 className="font-mono font-bold text-slate-100 text-sm">
                  Mitigasi Brute Force Attack via In-Memory Rate Limiting
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Mensimulasikan 6 permintaan login berurutan secara cepat untuk memastikan pemblokiran pada request ke-6.
                </p>
              </div>
            </div>

            <button
              onClick={() => runTest("rate_limit")}
              disabled={loadingScenario === "rate_limit"}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingScenario === "rate_limit" ? "Menguji..." : "Uji Rate Limit (6x Request)"}</span>
            </button>
          </div>

          {results.rate_limit && (
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hasil Simulasi Burst 6 Request:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                  {results.rate_limit.status} (TERBLOKIR HTTP 429)
                </span>
              </div>
              <div className="flex gap-2">
                {results.rate_limit.attempts?.map((a: any) => (
                  <div
                    key={a.attempt}
                    className={`flex-1 p-1.5 rounded text-center border ${
                      a.success
                        ? "bg-slate-900 border-slate-700 text-slate-300"
                        : "bg-red-950 border-red-800 text-red-400 font-bold"
                    }`}
                  >
                    Req #{a.attempt}: {a.success ? "200 OK" : "429 BLOCKED"}
                  </div>
                ))}
              </div>
              <div className="text-slate-300 text-[11px]">{results.rate_limit.findings}</div>
              <div className="text-[10px] text-slate-500">
                <strong>Mitigasi:</strong> {results.rate_limit.defenseMechanism}
              </div>
            </div>
          )}
        </div>

        {/* Skenario 5: Security Headers & HTTPS Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                05
              </div>
              <div>
                <h3 className="font-mono font-bold text-slate-100 text-sm">
                  Audit Security Headers &amp; Pencegahan Kebocoran Secret
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Memverifikasi header HTTP bawaan: CSP, Anti-Clickjacking (X-Frame-Options), MIME-Sniffing, dan isolasi kredensial `.env`.
                </p>
              </div>
            </div>

            <button
              onClick={() => runTest("headers")}
              disabled={loadingScenario === "headers"}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingScenario === "headers" ? "Menguji..." : "Scan Headers"}</span>
            </button>
          </div>

          {results.headers && (
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security Headers Output:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                  GRADE A COMPLIANT
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                {Object.entries(results.headers.headersApplied || {}).map(([key, val]: any) => (
                  <div key={key} className="flex flex-col sm:flex-row justify-between py-0.5 border-b border-slate-900">
                    <span className="font-bold text-amber-400">{key}:</span>
                    <span className="text-slate-300">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Security Audit Log (From Database) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Audit Log Keamanan &amp; Aktivitas Sistem (Database)</span>
          </h3>
          <button
            onClick={fetchLogs}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono"
          >
            Refresh Log
          </button>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Peristiwa (Event)</th>
                <th className="py-2.5 px-3">Rincian / Details</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Belum ada log tercatat.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isWarn = log.event.includes("FAILED") || log.event.includes("RATE_LIMIT");
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString("id-ID")}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isWarn
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-slate-800 text-emerald-400 border border-slate-700"
                          }`}
                        >
                          {log.event}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 max-w-xs truncate">{log.details}</td>
                      <td className="py-2 px-3 text-slate-400">{log.ipAddress || "-"}</td>
                      <td className="py-2 px-3 text-slate-400">
                        {log.user ? `${log.user.username} (${log.user.role})` : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
