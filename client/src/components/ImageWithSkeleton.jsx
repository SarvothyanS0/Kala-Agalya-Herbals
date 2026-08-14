import { useState, useEffect, useRef } from "react";

export default function ImageWithSkeleton({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  skeletonClassName = "",
  loading = "lazy",
  fetchpriority,
  decoding = "async",
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    // If the image is already in the browser cache (or is a data URI already decoded),
    // the browser sets img.complete = true before React attaches the onLoad handler.
    // We poll once on the next tick to catch that case.
    const quickCheck = setTimeout(() => {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }, 50);
    // Hard fallback: if image still hasn't loaded after 5 s (large data URI on slow mobile),
    // force-show it so it never stays stuck behind the skeleton forever.
    const fallback = setTimeout(() => {
      setIsLoaded(true);
    }, 5000);
    return () => {
      clearTimeout(quickCheck);
      clearTimeout(fallback);
    };
  }, [src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoaded(true);
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${containerClassName}`}>
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 skeleton-shimmer z-10 ${skeletonClassName}`} />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchpriority}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        {...props}
      />
    </div>
  );
}

