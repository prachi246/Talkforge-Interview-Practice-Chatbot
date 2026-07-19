

import React, { useState } from 'react';

const MicrophoneTroubleshooting: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'windows' | 'macos'>('windows');

    const getBrowserName = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes("Firefox")) return "Firefox";
        if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
        if (userAgent.includes("Trident")) return "Internet Explorer";
        // Edge can contain "Chrome" and "Safari", so check for "Edg"
        if (userAgent.includes("Edg")) return "Microsoft Edge";
        if (userAgent.includes("Chrome")) return "Google Chrome";
        if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
        return "your browser";
    }

    const browserName = getBrowserName();

    return (
        <div className="bg-violet-950/50 backdrop-blur-lg border border-violet-500/20 rounded-lg p-6 max-w-lg mx-auto text-left text-violet-200 mt-4 animate-fadeInUp">
            <h4 className="text-xl font-bold text-white mb-4 text-center">Troubleshooting Guide</h4>
            
            <div className="mb-6 p-4 bg-violet-500/5 rounded-md border border-violet-500/20">
                <h5 className="font-semibold text-white mb-2">Step 1: Allow Microphone in {browserName}</h5>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Click the <span className="font-mono bg-violet-500/10 px-1.5 py-0.5 rounded">lock icon (🔒)</span> in the address bar next to the website URL.</li>
                    <li>Find the "Microphone" permission in the menu that appears.</li>
                    <li>Make sure it is set to <span className="font-bold text-green-400">Allow</span>.</li>
                    <li>If you made a change, you may need to reload the page.</li>
                </ol>
            </div>

            <div className="mb-6 p-4 bg-violet-500/5 rounded-md border border-violet-500/20">
                <h5 className="font-semibold text-white mb-2">Step 2: Check Operating System Settings</h5>
                <div className="flex border-b border-violet-500/20 mb-2">
                    <button 
                        onClick={() => setActiveTab('windows')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'windows' ? 'border-b-2 border-purple-400 text-white' : 'text-violet-300 hover:text-white'}`}
                    >
                        Windows
                    </button>
                    <button 
                        onClick={() => setActiveTab('macos')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'macos' ? 'border-b-2 border-purple-400 text-white' : 'text-violet-300 hover:text-white'}`}
                    >
                        macOS
                    </button>
                </div>
                
                {activeTab === 'windows' && (
                    <div className="text-sm space-y-2 pt-2">
                        <p>1. Press <span className="font-mono bg-violet-500/10 px-1.5 py-0.5 rounded">Windows Key + I</span> to open Settings.</p>
                        <p>2. Go to <span className="font-semibold">Privacy & security</span> {'>'} <span className="font-semibold">Microphone</span>.</p>
                        <p>3. Ensure <span className="font-semibold">"Microphone access"</span> and <span className="font-semibold">"Let apps access your microphone"</span> are both <span className="font-bold text-green-400">On</span>.</p>
                        <p>4. Scroll down and make sure <span className="font-semibold">{browserName}</span> is allowed access.</p>
                    </div>
                )}

                {activeTab === 'macos' && (
                    <div className="text-sm space-y-2 pt-2">
                        <p>1. Open <span className="font-semibold">System Settings</span> (from the Apple menu ).</p>
                        <p>2. Go to <span className="font-semibold">Privacy & Security</span> {'>'} <span className="font-semibold">Microphone</span>.</p>
                        <p>3. Find <span className="font-semibold">{browserName}</span> in the list.</p>
                        <p>4. Ensure the switch next to it is <span className="font-bold text-green-400">On</span> (blue).</p>
                        <p>5. You may need to quit and restart your browser for the change to take effect.</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-violet-500/5 rounded-md border border-violet-500/20">
                <h5 className="font-semibold text-white mb-2">Step 3: Check Your Hardware</h5>
                 <ul className="list-disc list-inside space-y-2 text-sm">
                     <li>If using an external microphone, ensure it's securely plugged in.</li>
                     <li>Check for a physical mute button on your microphone or headset.</li>
                     <li>Ensure your desired microphone is selected as the default system input device in your computer's sound settings.</li>
                 </ul>
            </div>
            
            <div className="mt-8 text-center">
                 <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_theme(colors.purple.600/0.7)]"
                >
                    <span>Reload and Try Again</span>
                </button>
            </div>
        </div>
    );
};

export default MicrophoneTroubleshooting;