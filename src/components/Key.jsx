import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Key({ onKeyUsed }) {
  const [landed, setLanded] = useState(false)
  const keyRef = useRef(null)
  const clickedRef = useRef(false)

  useEffect(() => {
    if (!landed) return
    const el = keyRef.current
    gsap.fromTo(el,
      { filter: 'none' },
      {
        filter: 'drop-shadow(0 0 20px white) drop-shadow(0 0 40px rgba(100,149,237,1)) drop-shadow(0 0 60px rgba(0,100,255,0.9))',
        duration: 0.3,
        repeat: 5,
        yoyo: true,
        ease: 'sine.inOut',
        onComplete: () => {
          gsap.to(el, { filter: 'none', duration: 0.2 })
        }
      }
    )
  }, [landed])

  const handleClick = () => {
    if (clickedRef.current) return
    clickedRef.current = true

    const el = keyRef.current
    gsap.killTweensOf(el)

    const tl = gsap.timeline({ delay: 0 })

    tl.to(el, {
      duration: 1.1,
      ease: 'none',
      keyframes: [
        { x: '0%',    y: '0%',    rotation: 0,  ease: 'power3.out'   },
        { x: '2%',    y: '-2%',   rotation: 6,  ease: 'power1.inOut' },
        { x: '4%',    y: '-4%',   rotation: 11, ease: 'power1.inOut' },
        { x: '6%',    y: '-7%',   rotation: 16, ease: 'power1.inOut' },
        { x: '9%',    y: '-10%',  rotation: 21, ease: 'power1.inOut' },
        { x: '11%',   y: '-12%',  rotation: 26, ease: 'power1.inOut' },
        { x: '13%',   y: '-14%',  rotation: 31, ease: 'power1.inOut' },
        { x: '15%',   y: '-16%',  rotation: 36, ease: 'power1.inOut' },
        { x: '17%',   y: '-17%',  rotation: 40, ease: 'power1.inOut' },
        { x: '19%',   y: '-18%',  rotation: 45, ease: 'power1.inOut' },
        { x: '21%',   y: '-19%',  rotation: 49, ease: 'power1.inOut' },
        { x: '23%',   y: '-20%',  rotation: 53, ease: 'power1.inOut' },
        { x: '24%',   y: '-20%',  rotation: 57, ease: 'power1.inOut' },
        { x: '26%',   y: '-20%',  rotation: 61, ease: 'power1.inOut' },
        { x: '27%',   y: '-20%',  rotation: 64, ease: 'power1.inOut' },
        { x: '28%',   y: '-20%',  rotation: 67, ease: 'power1.inOut' },
        { x: '29%',   y: '-20%',  rotation: 70, ease: 'power1.inOut' },
        { x: '30%',   y: '-19%',  rotation: 73, ease: 'power1.inOut' },
        { x: '31%',   y: '-19%',  rotation: 76, ease: 'power1.inOut' },
        { x: '32%',   y: '-18%',  rotation: 79, ease: 'power2.inOut' },
        { x: '32.5%', y: '-18%',  rotation: 81, ease: 'power2.inOut' },
        { x: '33%',   y: '-17%',  rotation: 83, ease: 'power2.inOut' },
        { x: '33.5%', y: '-17%',  rotation: 85, ease: 'power2.out'   },
        { x: '34%',   y: '-17%',  rotation: 87, ease: 'power3.out'   },
        { x: '34.2%', y: '-16%',  rotation: 88, ease: 'power3.out'   },
        { x: '34.5%', y: '-16%',  rotation: 90, ease: 'power3.out'   },
      ],
    })

    tl.call(() => setLanded(true))
    tl.call(() => setTimeout(onKeyUsed, 2800), [], '+=0')
  }

  return (
    <img
      ref={keyRef}
      src="/gary_book_key.png"
      alt="Key"
      onMouseEnter={() => {
        if (clickedRef.current) return
        gsap.to(keyRef.current, {
          filter: 'drop-shadow(0 0 6px rgba(192,192,192,0.9)) drop-shadow(0 0 12px rgba(220,220,220,0.7)) brightness(1.3)',
          duration: 0.3,
        })
      }}
      onMouseLeave={() => {
        if (clickedRef.current) return
        gsap.to(keyRef.current, { filter: 'none', duration: 0.3 })
      }}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: '22%',
        width: '55%',
        height: 'auto',
        zIndex: 99999,
        cursor: 'pointer',
        filter: 'none',
      }}
    />
  )
}