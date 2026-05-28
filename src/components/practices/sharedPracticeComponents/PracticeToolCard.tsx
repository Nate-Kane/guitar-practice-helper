import { FC, ReactNode } from 'react';

interface PracticeToolCardProps {
  heading: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

const PracticeToolCard: FC<PracticeToolCardProps> = ({
  heading,
  title,
  description,
  icon,
  actions,
  children,
}) => (
  <div className="space-y-4 max-w-[900px]">
    <h2 className="text-xl font-bold text-amber-900">{heading}</h2>

    <div className="rounded-lg shadow overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
      <div className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="bg-amber-900 p-3 rounded-md text-stone-50 shrink-0">{icon}</div>
            )}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-stone-50 mb-1">{title}</h3>
              {description && (
                <p className="text-stone-300 text-sm md:text-base">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">{actions}</div>
          )}
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default PracticeToolCard;
