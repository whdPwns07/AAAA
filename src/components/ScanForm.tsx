import React, { useState } from "react";
import { UserProfile } from "../types";

interface ScanFormProps {
  userProfile: UserProfile;
  onAnalyze: (data: {
    myMbti: string;
    myChatStyle: string;
    myKeywords: string[];
    crushMbti: string;
    crushChatStyle: string;
    crushKeywords: string[];
  }) => void;
  isAnalyzing: boolean;
}

const MBTI_OPTIONS = [
  { value: "INTJ", label: "INTJ - 용의주도한 전략가" },
  { value: "INTP", label: "INTP - 논리적인 사색가" },
  { value: "ENTJ", label: "ENTJ - 대담한 지도자" },
  { value: "ENTP", label: "ENTP - 뜨거운 논쟁을 즐기는 변론가" },
  { value: "INFJ", label: "INFJ - 선의의 옹호자" },
  { value: "INFP", label: "INFP - 상냥한 이타주의자" },
  { value: "ENFJ", label: "ENFJ - 정의로운 사회운동가" },
  { value: "ENFP", label: "ENFP - 재기발랄한 활동가" },
  { value: "ISTJ", label: "ISTJ - 청렴결백한 사무관" },
  { value: "ISFJ", label: "ISFJ - 용감한 수호자" },
  { value: "ESTJ", label: "ESTJ - 엄격한 관리자" },
  { value: "ESFJ", label: "ESFJ - 사교적인 외교관" },
  { value: "ISTP", label: "ISTP - 만능 재주꾼" },
  { value: "ISFP", label: "ISFP - 호기심 많은 예술가" },
  { value: "ESTP", label: "ESTP - 모험을 즐기는 사업가" },
  { value: "ESFP", label: "ESFP - 자유로운 영혼의 연예인" },
];

const MY_DEFAULT_KEYWORDS = ["맛집", "코딩", "넷플릭스", "고양이", "아이돌", "카페", "운동"];
const CRUSH_DEFAULT_KEYWORDS = ["강아지", "여행", "홈쿠킹", "인스타", "커피", "새벽통화", "독서"];

