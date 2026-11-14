"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaGithub,
  FaGooglePlay,
  FaExternalLinkAlt,
  FaAndroid,
  FaJava,
  FaServer,
  FaDatabase,
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaMobileAlt,
  FaRobot,
  FaRedo,
  FaCheckCircle,
  FaShieldAlt,
  FaBolt,
  FaChartLine,
  FaTv,
  FaAward,
} from "react-icons/fa";
import {
  SiKotlin,
  SiSpringboot,
  SiFirebase,
  SiPostgresql,
  SiRedis,
  SiApachekafka,
  SiDocker,
  SiGooglecloud,
  SiAmazonwebservices,
  SiPrometheus,
  SiGrafana,
  SiPython,
  SiMysql,
} from "react-icons/si";
import { HiSparkles } from "react-icons/hi2";

gsap.registerPlugin(ScrollTrigger);

// --- 1. INTERACTIVE MOCKUP: XO RUSH (Minimax + Jetpack Compose Simulation) ---
function XORushMockup() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsAi, setVsAi] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [statusMessage, setStatusMessage] = useState("Your Turn (X)");

  const winningCombinations = useMemo(
    () => [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
    []
  );

  const checkWinner = (squares: (string | null)[]) => {
    for (const [a, b, c] of winningCombinations) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return { winner: "Draw", line: null };
    }
    return null;
  };

  const winInfo = checkWinner(board);

  // Minimax simplified AI turn
  useEffect(() => {
    if (vsAi && !isXNext && !winInfo) {
      const timer = setTimeout(() => {
        // Find empty cells
        const emptyIndices = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((v): v is number => v !== null);

        if (emptyIndices.length === 0) return;

        // Check if AI can win immediately or block human win
        let chosenMove: number = emptyIndices[0];
        for (const idx of emptyIndices) {
          const testBoard = [...board];
          testBoard[idx] = "O";
          if (checkWinner(testBoard)?.winner === "O") {
            chosenMove = idx;
            break;
          }
        }
        // Block player
        if (chosenMove === emptyIndices[0]) {
          for (const idx of emptyIndices) {
            const testBoard = [...board];
            testBoard[idx] = "X";
            if (checkWinner(testBoard)?.winner === "X") {
              chosenMove = idx;
              break;
            }
          }
        }
        // Center preference
        if (emptyIndices.includes(4) && Math.random() > 0.3) {
          chosenMove = 4;
        }

        const newBoard = [...board];
        newBoard[chosenMove] = "O";
        setBoard(newBoard);
        setIsXNext(true);

        const outcome = checkWinner(newBoard);
        if (outcome?.winner === "O") {
          setScores((prev) => ({ ...prev, o: prev.o + 1 }));
          setStatusMessage("AI Won (Minimax)");
        } else if (outcome?.winner === "Draw") {
          setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
          setStatusMessage("Match Drawn!");
        } else {
          setStatusMessage("Your Turn (X)");
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [vsAi, isXNext, board, winInfo, winningCombinations]);

  const handleCellClick = (idx: number) => {
    if (board[idx] || winInfo) return;
    if (vsAi && !isXNext) return;

    const newBoard = [...board];
    newBoard[idx] = isXNext ? "X" : "O";
    setBoard(newBoard);

    const outcome = checkWinner(newBoard);
    if (outcome?.winner === "X") {
      setScores((prev) => ({ ...prev, x: prev.x + 1 }));
      setStatusMessage("Player X Won! 🎉");
    } else if (outcome?.winner === "O") {
      setScores((prev) => ({ ...prev, o: prev.o + 1 }));
      setStatusMessage("Player O Won!");
    } else if (outcome?.winner === "Draw") {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      setStatusMessage("Match Drawn!");
    } else {
      setIsXNext(!isXNext);
      setStatusMessage(vsAi ? "AI Thinking..." : `Player ${!isXNext ? "X" : "O"}'s Turn`);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatusMessage("Your Turn (X)");
  };

  return (
    <div className="relative mx-auto w-full max-w-[320px] rounded-[42px] border-[5px] border-gray-800 bg-black p-3.5 shadow-2xl device-shadow">
      {/* Device speaker & camera pill */}
      <div className="absolute left-1/2 top-3 z-20 flex h-4 w-28 -translate-x-1/2 items-center justify-center rounded-full bg-gray-900 border border-gray-800">
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/80 mr-2" />
        <div className="h-1 w-8 rounded-full bg-gray-700" />
      </div>

      {/* Screen Content */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4 pt-7 text-white select-none">
        {/* Status bar */}
        <div className="mb-2 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded">Compose UI</span>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* App Bar */}
        <div className="mb-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-0.5 text-[10px] text-cyan-300 font-bold tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            XO RUSH • MULTIPLAYER
          </div>
          <h4 className="mt-1 text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400">
            Jetpack Compose Engine
          </h4>
        </div>

        {/* AI / Local Mode Toggle */}
        <div className="mb-2.5 flex items-center justify-between rounded-lg bg-gray-900/90 p-1 border border-gray-800 text-[10px]">
          <button
            onClick={() => {
              setVsAi(true);
              resetGame();
            }}
            className={`flex-1 rounded py-1 font-semibold transition-all ${
              vsAi ? "bg-cyan-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            vs Minimax AI
          </button>
          <button
            onClick={() => {
              setVsAi(false);
              resetGame();
            }}
            className={`flex-1 rounded py-1 font-semibold transition-all ${
              !vsAi ? "bg-fuchsia-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Pass & Play
          </button>
        </div>

        {/* Scoreboard */}
        <div className="mb-2.5 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
          <div className="rounded-md bg-gray-900/80 p-1 border border-cyan-900/40">
            <span className="text-cyan-400 font-bold">X (You)</span>
            <div className="text-xs font-black text-white">{scores.x}</div>
          </div>
          <div className="rounded-md bg-gray-900/80 p-1 border border-gray-800">
            <span className="text-gray-400">Draws</span>
            <div className="text-xs font-black text-white">{scores.draws}</div>
          </div>
          <div className="rounded-md bg-gray-900/80 p-1 border border-fuchsia-900/40">
            <span className="text-fuchsia-400 font-bold">{vsAi ? "AI (O)" : "O"}</span>
            <div className="text-xs font-black text-white">{scores.o}</div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="mb-2 text-center text-[11px] font-semibold text-cyan-300">
          {statusMessage}
        </div>

        {/* 3x3 Playable Board */}
        <div className="grid grid-cols-3 gap-2 bg-gray-950/90 p-2 rounded-2xl border border-gray-800">
          {board.map((cell, idx) => {
            const isWinningCell = winInfo?.line?.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`relative flex h-16 w-full items-center justify-center rounded-xl text-2xl font-black transition-all ${
                  isWinningCell
                    ? "bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-white scale-105 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                    : "bg-gray-900/90 hover:bg-gray-800/90 border border-gray-800 text-white active:scale-95"
                }`}
              >
                {cell === "X" && (
                  <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">X</span>
                )}
                {cell === "O" && (
                  <span className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">O</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer controls inside device */}
        <div className="mt-3 flex items-center justify-between pt-1 border-t border-gray-800/60">
          <button
            onClick={resetGame}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-cyan-300 transition-colors"
          >
            <FaRedo className="text-[10px]" /> Restart Match
          </button>
          <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Firebase Realtime
          </span>
        </div>
      </div>
    </div>
  );
}

// --- 2. INTERACTIVE MOCKUP: MYSA MONEY (Material 3 + Gemini AI & ML Kit) ---
function MysaMoneyMockup() {
  const [activeTab, setActiveTab] = useState<"coach" | "ocr">("coach");
  const [coachResponse, setCoachResponse] = useState(
    "Based on this week's expenses, your Food & Dining is 18% lower than average. Consider allocating $150 towards emergency savings!"
  );
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    {
      label: "Analyze Spending",
      reply: "Analyzed 42 transactions: Utilities and Subscriptions are on track. Weekend dining accounts for 62% of discretionary spend.",
    },
    {
      label: "Save $200 Fast",
      reply: "Automated Strategy: Pausing 2 unused subscriptions + dining in twice this week yields $214 in projected savings.",
    },
    {
      label: "Tax Deductions",
      reply: "Found 6 work-related receipts scanned with ML Kit OCR eligible for itemized tax filing.",
    },
  ];

  const handlePromptClick = (reply: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setCoachResponse(reply);
      setIsTyping(false);
    }, 300);
  };

  return (
    <div className="relative mx-auto w-full max-w-[320px] rounded-[42px] border-[5px] border-gray-800 bg-black p-3.5 shadow-2xl device-shadow-emerald">
      {/* Device speaker & camera pill */}
      <div className="absolute left-1/2 top-3 z-20 flex h-4 w-28 -translate-x-1/2 items-center justify-center rounded-full bg-gray-900 border border-gray-800">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 mr-2" />
        <div className="h-1 w-8 rounded-full bg-gray-700" />
      </div>

      {/* Screen Content */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-gray-950 via-zinc-900 to-black p-4 pt-7 text-white select-none">
        {/* Status bar */}
        <div className="mb-2 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Material 3
            </span>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950/70 via-gray-900 to-gray-950 p-3.5 border border-emerald-800/40 mb-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Total Net Balance</span>
            <span className="text-emerald-400 text-[10px] font-mono bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-700/50">
              +14.2% MoM
            </span>
          </div>
          <div className="mt-1 text-2xl font-black tracking-tight text-white font-mono">
            $4,850.20
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[10px] pt-2 border-t border-gray-800/80">
            <span className="text-emerald-400 font-semibold">Income: +$3,420</span>
            <span className="text-rose-400 font-semibold">Expense: -$1,410</span>
          </div>
        </div>

        {/* Sub-Feature Toggles */}
        <div className="mb-2.5 flex gap-1 rounded-xl bg-gray-900/90 p-1 border border-gray-800 text-[10px]">
          <button
            onClick={() => setActiveTab("coach")}
            className={`flex-1 rounded-lg py-1.5 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "coach"
                ? "bg-emerald-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FaRobot /> Gemini AI Coach
          </button>
          <button
            onClick={() => setActiveTab("ocr")}
            className={`flex-1 rounded-lg py-1.5 font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "ocr"
                ? "bg-emerald-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FaBolt /> ML Kit OCR
          </button>
        </div>

        {/* Tab 1: Gemini AI Coach */}
        {activeTab === "coach" && (
          <div className="space-y-2.5">
            <div className="rounded-xl bg-gray-900/90 p-3 border border-emerald-900/50 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <HiSparkles className="animate-spin text-sm" /> Gemini AI Insight
              </div>
              <p className={`text-gray-300 transition-opacity ${isTyping ? "opacity-40" : "opacity-100"}`}>
                {coachResponse}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-mono">Ask Coach:</span>
              <div className="flex flex-wrap gap-1">
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(p.reply)}
                    className="text-[9px] bg-gray-900 hover:bg-emerald-950 text-emerald-300 border border-emerald-900/40 px-2 py-1 rounded-md transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ML Kit Receipt Scanner */}
        {activeTab === "ocr" && (
          <div className="relative rounded-xl bg-gray-900/90 p-3 border border-emerald-900/50 text-[11px] overflow-hidden">
            {/* Animated Laser Scan line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-scanbeam pointer-events-none" />

            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2 font-mono">
              <span>SCANNING RECEIPT #049</span>
              <span className="text-emerald-400">ML Kit On-Device</span>
            </div>

            <div className="space-y-1.5 font-mono text-[10px] bg-black/60 p-2 rounded-lg border border-gray-800">
              <div className="flex justify-between text-gray-300">
                <span>WHOLE FOODS MKT</span>
                <span>$42.50</span>
              </div>
              <div className="text-[9px] text-gray-500">2026-11-12 14:22:04 • OCR Confidence: 99.4%</div>
              <div className="h-px bg-gray-800 my-1" />
              <div className="flex justify-between text-emerald-300 text-[10px] font-bold">
                <span>Status</span>
                <span>Auto-categorized: Groceries</span>
              </div>
            </div>

            <div className="mt-2 text-[9px] text-gray-400 text-center font-mono">
              Offline-first Room DB Sync • Google Drive Backup
            </div>
          </div>
        )}

        {/* Footer info inside device */}
        <div className="mt-3 flex items-center justify-between pt-1 border-t border-gray-800/60 text-[9px] text-gray-500 font-mono">
          <span>7K+ LOC • 20+ Screens</span>
          <span className="text-emerald-400">Play Billing Active</span>
        </div>
      </div>
    </div>
  );
}

// --- 3. INTERACTIVE MOCKUP: INDUSTRIAL AI SAFETY ECOSYSTEM (DMAISE Edge AI) ---
function IndustrialAiConsole() {
  const [telemetryEvents, setTelemetryEvents] = useState(2840);
  const [sensorValues, setSensorValues] = useState({
    temp: 78.4,
    gas: 0.02,
    vibration: 0.14,
    anomalyScore: 3.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryEvents((prev) => prev + Math.floor(Math.random() * 8) + 2);
      setSensorValues({
        temp: Number((78.0 + Math.random() * 0.9).toFixed(1)),
        gas: Number((0.02 + Math.random() * 0.01).toFixed(3)),
        vibration: Number((0.13 + Math.random() * 0.03).toFixed(2)),
        anomalyScore: Number((3.0 + Math.random() * 0.6).toFixed(1)),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-3xl border border-sky-900/60 bg-gradient-to-b from-gray-950 via-slate-900/90 to-black p-5 shadow-2xl device-shadow">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-sky-400">
            DMAISE EDGE AI • INDUSTRIAL TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400">
          <span className="rounded bg-sky-950 px-2 py-0.5 text-sky-300 border border-sky-800/50">
            Kafka Pipeline: Live
          </span>
          <span className="rounded bg-gray-800 px-2 py-0.5 text-emerald-400">
            WebSocket Sync: OK
          </span>
        </div>
      </div>

      {/* Sensor Metric Grid */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-gray-900/90 p-3 border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono">Reactor Temperature</div>
          <div className="text-xl font-black font-mono text-white mt-1">{sensorValues.temp}°C</div>
          <div className="text-[9px] text-emerald-400 mt-1">Normal Range [65-85°C]</div>
        </div>

        <div className="rounded-xl bg-gray-900/90 p-3 border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono">Gas Level (VOC)</div>
          <div className="text-xl font-black font-mono text-white mt-1">{sensorValues.gas} ppm</div>
          <div className="text-[9px] text-emerald-400 mt-1">Threshold: &lt; 0.50 ppm</div>
        </div>

        <div className="rounded-xl bg-gray-900/90 p-3 border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono">Vibration Velocity</div>
          <div className="text-xl font-black font-mono text-white mt-1">{sensorValues.vibration} mm/s</div>
          <div className="text-[9px] text-emerald-400 mt-1">Zero Harmonic Resonance</div>
        </div>

        <div className="rounded-xl bg-gray-900/90 p-3 border border-sky-800/40">
          <div className="text-[10px] text-sky-300 font-mono flex items-center gap-1">
            <HiSparkles /> LangChain4j Score
          </div>
          <div className="text-xl font-black font-mono text-cyan-300 mt-1">
            {sensorValues.anomalyScore}%
          </div>
          <div className="text-[9px] text-emerald-400 mt-1">Safe • LLM Anomaly Check</div>
        </div>
      </div>

      {/* Live Pipeline Telemetry Log */}
      <div className="mt-4 rounded-xl bg-black/80 p-3.5 border border-gray-800 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-800 pb-2 mb-2">
          <span className="flex items-center gap-1.5 text-sky-400">
            <FaBolt /> Stream: {telemetryEvents.toLocaleString()} events/sec
          </span>
          <span className="text-gray-500">Latency: 16ms (Prometheus)</span>
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="text-gray-300">
            <span className="text-cyan-400">[KAFKA-CONSUMER-01]</span> Partition #3 assigned. 128 sensor frames dispatched to LangChain4j executor.
          </div>
          <div className="text-gray-400">
            <span className="text-emerald-400">[WEBSOCKET-BROADCAST]</span> Companion Android app synchronized via JWT token.
          </div>
          <div className="text-gray-500 text-[10px]">
            <span className="text-purple-400">[DOCKER]</span> 6 containers running (Spring Boot, Postgres, Redis, Kafka, Prometheus, Grafana).
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PORTFOLIO COMPONENT ---
export default function Portfolio() {
  const heroRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [projectTab, setProjectTab] = useState<"all" | "android" | "backend">("all");

  useEffect(() => {
    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      // 1. HERO SEQUENCE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=1600",
          scrub: 1,
          pin: true,
        },
      });

      tl.to(".hero-name", { opacity: 1, y: 0, duration: 2 })
        .to(".hero-name", { scale: 0.85, y: -40, duration: 1.5 }, "+=0.5")
        .to(".hero-role", { opacity: 1, y: 0, duration: 1.5 }, "<")
        .to(".hero-stats", { opacity: 1, y: 0, duration: 1.5 }, "+=0.3")
        .to(".hero-content", { opacity: 1, y: 0, duration: 1.5 }, "<");

      // 2. SECTION REVEALS
      const sections = gsap.utils.toArray(".reveal-section") as HTMLElement[];
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 3. PARALLAX TECH BACKGROUND
      gsap.to(".parallax-bg", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, mainRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="relative min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* --- Parallax Background --- */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-30">
        <div className="parallax-bg w-full h-[120%] relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/background.jpg`}
            alt="Tech Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
      </div>

      {/* --- HERO SECTION (Pinned GSAP Timeline) --- */}
      <section
        ref={heroRef}
        className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      >
        {/* Step 1: Name */}
        <h1 className="hero-name text-6xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-600 opacity-0 translate-y-20 tracking-tight">
          Kunal
        </h1>

        {/* Step 2: Role */}
        <h2 className="hero-role text-xl md:text-3xl font-semibold tracking-widest mt-3 text-gray-200 opacity-0 translate-y-20 flex items-center justify-center gap-2">
          <span>ANDROID &amp; BACKEND SOFTWARE ENGINEER</span>
        </h2>

        {/* Step 3: Key Stats Strip */}
        <div className="hero-stats opacity-0 translate-y-16 mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full px-2">
          <div className="rounded-xl bg-gray-900/80 p-3 border border-cyan-500/30 backdrop-blur-md">
            <div className="text-2xl font-black text-cyan-400 font-mono">2 Apps</div>
            <div className="text-xs text-gray-400">Live on Google Play</div>
          </div>
          <div className="rounded-xl bg-gray-900/80 p-3 border border-sky-500/30 backdrop-blur-md">
            <div className="text-2xl font-black text-sky-400 font-mono">1,000+</div>
            <div className="text-xs text-gray-400">Production Screens</div>
          </div>
          <div className="rounded-xl bg-gray-900/80 p-3 border border-emerald-500/30 backdrop-blur-md">
            <div className="text-2xl font-black text-emerald-400 font-mono">99.9%</div>
            <div className="text-xs text-gray-400">Uptime Media Players</div>
          </div>
          <div className="rounded-xl bg-gray-900/80 p-3 border border-purple-500/30 backdrop-blur-md">
            <div className="text-2xl font-black text-purple-400 font-mono">98%</div>
            <div className="text-xs text-gray-400">Ad Fill Rate (Kotlin)</div>
          </div>
        </div>

        {/* Step 4: Hero Content & CTAs */}
        <div className="hero-content opacity-0 translate-y-16 mt-8 flex flex-col items-center gap-5 max-w-2xl">
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Specializing in <span className="text-cyan-400 font-semibold">Kotlin &amp; Jetpack Compose</span> for modern Android apps, paired with resilient, low-latency <span className="text-sky-400 font-semibold">Java, Spring Boot &amp; Cloud</span> backends.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects"
              className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)] hover:shadow-[0_0_30px_rgba(8,145,178,0.8)] text-sm flex items-center gap-2"
            >
              <FaMobileAlt /> Explore Live Apps
            </a>
            <a
              href="https://github.com/giant-nova"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold transition-all text-sm flex items-center gap-2"
            >
              <FaGithub /> GitHub Profile
            </a>
            <a
              href="mailto:kunal.sde.in@gmail.com"
              className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-800/60 font-semibold transition-all text-sm flex items-center gap-2"
            >
              <FaEnvelope /> Get In Touch
            </a>
          </div>

          <div className="mt-4 animate-bounce text-gray-500">
            <span className="text-xs uppercase tracking-widest font-mono">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto pb-24 space-y-32">
        {/* --- 2. ABOUT ME & EDUCATION --- */}
        <section className="reveal-section flex flex-col lg:flex-row gap-12 items-center pt-16">
          <div className="w-full lg:w-5/12">
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/profile.jpg`}
                alt="Kunal"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-gray-800 text-xs">
                <div className="font-bold text-cyan-400">Kunal • Software Engineer</div>
                <div className="text-gray-400 font-mono">SDE-1 @ JustBaat Mediatech | B.E. IT 2025</div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black border-l-4 border-cyan-500 pl-4">
              About <span className="text-cyan-400">Me</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Android developer with nearly 2 years of engineering experience and two live apps on Google Play. Currently building and scaling VisionPlay DOOH player applications across Android, Windows, Linux, and Samsung Tizen OS running on <strong className="text-white">1,000+ production screens</strong> with distributed control and 99.9% uptime.
            </p>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Equally experienced in backend architecture: engineered real-time Firebase multiplayer systems, Kafka-driven AI edge telemetry in Spring Boot, and optimized high-throughput PostgreSQL queries handling 1M+ records.
            </p>

            {/* Education Badge */}
            <div className="rounded-2xl bg-gray-900/90 border border-gray-800 p-5 mt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-950 p-3 text-cyan-400 border border-cyan-800/60">
                  <FaAward className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Bachelor of Engineering in Information Technology (2021 – 2025)
                  </h4>
                  <p className="text-sm text-cyan-400">
                    University Institute of Engineering and Technology, Panjab University • Chandigarh, India
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Coursework: Software Engineering, Data Structures &amp; Algorithms, DBMS, OOP, AI/ML, Network Security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. TECHNICAL SKILLS GRID --- */}
        <section className="reveal-section">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black">
              Technical <span className="text-cyan-400">Arsenal</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
              Production-tested technologies across modern mobile client development, distributed backend microservices, and AI integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Group 1: Android & Mobile */}
            <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-5 hover:border-cyan-500 transition-all">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold mb-4 text-base">
                <FaAndroid className="text-2xl" /> Android &amp; Mobile
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <SiKotlin className="text-purple-400" /> Kotlin &amp; Coroutines
                </li>
                <li className="flex items-center gap-2">
                  <FaMobileAlt className="text-cyan-400" /> Jetpack Compose &amp; M3
                </li>
                <li className="flex items-center gap-2">
                  <FaBolt className="text-yellow-400" /> MVVM &amp; UDF Architecture
                </li>
                <li className="flex items-center gap-2">
                  <FaDatabase className="text-blue-400" /> Room Database (Offline-first)
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" /> Android Studio &amp; Play Console
                </li>
              </ul>
            </div>

            {/* Group 2: Backend & Distributed */}
            <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-5 hover:border-sky-500 transition-all">
              <div className="flex items-center gap-2.5 text-sky-400 font-bold mb-4 text-base">
                <FaServer className="text-2xl" /> Backend &amp; Cloud
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <SiSpringboot className="text-green-400" /> Spring Boot (Java)
                </li>
                <li className="flex items-center gap-2">
                  <SiPostgresql className="text-blue-400" /> PostgreSQL &amp; Cursor Functions
                </li>
                <li className="flex items-center gap-2">
                  <SiRedis className="text-red-400" /> Redis Cache &amp; PubSub
                </li>
                <li className="flex items-center gap-2">
                  <SiApachekafka className="text-orange-400" /> Apache Kafka Event Streaming
                </li>
                <li className="flex items-center gap-2">
                  <SiDocker className="text-sky-400" /> Docker, AWS EC2, GCP
                </li>
              </ul>
            </div>

            {/* Group 3: Firebase & Google Services */}
            <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-5 hover:border-amber-500 transition-all">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold mb-4 text-base">
                <SiFirebase className="text-2xl" /> Firebase &amp; Google Services
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <FaBolt className="text-amber-400" /> Firebase Realtime Database
                </li>
                <li className="flex items-center gap-2">
                  <FaShieldAlt className="text-blue-400" /> Firebase Remote Config &amp; Rules
                </li>
                <li className="flex items-center gap-2">
                  <FaRobot className="text-emerald-400" /> ML Kit On-Device OCR
                </li>
                <li className="flex items-center gap-2">
                  <FaGooglePlay className="text-green-400" /> Google Play Billing &amp; AdMob
                </li>
                <li className="flex items-center gap-2">
                  <FaChartLine className="text-purple-400" /> GAM ADX &amp; OAuth 2.0 Drive Sync
                </li>
              </ul>
            </div>

            {/* Group 4: AI & Modern Tooling */}
            <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-5 hover:border-purple-500 transition-all">
              <div className="flex items-center gap-2.5 text-purple-400 font-bold mb-4 text-base">
                <HiSparkles className="text-2xl" /> AI &amp; Observability
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <HiSparkles className="text-cyan-400" /> Gemini AI &amp; LangChain4j
                </li>
                <li className="flex items-center gap-2">
                  <SiPrometheus className="text-orange-400" /> Prometheus Latency Metrics
                </li>
                <li className="flex items-center gap-2">
                  <SiGrafana className="text-yellow-400" /> Grafana Dashboard Monitoring
                </li>
                <li className="flex items-center gap-2">
                  <FaBolt className="text-emerald-400" /> Spotify Ruler Build Optimizer
                </li>
                <li className="flex items-center gap-2">
                  <FaGithub className="text-gray-300" /> Git, Maven, Claude Code
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- 4. WORK EXPERIENCE TIMELINE --- */}
        <section className="reveal-section">
          <h2 className="text-3xl md:text-4xl font-black mb-12 border-l-4 border-cyan-500 pl-4">
            Professional <span className="text-cyan-400">Experience</span>
          </h2>

          <div className="relative border-l-2 border-gray-800 ml-4 space-y-12 pl-6">
            {/* Role 1: JustBaat */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-cyan-500 shadow-[0_0_12px_#06b6d4]" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  SDE-1 <span className="text-cyan-400 font-normal">@ JustBaat Mediatech Pvt. Ltd.</span>
                </h3>
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-800/50">
                  Jan 2026 – Present • Gurugram, Haryana
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1 mb-3">
                Architecting and scaling DOOH VisionPlay media players &amp; high-volume monetization infrastructure.
              </p>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 leading-relaxed">
                <li>
                  Built and scaled <strong className="text-white">VisionPlay DOOH player apps</strong> across Android, Windows, Linux, and Samsung Tizen OS, running on <strong className="text-cyan-300">1,000+ screens</strong> with distributed control.
                </li>
                <li>
                  Engineered fault-tolerant player architecture, eliminating black-screen downtime and maintaining <strong className="text-emerald-400">99.9% uptime</strong> with live CMS synchronization.
                </li>
                <li>
                  Developed ad monetization stack in Kotlin (SDK bidding and mediation adapters for AdMob and GAM ADX), raising fill rates to <strong className="text-cyan-300">98%</strong> and revenue by up to <strong className="text-cyan-300">60%</strong>.
                </li>
                <li>
                  Built remote deployment with auto-update for media players, enabling zero-downtime rollouts and saving 1–2 hours of manual maintenance.
                </li>
              </ul>
            </div>

            {/* Role 2: Acontway */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-gray-600" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  SDE-1 <span className="text-gray-400 font-normal">@ Acontway Technologies Pvt. Ltd.</span>
                </h3>
                <span className="text-xs font-mono bg-gray-900 text-gray-400 px-2.5 py-1 rounded-full border border-gray-800">
                  Apr 2025 – Dec 2025 • Mohali, Punjab
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-mono mb-3">Promoted from SDE Intern</p>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 leading-relaxed">
                <li>
                  Led <strong className="text-white">Acont AI</strong>, an automated financial audit SaaS platform, cutting manual audit effort by <strong className="text-cyan-300">80%</strong>.
                </li>
                <li>
                  Migrated platform from single-tenant to multi-tenant with real-time company switching, cutting PostgreSQL query latency by <strong className="text-cyan-300">40%</strong>.
                </li>
                <li>
                  Cut PDF generation from 120s to 20s (<strong className="text-emerald-400">85% faster</strong>), reached 99.9% success on 500MB+ file uploads, and integrated OTP-based authentication.
                </li>
              </ul>
            </div>

            {/* Role 3: InnovateLogic */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-gray-700" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  Backend Developer Intern <span className="text-gray-400 font-normal">@ InnovateLogic Company Pvt. Ltd.</span>
                </h3>
                <span className="text-xs font-mono bg-gray-900 text-gray-400 px-2.5 py-1 rounded-full border border-gray-800">
                  Jan 2025 – Mar 2025 • Mohali, Punjab
                </span>
              </div>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 leading-relaxed mt-3">
                <li>
                  Rewrote slow PostgreSQL queries as cursor functions (<strong className="text-cyan-300">30–40% faster</strong>).
                </li>
                <li>
                  Rebuilt Excel export engine to process <strong className="text-white">1M+ records in under 30 seconds</strong> instead of 3–4 minutes.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- 5. FEATURED PROJECTS SECTION --- */}
        <section id="projects" className="reveal-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black border-l-4 border-cyan-500 pl-4">
                Featured <span className="text-cyan-400">Projects</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xl pl-5">
                Explore interactive live mockups of production Android apps on Google Play and enterprise AI edge systems.
              </p>
            </div>

            {/* Tab Filter */}
            <div className="flex gap-2 bg-gray-900/90 p-1.5 rounded-xl border border-gray-800 text-xs">
              <button
                onClick={() => setProjectTab("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  projectTab === "all" ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setProjectTab("android")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  projectTab === "android" ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                <FaGooglePlay className="text-[10px]" /> Live Android Apps
              </button>
              <button
                onClick={() => setProjectTab("backend")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  projectTab === "backend" ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                <FaServer className="text-[10px]" /> Cloud &amp; AI Systems
              </button>
            </div>
          </div>

          <div className="space-y-20">
            {/* PROJECT 1: XO RUSH (Google Play Live App with Playable Phone Mockup) */}
            {(projectTab === "all" || projectTab === "android") && (
              <div className="rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-gray-800 p-6 md:p-10 hover:border-cyan-500/60 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Left: Info */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 text-xs text-emerald-300 font-bold">
                      <FaGooglePlay /> LIVE ON GOOGLE PLAY STORE
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white">
                      XO Rush: 2 Player Tic Tac Toe
                    </h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                      Architected a 5-module, 100% Jetpack Compose multiplayer game powered by Kotlin Coroutines, Unidirectional Data Flow (UDF), and a custom-themed cyberpunk design system.
                    </p>

                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                        <span><strong>Serverless Real-time Multiplayer:</strong> Powered by Firebase Realtime DB with custom security rules and disconnect grace handling.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                        <span><strong>Minimax with Alpha-Beta Pruning:</strong> Engineered algorithmic AI for optimal N×N decision-making.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                        <span><strong>Dynamic Monetization:</strong> 38-placement ad pipeline managed entirely via Firebase Remote Config.</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {["Kotlin", "Jetpack Compose", "Coroutines", "Firebase Realtime DB", "Remote Config", "Minimax AI", "UDF Architecture"].map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-900 text-cyan-300 px-3 py-1 rounded-lg border border-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-3">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.giantnovadevs.tictactoe"
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] text-sm flex items-center gap-2"
                      >
                        <FaGooglePlay /> Get on Google Play
                      </a>
                    </div>
                  </div>

                  {/* Right: Live Interactive Phone Mockup */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="text-xs text-gray-400 font-mono mb-2 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      Interactive Live Preview (Tap to play!)
                    </div>
                    <XORushMockup />
                  </div>
                </div>
              </div>
            )}

            {/* PROJECT 2: MYSA MONEY (Google Play Live App with Financial & ML Kit Mockup) */}
            {(projectTab === "all" || projectTab === "android") && (
              <div className="rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-gray-800 p-6 md:p-10 hover:border-emerald-500/60 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Left: Info */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 text-xs text-emerald-300 font-bold">
                      <FaGooglePlay /> LIVE ON GOOGLE PLAY STORE
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white">
                      Mysa Money: AI Expense Tracker
                    </h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                      An offline-first personal finance platform built with Kotlin, Jetpack Compose Material 3, MVVM, and Room DB (7K+ LOC, 20+ screens, 10 ViewModels, and 6 DB entities).
                    </p>

                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
                        <span><strong>Gemini AI Financial Coach:</strong> Personalized spending advice, automated savings strategies, and smart budget forecasting.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
                        <span><strong>ML Kit On-Device OCR:</strong> Instant optical receipt scanning for automated transaction categorization without latency.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
                        <span><strong>Google Play Billing &amp; AdMob:</strong> Freemium subscription layer with cloud backup via OAuth 2.0 and Google Drive API.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
                        <span><strong>Spotify Ruler &amp; iText PDF:</strong> Release build size optimization and formatted PDF financial statement exports.</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {["Kotlin", "Jetpack Compose", "Material 3", "Room (MVVM)", "Gemini AI", "ML Kit OCR", "Google Play Billing", "Spotify Ruler"].map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-900 text-emerald-300 px-3 py-1 rounded-lg border border-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-3">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.giantnovadevs.mysamoney"
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] text-sm flex items-center gap-2"
                      >
                        <FaGooglePlay /> Get on Google Play
                      </a>
                      <a
                        href="https://github.com/giant-nova/Mysa-Money.git"
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold transition-all text-sm flex items-center gap-2"
                      >
                        <FaGithub /> Source Code
                      </a>
                    </div>
                  </div>

                  {/* Right: Live Interactive Phone Mockup */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="text-xs text-gray-400 font-mono mb-2 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Material 3 Preview (Interactive)
                    </div>
                    <MysaMoneyMockup />
                  </div>
                </div>
              </div>
            )}

            {/* PROJECT 3: AI-DRIVEN INDUSTRIAL SAFETY ECOSYSTEM (Requested New Project) */}
            {(projectTab === "all" || projectTab === "backend") && (
              <div className="rounded-3xl bg-gradient-to-br from-gray-950 via-slate-900/90 to-black border border-gray-800 p-6 md:p-10 hover:border-sky-500/60 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-950/80 border border-sky-700/60 px-3 py-1 text-xs text-sky-300 font-bold">
                      <FaServer /> DISTRIBUTED SYSTEM &amp; EDGE AI
                    </div>
                    <a
                      href="https://github.com/giant-nova/Java-DMAISE-edge-AI"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2 rounded-full bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-800/60 font-semibold text-xs flex items-center gap-2 transition-all"
                    >
                      <FaGithub /> View on GitHub <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  </div>

                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white">
                      AI-Driven Industrial Safety Ecosystem (DMAISE Edge AI)
                    </h3>
                    <p className="text-cyan-400 font-mono text-sm mt-1">
                      Spring Boot • Apache Kafka • LangChain4j / Gemini • PostgreSQL • Redis • Prometheus &amp; Grafana • Companion Android App
                    </p>
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed">
                    Engineered an enterprise AI safety platform using Java/Spring Boot, Apache Kafka, and LangChain4j/Gemini for real-time anomaly detection, hazard forecasting, and instant emergency dispatch across industrial edge nodes.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div className="rounded-2xl bg-gray-900/80 p-4 border border-gray-800">
                      <div className="font-bold text-sky-400 mb-1 flex items-center gap-2">
                        <FaBolt /> Real-Time Telemetry Pipeline
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        High-throughput Apache Kafka event ingestion streaming sensor frames into LangChain4j for sub-second anomaly detection and score generation.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-900/80 p-4 border border-gray-800">
                      <div className="font-bold text-cyan-400 mb-1 flex items-center gap-2">
                        <FaShieldAlt /> Secure Notifications &amp; Mobile
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        JWT-secured real-time notification pipeline utilizing WebSockets and Firebase Cloud Messaging (FCM) synced with a companion native Android application.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-900/80 p-4 border border-gray-800">
                      <div className="font-bold text-purple-400 mb-1 flex items-center gap-2">
                        <FaChartLine /> Containerization &amp; Metrics
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Full Docker stack orchestration with deep observability instrumented via Prometheus and Grafana for tracking AI inference latency and LLM token errors.
                      </p>
                    </div>
                  </div>

                  {/* Live Simulation Console */}
                  <div className="pt-2">
                    <IndustrialAiConsole />
                  </div>
                </div>
              </div>
            )}

            {/* PROJECT 4: RETAIL INVENTORY & BILLING (Windows Desktop & Spring Boot) */}
            {(projectTab === "all" || projectTab === "backend") && (
              <div className="rounded-3xl bg-gray-900/60 border border-gray-800 p-6 md:p-8 hover:border-gray-700 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Retail Inventory &amp; GST Billing System (Windows Desktop App)
                    </h3>
                    <p className="text-gray-400 text-xs font-mono mt-1">
                      Java • Spring Boot • JavaFX • FXML • Jasper Reports • SQLite • jpackage
                    </p>
                  </div>
                  <a
                    href="https://github.com/giant-nova/java-desktop.git"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <FaGithub /> GitHub Repository
                  </a>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Engineered a standalone desktop ERP system pairing a Spring Boot / SQLite backend with an interactive JavaFX FXML client. Automated GST invoice generation with custom Jasper Reports templates and bundled code into an executable Windows installer (.exe) via jpackage.
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Java", "Spring Boot", "JavaFX", "Jasper Reports", "SQLite", "jpackage"].map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-950 text-gray-300 px-2.5 py-1 rounded-md border border-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* --- FOOTER & CONTACT SECTION --- */}
      <footer className="relative z-10 bg-gray-950 border-t border-gray-800 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/80 border border-cyan-700/60 px-4 py-1.5 text-xs text-cyan-300 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            OPEN FOR NEW OPPORTUNITIES
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white">
            Let&apos;s Build Something <span className="text-cyan-400">Extraordinary</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Looking for an Android (Kotlin / Jetpack Compose) or Java / Spring Boot Backend engineer with proven production deployments? Let&apos;s talk!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="mailto:kunal.sde.in@gmail.com"
              className="px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] flex items-center gap-2 text-sm"
            >
              <FaEnvelope /> kunal.sde.in@gmail.com
            </a>
            <a
              href="tel:+918604329827"
              className="px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold transition-all flex items-center gap-2 text-sm"
            >
              <FaPhoneAlt /> +91 8604329827
            </a>
            <a
              href="https://linkedin.com/in/kunal-sde-in/"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-800/60 font-semibold transition-all flex items-center gap-2 text-sm"
            >
              <FaLinkedin /> LinkedIn Profile
            </a>
          </div>

          <div className="pt-8 border-t border-gray-900 text-xs text-gray-500 font-mono">
            Designed &amp; Developed with Next.js, Tailwind CSS &amp; GSAP • Hosted on Firebase
          </div>
        </div>
      </footer>
    </main>
  );
}
