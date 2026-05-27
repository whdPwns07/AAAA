import React, { useState, useEffect } from "react";
import { LoveScan, UserProfile, CompatibilityResult } from "./types";
import ScanForm from "./components/ScanForm";
import ResultReport from "./components/ResultReport";
import HistoryList from "./components/HistoryList";
import ProfileSettings from "./components/ProfileSettings";

const DEFAULT_PROFILE: UserProfile = {
  name: "연애 탐험가",
  mbti: "INFJ",
  chatStyle: "리액션이 많고 부드러운 말투",
  keywords: ["맛집", "코딩"],
  vibe: "직진하는 불도저 (Straight Bulldozer)",
  emoji: "🦄",
};

// Seed exact sample data from the user screenshot
const SCREENSHOT_COMPATIBILITY_SAMPLE: LoveScan = {
  id: "VN-2024-X-SAMPLE",
  timestamp: new Date().toISOString(),
  myMbti: "INFJ",
  myChatStyle: "설명하는 편",
  myKeywords: ["맛집", "코딩"],
  crushMbti: "ENFP",
  crushChatStyle: "리액션 폭발",
  crushKeywords: ["강아지", "여행"],
  result: {
    successRate: 72,
    stabilityIndex: 45,
    dopamineIndex: 88,
    personalityStitch: "불도저와 유리멘탈의 아슬아슬한 만남",
    conflictSpot: "메뉴 결정 장애와 웨이팅 1시간의 콜라보. 한 명은 배고파서 예민해지고 한 명은 눈치 보느라 정신 나감.",
    futureSpoiler: "3개월 뒤, 서로의 말투가 전염되어 카톡만 보면 쌍둥이인 줄 앎. 가끔 서운함 토로하다가도 야식 메뉴 고를 땐 환상의 팀워크.",
    tags: ["#불도저직진", "#유리멘탈보호", "#야식메이트"],
  },
};

