import React from 'react'
import LeftHeroSection from './LeftHeroSection'
import RightHeroSection from './RightHeroSection'
const HeroSection = () => {
  return (
    <div>
      <div className='flex flex-row justify-between items-center pt-8'>
        <LeftHeroSection/>
        <RightHeroSection/>
      </div>
    </div>
  )
}

export default HeroSection
