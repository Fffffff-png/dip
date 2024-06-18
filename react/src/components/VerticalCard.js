import React from "react";
import { Link } from "react-router-dom";
import IconStar from "./icons/IconStar";

export default function VerticalCard(props){
    const title=props.title
    const imgSrc=props.imgSrc
    const dir=props.dir
    const type=props.type
    const rate=props.rate
    const grid=props.grid
    return(
        <React.Fragment>
            <div style={grid?{width:"140px",flex:"1 0 auto",maxWidth:"50%",padding:"0 4px"}:{width:"5%"}}>
                <Link title={title} className="vertical-card" to={"/title/"+dir}>
                    <div className="vertical-container">
                        <div className="image-container">
                            <div className="Image" style={{backgroundImage: `url(${imgSrc})`}}></div>
                        </div>
                    </div>
                    <div style={{paddingLeft: ".125rem", paddingRight: ".5rem", marginBottom: ".25rem"}}>
                        <div style={{alignItems: "center", display: "flex"}}>
                            <p className="card-text-type">
                                {type}
                                &nbsp;&nbsp;
                            </p>
                            <p className="card-text-rate">
                                <IconStar/>
                                &nbsp;
                                {rate}
                                &nbsp;
                            </p>
                        </div>
                        <h1 className="card-text-name">
                            {title}
                        </h1>
                    </div>
                </Link>
            </div>
        </React.Fragment>
    )
}