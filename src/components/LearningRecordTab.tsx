import { useState } from "react";
import { Award, Share2, Sparkles, BookOpen, Clock, Heart, Check, Trash2, Calendar } from "lucide-react";

interface LearningRecordTabProps {
  visitedSpots: string[];
  unlockedStories: Record<string, string[]>;
  unlockedTags: string[];
  onResetRecord?: () => void;
}

export default function LearningRecordTab({
  visitedSpots,
  unlockedStories,
  unlockedTags,
  onResetRecord
}: LearningRecordTabProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = () => {
    setShowToast(true);
    navigator.clipboard?.writeText?.(window.location.href);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const unlockedStoryCount = Object.values(unlockedStories).reduce((sum, list) => sum + list.length, 0);

  // Badge list across Taiwan regions
  const badgesList = [
    {
      id: "badge1",
      title: "府城文史探索家",
      desc: "走訪或聆聽台南安平古堡、赤崁樓等大航海與古都歷史",
      requirement: () => visitedSpots.some(s => s.includes("安平") || s.includes("赤崁") || s.includes("台南") || s.includes("神農") || s.includes("鹿港")) || 
        Object.keys(unlockedStories).some(k => k.includes("安平") || k.includes("赤崁") || k.includes("台南") || k.includes("鹿港")),
      icon: "🏰",
      tag: "古蹟文史"
    },
    {
      id: "badge2",
      title: "山林鐵道探勘員",
      desc: "走訪或聆聽阿里山、羅東林場或溪頭等台灣高山林業歷史",
      requirement: () => visitedSpots.some(s => s.includes("阿里山") || s.includes("林場") || s.includes("林業") || s.includes("清境")) || 
        Object.keys(unlockedStories).some(k => k.includes("阿里山") || k.includes("林業") || k.includes("清境")),
      icon: "🚂",
      tag: "林業鐵道"
    },
    {
      id: "badge3",
      title: "首都當代建築師",
      desc: "走訪或聆聽台北101、故宮博物院或大稻埕洋樓街屋",
      requirement: () => visitedSpots.some(s => s.includes("101") || s.includes("故宮") || s.includes("大稻埕") || s.includes("迪化")) || 
        Object.keys(unlockedStories).some(k => k.includes("101") || k.includes("故宮") || k.includes("大稻埕")),
      icon: "🏙️",
      tag: "當代建築"
    },
    {
      id: "badge4",
      title: "峽谷奇景守護者",
      desc: "走訪或聆聽花蓮太魯閣大理石峭壁、立霧溪地質奇觀",
      requirement: () => visitedSpots.some(s => s.includes("太魯閣") || s.includes("七星潭")) || 
        Object.keys(unlockedStories).some(k => k.includes("太魯閣") || k.includes("七星潭")),
      icon: "⛰️",
      tag: "峽谷地質"
    },
    {
      id: "badge5",
      title: "縱谷稻浪追風人",
      desc: "走訪或聆聽池上伯朗大道、三仙台海岸或花東縱谷農墾",
      requirement: () => visitedSpots.some(s => s.includes("伯朗大道") || s.includes("池上") || s.includes("三仙台")) || 
        Object.keys(unlockedStories).some(k => k.includes("伯朗大道") || k.includes("池上") || k.includes("三仙台")),
      icon: "🌾",
      tag: "縱谷風土"
    },
    {
      id: "badge6",
      title: "港灣海島領航員",
      desc: "解鎖高雄駁二特區、旗津燈塔、南方澳或澎湖跨海大橋海味",
      requirement: () => visitedSpots.some(s => s.includes("駁二") || s.includes("旗津") || s.includes("漁港") || s.includes("澎湖")) || 
        Object.keys(unlockedStories).some(k => k.includes("駁二") || k.includes("旗津") || k.includes("漁港") || k.includes("澎湖")),
      icon: "🚢",
      tag: "海洋聚落"
    },
    {
      id: "badge7",
      title: "地質奇泉探勘客",
      desc: "走訪或聆聽蘇澳冷泉、北投溫泉或礁溪等碳酸冷熱雙泉",
      requirement: () => visitedSpots.some(s => s.includes("冷泉") || s.includes("溫泉")) || 
        Object.keys(unlockedStories).some(k => k.includes("冷泉") || k.includes("溫泉")),
      icon: "🫧",
      tag: "地質奇觀"
    },
    {
      id: "badge8",
      title: "水綠共生環境家",
      desc: "探索高美濕地、冬山河生態綠舟等水鳥濕地與生態復育",
      requirement: () => visitedSpots.some(s => s.includes("高美") || s.includes("生態綠舟") || s.includes("日月潭")) || 
        Object.keys(unlockedStories).some(k => k.includes("高美") || k.includes("生態綠舟") || k.includes("日月潭")),
      icon: "🌳",
      tag: "生態共融"
    }
  ];

  const earnedBadgesCount = badgesList.filter(b => b.requirement()).length;

  return (
    <div className="space-y-6 fade-in p-1 select-none">
      
      {/* Toast Notification for share link (Prompt A requirement) */}
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#13294B] text-[#E8A02C] text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-amber-400/40 animate-slide-up">
          <Check className="w-4 h-4" />
          <span>✓ 已複製分享連結！去邀好友一起出發台灣深度探索之旅吧</span>
        </div>
      )}

      {/* Statistics board */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">已走訪景點數</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold font-display text-[#13294B]">{visitedSpots.length}</span>
            <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-md font-medium">景點打卡</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">已解鎖導覽故事</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold font-display text-[#D2691E]">{unlockedStoryCount}</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-medium">主線解鎖</span>
          </div>
        </div>
      </div>

      {/* Badges Collectibles Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-600 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E8A02C]" />
            台灣文化勳章證書 ({earnedBadgesCount}/{badgesList.length})
          </span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {badgesList.map(badge => {
            const isEarned = badge.requirement();
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center relative overflow-hidden transition-all flex flex-col justify-between ${
                  isEarned
                    ? "bg-white border-amber-200/50 shadow-xs"
                    : "bg-gray-100/50 border-gray-200/50 opacity-65"
                }`}
              >
                <div>
                  <div className="p-2.5 rounded-full w-12 h-12 flex items-center justify-center text-2xl mx-auto mb-2 bg-[#FAF8F5]">
                    {badge.icon}
                  </div>
                  <h4 className={`text-xs font-bold leading-tight ${isEarned ? "text-[#13294B]" : "text-gray-500"}`}>
                    {badge.title}
                  </h4>
                  <p className="text-[9px] text-gray-400 mt-1 leading-normal line-clamp-2">
                    {badge.desc}
                  </p>
                </div>
                <div className="mt-2 text-[8px] font-bold">
                  {isEarned ? (
                    <span className="bg-amber-50 text-[#E8A02C] px-1.5 py-0.5 rounded-full border border-amber-100">
                      🏅 已解鎖 🎓
                    </span>
                  ) : (
                    <span className="bg-gray-200/50 text-gray-400 px-1.5 py-0.5 rounded-full">
                      待探索
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked study themes tags accrued (Prompt A requirement) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
          <span>解鎖學習文化標籤集</span>
          <span className="font-mono text-[10px] text-gray-500 font-semibold">{unlockedTags.length} 標籤</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {unlockedTags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all hover:scale-105"
            >
              <span>{tag}</span>
            </span>
          ))}
          {unlockedTags.length === 0 && (
            <div className="text-gray-400 text-xs py-2 w-full text-center">
              隨意走讀或勾選「已走訪」景點，即可在此處積攢你的主題學習里程碑！
            </div>
          )}
        </div>
      </div>

      {/* Share Actions (Prompt A Requirement) */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 bg-[#13294B] hover:bg-opacity-90 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Share2 className="w-4 h-4 text-[#E8A02C]" />
          分享我的旅程
        </button>
        {onResetRecord && (unlockedTags.length > 0 || visitedSpots.length > 0) && (
          <button
            onClick={onResetRecord}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 px-3.5 rounded-xl transition-all"
            title="重算紀錄"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
