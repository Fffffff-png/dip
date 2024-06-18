import React, { useContext, useEffect, useState } from "react";
import IconMenu_hamburger from "./icons/IconMenu";
import { Link } from "react-router-dom";
import LoginMenu from "./LoginMenu";
import { AuthContext } from "../AuthProvider";
import IconLeft from "./icons/IconLeft";
import IconFavorite from "./icons/IconFavorite";
import IconFavoriteLine from "./icons/IconFavoriteLine";
import IconOrderedList from "./icons/IconOrderList";

export default function NavBar(props){
    const menuIsOpen= props.menuIsOpen
    const setMenuIsOpen=props.setMenuIsOpen
    const {authToken}=useContext(AuthContext)
    const [loginMeuIsOpen,setLoginMenuIsOpen]=useState(false)
    const isReadPage=props.isReadPage
    const isFavorite=props.isFavorite
    const navBarIsShow=props.navBarIsShow
    const activePage=props.activePage
    const countPage=props.countPage
    const dir=props.dir
    const setIsListChaptersOpen=props.setIsListChaptersOpen
    const isListChaptersOpen=props.isListChaptersOpen
    const sendIsFavorite=props.sendIsFavorite
    return(
        <React.Fragment>
            {isReadPage?
            <><header style={navBarIsShow?{}:{display:"none"}}>
                <nav style={{maxWidth:"800px"}}>
                    <div className="navContainer">
                        <Link className="navButton-a" to="/">
                            <span className="button-label">
                                главная
                            </span>
                        </Link>
                    </div>
                    <div className="navContainer right">
                        {
                        authToken?
                            <IconMenu_hamburger onClick={()=>{setMenuIsOpen(!menuIsOpen)}} style={{fontSize:"1.75rem",cursor:"pointer"}}/>
                        :
                        <React.Fragment>
                            <button onClick={()=>{setLoginMenuIsOpen(!loginMeuIsOpen)}} className="button-main">Вход</button>
                            <LoginMenu loginMenuIsOpen={loginMeuIsOpen} setLoginMenuIsOpen={setLoginMenuIsOpen}/>
                        </React.Fragment>
                        }
                    </div>
                </nav>
            </header>
            <header style={navBarIsShow?{position:"fixed",bottom:"0",top:"auto"}:{display:"none"}}>
                <nav  style={{maxWidth:"800px"}}>
                    <div className="navContainer" style={{maxWidth:"100%",justifyContent:"space-between"}}>
                        <Link className="navButton-a" to={`/title/${dir}`}>
                            <span className="button-label" style={{display:"flex",justifyContent:"center"}}>
                                <IconLeft style={{fontSize:"large"}}/> к тайтлу
                            </span>
                        </Link>
                        <div style={{padding:"10px"}}>{activePage}/{countPage}</div>
                        <IconOrderedList style={{fontSize:"large",color:"var(--text-primary)",padding:"10px"}} onClick={()=>{setIsListChaptersOpen(!isListChaptersOpen)}}/>
                        {isFavorite? <IconFavorite style={{fontSize:"large",color:"red",padding:"10px"}}/>:<IconFavoriteLine onClick={sendIsFavorite} style={{fontSize:"large",color:"var(--text-primary)",padding:"10px"}}/>}
                    </div>
                </nav>
            </header>
            </>
            :
            <header>
                <nav>
                    <div className="navContainer">
                        <Link className="navButton-a" to="/">
                            <span className="button-label">
                                главная
                            </span>
                        </Link>
                        <Link className="navButton-a" to="/catalog">
                            <span className="button-label">
                                каталог
                            </span>
                        </Link>
                        <Link className="navButton-a" to="/search">
                            <span className="button-label">
                                поиск
                            </span>
                        </Link>
                    </div>
                    <div className="navContainer right">
                        {
                        authToken?
                            <IconMenu_hamburger onClick={()=>{setMenuIsOpen(!menuIsOpen)}} style={{fontSize:"1.75rem",cursor:"pointer"}}/>
                        :
                        <React.Fragment>
                            <button onClick={()=>{setLoginMenuIsOpen(!loginMeuIsOpen)}} className="button-main">Вход</button>
                            <LoginMenu loginMenuIsOpen={loginMeuIsOpen} setLoginMenuIsOpen={setLoginMenuIsOpen}/>
                        </React.Fragment>
                        }
                    </div>
                </nav>
            </header>
            }
        </React.Fragment>
    )
}