const LOADING_STEPS = [
  "두 사람의 가치관 주파수 도킹 중...",
  "채팅 톤앤매너 속도 지수 정밀 분석 중...",
  "성향 스티칭 알고리즘 가동 중...",
  "첫 갈등 시뮬레이션 및 데이터 보정 중...",
  "미래 스포일러 타임라인 렌더링 중...",
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<"scan" | "history" | "profile" | "result">("scan");
  const [scans, setScans] = useState<LoveScan[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // States for active scanning and result displays
  const [selectedScan, setSelectedScan] = useState<LoveScan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedScans = localStorage.getItem("love_scans");
      if (storedScans) {
        setScans(JSON.parse(storedScans));
      } else {
        // Pre-populate with the screenshot's sample report
        localStorage.setItem("love_scans", JSON.stringify([SCREENSHOT_COMPATIBILITY_SAMPLE]));
        setScans([SCREENSHOT_COMPATIBILITY_SAMPLE]);
      }

      const storedProfile = localStorage.getItem("user_profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (e) {
      console.error("실패: 로컬스토리지 복구 중 오류", e);
    }
  }, []);

  // Save changes to localStorage
  const saveScansToLocal = (newScans: LoveScan[]) => {
    setScans(newScans);
    localStorage.setItem("love_scans", JSON.stringify(newScans));
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
  };

  // Perform Gemini AI compatibility analysis
  const handleAnalyze = async (inputs: {
    myMbti: string;
    myChatStyle: string;
    myKeywords: string[];
    crushMbti: string;
    crushChatStyle: string;
    crushKeywords: string[];
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    // Animate custom loading steps
    let currentStep = 0;
    setLoadingMessage(LOADING_STEPS[currentStep]);
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < LOADING_STEPS.length) {
        setLoadingMessage(LOADING_STEPS[currentStep]);
      }
    }, 900);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "서버 통신 중 오류가 발생했습니다.");
      }

      const compatibilityResult: CompatibilityResult = await response.json();

      const newScanReport: LoveScan = {
        id: `VN-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...inputs,
        result: compatibilityResult,
      };

      // Save report in History & Display
      const updatedHistory = [newScanReport, ...scans];
      saveScansToLocal(updatedHistory);
      setSelectedScan(newScanReport);
      setCurrentTab("result");
    } catch (error: any) {
      console.error("AI Analysis Failed:", error);
      setAnalysisError(error.message || "AI 연애 분석 중 예상치 못한 장애가 발생했습니다.");
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  // Delete scan history
  const handleDeleteScan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("정말 이 진단 보고서 기록을 삭제하시겠습니까?")) {
      const filtered = scans.filter((s) => s.id !== id);
      saveScansToLocal(filtered);
      if (selectedScan?.id === id) {
        setSelectedScan(null);
      }
    }
  };

  const handleClearAllScans = () => {
    if (confirm("주의: 모든 연애 매칭 스캔 기록을 완전히 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다.")) {
      saveScansToLocal([]);
      setSelectedScan(null);
    }
  };

  const loadScanReport = (scan: LoveScan) => {
    setSelectedScan(scan);
    setCurrentTab("result");
  };

  // Love Navigator heart base64 logo (as in the screenshot!)
  const logoHearts = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ff4b89' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/><circle cx='12' cy='11' r='2' fill='%23d0bcff'/></svg>";

  return (
    <div className="min-h-screen bg-neutral-950 text-on-background pb-36 font-sans selection:bg-primary/20">
      {/* Top Header navbar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 z-50 flex justify-between items-center px-6">
        <div 
          onClick={() => {
            setSelectedScan(null);
            setCurrentTab("scan");
          }} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            alt="LOVE NAVIGATOR Logo"
            className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
            src={logoHearts}
          />
          <h1 className="font-headline text-[22px] font-black text-primary tracking-tighter transition-colors group-hover:text-primary-container">
            LOVE NAVIGATOR
          </h1>
        </div>

        {/* Top-right Actions info shortcuts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab("history")}
            className={`p-2 rounded-full hover:bg-white/5 transition-colors relative ${
              currentTab === "history" ? "text-primary" : "text-on-surface-variant"
            }`}
            title="스캔 기록"
          >
            <span className="material-symbols-outlined text-[22px]">history</span>
            {scans.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab("profile")}
            className={`p-2 rounded-full hover:bg-white/5 transition-colors ${
              currentTab === "profile" ? "text-primary" : "text-on-surface-variant"
            }`}
            title="내 프로필 커스텀"
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="pt-24 px-5 max-w-lg mx-auto min-h-screen">
        {/* Real-time Loader Animation State */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-6 space-y-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Spinning Pulsing Holograms */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary animate-spin duration-[8s]"></div>
              <div className="absolute inset-2 rounded-full border border-secondary animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-tertiary animate-spin duration-[4s]"></div>
              <span className="material-symbols-outlined text-4xl text-primary animate-bounce">radar</span>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-headline text-xl text-white font-bold">AI Core 연애 벡터 정밀 연산 중</h3>
              <p className="text-sm text-primary font-mono animate-pulse">{loadingMessage}</p>
            </div>
            
            <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {/* Display System Connection Errors gracefully */}
        {analysisError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-6 text-center text-sm space-y-3 relative overflow-hidden">
            <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
            <p className="font-bold text-red-200">데이터 스캔 실패</p>
            <p className="text-xs text-on-surface-variant">{analysisError}</p>
            <button
              onClick={() => setAnalysisError(null)}
              className="px-4 py-1.5 bg-red-400/20 text-red-200 text-xs rounded-full hover:bg-red-400/40 transition-all font-bold"
            >
              확인 및 재시도
            </button>
          </div>
        )}

        {/* Tab Router views rendering */}
        {(() => {
          switch (currentTab) {
            case "scan":
              return (
                <ScanForm
                  userProfile={profile}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              );
            case "result":
              return selectedScan ? (
                <ResultReport
                  myMbti={selectedScan.myMbti}
                  myChatStyle={selectedScan.myChatStyle}
                  myKeywords={selectedScan.myKeywords}
                  crushMbti={selectedScan.crushMbti}
                  crushChatStyle={selectedScan.crushChatStyle}
                  crushKeywords={selectedScan.crushKeywords}
                  result={selectedScan.result}
                  onReset={() => {
                    setSelectedScan(null);
                    setCurrentTab("scan");
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-on-surface-variant">표시할 활성 보고서가 없습니다.</p>
                  <button
                    onClick={() => setCurrentTab("scan")}
                    className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-full font-bold text-sm"
                  >
                    스캔하러 가기
                  </button>
                </div>
              );
            case "history":
              return (
                <HistoryList
                  scans={scans}
                  onSelectScan={loadScanReport}
                  onDeleteScan={handleDeleteScan}
                  onClearAll={handleClearAllScans}
                  onNavigateToScan={() => setCurrentTab("scan")}
                />
              );
            case "profile":
              return (
                <ProfileSettings
                  profile={profile}
                  onSaveProfile={handleSaveProfile}
                />
              );
            default:
              return null;
          }
        })()}
      </main>

      {/* Styled Bottom navigation bar reflecting user screenshot parameters */}
      <nav id="bottom_navigation_bar" className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-6 pt-3 bg-neutral-950/65 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.45)] rounded-t-xl max-w-lg mx-auto right-0">
        <button
          onClick={() => {
            setSelectedScan(null);
            setCurrentTab("scan");
          }}
          className={`flex flex-col items-center justify-center transition-all duration-200 ease-out py-1 px-4 cursor-pointer ${
            currentTab === "scan"
              ? "text-primary bg-primary-container/20 rounded-xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.4)] scale-95"
              : "text-on-surface-variant opacity-60 hover:opacity-100"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: currentTab === "scan" ? "'FILL' 1" : "'FILL' 0" }}>
            radar
          </span>
          <span className="font-label-sm text-[11px] font-bold mt-0.5">Scan</span>
        </button>

        <button
          onClick={() => setCurrentTab("history")}
          className={`flex flex-col items-center justify-center transition-all duration-200 ease-out py-1 px-4 cursor-pointer ${
            currentTab === "history"
              ? "text-primary bg-primary-container/20 rounded-xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.4)] scale-95"
              : "text-on-surface-variant opacity-60 hover:opacity-100"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: currentTab === "history" ? "'FILL' 1" : "'FILL' 0" }}>
            receipt_long
          </span>
          <span className="font-label-sm text-[11px] font-bold mt-0.5">History</span>
        </button>

        <button
          onClick={() => setCurrentTab("profile")}
          className={`flex flex-col items-center justify-center transition-all duration-200 ease-out py-1 px-4 cursor-pointer ${
            currentTab === "profile"
              ? "text-primary bg-primary-container/20 rounded-xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.4)] scale-95"
              : "text-on-surface-variant opacity-60 hover:opacity-100"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: currentTab === "profile" ? "'FILL' 1" : "'FILL' 0" }}>
            person
          </span>
          <span className="font-label-sm text-[11px] font-bold mt-0.5">Profile</span>
        </button>
      </nav>

      {/* Decorative ambient background lights matching design specifications */}
      <div className="fixed top-1/4 -right-24 w-72 h-72 bg-primary/10 blur-[130px] pointer-events-none -z-10 rounded-full"></div>
      <div className="fixed bottom-1/4 -left-24 w-72 h-72 bg-secondary/10 blur-[130px] pointer-events-none -z-10 rounded-full"></div>
    </div>
  );
}
