'use client'

import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function GameTitle() {
  const titleRef = useRef(null)

  useEffect(() => {
    gsap.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
  }, [])

  return (
    <motion.h1
      ref={titleRef}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 5 }}
      className="text-4xl font-bold text-center"
    >
      Tic Tac Toe
    </motion.h1>
  )
}