export default function ScanForm({ userProfile, onAnalyze, isAnalyzing }: ScanFormProps) {
  // Prep initialized fields from persistent user profile if available
  const [myMbti, setMyMbti] = useState(userProfile.mbti || "INFJ");
  const [myChatStyle, setMyChatStyle] = useState(userProfile.chatStyle || "");
  const [myKeywords, setMyKeywords] = useState<string[]>(
    userProfile.keywords.length > 0 ? userProfile.keywords : ["맛집", "코딩"]
  );

  const [crushMbti, setCrushMbti] = useState("ENFP");
  const [crushChatStyle, setCrushChatStyle] = useState("");
  const [crushKeywords, setCrushKeywords] = useState<string[]>(["강아지", "여행"]);

  // Tag helper states
  const [showMyInput, setShowMyInput] = useState(false);
  const [newMyTag, setNewMyTag] = useState("");
  const [showCrushInput, setShowCrushInput] = useState(false);
  const [newCrushTag, setNewCrushTag] = useState("");

  const handleAddMyTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newMyTag.trim().replace("#", "");
    if (clean && !myKeywords.includes(clean)) {
      setMyKeywords([...myKeywords, clean]);
    }
    setNewMyTag("");
    setShowMyInput(false);
  };

  const handleAddCrushTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCrushTag.trim().replace("#", "");
    if (clean && !crushKeywords.includes(clean)) {
      setCrushKeywords([...crushKeywords, clean]);
    }
    setNewCrushTag("");
    setShowCrushInput(false);
  };

  const removeMyTag = (tag: string) => {
    setMyKeywords(myKeywords.filter((k) => k !== tag));
  };

  const removeCrushTag = (tag: string) => {
    setCrushKeywords(crushKeywords.filter((k) => k !== tag));
  };

  const handlePredefinedMyClick = (tag: string) => {
    if (!myKeywords.includes(tag)) {
      setMyKeywords([...myKeywords, tag]);
    }
  };

  const handlePredefinedCrushClick = (tag: string) => {
    if (!crushKeywords.includes(tag)) {
      setCrushKeywords([...crushKeywords, tag]);
    }
  };

  const submitAnalysis = () => {
    onAnalyze({
      myMbti,
      myChatStyle,
      myKeywords,
      crushMbti,
      crushChatStyle,
      crushKeywords,
    });
  };

  return (
    <div id="scan_main_content" className="space-y-gutter">
      {/* Hero Header */}
      <div id="scan_heading_banner" className="mb-8 text-center relative overflow-hidden py-6 rounded-xl bg-surface-container-low border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 px-4">
          <p className="font-label-md text-label-md text-primary tracking-widest uppercase mb-2">DIAGNOSTIC MODE: ACTIVE</p>
          <h2 className="font-headline-xl text-[32px] md:text-headline-xl text-on-background leading-normal font-black mb-1">
            정밀 데이터 스캔 📡
          </h2>
          <p id="sub_desc" className="text-body-md text-on-surface-variant max-w-md mx-auto opacity-70">
            분석을 위해 두 사람의 메타데이터를 입력하세요. 알고리즘이 연애 성공 확률을 계산합니다.
          </p>
        </div>
      </div>

      <div id="scan_form_inputs" className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Section: My Data */}
        <section id="my_data_section" className="glass-card p-6 rounded-xl relative overflow-hidden border border-white/10">
          {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none bg-primary/5 z-20">
              <div className="scan-line"></div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-xl">person</span>
            </div>
            <div>
              <h3 className="font-headline-lg-mobile text-xl text-on-background font-bold">나의 데이터</h3>
              <p className="font-label-sm text-xs text-on-surface-variant/70 font-mono">SUBJECT_01_INPUT</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* MBTI Select */}
            <div>
              <label className="font-label-md text-sm block mb-2 text-primary uppercase tracking-wider font-semibold">
                MBTI 유형
              </label>
              <div className="relative">
                <select
                  id="my_mbti_select"
                  value={myMbti}
                  onChange={(e) => setMyMbti(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none neumorphic-inset"
                >
                  {MBTI_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>
            </div>

            {/* Chat Style */}
            <div>
              <label className="font-label-md text-sm block mb-2 text-primary uppercase tracking-wider font-semibold">
                채팅 스타일
              </label>
              <input
                id="my_chat_style_input"
                value={myChatStyle}
                onChange={(e) => setMyChatStyle(e.target.value)}
                className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all neumorphic-inset placeholder:text-on-surface-variant/40"
                placeholder="예: 'ㅋㅋㅋ' 위주 vs 리액션 폭발 vs 진지한 설명충"
                type="text"
              />
            </div>

            {/* Interest Keywords */}
            <div>
              <label className="font-label-md text-sm block mb-2 text-primary uppercase tracking-wider font-semibold">
                관심사 키워드
              </label>
              <div id="my_tags_pills" className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                {myKeywords.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => removeMyTag(tag)}
                    className="group cursor-pointer px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-full hover:bg-red-500/20 hover:border-red-500/45 transition-all flex items-center gap-1 font-medium"
                    title="클릭하여 제거"
                  >
                    #{tag}
                    <span className="text-[10px] opacity-60 group-hover:text-red-400">×</span>
                  </span>
                ))}

                {showMyInput ? (
                  <form onSubmit={handleAddMyTag} className="inline-flex items-center gap-1">
                    <input
                      value={newMyTag}
                      onChange={(e) => setNewMyTag(e.target.value)}
                      placeholder="입력 후 엔터"
                      autoFocus
                      className="px-2 py-0.5 text-xs bg-surface-container border border-primary/40 rounded-full text-on-surface outline-none focus:border-primary max-w-[100px]"
                    />
                    <button type="submit" className="text-xs text-primary font-bold px-1 hover:underline">
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMyInput(false)}
                      className="text-xs text-on-surface-variant hover:text-white px-1"
                    >
                      취소
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowMyInput(true)}
                    className="px-3 py-1 bg-surface-container-highest border border-outline/20 text-on-surface-variant text-xs rounded-full hover:border-primary/50 transition-all flex items-center gap-1 font-mono hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> 태그 추가
                  </button>
                )}
              </div>

              {/* Quick Preset Tags for Quick entry */}
              <div id="my_presets" className="mt-2 text-xs opacity-80">
                <p className="text-on-surface-variant/70 text-[11px] mb-1 font-mono">가장 핫한 키워드 원클릭 추가:</p>
                <div className="flex flex-wrap gap-1">
                  {MY_DEFAULT_KEYWORDS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handlePredefinedMyClick(tag)}
                      disabled={myKeywords.includes(tag)}
                      className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                        myKeywords.includes(tag)
                          ? "bg-white/5 border-white/5 text-on-surface-variant/40 cursor-not-allowed"
                          : "bg-surface-container-low border-white/5 hover:border-primary/45 hover:text-primary text-on-surface-variant"
                      }`}
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Crush's Data */}
        <section id="crush_data_section" className="glass-card p-6 rounded-xl relative overflow-hidden border border-white/10">
          {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none bg-secondary/5 z-20">
              <div className="scan-line"></div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-xl">favorite</span>
            </div>
            <div>
              <h3 className="font-headline-lg-mobile text-xl text-on-background font-bold">그 사람의 데이터</h3>
              <p className="font-label-sm text-xs text-on-surface-variant/70 font-mono">TARGET_SUBJECT_INPUT</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Crush MBTI Select */}
            <div>
              <label className="font-label-md text-sm block mb-2 text-secondary uppercase tracking-wider font-semibold">
                추정 MBTI
              </label>
              <div className="relative">
                <select
                  id="crush_mbti_select"
                  value={crushMbti}
                  onChange={(e) => setCrushMbti(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all appearance-none neumorphic-inset"
                >
                  {MBTI_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>
            </div>

            {/* Crush Chat Speed/Style */}
            <div>
              <label className="font-label-md text-sm block mb-2 text-secondary uppercase tracking-wider font-semibold">
                답장 속도/스타일
              </label>
              <input
                id="crush_chat_style_input"
                value={crushChatStyle}
                onChange={(e) => setCrushChatStyle(e.target.value)}
                className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all neumorphic-inset placeholder:text-on-surface-variant/40"
                placeholder="예: '1분 칼답' vs '6시간 뒤 뒷북' vs '읽씹 장인'"
                type="text"
              />
            </div>

            {/* Observed Preference Keywords */}
            <div>
              <label className="font-label-md text-sm block mb-2 text-secondary uppercase tracking-wider font-semibold">
                관찰된 선호도 선구안
              </label>
              <div id="crush_tags_pills" className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                {crushKeywords.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => removeCrushTag(tag)}
                    className="group cursor-pointer px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary text-xs rounded-full hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-1 font-medium"
                    title="클릭하여 제거"
                  >
                    #{tag}
                    <span className="text-[10px] opacity-60 group-hover:text-red-400">×</span>
                  </span>
                ))}

                {showCrushInput ? (
                  <form onSubmit={handleAddCrushTag} className="inline-flex items-center gap-1">
                    <input
                      value={newCrushTag}
                      onChange={(e) => setNewCrushTag(e.target.value)}
                      placeholder="입력 후 엔터"
                      autoFocus
                      className="px-2 py-0.5 text-xs bg-surface-container border border-secondary/40 rounded-full text-on-surface outline-none focus:border-secondary max-w-[100px]"
                    />
                    <button type="submit" className="text-xs text-secondary font-bold px-1 hover:underline">
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCrushInput(false)}
                      className="text-xs text-on-surface-variant hover:text-white px-1"
                    >
                      취소
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowCrushInput(true)}
                    className="px-3 py-1 bg-surface-container-highest border border-outline/20 text-on-surface-variant text-xs rounded-full hover:border-secondary/50 transition-all flex items-center gap-1 font-mono hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> 태그 추가
                  </button>
                )}
              </div>

              {/* Quick Preset tags for crush */}
              <div id="crush_presets" className="mt-2 text-xs opacity-80">
                <p className="text-on-surface-variant/70 text-[11px] mb-1 font-mono">상대를 표현하는 키워드 추가:</p>
                <div className="flex flex-wrap gap-1">
                  {CRUSH_DEFAULT_KEYWORDS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handlePredefinedCrushClick(tag)}
                      disabled={crushKeywords.includes(tag)}
                      className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                        crushKeywords.includes(tag)
                          ? "bg-white/5 border-white/5 text-on-surface-variant/40 cursor-not-allowed"
                          : "bg-surface-container-low border-white/5 hover:border-secondary/45 hover:text-secondary text-on-surface-variant"
                      }`}
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Connection Badge status */}
      <div id="ai_status_badge" className="mt-8 flex justify-center">
        <div className="flex items-center gap-3 bg-surface-container-low/50 px-6 py-2 rounded-full border border-white/5 shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${isAnalyzing ? "bg-primary animate-ping" : "bg-tertiary animate-pulse"}`}></span>
          <span className="font-label-md text-xs text-on-surface-variant font-mono">
            {isAnalyzing ? "AI Core: Calculating Love Vectors..." : "AI Core status: Optimal connection"}
          </span>
        </div>
      </div>

      {/* Floating Big Button Area */}
      <div id="analyze_action_container" className="pt-6 pb-2 px-1 flex justify-center">
        <button
          onClick={submitAnalysis}
          disabled={isAnalyzing}
          className={`w-full max-w-md h-16 rounded-full text-white font-black text-lg tracking-wider md:hover:scale-[1.02] transform transition-all flex items-center justify-center gap-3 neumorphic-button duration-200 ${
            isAnalyzing
              ? "bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-primary-container to-secondary-container hover:shadow-[0_0_20px_rgba(255,177,195,0.4)] active:scale-95 duration-150 cursor-pointer"
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${isAnalyzing ? "animate-spin" : ""}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isAnalyzing ? "sync" : "analytics"}
          </span>
          {isAnalyzing ? "데이터 정밀 해독 중..." : "분석하기"}
        </button>
      </div>
    </div>
  );
}
