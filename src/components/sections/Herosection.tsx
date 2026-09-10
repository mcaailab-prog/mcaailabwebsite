'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'


const HERO_IMAGES = [
  '/hero1.jpg', 
  '/2hero.jpg', 
  '/hero3.jpg',
  '/4hero.jpg',
  '/5hero.jpg',
  '/6hero.jpg',
]

const ROTATION_INTERVAL_MS = 6000

/**
 * Animates a single word with a typewriter effect: types it out character
 * by character, pauses, deletes it, pauses, then repeats. Returns the
 * current substring to render plus whether the cursor should be visible.
 */
function useTypewriter(
  word: string,
  options: { typingSpeedMs?: number; deletingSpeedMs?: number; pauseMs?: number } = {}
) {
  const { typingSpeedMs = 120, deletingSpeedMs = 70, pauseMs = 1800 } = options
  const [displayedText, setDisplayedText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    if (phase === 'typing') {
      if (displayedText.length < word.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(word.slice(0, displayedText.length + 1))
        }, typingSpeedMs)
        return () => clearTimeout(timeout)
      }
      setPhase('pausing')
      return
    }

    if (phase === 'pausing') {
      const timeout = setTimeout(() => setPhase('deleting'), pauseMs)
      return () => clearTimeout(timeout)
    }

    // phase === 'deleting'
    if (displayedText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayedText(word.slice(0, displayedText.length - 1))
      }, deletingSpeedMs)
      return () => clearTimeout(timeout)
    }
    setPhase('typing')
  }, [displayedText, phase, word, typingSpeedMs, deletingSpeedMs, pauseMs])

  return displayedText
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const typedInnovation = useTypewriter('Innovation')

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, ROTATION_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative w-full overflow-hidden py-12 px-4">

      <div className="absolute inset-0">
        {HERO_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="100vw"
          />
        ))}
      </div>

      
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg leading-tight">
            Harnessing AI for{' '}
            <span className='text-mcaai-teal'>Community-Driven</span>{' '}
            <span className="relative inline-block align-bottom">
          
              <span className="invisible" aria-hidden="true">
                Innovations
              </span>
              <span className="absolute left-0 top-0">
                {typedInnovation}
                <span className="animate-pulse"></span>
              </span>
            </span>
          </h1>
          <p className="text-base max-w-[65%] md:text-lg text-white/90 mb-8 ">
            Maseno Center for Applied Artificial Intelligence (MCAAI) drives innovation in AI research,
            education, and real-world solutions for health, agriculture, education, climate, and governance.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/research" passHref
              className="px-3 py-3 text-white rounded-full font-bold hover:shadow-xl transition-all transform hover:scale-105"
              style={{ backgroundColor: '#72C6D5' }}
            >
              Explore Research
            </Link>
            <a href="#contact" className="px-3 py-3 bg-white rounded-full font-bold border-2 transition-all hover:bg-opacity-90"
              style={{ color: '#72C6D5', borderColor: '#72C6D5' }}
            >
              Partner With Us
            </a>
          </div>
        </div>

        {/* Dots stay centered across the full hero width, independent of
            the left-aligned text column above */}
        <div className="flex gap-2 justify-center mt-10">
          {HERO_IMAGES.map((src, index) => (
            <button
              key={src}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show background image ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-6 bg-mcaai-green' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}