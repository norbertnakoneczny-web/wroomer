
import Image from 'next/image'

// Użyj tego zamiast <img> - automatycznie naprawia CLS i LCP
// Dodaje width/height, lazy-load, WebP/AVIF

export function OptimizedImage({ src, alt, priority = false, ...props }) {
  if (!alt) {
    console.warn(`Brak alt dla obrazu: ${src} - dodaj alt dla dostępności!`)
  }
  return (
    <Image
      src={src}
      alt={alt || ''}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
      style={{ height: 'auto', ...props.style }}
    />
  )
}

// Dla LCP hero - użyj priority
export function LcpImage({ src, alt, ...props }) {
  return (
    <>
      <link rel="preload" as="image" href={src} fetchPriority="high" />
      <Image
        src={src}
        alt={alt || 'Wroomer.pl - wyszukiwarka ogłoszeń motoryzacyjnych'}
        priority
        fetchPriority="high"
        sizes="100vw"
        {...props}
      />
    </>
  )
}
