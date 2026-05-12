import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  subtitle?: string;
};

export default function BrandMark({
  className,
  iconClassName,
  showText = true,
  subtitle = "Digital Platform",
}: BrandMarkProps) {
  return (
    <div className={cn("inline-flex min-w-0 items-center gap-2.5 sm:gap-3", className)}>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-xs font-black tracking-wide text-primary-foreground shadow-card sm:h-10 sm:w-10 sm:text-sm",
          iconClassName
        )}
      >
        GT
      </div>
      {showText ? (
        <div className="min-w-0 leading-none">
          <div className="truncate font-heading text-lg font-bold text-foreground sm:text-xl">GauryaTech</div>
          <div className="mt-1 hidden truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:block">
            {subtitle}
          </div>
        </div>
      ) : null}
    </div>
  );
}
