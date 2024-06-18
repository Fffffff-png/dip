import React, { useState } from "react";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Menu from "./Menu";

export default function Layout(){
    const [menuIsOpen, setMenuIsOpen]=useState(false)
    return(
        <React.Fragment>
            <main className="main-content">
                <NavBar menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}/>
                <Menu setMenuIsOpen={setMenuIsOpen} menuIsOpen={menuIsOpen}/>

                <Outlet/>
                
                <Footer/>
            </main>
        </React.Fragment>
    )
}