import React, { useContext, useEffect, useState } from "react";
import VerticalCard from "../components/VerticalCard";
import { AuthContext } from "../AuthProvider";
import axios from "axios";

export default function BookmarksPage(){
    const [data,setData]=useState(null)
    const {userId} = useContext(AuthContext)
    useEffect(()=>{
        const fetchData=async ()=>{
            if (!userId) return
            try{
                const response = await axios.get(`http://localhost:5000/api/bookmarks?user-id=${userId}`)
                setData(response.data)
                
            }catch(error) {
                console.error(error)
            }
        }
        fetchData()
    },[userId])
    return(
        <React.Fragment>
            <div className="page-main-container" style={{minHeight:"100vh"}}>
                <h1 style={{paddingLeft:"1rem",margin:"0",paddingBottom:"2rem"}}>Закладки</h1>
                <div style={{display:"flex",width:"100%"}}>
                    <div className="GridGridContainer">
                        <div className="GridGrid">
                            {data?
                            data.map(item =>(
                                <VerticalCard
                                key={item["id"]}
                                title={item["name_Rus"]}
                                type={item["type"]}
                                imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                                dir={item['dir']}
                                rate={item["rating"]}
                                grid={true}
                                />
                            ))
                            :<div></div>}
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                            <div className="GridItemPlaceholder"/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}