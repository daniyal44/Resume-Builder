import { useState, useEffect } from 'react';
import { Upload, Trash2, User, Mail, Phone, MapPin, Globe, LayoutTemplate, Link as LinkIcon } from 'lucide-react';
import type { HeaderData } from '../../types/resume';

interface Props {
  data: HeaderData;
  onChange: (data: HeaderData) => void;
}

export default function PersonalInfoForm({ data, onChange }: Props) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [data.profilePicture]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: keyof HeaderData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-[#09090b] transition-colors p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <User className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Personal Information</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Profile Picture Upload */}
        <div className="flex-shrink-0 flex flex-col gap-3 w-28 sm:w-36">
          <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">Profile Picture</label>
          <div className="relative group w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700/80 flex items-center justify-center overflow-hidden hover:border-zinc-400 dark:border-zinc-600 transition-colors bg-zinc-50 dark:bg-zinc-800/50 transition-colors shrink-0">
            {data.profilePicture && !imgError ? (
              <>
                <img src={data.profilePicture} alt="Profile" onError={() => setImgError(true)} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleChange('profilePicture', '')}
                    className="p-2 bg-white dark:bg-[#09090b] transition-colors/20 hover:bg-white dark:bg-[#09090b] transition-colors/40 rounded-full text-white backdrop-blur-sm transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 transition-colors font-bold tracking-wide text-zinc-900 dark:text-zinc-100">
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold uppercase tracking-wider">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <LinkIcon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
            </div>
            <input
              type="url"
              value={data.profilePicture.startsWith('http') ? data.profilePicture : ''}
              onChange={(e) => handleChange('profilePicture', e.target.value)}
              className="block w-full pl-8 pr-3 py-2 border border-zinc-300 dark:border-zinc-700/80 rounded-lg focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-xs outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 transition-colors hover:bg-white dark:bg-[#09090b] transition-colors focus:bg-white dark:bg-[#09090b] transition-colors"
              placeholder="Paste URL..."
            />
          </div>
        </div>

        {/* Text Fields */}
        <div className="flex-1 w-full space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500"
                  placeholder="e.g. Jane Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Headline</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LayoutTemplate className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="url"
                  value={data.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Contact Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="tel"
                  value={data.contactNumber}
                  onChange={(e) => handleChange('contactNumber', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Physical Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  value={data.physicalAddress}
                  onChange={(e) => handleChange('physicalAddress', e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500"
                  placeholder="123 Resume St, City, Country"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
