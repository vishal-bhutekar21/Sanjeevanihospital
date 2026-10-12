import React, { useState } from 'react';

/** Page title block used at the top of every inner page. No badges, no boxes. */
export const PageIntro: React.FC<{
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode; // actions (buttons) or a search box
  image?: string;
  imageAlt?: string;
}> = ({ title, intro, children, image, imageAlt = '' }) => (
  <header className="bg-white border-b border-[#E7E3DA]">
    <div
      className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 ${
        image ? 'grid lg:grid-cols-12 gap-8 lg:gap-12 items-center' : ''
      }`}
    >
      <div className={image ? 'lg:col-span-7' : 'max-w-3xl'}>
        <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.1]">{title}</h1>
        {intro && <p className="mt-4 text-lg text-stone-600 leading-relaxed max-w-2xl">{intro}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
      {image && (
        <div className="lg:col-span-5">
          <Photo src={image} alt={imageAlt} className="w-full aspect-[4/3] rounded-lg" />
        </div>
      )}
    </div>
  </header>
);

/** Section heading with optional line of explanation. */
export const SectionTitle: React.FC<{ title: React.ReactNode; sub?: React.ReactNode; className?: string }> = ({
  title,
  sub,
  className = '',
}) => (
  <div className={`mb-6 max-w-2xl ${className}`}>
    <h2 className="text-[1.5rem] sm:text-[1.875rem] leading-tight">{title}</h2>
    {sub && <p className="mt-2 text-stone-600">{sub}</p>}
  </div>
);

/** Image that never shows a broken icon: falls back to a calm neutral block. */
export const Photo: React.FC<{ src?: string; alt?: string; className?: string }> = ({ src, alt = '', className = '' }) => {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return <div className={`bg-[#EFEBE3] ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} />;
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover bg-[#EFEBE3] ${className}`} />;
};

const initials = (name: string) =>
  name
    .replace(/^(Dr\.?|डॉ\.?)\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Doctor photo, or the doctor's initials until a photo is added. */
export const DoctorPhoto: React.FC<{ src?: string; name: string; className?: string; textClass?: string }> = ({
  src,
  name,
  className = '',
  textClass = 'text-xl',
}) => {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={name}
        className={`bg-[#E8F3F1] text-[#0B5D57] flex items-center justify-center font-heading ${textClass} ${className}`}
      >
        {initials(name)}
      </div>
    );
  }
  return (
    <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={`object-cover object-top bg-[#EFEBE3] ${className}`} />
  );
};
