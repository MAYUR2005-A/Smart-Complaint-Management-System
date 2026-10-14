import React from 'react'
import HeroSection from './HeroSection'
import CardSection from './CardSection'
import FeatureSection from './FeatureSection'
const PageContent = (props) => {
  return (
    <div>
   <HeroSection/>
   <CardSection content={props.content}/>
   <FeatureSection/>
    </div>
  )
}

export default PageContent
