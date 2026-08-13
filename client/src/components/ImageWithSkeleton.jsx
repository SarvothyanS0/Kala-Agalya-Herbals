import { useState, useEffect } from "react";

export default function ImageWithSkeleton({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  skeletonClassName = "",
  loading = "lazy",
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
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
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        {...props}
      />
    </div>
  );
}
