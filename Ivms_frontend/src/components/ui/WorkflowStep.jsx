import { ChevronRight } from "lucide-react";

export const WorkflowStep = ({ stepNumber, title, description, icon: Icon, colorClass, isLast }) => (
  <div className="flex items-center flex-1">
    <div className="flex flex-col items-center text-center space-y-2">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">Step {stepNumber}</p>
        <h5 className="text-xs font-bold text-slate-800">{title}</h5>
        <p className="text-[10px] text-slate-400">{description}</p>
      </div>
    </div>
    {!isLast && (
      <div className="flex-1 flex justify-center text-slate-200">
        <ChevronRight className="w-8 h-8" />
      </div>
    )}
  </div>
);