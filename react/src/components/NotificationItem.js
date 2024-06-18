import "./NotificationItem.css"
import React from "react";
import IconTrash from "./icons/IconTrash";
export default function NotificationItem(props){
    const titleName=props.titleName
    const date=props.date
    const tom=props.tom
    const chapter=props.chapter
    const image=props.image
    return(
        <React.Fragment>
            <div className="NotificationItem">
                <a className="NotificationItemContent">
                    <div className="NotificationAvatar">
                        <div className="NotificationImageConteiner">
                            <div className="NotificationImage" style={{backgroundImage: `url(${image})`}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="NotificationText">
                            {titleName} добавлена новая глава {tom}-{chapter}
                        </div>
                        <div className="NotificationTextSecondary">{date}</div>
                    </div>
                </a>
                <div className="NotificationAction">
                    <button>
                        <IconTrash style={{fontSize:"1.2rem"}}/>
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}