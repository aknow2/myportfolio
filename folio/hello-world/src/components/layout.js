import React from "react"
import { Link } from "gatsby"
import tw, { styled } from 'twin.macro'

const Container = styled.div(() => [
]);
const Nav = styled.nav(() => [
  tw`fixed inset-x-0 top-0 flex flex-row justify-between z-10 text-white bg-transparent`,
]);

const Title = styled.h1(() => [
  tw`text-5xl`
]);


export default function Layout({ children }) {
  return (
    <Container>
      <Nav>
        <Link to={`/`}>
          <Title>
            aKnow2
          </Title>
        </Link>
      </Nav>
      <header className="bg-center bg-fixed bg-no-repeat bg-center bg-cover h-screen relative" 
        style={
           {
            background: "url('https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')"
          }
        }
      >
		<div className="h-screen bg-opacity-50 bg-black flex items-center justify-center">
			<div className="mx-2 text-center">
				<h1 class="text-gray-100 font-extrabold text-4xl xs:text-5xl md:text-6xl">
					<span className="text-white">Right</span> Place To
           </h1>
           <h2 className="text-gray-200 font-extrabold text-3xl xs:text-4xl md:text-5xl leading-tight">
            Get a <span className="text-white">Better</span> and <span class="text-white">Professionals</span> Design
           </h2>
           <div className="inline-flex">
           <button className="p-2 my-5 mx-2 bg-indigo-700 hover:bg-indigo-800 font-bold text-white rounded border-2 border-transparent hover:border-indigo-800 shadow-md transition duration-500 md:text-xl">Hire US!</button>
           <a href="#about"><button className="p-2 my-5 mx-2 bg-transparent border-2 bg-indigo-200 bg-opacity-75 hover:bg-opacity-100 border-indigo-700 rounded hover:border-indigo-800 font-bold text-indigo-800 shadow-md transition duration-500 md:text-lg">Learn More</button></a>
           </div>
        </div>
    </div>
</header>
    </Container>
  )
}
