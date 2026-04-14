import { ReactNode } from "react";

interface KnowledgeCardProps {
  type: "knowledge" | "safety" | "tip";
  title?: string;
  children: ReactNode;
}

const cardStyles = {
  knowledge: {
    border: "border-[#B8956A]",
    bg: "bg-[#B8956A]/10",
    icon: "🧠",
    title: "Anatomia Ativada",
  },
  safety: {
    border: "border-[#7A1A1A]",
    bg: "bg-[#7A1A1A]/10",
    icon: "⚠️",
    title: "Saúde Primeiro",
  },
  tip: {
    border: "border-[#3D5A3D]",
    bg: "bg-[#3D5A3D]/10",
    icon: "💪",
    title: "Dica Prática",
  },
};

export function KnowledgeCard({ type, title, children }: KnowledgeCardProps) {
  const style = cardStyles[type];
  const displayTitle = title || style.title;

  return (
    <div
      className={`my-6 p-4 border-l-4 ${style.border} ${style.bg} rounded-r-sm`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{style.icon}</span>
        <h4 className={`text-sm font-bold tracking-wider ${type === "knowledge" ? "text-[#B8956A]" : type === "safety" ? "text-[#7A1A1A]" : "text-[#5A8A5A]"}`}>
          {displayTitle}
        </h4>
      </div>
      <div className="text-sm leading-relaxed text-[#ccc]">
        {children}
      </div>
    </div>
  );
}
