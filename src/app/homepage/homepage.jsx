import React from 'react'
import Hero from './Hero'
import Features from './Features'
import About from './About'
import FAQ from './FAQ'

export default function homepage() {
  return (
    <div>
      <Hero/>
      <About/>
      <Features/>
      <FAQ/>
    </div>
  )
}
