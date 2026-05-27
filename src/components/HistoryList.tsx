import React from "react";
import { LoveScan } from "../types";

interface HistoryListProps {
  scans: LoveScan[];
  onSelectScan: (scan: LoveScan) => void;
  onDeleteScan: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onNavigateToScan: () => void;
}

export default function HistoryList({
  scans,
  onSelectScan,
  onDeleteScan,
  onClearAll,
  onNavigateToScan,
}: HistoryListProps) {
  return (
    <div id="history_list_main" className="space-y-gutter max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-headline-lg-mobile text-2xl text-on-background font-black flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
            과거 스캔 기록
          </h2>
          <p className="text-xs text-on-surface-variant opacity-75 mt-1 font-mono">
            총 {scans.length}개의 정밀 연애 보고서가 보관됨
          </p>
        </div>
        {scans.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            전체 삭제
          </button>
        )}
      </div>

      {scans.length === 0 ? (
        <div className="glass-card rounded-xl p-md text-center py-16 border border-white/5 relative overflow-hidden flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">
            🔍
          </div>
          <h3 className="text-lg font-black text-on-background mb-1">스캔 기록이 존재하지 않습니다</h3>
          <p className="text-sm text-on-surface-variant/80 max-w-sm mx-auto mb-6">
            아직 연애 네비게이터 스캔을 하지 않았거나, 분석하지 않았습니다. 마음에 품어둔 그 사람에 대한 진단을 시도해 보세요!
          </p>
          <button
            onClick={onNavigateToScan}
            className="px-6 py-3 bg-gradient-to-r from-primary-container to-secondary-container text-white font-bold text-sm rounded-full active:scale-95 transition-all shadow-[0_4px_12px_rgba(255,75,137,0.3)] cursor-pointer"
          >
            스치치 분석 시작하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map((scan) => {
            const dateStr = new Date(scan.timestamp).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className="glass-card hover:bg-white/[0.05] border border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex justify-between items-center group relative overflow-hidden"
              >
                <div className="space-y-2 max-w-[80%]">
                  {/* Matching pairs MBTI & Date */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold font-mono">
                      {scan.myMbti}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/60 font-mono">×</span>
                    <span className="px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold font-mono">
                      {scan.crushMbti}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="text-[10px] text-on-surface-variant font-mono opacity-60">
                      {dateStr}
                    </span>
                  </div>

                  {/* Dynamic Match dynamics summary */}
                  <h4 className="font-bold text-sm text-white line-clamp-1 leading-normal">
                    "{scan.result.personalityStitch}"
                  </h4>

                  {/* Success Rate mini percent */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-primary font-black font-semibold">
                      성공률: {scan.result.successRate}%
                    </span>
                    <span className="text-xs text-on-surface-variant opacity-60 line-clamp-1 max-w-[200px]">
                      태그: {scan.result.tags?.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Right Arrow and Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onDeleteScan(scan.id, e)}
                    className="p-2 hover:bg-red-500/20 text-on-surface-variant hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 cursor-pointer"
                    title="기록 지우기"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                  <span className="material-symbols-outlined text-on-surface-variant opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all text-xl">
                    chevron_right
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
