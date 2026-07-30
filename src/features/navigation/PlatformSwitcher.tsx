import { ChevronDown } from 'lucide-react';

export function PlatformSwitcher({ isOps = false, isGov = false }: { isOps?: boolean; isGov?: boolean }) {
  return (
    <div className={`flex items-center gap-2 cursor-pointer p-2 rounded transition-colors -mx-2 ${
      isGov || isOps 
        ? 'hover:bg-[#1A2744] hover:bg-opacity-50' 
        : 'hover:bg-[#F1F5F9]'
    }`}>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <span className={`font-semibold text-sm tracking-tight ${
            isGov || isOps ? 'text-white' : 'text-[var(--color-iot-text-primary)]'
          }`}>
            {isGov ? 'Government Center' : isOps ? 'Operations Center' : 'IoT Fleet Operations'}
          </span>
          <ChevronDown className={`w-4 h-4 ${
            isGov || isOps ? 'text-slate-500' : 'text-[var(--color-iot-text-muted)]'
          }`} />
        </div>
        <span className={`text-[11px] font-medium leading-none mt-1 ${
          isGov || isOps ? 'text-slate-400' : 'text-[var(--color-iot-text-secondary)]'
        }`}>
          {isGov ? 'Ahmedabad City • Executive' : isOps ? 'Ahmedabad City • Mission Control' : 'North Campus • 148 Devices'}
        </span>
      </div>
    </div>
  );
}
