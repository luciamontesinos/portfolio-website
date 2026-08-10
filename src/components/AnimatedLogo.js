import { useState, useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";

const LogoLMContainer = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

function AnimatedLogo(){
    const [animationStage, setAnimationStage] = useState('initial');
    const [morphProgress, setMorphProgress] = useState(0);
    const logoRef = useRef(null);
    const theme = useTheme();
    const [isBlinking,setIsBlinking] = useState(false);


    const strokeColor = theme.color

  const startMain = [
    [30, 40, 30, 80],
    [30, 80, 60, 80],
    [60, 80, 60, 40],
    [60, 40, 75, 55],
    [75, 55, 90, 40],
    [90, 40, 90, 80]
  ];

  const endMain = [
    [30, 34, 34, 80],
    [34, 80, 34, 80],
    [34, 80, 70, 75],
    [70, 75, 50, 90],
    [50, 90, 70, 95],
    [70, 95, 38, 115]
  ];

    // Lerp function
    const lerp = (start, end, progress) => {
      return start + (end - start) * progress;
    };

    // Easing function for smooth animation
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    useEffect(() => {
      const timer1 = setTimeout(() => setAnimationStage('morphing'), 500);
      const timer2 = setTimeout(() => setAnimationStage('moving'), 2500);
      const timer3 = setTimeout(() => setAnimationStage('complete'), 3500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, []);

    // Morph animation using lerp
    useEffect(() => {
      if (animationStage === 'morphing') {
        const startTime = Date.now();
        const duration = 2000; // 2 seconds

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeInOutCubic(progress);

          setMorphProgress(easedProgress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    }, [animationStage]);


    useEffect(() => {
    if (animationStage !== 'complete') return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 200); // Blink duration: 0.4 seconds
    }, 4000); // Blink every 4 seconds

    return () => clearInterval(blinkInterval);
  }, [animationStage]);


    const renderLines = () => {
      let lines;

      if (animationStage === 'initial') {
        lines = startMain;
      } else if (animationStage === 'morphing') {
        // Lerp between start and end based on progress
        lines = startMain.map((startLine, i) => {
          const endLine = endMain[i];
          return [
            lerp(startLine[0], endLine[0], morphProgress),
            lerp(startLine[1], endLine[1], morphProgress),
            lerp(startLine[2], endLine[2], morphProgress),
            lerp(startLine[3], endLine[3], morphProgress)
          ];
        });
      } else {
        lines = endMain;
      }

      return lines.map((line, i) => (
        <line
          key={i}
          x1={line[0]}
          y1={line[1]}
          x2={line[2]}
          y2={line[3]}
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
        />
      ));
    };

   const renderEyes = () => {
    if (animationStage !== 'complete' || isBlinking || !logoRef.current) return null;


    // Left eye center position (in viewBox coordinates)
      const leftEyeCenterX = 15;
      const leftEyeCenterY = 60;

      // Right eye center position
      const rightEyeCenterX = 60;
      const rightEyeCenterY = 50;


    return (
      <>
        <circle cx={leftEyeCenterX} cy={leftEyeCenterY} r="8" fill={strokeColor} />
        <circle cx={rightEyeCenterX} cy={rightEyeCenterY} r="8" fill={strokeColor} />
      </>
    );
  };

    const getContainerStyles = () => {
      const base = {
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
      };

      if (animationStage === 'initial' || animationStage === 'morphing') {
        return {
          ...base,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          zIndex: 10000,
        };
      } else if (animationStage === 'moving' || animationStage === 'complete') {
        return {
          ...base,
          position: 'fixed',
          top: '20px',
          left: '10px',
          width: '50px',
          height: '50px',
          zIndex: 10000,
          cursor: animationStage === 'complete' ? 'pointer' : 'default',
        };
      }
    };

    const getOverlayOpacity = () => {
      if (animationStage === 'initial' || animationStage === 'morphing') {
        return 1;
      } else if (animationStage === 'moving') {
        return 0;
      }
      return 0;
    };

     const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    return (
      <LogoLMContainer>
        {/* Black overlay */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: getOverlayOpacity(),
            transition: 'opacity 1s ease-out',
            pointerEvents: animationStage === 'complete' ? 'none' : 'all',
            zIndex: 9999,
          }}
        />

        <div ref={logoRef} style={getContainerStyles()} onClick={animationStage === 'complete' ? handleClick : undefined}>
          <svg
            viewBox="0 0 120 120"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <g>
              {renderLines()}
            </g>
            {renderEyes()}
          </svg>
        </div>

        <style>{`
          .eye {
            transition: cx 0.1s ease-out, cy 0.1s ease-out;
          }
            /* Default: hide on all devices */
        .logo-container,
        .logo-overlay {
          display: none;
        }

        /* Show logo only on desktop (min-width: 768px) */
        @media (min-width: 768px) {
          .logo-container,
          .logo-overlay {
            display: block;
          }
        }
        `}</style>
      </LogoLMContainer>
    );
  };

export default AnimatedLogo;
