
import React, { useState, useCallback, useEffect } from 'react';
import { translations } from './i18n';
import { FileState, ImageFormat, Language } from './types';
import FileUploader from './components/FileUploader';
import FileItem from './components/FileItem';
import { convertImage } from './utils/imageProcessor';
import { 
  Image as ImageIcon, 
  Settings2, 
  Download, 
  RefreshCw, 
  Trash2, 
  Languages 
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [files, setFiles] = useState<FileState[]>([]);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleFilesAdded = (newFiles: File[]) => {
    const newStates: FileState[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      targetFormat: 'image/jpeg',
      quality: 0.9,
      status: 'idle',
      progress: 0
    }));
    setFiles(prev => [...prev, ...newStates]);
  };

  const handleUpdateFile = (id: string, updates: Partial<FileState>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      if (file?.resultUrl) URL.revokeObjectURL(file.resultUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleConvert = async (id: string) => {
    const fileState = files.find(f => f.id === id);
    if (!fileState || fileState.status === 'converting') return;

    handleUpdateFile(id, { status: 'converting', progress: 10 });

    try {
      const { blob, size } = await convertImage(fileState.file, fileState.targetFormat, fileState.quality);
      const url = URL.createObjectURL(blob);
      handleUpdateFile(id, { 
        status: 'completed', 
        progress: 100, 
        resultUrl: url, 
        resultSize: size 
      });
    } catch (error) {
      handleUpdateFile(id, { status: 'error', progress: 0 });
    }
  };

  const handleConvertAll = async () => {
    const idleFiles = files.filter(f => f.status === 'idle');
    for (const f of idleFiles) {
      await handleConvert(f.id);
    }
  };

  const handleClearAll = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-slate-500 font-medium">{t.subtitle}</p>
          </div>
        </div>
        
        <button 
          onClick={toggleLanguage}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold shadow-sm"
        >
          <Languages className="w-5 h-5" />
          <span>{t.language}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="space-y-8">
        <section>
          <FileUploader onFilesAdded={handleFilesAdded} t={t} />
        </section>

        {files.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-500" />
                {lang === 'ar' ? 'الصور المختارة' : 'Selected Images'} ({files.length})
              </h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleClearAll}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t.clearAll}
                </button>
                <button 
                  onClick={handleConvertAll}
                  disabled={!files.some(f => f.status === 'idle')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-md shadow-blue-200 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t.convertAll}
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {files.map(fileState => (
                <FileItem 
                  key={fileState.id}
                  fileState={fileState}
                  onUpdate={(updates) => handleUpdateFile(fileState.id, updates)}
                  onRemove={() => handleRemoveFile(fileState.id)}
                  onConvert={() => handleConvert(fileState.id)}
                  t={t}
                  isAr={lang === 'ar'}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-16 text-center text-slate-400 text-sm">
        <p>© 2024 PixelFlex. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
      </footer>
    </div>
  );
};

export default App;
