
export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface FileState {
  id: string;
  file: File;
  preview: string;
  targetFormat: ImageFormat;
  quality: number;
  status: 'idle' | 'converting' | 'completed' | 'error';
  progress: number;
  resultUrl?: string;
  resultSize?: number;
}

export interface Translation {
  title: string;
  subtitle: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  convertAll: string;
  downloadAll: string;
  clearAll: string;
  format: string;
  quality: string;
  statusIdle: string;
  statusConverting: string;
  statusCompleted: string;
  statusError: string;
  download: string;
  remove: string;
  language: string;
}

export type Language = 'en' | 'ar';
