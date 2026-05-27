import React, { useState } from "react";
import { UserProfile } from "../types";

interface ProfileSettingsProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const EMOJI_OPTIONS = ["😎", "🥰", "🐱", "🐶", "👽", "🦄", "🐼", "🦊", "🤖", "👻", "👾", "🤡"];

const VIBE_OPTIONS = [
  "직진하는 불도저 (Straight Bulldozer)",
  "섬세하고 유리멘탈인 쿠쿠다스 (Delicate Glass Mind)",
  "분석하고 정교하게 탐색하는 과학자 (Analytical Lab Agent)",
  "연락보단 개인 정비가 시급한 집돌이/집순이 (Couch Potato Master)",
  "인스타 핫플 꿰고 있는 로맨티시스트 (Trendy Instagram Romantic)",
  "리액션만 쏟아내는 대화 반응러 (Dolphin React Spammer)",
];

export default function ProfileSettings({ profile, onSaveProfile }: ProfileSettingsProps) {
  const [name, setName] = useState(profile.name || "연애 탐험가");
  const [mbti, setMbti] = useState(profile.mbti || "INFJ");
  const [chatStyle, setChatStyle] = useState(profile.chatStyle || "");
  const [vibe, setVibe] = useState(profile.vibe || VIBE_OPTIONS[0]);
  const [emoji, setEmoji] = useState(profile.emoji || "🐱");

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onSaveProfile({
      name,
      mbti,
      chatStyle,
      vibe,
      emoji,
      keywords: profile.keywords || ["맛집", "코딩"],
    });
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div id="profile_settings_main" className="max-w-lg mx-auto space-y-gutter">
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-headline-lg-mobile text-2xl text-on-background font-black flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">person</span>
            프로필 커스터마이징
          </h2>
          <p className="text-xs text-on-surface-variant opacity-75 mt-1 font-mono">
            스캔 엔진의 나의 데이터 기본값 동기화
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-md border border-white/10 shadow-lg p-6 space-y-6">
        {/* Header Avatar and Name Input */}
        <div className="flex items-center gap-4 py-2 border-b border-white/5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl shadow-md">
              {emoji}
            </div>
            <div className="absolute -bottom-1 -right-1 flex gap-1 bg-surface-container border border-white/10 rounded-full p-1">
              <span className="material-symbols-outlined text-xs text-primary">edit</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[11px] text-on-surface-variant font-mono">사용자 닉네임</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary outline-none transition-all font-bold"
              placeholder="닉네임 입력"
              type="text"
            />
          </div>
        </div>

        {/* Emoji selector */}
        <div>
          <label className="font-label-md text-xs block mb-2 text-primary uppercase font-bold">내 아바타 이모지</label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  emoji === em ? "bg-primary/20 border-primary" : "bg-white/5 border-white/5"
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* MBTI Select */}
        <div>
          <label className="font-label-md text-xs block mb-2 text-primary uppercase font-bold">내 기본 MBTI</label>
          <div className="grid grid-cols-4 gap-1.5">
            {MBTI_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMbti(type)}
                className={`py-2 text-xs rounded border hover:border-primary/40 font-bold transition-all cursor-pointer ${
                  mbti === type
                    ? "bg-primary text-on-primary border-primary shadow-[0_0_10px_rgba(255,177,195,0.4)]"
                    : "bg-surface-container-low border-white/5 text-on-surface-variant"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Default Chat Style */}
        <div>
          <label className="font-label-md text-xs block mb-2 text-primary uppercase font-bold">나의 대화/채팅 톤 앤 매너</label>
          <input
            value={chatStyle}
            onChange={(e) => setChatStyle(e.target.value)}
            className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-sm text-on-surface focus:border-primary outline-none transition-all neumorphic-inset placeholder:text-on-surface-variant/30"
            placeholder="예: 'ㅋㅋㅋ' 위주로 가벼운 수다, 칼답, 단답, 이모티콘 부자 등"
            type="text"
          />
        </div>

        {/* Profile Vibe Option */}
        <div>
          <label className="font-label-md text-xs block mb-2 text-primary uppercase font-bold">나의 연애 포지셔닝</label>
          <div className="relative">
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-sm text-on-surface focus:border-primary outline-none transition-all appearance-none neumorphic-inset"
            >
              {VIBE_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-primary-container to-secondary-container hover:shadow-[0_0_15px_rgba(255,177,195,0.4)] text-white font-black text-sm rounded-full active:scale-95 transition-all duration-150 flex items-center gap-1 cursor-pointer"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                저장 중...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xs">save</span>
                프로필 값 업데이트 저장
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
