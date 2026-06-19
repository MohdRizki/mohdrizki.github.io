import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkle, Rocket, BookOpenText } from "@phosphor-icons/react";
import { ZipperContext } from "../../App";
import SEO from "../../components/SEO";

export default function LandingMobile() {
  const navigate = useNavigate();
  const { setIsZipping } = useContext(ZipperContext);

  const handleStart = () => {
    setIsZipping(true);
    setTimeout(() => {
      navigate('/beranda');
    }, 450);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col px-5 py-8 pb-20 relative overflow-x-hidden overflow-y-auto bg-retro-white">
      <SEO title="Selamat Datang" />
      
      {/* ═══ BACKGROUND LAYERS ═══ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-40"></div>
        {/* Decorative Shapes */}
        <svg className="absolute w-20 h-20 top-[5%] right-[-10%] text-retro-yellow opacity-30" viewBox="0 0 100 100" fill="currentColor"><path d="M10,50 Q20,10 50,20 T90,50 T50,80 T10,50 Z" /></svg>
        <svg className="absolute w-24 h-24 bottom-[15%] left-[-15%] text-retro-pink opacity-30" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="40" /></svg>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center mt-4">
        
        {/* ── Profile Photo Section (Neo-Brutalism) ── */}
        <div className="relative w-full max-w-[200px] mb-10">
          {/* Layered offset backgrounds */}
          <div className="absolute inset-0 gradient-lavender-pink border-[2.5px] border-retro-dark rounded-2xl translate-x-3 translate-y-3 shadow-sm"></div>
          <div className="absolute inset-0 gradient-blue-mint border-[2.5px] border-retro-dark rounded-2xl translate-x-1.5 translate-y-1.5"></div>

          {/* Main photo card */}
          <div className="relative bg-retro-white border-[2.5px] border-retro-dark p-1.5 rounded-2xl shadow-sm">
            <div className="rounded-xl overflow-hidden aspect-[4/5] border-[2px] border-retro-dark bg-retro-grey">
              <img src="/profile.png" alt="Mohamad Rizki" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/400x500/FFF8EC/2D2A26?text=Profile'} />
            </div>
          </div>

          {/* Floating stat stickers (CSS animations for performance) */}
          <div className="absolute -bottom-3 -left-3 sticker bg-retro-yellow z-20 border-[2px] border-retro-dark shadow-sm transition-transform duration-1000 ease-in-out origin-center hover:scale-105">
            <span className="text-[10px] font-bold">Mohamad Rizki, S.Pd., Gr.</span>
          </div>
          <div className="absolute -top-3 -right-3 sticker bg-retro-mint rotate-3 z-20 border-[2px] border-retro-dark shadow-sm">
            <span className="text-[10px] font-bold">Reezapps' Dev</span>
          </div>
        </div>

        {/* ── Text Content ── */}
        <div className="text-center w-full flex flex-col items-center">
          <div className="inline-flex px-3 py-1 gradient-yellow-lime border-[2px] border-retro-dark rounded-full font-heading font-bold text-[10px] mb-4 shadow-sm -rotate-2">
            <span className="flex items-center gap-1.5 text-retro-dark">
              <Sparkle weight="fill" size={12} />
              Guru SD & Edukator
            </span>
          </div>

          <h1 className="font-heading text-[2.2rem] font-bold leading-[1.05] mb-4 tracking-tight text-retro-dark">
            Pendidik Kenal Digital<br />
            <span className="inline-block bg-retro-dark text-retro-yellow px-2 py-0.5 border-[2px] border-retro-dark shadow-sm rotate-[-1deg] mt-1.5">Belajar Seru</span>{" "}
            <br/>
            <span className="inline-block bg-retro-yellow px-2 py-0.5 border-[2px] border-retro-dark shadow-sm rotate-[1deg] mt-1">Hasil Maksimal</span>
          </h1>

          {/* Description in Retro Window */}
          <div className="w-full bg-retro-white border-[2.5px] border-retro-dark rounded-xl shadow-[4px_4px_0px_#2D2A26] mb-6 overflow-hidden text-left">
            <div className="bg-retro-dark px-3 py-1.5 border-b-[2.5px] border-retro-dark flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBCB0] border-[1px] border-retro-dark mr-1.5"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD56B] border-[1px] border-retro-dark mr-1.5"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#B5D8B0] border-[1px] border-retro-dark mr-2"></div>
              <span className="text-[9px] font-bold text-retro-white/70 font-heading">tentang.md</span>
            </div>
            <div className="p-3">
              <p className="text-xs text-retro-dark/85 font-medium leading-relaxed">
                Sampurasun! Pendekatan <span className="font-bold text-retro-dark">pedagogik kreatif</span> dan <span className="font-bold text-retro-dark">media interaktif</span> untuk menghadirkan pengalaman belajar bermakna.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <button
              onClick={handleStart}
              className="w-full bg-retro-yellow text-retro-dark font-heading font-bold text-sm px-5 py-3.5 rounded-xl border-[2.5px] border-retro-dark shadow-[3px_3px_0px_#2D2A26] active:shadow-[0px_0px_0px_#2D2A26] active:translate-y-[3px] active:translate-x-[3px] transition-all flex justify-center items-center gap-2"
            >
              Mulai Jelajah
              <ArrowRight weight="bold" size={16} />
            </button>
            <button
              onClick={() => navigate('/tentang-saya')}
              className="w-full bg-retro-white text-retro-dark font-heading font-bold text-sm px-5 py-3.5 rounded-xl border-[2.5px] border-retro-dark hover:bg-retro-grey transition-colors flex justify-center items-center"
            >
              Tentang Saya
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
