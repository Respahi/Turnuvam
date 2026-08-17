import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Save,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  HardDrive,
  X,
  ShieldCheck,
  FileJson,
  RotateCcw,
  Info,
  Calendar,
  Sparkles,
  Archive,
  Github,
  Code2,
} from 'lucide-react';
import { Group, KnockoutMatchData, Match, SaveSlot, Team } from '../types';
import projectSourceFiles from '../projectSourceFiles.json';

interface SaveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  groups: Group[];
  matches: Match[];
  knockoutMatches: KnockoutMatchData[];
  onLoadData: (data: {
    teams: Team[];
    groups: Group[];
    matches: Match[];
    knockoutMatches: KnockoutMatchData[];
  }) => void;
  lastSavedAt: Date | null;
  saveSlots: SaveSlot[];
  onSaveSlot: (name: string) => void;
  onLoadSlot: (slot: SaveSlot) => void;
  onDeleteSlot: (slotId: string) => void;
}

export const SaveManagerModal: React.FC<SaveManagerModalProps> = ({
  isOpen,
  onClose,
  teams,
  groups,
  matches,
  knockoutMatches,
  onLoadData,
  lastSavedAt,
  saveSlots,
  onSaveSlot,
  onLoadSlot,
  onDeleteSlot,
}) => {
  const [newSlotName, setNewSlotName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const playedMatchesCount = matches.filter((m) => m.isPlayed).length;

  // Export current state to JSON file
  const handleExportJson = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'Turnuva Puan Tablosu',
      data: {
        teams,
        groups,
        matches,
        knockoutMatches,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `turnuva_yedek_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(' Turnuva yedeği .json dosyası olarak indirildi!');
  };

  // Export full source code project as ZIP
  const [isExportingZip, setIsExportingZip] = useState(false);
  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // Add all project files
      for (const [filePath, content] of Object.entries(projectSourceFiles)) {
        zip.file(filePath, content as string);
      }

      // Generate the ZIP file
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'turnuva-puan-tablosu-github.zip');
      showToast('📦 Proje kaynak kodları (ZIP) başarıyla indirildi!');
    } catch (err) {
      console.error(err);
      alert('ZIP dosyası oluşturulurken bir hata oluştu.');
    } finally {
      setIsExportingZip(false);
    }
  };

  // Import from JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        const tournamentData = parsed.data || parsed;
        if (
          Array.isArray(tournamentData.teams) &&
          Array.isArray(tournamentData.groups) &&
          Array.isArray(tournamentData.matches)
        ) {
          onLoadData({
            teams: tournamentData.teams,
            groups: tournamentData.groups,
            matches: tournamentData.matches,
            knockoutMatches: tournamentData.knockoutMatches || [],
          });
          showToast(' Turnuva verileri dosyadan başarıyla yüklendi!');
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          alert('Geçersiz yedek dosyası formatı! Lütfen geçerli bir turnuva JSON dosyası seçin.');
        }
      } catch (err) {
        console.error(err);
        alert('Dosya okunurken bir hata oluştu. Lütfen dosya formatını kontrol edin.');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSlotName.trim() || `Yedek (${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})`;
    onSaveSlot(name);
    setNewSlotName('');
    showToast(`"${name}" adıyla kayıt noktası oluşturuldu!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-emerald-950/40 text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Kaydet & Sonraki Gün Devam Et</span>
              </h2>
              <p className="text-xs text-slate-400">
                Turnuva ilerlemenizi tarayıcıda saklayın, yedekleyin veya başka cihaza aktarın
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-medium flex items-center space-x-2 animate-in slide-in-from-top duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Automatic Save Status */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="relative mt-1">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">Anlık Otomatik Kayıt Aktif</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    LocalStorage
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Girdiğiniz her skor ve yaptığınız her değişiklik otomatik olarak kaydedilir. Yarın bu sayfaya aynı tarayıcıdan girdiğinizde kaldığınız yerden devam edebilirsiniz.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 self-end sm:self-center">
              <div className="text-[11px] text-slate-500 flex items-center justify-end space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Son Otomatik Kayıt:</span>
              </div>
              <div className="text-xs font-mono font-medium text-emerald-400 mt-0.5">
                {lastSavedAt
                  ? lastSavedAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : 'Şimdi'}
              </div>
            </div>
          </div>

          {/* Backup & Import Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Export Full Codebase ZIP */}
            <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-xl p-4 hover:border-indigo-400 transition-all flex flex-col justify-between shadow-lg shadow-indigo-950/20">
              <div>
                <div className="flex items-center space-x-2 text-white font-semibold text-sm mb-1">
                  <Github className="w-4 h-4 text-indigo-400" />
                  <span>Projeyi ZIP Olarak İndir</span>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Tüm kaynak kodları, GitHub Actions ve Vite yapılandırmasıyla birlikte bilgisayarınıza `.zip` olarak indirin. GitHub veya Vercel'de anında yayınlayabilirsiniz.
                </p>
              </div>
              <button
                onClick={handleExportZip}
                disabled={isExportingZip}
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md shadow-indigo-950/50"
              >
                <Archive className="w-4 h-4" />
                <span>{isExportingZip ? 'Paketleniyor...' : 'Tüm Projeyi İndir (.zip)'}</span>
              </button>
            </div>

            {/* Export State JSON File */}
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 hover:border-slate-600 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-white font-medium text-sm mb-1">
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span>Skor Verilerini İndir</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Yalnızca turnuva skorlarını ve eşleşmeleri `.json` olarak indirin. Başka cihazda devam etmek için idealdir.
                </p>
              </div>
              <button
                onClick={handleExportJson}
                className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Skor Yedeği İndir (.json)</span>
              </button>
            </div>

            {/* Import File */}
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 hover:border-slate-600 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-white font-medium text-sm mb-1">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Yedek Dosyasından Yükle</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Daha önce indirdiğiniz `.json` skor yedeğini yükleyerek eski bir turnuvayı veya başka bir cihazdaki veriyi açın.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleImportJson}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Dosya Seç & Yükle</span>
                </button>
              </div>
            </div>

          </div>

          {/* Create Manual Save Snapshot */}
          <div className="bg-slate-800/30 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Özel Kayıt Noktası (Snapshot) Oluştur</span>
              </span>
              <span className="text-[11px] text-slate-400">Geri dönmek üzere aşama kaydet</span>
            </div>

            <form onSubmit={handleCreateSlot} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Örn: 1. Gün Sonu - Grup Maçları Yarısı"
                value={newSlotName}
                onChange={(e) => setNewSlotName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg flex items-center space-x-1.5 shadow-md shadow-emerald-950/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Kayıt Noktası Ekle</span>
              </button>
            </form>
          </div>

          {/* Saved Snapshots List */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Kayıtlı Anlık Görüntüler ({saveSlots.length})</span>
              <span className="text-[10px] text-slate-500 font-normal">Tarayıcıda Saklananlar</span>
            </h3>

            {saveSlots.length === 0 ? (
              <div className="p-6 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
                Henüz özel kayıt noktası oluşturulmadı. Yukarıdaki kutucuğu kullanarak turnuva aşamalarınızı isim vererek saklayabilirsiniz.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {saveSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white truncate">{slot.name}</div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{slot.savedAt}</span>
                        </span>
                        <span className="text-emerald-400 font-mono">
                          {slot.playedCount}/{slot.totalCount} Maç
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          onLoadSlot(slot);
                          showToast(`"${slot.name}" kaydı geri yüklendi!`);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Bu kaydı yükle"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Yükle</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`"${slot.name}" kayıt noktasını silmek istediğinize emin misiniz?`)) {
                            onDeleteSlot(slot.id);
                            showToast('Kayıt noktası silindi.');
                          }
                        }}
                        className="p-1.5 bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/50 rounded-lg transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Guidance Info */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Veri Güvenliği Bilgilendirmesi</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-slate-300">
              <li>
                <strong>GitHub / Vercel'de Yayınlama:</strong> <strong>"Tüm Projeyi İndir (.zip)"</strong> butonuna basarak kaynak kodları bilgisayarınıza indirip GitHub veya Vercel'e yükleyerek 7/24 kesintisiz canlıya alabilirsiniz.
              </li>
              <li>
                <strong>Otomatik Koruma:</strong> Tarayıcıyı kapatsanız veya yarın geri dönseniz bile tüm verileriniz en son haliyle saklanır.
              </li>
              <li>
                <strong>Farklı Cihazlar:</strong> Eğer turnuvayı başka bir cihazda sürdürmek isterseniz <strong>"Skor Verilerini İndir (.json)"</strong> yapıp yeni cihazda <strong>"Dosya Seç & Yükle"</strong> seçeneğini kullanabilirsiniz.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Kaldığınız yeri kaydetmek için ek işlem yapmanıza gerek yoktur.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Tamam / Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
