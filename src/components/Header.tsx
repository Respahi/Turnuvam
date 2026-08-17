import React from 'react';
import { Trophy, Users, Table, Award, RefreshCw, Zap, Sparkles, HardDrive } from 'lucide-react';

interface HeaderProps {
  activeTab: 'setup' | 'group' | 'bestSeconds' | 'knockout';
  setActiveTab: (tab: 'setup' | 'group' | 'bestSeconds' | 'knockout') => void;
  onLoadSample: () => void;
  onReset: () => void;
  onSimulateAll: () => void;
  onOpenSaveManager: () => void;
  playedMatchesCount: number;
  totalMatchesCount: number;
  championName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLoadSample,
  onReset,
  onSimulateAll,
  onOpenSaveManager,
  playedMatchesCount,
  totalMatchesCount,
  championName,
}) => {
  const progressPercent = totalMatchesCount > 0 ? Math.round((playedMatchesCount / totalMatchesCount) * 100) : 0;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-900/30">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  Turnuva Puan Tablosu & Göstergesi
                </h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                  3 Grup • 9 Takım
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Grup Aşaması, Otomatik Rövanşlı Puan Cetveli ve En İyi 2. Eleme Sistemi
              </p>
            </div>
          </div>

          {/* Tournament Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSaveManager}
              title="Kayıt durumu, yedek indir ve geri yükleme"
              className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center space-x-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kaydet & Devam Et</span>
            </button>

            <button
              onClick={onSimulateAll}
              title="Tüm maç sonuçlarını rastgele doldur"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Rastgele Skorlar</span>
            </button>

            <button
              onClick={onLoadSample}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Örnek Yükle</span>
            </button>

            <button
              onClick={onReset}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-slate-800/80 pt-2 pb-1 gap-2">
          
          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'setup'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>1. Takımlar ve Gruplar</span>
            </button>

            <button
              onClick={() => setActiveTab('group')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'group'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>2. Grup Maçları & Puan Durumu</span>
            </button>

            <button
              onClick={() => setActiveTab('bestSeconds')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'bestSeconds'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>3. En İyi 2. Takım</span>
            </button>

            <button
              onClick={() => setActiveTab('knockout')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'knockout'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>4. Eleme Aşaması</span>
              {championName && (
                <span className="ml-1 bg-amber-900/80 text-amber-200 text-[10px] px-1.5 py-0.5 rounded-full border border-amber-400/40 font-bold">
                  🏆 {championName}
                </span>
              )}
            </button>
          </nav>

          {/* Match Completion Stats */}
          <div className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80 self-start sm:self-auto">
            <span>Oynanan Maçlar:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {playedMatchesCount} / {totalMatchesCount}
            </span>
            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-slate-300">{progressPercent}%</span>
          </div>

        </div>
      </div>
    </header>
  );
};
