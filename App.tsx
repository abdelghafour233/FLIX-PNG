
import React, { useState, useEffect } from 'react';
import { translations } from './i18n';
import { FileState, ImageFormat, Language } from './types';
import FileUploader from './components/FileUploader';
import FileItem from './components/FileItem';
import { convertImage } from './utils/imageProcessor';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Settings2, 
  RefreshCw, 
  Trash2, 
  Languages,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [files, setFiles] = useState<FileState[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  const handleFilesAdded = (newFiles: File[]) => {
    const newStates: FileState[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      targetFormat: 'image/jpeg',
      quality: 0.85,
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

    handleUpdateFile(id, { status: 'converting', progress: 30 });

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
    setIsProcessingAll(true);
    const idleFiles = files.filter(f => f.status === 'idle');
    for (const f of idleFiles) {
      await handleConvert(f.id);
    }
    setIsProcessingAll(false);
  };

  const handleClearAll = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-5"
          >
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] shadow-2xl shadow-blue-200 rotate-3">
              <ImageIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.title}</h1>
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-slate-500 font-medium text-lg mt-1">{t.subtitle}</p>
            </div>
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold shadow-sm text-slate-700"
          >
            <Languages className="w-5 h-5 text-blue-500" />
            <span>{t.language}</span>
          </motion.button>
        </header>

        {/* Main Content */}
        <main className="space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FileUploader onFilesAdded={handleFilesAdded} t={t} />
          </motion.section>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Settings2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {lang === 'ar' ? 'الصور المختارة' : 'Images'}
                      </h2>
                      <p className="text-sm text-slate-500 font-medium">{files.length} {lang === 'ar' ? 'ملفات جاهزة' : 'files ready'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleClearAll}
                      className="px-5 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.clearAll}
                    </button>
                    <button 
                      onClick={handleConvertAll}
                      disabled={isProcessingAll || !files.some(f => f.status === 'idle')}
                      className="px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-blue-200 flex items-center gap-3"
                    >
                      {isProcessingAll ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                      {t.convertAll}
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {files.map(fileState => (
                      <motion.div
                        key={fileState.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FileItem 
                          fileState={fileState}
                          onUpdate={(updates) => handleUpdateFile(fileState.id, updates)}
                          onRemove={() => handleRemoveFile(fileState.id)}
                          onConvert={() => handleConvert(fileState.id)}
                          t={t}
                          isAr={lang === 'ar'}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-20 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <span className="text-slate-300">●</span>
            <span className="text-slate-300">●</span>
            <span className="text-slate-300">●</span>
          </div>
          <p className="text-slate-400 font-medium">
            {lang === 'ar' ? 'تم التصميم بكل حب لتحويل صورك بخصوصية تامة' : 'Designed with care for private image conversion'}
          </p>
          <p className="text-slate-400 text-sm mt-2 font-bold opacity-75">
            © 2024 PixelFlex v2.0
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
