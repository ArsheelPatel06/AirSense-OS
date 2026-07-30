import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If we are on the dashboard root, just show Home
  if (pathnames.length === 0) {
    return (
      <nav className="flex items-center text-sm font-medium text-gray-500 mb-6 px-1">
        <div className="flex items-center hover:text-primary transition-colors cursor-pointer">
          <Home className="w-4 h-4 mr-1.5" />
          <span>Overview</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center text-[13px] font-medium text-[var(--color-iot-text-secondary)] mb-2 px-1">
      <Link to="/" className="flex items-center hover:text-[var(--color-iot-brand)] transition-colors">
        <Home className="w-3.5 h-3.5 mr-1.5" />
        <span>Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        // format text: 'iot' -> 'IoT', otherwise capitalize
        let title = value.replace(/-/g, ' ');
        if (title.toLowerCase() === 'iot') title = 'IoT';
        else title = title.charAt(0).toUpperCase() + title.slice(1);

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-[var(--color-iot-border)]" />
            {last ? (
              <span className="text-[var(--color-iot-text-primary)] font-semibold" aria-current="page">
                {title}
              </span>
            ) : (
              <Link to={to} className="hover:text-[var(--color-iot-brand)] transition-colors">
                {title}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
