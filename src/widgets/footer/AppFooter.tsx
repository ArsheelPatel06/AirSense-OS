export function AppFooter() {
  return (
    <footer className="mt-auto py-4 border-t border-gray-200 dark:border-gray-800/50 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
      <div className="mb-2 sm:mb-0">
        &copy; {new Date().getFullYear()} AirSense Systems. All rights reserved.
      </div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Documentation</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Support</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">API Status</a>
      </div>
    </footer>
  );
}
