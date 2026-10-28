import React from 'react'
import Card from './Card'
const CardSection = (props) => {
  return (
    <div className='py-35' id="Features">
    <div>
       <h1 className='text-center'>
       <span className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-semibold">
          Key Features
        </span>
        </h1>
    </div>
    <div className='flex flex-row justify-center items-center mt-10 '>
    {props.content.map(function (elem,indx){
      return <Card key={indx} logo={elem.logo} title={elem.title} description={elem.description}/>
    }
    )}
    </div>
    </div>
  )
}

export default CardSection
