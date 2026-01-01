
import { Translation, Language } from './types';

export const translations: Record<Language, Translation> = {
  en: {
    title: 'PixelFlex',
    subtitle: 'Professional Image Converter',
    dropzoneTitle: 'Select or drop images here',
    dropzoneSubtitle: 'Supports JPG, PNG, WEBP',
    convertAll: 'Convert All',
    downloadAll: 'Download All',
    clearAll: 'Clear All',
    format: 'Target Format',
    quality: 'Quality',
    statusIdle: 'Ready',
    statusConverting: 'Converting...',
    statusCompleted: 'Completed',
    statusError: 'Error',
    download: 'Download',
    remove: 'Remove',
    language: 'عربي'
  },
  ar: {
    title: 'بكسل فليكس',
    subtitle: 'محول صور احترافي',
    dropzoneTitle: 'اختر أو اسحب الصور هنا',
    dropzoneSubtitle: 'يدعم صيغ JPG, PNG, WEBP',
    convertAll: 'تحويل الكل',
    downloadAll: 'تحميل الكل',
    clearAll: 'مسح الكل',
    format: 'الصيغة المستهدفة',
    quality: 'الجودة',
    statusIdle: 'جاهز',
    statusConverting: 'جاري التحويل...',
    statusCompleted: 'تم التحويل',
    statusError: 'خطأ',
    download: 'تحميل',
    remove: 'حذف',
    language: 'English'
  }
};
