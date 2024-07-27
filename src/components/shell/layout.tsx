import React from 'react'


const Layout: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
  return (
    <>
      {props.children}
    </>
  )
}

export default Layout
