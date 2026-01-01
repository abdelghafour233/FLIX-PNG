
import React from 'react';
import { FileState, ImageFormat, Translation } from '../types';
import { 
  X, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ChevronRight,
  ChevronLeft
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

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Preview & Info */}
      <div className="flex items-center gap-4 min-w-[200px] w-full lg:w-1/3">
        <div className="relative group">
          <img 
            src={fileState.preview} 
            alt="Preview" 
            className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shadow-sm"
          />
          {isCompleted && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg border-2 border-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="font-bold text-slate-800 truncate" dir="ltr">
            {fileState.file.name}
          </h4>
          <p className="text-slate-500 text-sm font-medium">
            {formatSize(fileState.file.size)} • {fileState.file.type.split('/')[1].toUpperCase()}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-wrap items-center gap-6 w-full">
        {/* Target Format */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.format}</label>
          <select 
            value={fileState.targetFormat}
            disabled={isConverting || isCompleted}
            onChange={(e) => onUpdate({ targetFormat: e.target.value as ImageFormat })}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
          >
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>

        {/* Quality */}
        {(fileState.targetFormat === 'image/jpeg' || fileState.targetFormat === 'image/webp') && (
          <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.quality}</label>
              <span className="text-xs font-bold text-blue-600">{Math.round(fileState.quality * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              disabled={isConverting || isCompleted}
              value={fileState.quality}
              onChange={(e) => onUpdate({ quality: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}

        {/* Status & Action */}
        <div className="flex items-center gap-4 ml-auto lg:ml-0">
          {isConverting ? (
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${fileState.progress}%` }}
                />
              </div>
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          ) : isCompleted ? (
            <div className="flex flex-col items-end">
               <span className="text-xs font-bold text-green-600 uppercase mb-1">{t.statusCompleted}</span>
               <p className="text-xs text-slate-400 font-medium">{formatSize(fileState.resultSize || 0)}</p>
            </div>
          ) : (
             <button 
              onClick={onConvert}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-bold flex items-center gap-2"
            >
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {isAr ? 'بدء التحويل' : 'Start'}
            </button>
          )}
        </div>
      </div>

      {/* Final Actions */}
      <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
        {isCompleted && fileState.resultUrl && (
          <a 
            href={fileState.resultUrl}
            download={`converted-${fileState.file.name.split('.')[0]}.${fileState.targetFormat.split('/')[1]}`}
            className="p-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all shadow-sm"
            title={t.download}
          >
            <Download className="w-5 h-5" />
          </a>
        )}
        <button 
          onClick={onRemove}
          className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all shadow-sm"
          title={t.remove}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FileItem;
