
import React from 'react';
import { FileState, ImageFormat, Translation } from '../types';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  ChevronLeft,
  FileImage,
  Image as ImageIcon
} from 'lucide-react';

interface FileItemProps {
  fileState: FileState;
  onUpdate: (updates: Partial<FileState>) => void;
  onRemove: () => void;
  onConvert: () => void;
  t: Translation;
  isAr: boolean;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileItem: React.FC<FileItemProps> = ({ fileState, onUpdate, onRemove, onConvert, t, isAr }) => {
  const isConverting = fileState.status === 'converting';
  const isCompleted = fileState.status === 'completed';
  const isError = fileState.status === 'error';

  return (
    <div className={`p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center transition-colors ${isCompleted ? 'bg-green-50/30' : 'hover:bg-slate-50/50'}`}>
      {/* File Info & Thumbnail */}
      <div className="flex items-center gap-5 min-w-[280px] w-full lg:w-1/3">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100">
            <img 
              src={fileState.preview} 
              alt="Thumbnail" 
              className="w-full h-full object-cover"
            />
          </div>
          {isCompleted && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg border-2 border-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="font-bold text-slate-800 truncate text-base mb-1" dir="ltr">
            {fileState.file.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-black uppercase">
              {fileState.file.name.split('.').pop()}
            </span>
            <span className="text-slate-400 text-xs font-medium">
              {formatSize(fileState.file.size)}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Group */}
      <div className="flex-1 flex flex-wrap items-center gap-8 w-full">
        {/* Target Format */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.format}</label>
          <div className="relative group">
            <select 
              value={fileState.targetFormat}
              disabled={isConverting || isCompleted}
              onChange={(e) => onUpdate({ targetFormat: e.target.value as ImageFormat })}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-5 py-2.5 pr-10 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[120px]"
            >
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
            <div className={`absolute pointer-events-none inset-y-0 ${isAr ? 'left-3' : 'right-3'} flex items-center text-slate-400`}>
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Quality Slider */}
        {(fileState.targetFormat === 'image/jpeg' || fileState.targetFormat === 'image/webp') && (
          <div className="flex-1 min-w-[180px] space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.quality}</label>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{Math.round(fileState.quality * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              disabled={isConverting || isCompleted}
              value={fileState.quality}
              onChange={(e) => onUpdate({ quality: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}

        {/* Status Actions */}
        <div className="flex items-center gap-4 ml-auto lg:ml-0">
          {isConverting ? (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{Math.round(fileState.progress)}%</span>
              </div>
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${fileState.progress}%` }}
                />
              </div>
            </div>
          ) : isCompleted ? (
            <div className="flex flex-col items-end text-right">
               <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{t.statusCompleted}</span>
               <p className="text-xs text-slate-500 font-bold mt-0.5">
                  {formatSize(fileState.resultSize || 0)}
                  <span className="mx-1 opacity-30">•</span>
                  {Math.round(((fileState.resultSize || 0) / fileState.file.size) * 100)}%
               </p>
            </div>
          ) : (
             <button 
              onClick={onConvert}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              {isAr ? 'تحويل الآن' : 'Convert'}
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
        {isCompleted && fileState.resultUrl && (
          <a 
            href={fileState.resultUrl}
            download={`converted-${fileState.file.name.split('.')[0]}.${fileState.targetFormat.split('/')[1]}`}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-md shadow-green-100"
          >
            <Download className="w-4 h-4" />
            <span className="lg:hidden">{t.download}</span>
          </a>
        )}
        <button 
          onClick={onRemove}
          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title={t.remove}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FileItem;
