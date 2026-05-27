export interface CompatibilityResult {
  successRate: number;
  stabilityIndex: number;
  dopamineIndex: number;
  personalityStitch: string;
  conflictSpot: string;
  futureSpoiler: string;
  tags: string[];
}

export interface LoveScan {
  id: string;
  timestamp: string;
  myMbti: string;
  myChatStyle: string;
  myKeywords: string[];
  crushMbti: string;
  crushChatStyle: string;
  crushKeywords: string[];
  result: CompatibilityResult;
}

export interface UserProfile {
  name: string;
  mbti: string;
  chatStyle: string;
  keywords: string[];
  vibe: string;
  emoji: string;
}
