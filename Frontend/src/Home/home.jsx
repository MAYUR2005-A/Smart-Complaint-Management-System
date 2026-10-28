import React from 'react'
import Nav from '../components/navbar.jsx'
import PageContent from './PageContent.jsx'
import Footer from './Footer.jsx'
const home = (props) => {
  return (
    <div id="Home">
        <Nav/>
        <PageContent content={props.content}/>
        <Footer/>
    </div>
  )
}

export default home
