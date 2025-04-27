import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import { ChevronUp, ChevronDown } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";

interface HeroSectionProps {
  onShopClick: () => void;
  isIOS: boolean;
  isMobile: boolean;
}

const HeroSection = ({ onShopClick, isIOS, isMobile }: HeroSectionProps) => {
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides] = useState(3);
  const [slideProgress, setSlideProgress] = useState(0);
  const swiperRef = useRef<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);

  const heroSlides = isMobile
    ? [
        { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/7ce6a0a174264d11954f01ea3bab82d8.mp4" },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_phone.png?v=1743282576",
        },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_blue_phone.jpg?v=1743282582",
        },
      ]
    : [
        { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/d171bd97a07040888e99f84f4cf6f5c0.mp4" },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_deskto.png?v=1743282580",
        },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/blue_desktop_scamp.jpg?v=1743282583",
        },
      ];

  // Initial setup
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(0, 0);
    }

    // Initialize video playback
    const initializeVideo = async () => {
      const video = videoRefs.current[0];
      if (video) {
        try {
          video.muted = true;
          video.playsInline = true;
          video.autoplay = true;
          
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Video autoplay started");
              })
              .catch((error) => {
                console.error("Autoplay failed:", error);
                const playOnInteraction = () => {
                  video.muted = false;
                  video.play().catch(console.error);
                  document.removeEventListener("click", playOnInteraction);
                  document.removeEventListener("touchstart", playOnInteraction);
                };
                document.addEventListener("click", playOnInteraction);
                document.addEventListener("touchstart", playOnInteraction);
              });
          }
        } catch (err) {
          console.error("Video initialization error:", err);
        }
      }
    };

    setTimeout(initializeVideo, 100);

    return () => {
      videoRefs.current.forEach((video) => video?.pause());
    };
  }, []);

  // Handle slide transitions
  useEffect(() => {
    const currentSlide = heroSlides[activeIndex];

    if (currentSlide.type === "video" && videoRefs.current[activeIndex]) {
      const video = videoRefs.current[activeIndex];
      video.currentTime = 0;

      const playVideo = async () => {
        try {
          video.muted = false;
          await video.play();
        } catch (err) {
          console.error("Video play error:", err);
          const playOnInteraction = () => {
            video.play().catch(console.error);
            document.removeEventListener("click", playOnInteraction);
            document.removeEventListener("touchstart", playOnInteraction);
          };
          document.addEventListener("click", playOnInteraction);
          document.addEventListener("touchstart", playOnInteraction);
        }
      };

      playVideo();

      const updateProgress = () => {
        setSlideProgress(video.currentTime / video.duration);
      };

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("ended", () => {
        if (activeIndex < totalSlides - 1) {
          goToNextSlide();
        } else {
          onShopClick();
        }
      });

      return () => {
        video.removeEventListener("timeupdate", updateProgress);
        video.pause();
      };
    } else {
      setSlideProgress(0);
      const timer = setTimeout(() => {
        if (activeIndex < totalSlides - 1) {
          goToNextSlide();
        } else {
          onShopClick();
        }
      }, 5000);

      const progressInterval = setInterval(() => {
        setSlideProgress((prev) => Math.min(prev + 0.02, 1));
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [activeIndex]);

  const goToNextSlide = () => {
    if (activeIndex < totalSlides - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.slideTo(nextIndex, 500);
      }
    } else {
      onShopClick();
    }
  };

  const goToPrevSlide = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex);
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.slideTo(prevIndex, 500);
      }
    }
  };

  const calculateProgressHeight = () => {
    const segmentHeight = 100 / totalSlides;
    return (activeIndex + slideProgress) * segmentHeight;
  };

  return (
    <section className={`relative ${isIOS ? "h-[100vh]" : "h-[100svh]"}`}>
      <Swiper
        ref={swiperRef}
        modules={[EffectFade]}
        effect="fade"
        speed={800}
        fadeEffect={{ crossFade: true }}
        initialSlide={0}
        loop={false}
        slidesPerView={1}
        allowTouchMove={true}
        navigation={false}
        className="h-full w-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.update();
          }, 100);
        }}
        touchRatio={1}
        touchAngle={45}
        touchMoveStopPropagation={true}
        preventInteractionOnTransition={true}
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index} className="h-full">
            {slide.type === "video" ? (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  muted={isMuted}
                  autoPlay
                  playsInline
                  preload="auto"
                  className="absolute inset-0 object-cover h-full w-full"
                  style={{ transform: "translateZ(0)" }}
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
                <div className="absolute bottom-36 left-6 z-[100]">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                      const video = videoRefs.current[index];
                      if (video) {
                        video.muted = !isMuted;
                      }
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="bg-white/30 hover:bg-white/40 p-2 rounded-full transition-colors backdrop-blur-sm scale-75 md:scale-90 touch-manipulation pointer-events-auto"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-4 h-4 md:w-5 md:h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-4 h-4 md:w-5 md:h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <img
                src={slide.src || "/placeholder.svg"}
                alt={`Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "translateZ(0)" }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom navigation bar */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-20 flex items-center">
        <div className="flex flex-col items-center py-2 px-1.5 rounded-full bg-white/30 backdrop-blur-sm scale-75 md:scale-90">
          <button
            ref={navigationPrevRef}
            className="w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white"
            onClick={goToPrevSlide}
            disabled={activeIndex === 0}
          >
            <ChevronUp size={16} className="md:w-[22px] md:h-[22px]" />
          </button>

          <div className="h-40 md:h-56 w-1.5 md:w-2 my-2 md:my-3 relative rounded-full">
            <div
              className="absolute top-0 w-full bg-white transition-all duration-100 rounded-full shadow-glow"
              style={{ height: `${calculateProgressHeight()}%` }}
            />
          </div>

          <button
            ref={navigationNextRef}
            className="w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white"
            onClick={goToNextSlide}
          >
            <ChevronDown size={16} className="md:w-[22px] md:h-[22px]" />
          </button>
        </div>
      </div>

      {/* Shop button */}
      <div className="absolute bottom-36 md:bottom-44 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={onShopClick}
          className="text-white/80 text-base md:text-sm font-medium touch-target touch-feedback bg-white/30 hover:bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onShopClick();
            }
          }}
        >
          SHOP
        </button>
      </div>
    </section>
  );
};

export default HeroSection; 