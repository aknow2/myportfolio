import React from "react"
import { Link } from "gatsby"
import tw, { styled } from 'twin.macro'
import useHeroHeader from '../canvas/hero_background';

const Nav = styled.nav(() => [
  tw`fixed inset-x-0 top-0 flex flex-row justify-between z-10 text-white`,
]);
const HeroHeader = styled.header(() => [
  tw`bg-center bg-black bg-fixed bg-no-repeat bg-center bg-cover h-screen relative`,
])

const Title = styled.h1(() => [
  tw`text-5xl`
]);
const Canvas = styled.canvas(() => [
  tw`h-screen w-full`
]);


export default function Layout({ children }) {
  useHeroHeader();
  return (
    <>
      <Nav>
        <Link to={`/`}>
          <Title>
            aKnow2
          </Title>
        </Link>
      </Nav>
      <HeroHeader>
        <Canvas id="hero_header_canvas" />
        aa
      </HeroHeader>
      {children}
    </>
  )
}
