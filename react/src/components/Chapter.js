import React from "react";
import IconFavorite from "./icons/IconFavorite";
import IconStar from "./icons/IconStar";
import { Link, useLocation } from "react-router-dom";

export default function Chapter(props){
    const tom=props.tom
    const name=props.name
    const date=props.date
    const number=props.number
    const id=props.href
    const hideLikes=props.hideLikes
    const likes=props.likes
    const location=useLocation()
    const style=props.style
    console.log(location.pathname)
    return(
        <React.Fragment>
            <Link to={id}>
                <div className="chapterContainer" style={style}>
                    <div style={{width:"15px",textAlign:"center",paddingRight:"10px",color:"var(--text-secondary)"}}>{tom}</div>
                    <div style={{flexGrow:"1",display:"flex",flexDirection:"column"}}>
                        <div>Глава {number} {name}</div>
                        <div style={{color:"var(--text-secondary)"}}>{date}</div>
                    </div>
                    <div style={hideLikes?{display:"none"}:{color:"red",marginRight:"5px",display:"flex",alignItems:"center",gap:"5px"}}><IconFavorite style={{fontSize:"large"}}/>{likes? likes:0}</div>
                </div>
            </Link>
        </React.Fragment>
    )
}