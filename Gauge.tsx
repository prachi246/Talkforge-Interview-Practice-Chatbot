import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full flex-shrink-0 py-4 px-8 border-t border-slate-700/50 bg-slate-900">
      <div className="text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} TalkForge. Need help? Contact us at{' '}
          <a href="mailto:support@talkforge.ai" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
            support@talkforge.ai
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;