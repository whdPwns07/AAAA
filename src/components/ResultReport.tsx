import React, { useState } from "react";
import { CompatibilityResult } from "../types";

interface ResultReportProps {
  myMbti: string;
  myChatStyle: string;
  myKeywords: string[];
  crushMbti: string;
  crushChatStyle: string;
  crushKeywords: string[];
  result: CompatibilityResult;
  onReset: () => void;
}

export default function ResultReport({
  myMbti,
  myChatStyle,
  myKeywords,
  crushMbti,
  crushChatStyle,
  crushKeywords,
  result,
  onReset,
}: ResultReportProps) {
  const [copied, setCopied] = useState(false);

  // Generate a random ID or format one based on local date
  const reportId = `VN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleShare = () => {
    const textToCopy = `[❤️ LOVE NAVIGATOR AI 연애 진단 보고서]
💌 연애 성공 확률: ${result.successRate}%
🧩 한줄 성향 Stitch: ${result.personalityStitch}
⚠️ 첫 데이트 갈등 스팟: ${result.conflictSpot}
🔮 미래 스포일러 예측: ${result.futureSpoiler}
우리 둘의 MBTI 조합 (${myMbti} × ${crushMbti})의 진단결과입니다. 지금 확인해 보세요!`;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
        alert("진단 결과를 복사했습니다!\n\n" + textToCopy);
      });
  };

  const statusExplanation =
    result.successRate > 85
      ? "축복받은 환상종의 케미: 연애 개시 99% 근접"
      : result.successRate > 70
      ? "데이터 최적화 완료: 가능성 매우 높음"
      : result.successRate > 50
      ? "긍정적 궤도 진입: 사소한 티키타카 필요"
      : "조심스러운 탐색 단계: 빌드업 시작 타임";

  return (
    <div id="result_report_main" className="space-y-gutter relative max-w-lg mx-auto">
      {/* Dynamic Toast for Copy/Share Confirmation */}
      {copied && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-black font-body-md text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(255,177,195,0.6)] animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>진단 결과가 클립보드로 전송되었습니다! 공유해 보세요.</span>
        </div>
      )}

      {/* Main Result Card */}
      <section className="glass-card rounded-xl p-md relative overflow-hidden border border-white/10 shadow-lg">
        {/* Blinking Scanning Line */}
        <div className="absolute top-0 left-0 w-full scanning-line"></div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <span className="font-label-md text-xs text-primary font-bold tracking-widest uppercase">
              ANALYSIS COMPLETE
            </span>
          </div>
          <span className="font-label-sm text-[11px] text-on-surface-variant opacity-60 font-mono">
            ID: #{reportId}
          </span>
        </div>

        <div className="text-center py-base">
          <h2 className="font-headline-lg-mobile text-xl text-on-surface-variant/90 leading-tight mb-2 font-black flex items-center justify-center gap-1.5">
            ❤️ 연애 성공 확률
          </h2>
          <div className="text-[72px] font-black text-primary neon-glow-pink leading-none tracking-tighter my-3">
            {result.successRate}%
          </div>
          <p className="font-label-md text-sm text-on-surface-variant/90 font-bold bg-white/[0.03] border border-white/5 inline-block px-4 py-1.5 rounded-full mt-2">
            "{statusExplanation}"
          </p>
        </div>

        {/* Dynamic Progress Indicator Bars */}
        <div className="mt-8 grid grid-cols-2 gap-sm">
          <div className="p-base p-3 rounded-lg bg-white/5 border border-white/10 shadow-inner">
            <span className="font-label-sm text-xs text-on-surface-variant/70 block mb-1 font-mono">
              안정성 지수 (Stability)
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary transition-all duration-1000"
                  style={{ width: `${result.stabilityIndex}%` }}
                ></div>
              </div>
              <span className="text-xs text-tertiary font-bold font-mono">
                {result.stabilityIndex}%
              </span>
            </div>
          </div>
          <div className="p-base p-3 rounded-lg bg-white/5 border border-white/10 shadow-inner">
            <span className="font-label-sm text-xs text-on-surface-variant/70 block mb-1 font-mono">
              도파민 지수 (Excitement)
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${result.dopamineIndex}%` }}
                ></div>
              </div>
              <span className="text-xs text-primary font-bold font-mono">
                {result.dopamineIndex}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Input Metadata summary overview */}
      <section className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs flex justify-between items-center text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-primary-container/10 border border-primary/20 text-primary font-bold">
            YOU ({myMbti})
          </span>
          <span className="opacity-50">×</span>
          <span className="px-2 py-0.5 rounded bg-secondary-container/10 border border-secondary/20 text-secondary font-bold">
            CRUSH ({crushMbti})
          </span>
        </div>
        <div className="text-[10px] text-on-surface-variant/60 font-mono">
          Dynamic Matching Algorithm
        </div>
      </section>

      {/* Personality Stitch Section */}
      <section className="glass-card rounded-xl p-6 border border-white/10 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shadow-sm">
            🧩
          </div>
          <h3 className="font-headline-lg-mobile text-lg text-white font-black">
            한줄 성향 Stitch
          </h3>
        </div>
        <div className="p-4 rounded-xl bg-primary-container/10 border border-primary/20 shadow-inner">
          <p className="font-body-lg text-base text-primary font-black leading-relaxed">
            "{result.personalityStitch}"
          </p>
        </div>
      </section>

      {/* Conflict Spot Section */}
      <section className="glass-card rounded-xl p-6 border border-white/10 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-lg shadow-sm">
            ⚠️
          </div>
          <h3 className="font-headline-lg-mobile text-lg text-white font-black">
            첫 데이트 싸움 스팟
          </h3>
        </div>
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl shadow-inner space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="font-label-md text-[10px] text-error px-2 py-0.5 rounded border border-error/30 h-fit font-bold font-mono">
              DANGER
            </span>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {result.conflictSpot}
            </p>
          </div>
        </div>
      </section>

      {/* Future Spoiler Section */}
      <section className="glass-card rounded-xl p-6 border border-white/10 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-lg shadow-sm">
            🔮
          </div>
          <h3 className="font-headline-lg-mobile text-lg text-white font-black">
            미래 스포일러
          </h3>
        </div>
        <div className="p-4 bg-secondary-container/10 border border-secondary/20 rounded-xl shadow-inner">
          <p className="font-body-md text-sm text-on-surface leading-relaxed">
            {result.futureSpoiler}
          </p>
        </div>
      </section>

      {/* Analysis Tags */}
      <div id="result_chips" className="flex flex-wrap gap-2 pt-2">
        {result.tags && result.tags.map((tag, idx) => {
          // Alternative chip coloring
          const colors = [
            "bg-primary/20 border-primary/30 text-primary",
            "bg-secondary/20 border-secondary/30 text-secondary",
            "bg-tertiary/20 border-tertiary/30 text-tertiary"
          ];
          const chosenColor = colors[idx % colors.length];
          return (
            <span
              key={tag}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${chosenColor} font-mono`}
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div id="result_actions" className="grid grid-cols-2 gap-4 pt-6">
        <button
          onClick={handleShare}
          className="neumorphic-btn h-14 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(255,75,137,0.3)] bg-gradient-to-r from-primary-container to-secondary-container"
        >
          <span className="material-symbols-outlined text-base">share</span>
          결과 공유하기
        </button>
        <button
          onClick={onReset}
          className="h-14 rounded-xl border border-white/10 glass-card font-bold text-sm text-white flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          다시 분석하기
        </button>
      </div>
    </div>
  );
}
