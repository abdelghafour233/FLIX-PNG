
import React, { useState, useRef } from 'react';
import { Upload, CloudUpload } from 'lucide-react';
import { Translation } from '../types';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  t: Translation;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesAdded, t }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Fix: Explicitly cast Array.from result to File[] as FileList conversion can sometimes result in unknown types
    const files = (Array.from(e.dataTransfer.files) as File[]).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) onFilesAdded(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Fix: Explicitly cast to File[] to match onFilesAdded prop signature
      const files = Array.from(e.target.files) as File[];
      onFilesAdded(files);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative group cursor-pointer border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-300
        flex flex-col items-center justify-center text-center gap-4
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
          : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50'
        }
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInput} 
        multiple 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className={`
        p-6 rounded-3xl transition-transform duration-300 group-hover:scale-110
        ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}
      `}>
        <CloudUpload className="w-12 h-12" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">{t.dropzoneTitle}</h3>
        <p className="text-slate-500 font-medium">{t.dropzoneSubtitle}</p>
      </div>

      <div className="mt-2 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        {t.language === 'English' ? 'Browse Files' : 'استعراض الملفات'}
      </div>
    </div>
  );
};

export default FileUploader;
