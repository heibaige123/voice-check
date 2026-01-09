import { useState } from 'react';

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="hidden bottom-6 left-1/2 absolute lg:flex items-center gap-3 bg-slate-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur px-5 py-3 border border-white/15 rounded-full text-[13px] text-slate-200 -translate-x-1/2 pointer-events-none">
      <li className="flex items-center gap-2 pr-3 border-white/10 border-r font-mono">Electron v{versions.electron}</li>
      <li className="flex items-center gap-2 pr-3 border-white/10 border-r font-mono">Chromium v{versions.chrome}</li>
      <li className="flex items-center gap-2 font-mono">Node v{versions.node}</li>
    </ul>
  );
}

export default Versions;
