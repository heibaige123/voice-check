import { ArrowUpRight, Send, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Button } from '^/components/ui/button';
import Versions from './components/Versions';
import electronLogo from './assets/electron.svg';
import wavyLines from './assets/wavy-lines.svg';

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
  const highlights = [
    {
      icon: Sparkles,
      title: 'Ready-made UI',
      text: 'shadcn-styled controls with Tailwind 4 utility power.',
    },
    {
      icon: Zap,
      title: 'Fast DX',
      text: 'Electron Vite dev server, instant reload, TS strict.',
    },
    {
      icon: ShieldCheck,
      title: 'IPC-safe',
      text: 'Preload bridge and sandbox disabled only where needed.',
    },
  ];

  return (
    <div className="relative bg-slate-950 min-h-screen overflow-hidden text-slate-50">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: `url(${wavyLines})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(248,196,113,0.12),transparent_26%),radial-gradient(circle_at_40%_80%,rgba(94,234,212,0.12),transparent_32%)]" />

      <div className="z-10 relative flex flex-col gap-10 mx-auto px-6 sm:px-10 py-16 w-full max-w-5xl">
        <div className="flex flex-col gap-6 bg-slate-900/70 shadow-2xl backdrop-blur-xl p-8 sm:p-12 border border-white/10 rounded-3xl">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 px-4 py-1 rounded-full ring-1 ring-cyan-500/30 w-fit font-semibold text-cyan-200 text-xs">
            <span className="bg-cyan-400 rounded-full w-2 h-2" />
            Voice Check · Electron + React
          </div>
          <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-8">
            <div className="flex flex-col flex-1 gap-4">
              <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight">
                Ship a desktop UI that feels premium
              </h1>
              <p className="max-w-2xl text-slate-300 text-base leading-relaxed">
                Prewired IPC, Tailwind 4, and shadcn building blocks so you can focus on voice logic instead of scaffolding.
                Buttons, layout, and glassy surfaces are ready to tweak.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950" onClick={ipcHandle}>
                  <Send className="size-4" />
                  Send IPC
                </Button>
                <Button size="lg" variant="outline" className="gap-2 hover:bg-slate-800 border-slate-700 text-slate-100" asChild>
                  <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
                    <ArrowUpRight className="size-4" />
                    Docs
                  </a>
                </Button>
                <Button size="lg" variant="ghost" className="gap-2 hover:bg-slate-800/70 text-slate-200" asChild>
                  <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
                    <ArrowUpRight className="size-4" />
                    shadcn/ui
                  </a>
                </Button>
              </div>
              <p className="hidden sm:block text-slate-400 text-sm">
                Tip: press <span className="bg-slate-800 px-1.5 py-0.5 rounded-sm font-mono text-slate-100 text-xs">F12</span> to open DevTools
              </p>
            </div>
            <div className="flex flex-shrink-0 justify-center items-center bg-slate-900/60 shadow-xl p-6 border border-white/10 rounded-2xl">
              <img
                alt="Electron logo"
                className="drop-shadow-[0_20px_40px_rgba(8,126,164,0.28)] hover:drop-shadow-[0_20px_60px_rgba(56,189,248,0.45)] w-28 sm:w-32 h-28 sm:h-32 transition duration-300 select-none"
                src={electronLogo}
                draggable={false}
              />
            </div>
          </div>
          <div className="gap-4 grid sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group bg-white/5 hover:bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] p-4 border border-white/5 hover:border-cyan-400/50 rounded-2xl transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 font-semibold text-cyan-200 text-sm">
                  <Icon className="size-4" />
                  {title}
                </div>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Versions />
    </div>
  );
}

export default App;
