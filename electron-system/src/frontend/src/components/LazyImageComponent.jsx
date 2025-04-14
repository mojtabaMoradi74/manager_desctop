/* eslint-disable */

import React, {memo, useEffect, useRef} from 'react'
import {HOST_API_STORAGE} from 'src/config'

const LazyImageComponent = ({file, landscape, wide, free, className, ratio, ...props}) => {
  const imageRef = useRef(null)
  const skeletonRef = useRef(null)

  let src = file?.url || file?.src || props?.src
  const mimetype = file?.mimetype || props.mimetype
  if (src) src = HOST_API_STORAGE + '/' + src

  // const validSource = src?.startsWith('https://') || src?.startsWith('http://')
  // if (!validSource && src) {
  //   const blob = src?.startsWith(`blob:`)
  //   if (!blob) src = 'https://' + src
  // }
  // const isImage = mimetype?.includes("image");
  const isVideo = mimetype?.includes('video')

  const showImgClasses = 'opacity-100'

  console.log('* * * ImageFullLoad :', {src, isVideo, mimetype, className})

  function handleChangeImage() {
    try {
      //console.log('* * * handleChangeImage a')
      if (!src || !imageRef?.current) {
        skeletonRef?.current?.classList?.remove(showImgClasses)
        if (imageRef?.current) imageRef.current.src = null
        return imageRef.current.classList.add(showImgClasses)
      }
      //console.log('* * * handleChangeImage b')

      if (isVideo) {
        //console.log('* * * handleChangeImage isVideo')

        // if (!validSource) {
        //   skeletonRef?.current?.classList?.remove(showImgClasses)
        //   return imageRef.current.classList.add(showImgClasses)
        // }
        if (imageRef.current) {
          imageRef.current.src = src
          skeletonRef?.current?.classList?.remove(showImgClasses)
          imageRef.current.classList.add(showImgClasses)
          const canPlay = imageRef.current.canPlayType(mimetype)
          if (!canPlay) {
            console.error('* * * ImageFullLoad Video format not supported.')
            skeletonRef?.current?.classList?.remove(showImgClasses)
            return
          }
          imageRef.current.play().catch((error) => {
            //console.log('* * * ImageFullLoad Video play failed:', {error})
          })
        }
        return
      }
      //console.log('* * * handleChangeImage c', {src})

      const img = new Image()
      img.onload = function () {
        //console.log('* * * handleChangeImage onload')

        imageRef.current.src = src
        // ------------------------------------------------------ image
        imageRef.current.classList.add(showImgClasses)
        // ------------------------------------------------------ skeleton
        skeletonRef?.current?.classList?.remove(showImgClasses)
      }
      if (src) img.src = src
    } catch (error) {
      //console.log('* * * ImageFullLoad : ', {error})
    }
  }

  useEffect(() => {
    try {
      if (!(imageRef.current || skeletonRef.current)) {
        skeletonRef?.current?.classList?.remove(showImgClasses)
        return imageRef.current.classList.add(showImgClasses)
      }
      if (src === imageRef.current?.currentSrc) {
        skeletonRef?.current?.classList?.remove(showImgClasses)
        return imageRef.current.classList.add(showImgClasses)
      }
      // imageRef.current.src = IMAGE_PLACEHOLDER;
      // ------------------------------------------------------ image
      imageRef?.current?.classList?.remove(showImgClasses)
      // imageRef.current.classList.add(styles["hidden"]);
      // ------------------------------------------------------ skeleton
      skeletonRef?.current?.classList?.add(showImgClasses)
      // skeletonRef.current.classList.remove(styles["hidden"]);

      if (IntersectionObserver) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            return entry?.isIntersecting && handleChangeImage()
          },
          {threshold: [0.01], rootMargin: '0px'}
        )

        if (imageRef.current) {
          observer?.observe(imageRef.current)
        }

        return () => {
          if (observer && observer.unobserve && imageRef.current) {
            observer.unobserve(imageRef.current)
          }
        }
      } else {
        // alert();
        handleChangeImage()
      }
    } catch (error) {
      // alert();
      //   return false;
    }
  }, [src, mimetype])
  const containerClasses = [
    className?.container,
    // !free && 'h-auto',
    // free && 'h-full',
  ].join(' ')
  const contentClasses = [
    'overflow-hidden relative w-full flex justify-center items-center',
    className?.content,
    // !free && 'h-auto',
    // free && 'h-full',
  ].join(' ')
  const afterClasses = [
    `pb-[${getRatio(ratio)}%]`,
    // className?.ratio,
    'block',
    // !free && landscape && 'pb-[56.25%]',
    // !free && wide && 'pb-[35%]',
    // !free && !landscape && !wide && 'pb-[100%]',
    // free && 'pb-0',
  ].join(' ')

  const skeletonClasses =
    'absolute w-full h-full opacity-0 transition-opacity duration-500 ease-in-out flex bg-center bg-no-repeat bg-white'
  const showSkeletonClasses = 'bg-[#000] bg-[length:23px_auto]'

  const imgClasses = [
    className?.img,
    'w-full h-full transition-opacity duration-500 ease-in-out object-cover',
    // !free && 'absolute left-0 right-0 top-0',
    'opacity-0',
  ].join(' ')

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className={afterClasses} />
        <div className={`${skeletonClasses} ${showSkeletonClasses}`} />
        {isVideo ? (
          <video
            src={src ? src : undefined}
            className={imgClasses}
            ref={imageRef}
            autoPlay
            loop
            playsInline
            preload='auto'
            muted
          >
            <source src={src ? src : undefined} type={mimetype} />
          </video>
        ) : (
          <img className={imgClasses} ref={imageRef} />
        )}
      </div>
    </div>
  )
}
// function getRatio(ratio = '1/1') {
//   return {
//     '4/3':100% /4*3,
//     '3/4':100%/3*4,
//     '6/4':100%/6*4,
//     '4/6':100%/4*6,
//     '16/9': 100%/16*9,
//     '9/16': 100%/9*16,
//     '21/9': 100%/21*9,
//     '9/21': 100%/9*21,
//     '1/1': 100,
//   }[ratio]
// }
function getRatio(ratio = '1/1') {
  return {
    '4/3': (100 / 4) * 3,
    '3/4': (100 / 3) * 4,
    '6/4': (100 / 6) * 4,
    '4/6': (100 / 4) * 6,
    '16/9': (100 / 16) * 9,
    '9/16': (100 / 9) * 16,
    '21/9': (100 / 21) * 9,
    '9/21': (100 / 9) * 21,
    '1/1': 100,
  }[ratio]
}
// LazyImageComponent.propTypes = {
//   ratio: PropTypes.oneOf(['4/3', '3/4', '6/4', '4/6', '16/9', '9/16', '21/9', '9/21', '1/1']),
// }
export default memo(LazyImageComponent)
