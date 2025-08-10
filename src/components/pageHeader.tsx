import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  children: React.ReactNode;
  navigateBack?: string;
}

function PageHeader({ children, navigateBack }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(navigateBack || '/')}
        className="
          text-xs bg-transparent border-none p-0 cursor-pointer
          hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-offset-primary focus:ring-white mb-4
          flex items-center gap-0
        "
      >
        <ChevronLeft className="w-6 h-6" />
        Volver
      </button>

      {children}
    </div>
  );
}

export { PageHeader };
