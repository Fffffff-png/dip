import React, { useContext, useEffect, useState } from "react";
import IconAccount from "./icons/IconAccount";
import IconBookmarks from "./icons/IconBookmarks";
import IconIconNotification from "./icons/IocnNotification";
import IconGrid3x3Gap from "./icons/IconGrid";
import IconSearch from "./icons/IconSearch";
import { Link } from "react-router-dom";

import LoginMenu from "./LoginMenu";
import { AuthContext } from "../AuthProvider";

export default function Menu(props){
    const menuIsOpen=props.menuIsOpen
    const setMenuIsOpen=props.setMenuIsOpen
    const [loginMeuIsOpen,setLoginMenuIsOpen]=useState(false)
    const {authToken,user}=useContext(AuthContext)
    return(
        <React.Fragment>
            <div className="menu" style={menuIsOpen? {display:"flex"}:{display:"none"}}>
                <div style={{height:"100%",width:"100%"}} onClick={()=>{setMenuIsOpen(!menuIsOpen)}}/>
                <div className="menu-content">
                    <div className="menu-item" style={{padding:"50px 25px"}}>
                        {authToken?
                            <h1 className="menu-text" style={{fontWeight:"600",fontSize:"1rem"}}>{user}</h1>
                        :
                        <React.Fragment>
                            <button onClick={()=>{setLoginMenuIsOpen(!loginMeuIsOpen)}} style={{width:"100%"}} className="button-main">Вход</button>
                            <LoginMenu loginMenuIsOpen={loginMeuIsOpen} setLoginMenuIsOpen={setLoginMenuIsOpen}/>
                        </React.Fragment> 
                        }
                    </div>
                    <Link onClick={()=>{setMenuIsOpen(!menuIsOpen)}} className="menu-item" to="/bookmarks">
                        <h1 className="menu-text">Закладки</h1>
                        <IconBookmarks style={{fontSize:"1.25rem"}}/>
                    </Link>
                    <Link onClick={()=>{setMenuIsOpen(!menuIsOpen)}} className="menu-item" to="/notifications">
                        <h1 className="menu-text">Уведомления</h1>
                        <IconIconNotification style={{fontSize:"1.25rem"}}/>
                    </Link>
                    <div style={{padding:"25px"}}/>
                    <Link onClick={()=>{setMenuIsOpen(!menuIsOpen)}} to="/catalog" className="menu-item">
                        <h1 className="menu-text">Каталог</h1>
                        <IconGrid3x3Gap style={{fontSize:"1.25rem"}}/>
                    </Link>
                    <Link onClick={()=>{setMenuIsOpen(!menuIsOpen)}} className="menu-item" to="/search">
                        <h1 className="menu-text">Поиск</h1>
                        <IconSearch style={{fontSize:"1.25rem"}}/>
                    </Link>
                    <div style={{padding:"25px"}}/>
                    <Link onClick={()=>{setMenuIsOpen(!menuIsOpen)}} className="menu-item" to="/new-title">
                        <h1 className="menu-text">Добавить новый тайтл</h1>
                        {/* <IconSearch style={{fontSize:"1.25rem"}}/> */}
                    </Link>
                </div>
            </div>
        </React.Fragment>
    )
}