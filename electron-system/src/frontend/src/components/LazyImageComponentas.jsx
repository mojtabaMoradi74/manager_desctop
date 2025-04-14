/* eslint-disable */

import React, { memo, useEffect, useRef } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerFree: {
    height: 'full',
  },
  containerNotFree: {
    height: 'auto',
  },
  ratio: {
    display: 'block',
  },
  ratioLandscape: {
    paddingBottom: '56.25%',
  },
  ratioWide: {
    paddingBottom: '35%',
  },
  ratioSquare: {
    paddingBottom: '100%',
  },
  ratioFree: {
    paddingBottom: '0',
  },
  skeleton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    transition: 'opacity 0.5s ease-in-out',
    display: 'flex',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'white',
  },
  showSkeleton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    backgroundSize: '23px auto',
  },
  img: {
    width: '100%',
    height: '100%',
    transition: 'opacity 0.5s ease-in-out',
    objectFit: 'cover',
    opacity: 0,
  },
  imgPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  showImg: {
    opacity: 1,
  },
}));

const LazyImageComponent = ({ src, landscape, wide, free, className, mimeType }) => {
  const classes = useStyles();
  const imageRef = useRef(null);
  const skeletonRef = useRef(null);
  const isVideo = mimeType?.includes('video');

  const showImgClasses = classes.showImg;

  function handleChangeImage() {
    try {
      if (isVideo) {
        if (imageRef.current) {
          imageRef.current.src = src;
          skeletonRef?.current?.classList?.remove(showImgClasses);
          imageRef.current.classList.add(showImgClasses);
          imageRef.current.play().catch((error) => {
            console.error('Video play failed:', error);
          });
        }
        return;
      }
      const img = new Image();
      img.onload = function () {
        if (!src || !imageRef?.current) {
          skeletonRef?.current?.classList?.remove(showImgClasses);
          return imageRef.current.classList.add(showImgClasses);
        }
        imageRef.current.src = src;
        imageRef.current.classList.add(showImgClasses);
        skeletonRef?.current?.classList?.remove(showImgClasses);
      };
      if (src) img.src = src;
    } catch (error) {
      alert();
    }
  }

  useEffect(() => {
    try {
      if (!(imageRef.current || skeletonRef.current)) {
        skeletonRef?.current?.classList?.remove(showImgClasses);
        return imageRef.current.classList.add(showImgClasses);
      }
      if (src === imageRef.current?.currentSrc) {
        skeletonRef?.current?.classList?.remove(showImgClasses);
        return imageRef.current.classList.add(showImgClasses);
      }
      imageRef?.current?.classList?.remove(showImgClasses);
      skeletonRef?.current?.classList?.add(showImgClasses);

      if (IntersectionObserver) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            return entry?.isIntersecting && handleChangeImage();
          },
          { threshold: [0.01], rootMargin: '0px' }
        );

        if (imageRef.current) {
          observer?.observe(imageRef.current);
        }

        return () => {
          if (observer && observer.unobserve && imageRef.current) {
            observer.unobserve(imageRef.current);
          }
        };
      } else {
        handleChangeImage();
      }
    } catch (error) {
      // alert();
    }
  }, [src, mimeType]);

  const containerClasses = [
    classes.container,
    !free ? classes.containerNotFree : classes.containerFree,
    className?.container,
  ].join(' ');

  const afterClasses = [
    classes.ratio,
    !free && landscape && classes.ratioLandscape,
    !free && wide && classes.ratioWide,
    !free && !landscape && !wide && classes.ratioSquare,
    free && classes.ratioFree,
    className?.ratio,
  ].join(' ');

  const skeletonClasses = [classes.skeleton, classes.showSkeleton].join(' ');

  const imgClasses = [classes.img, !free && classes.imgPosition, className?.img].join(' ');

  return (
    <div className={containerClasses}>
      <div className={afterClasses} />
      <div className={skeletonClasses} ref={skeletonRef}></div>
      {isVideo ? (
        <video src={src} className={imgClasses} ref={imageRef} autoPlay loop playsInline preload="auto" muted>
          <source src={src} type={mimeType} />
        </video>
      ) : (
        <img className={imgClasses} ref={imageRef} />
      )}
    </div>
  );
};

export default memo(LazyImageComponent);
