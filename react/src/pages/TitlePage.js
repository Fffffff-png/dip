import React, { useContext, useEffect, useRef, useState } from "react";
import "./TitlePage.css"
import IconStar from "../components/icons/IconStar";
import { Link, useParams } from "react-router-dom";
import IconSend from "../components/icons/IconSend";
import { reverse, set } from "lodash";
import axios from "axios";
import { AuthContext } from "../AuthProvider";
import Comment from "../components/Comment";
import Chapter from "../components/Chapter";
import IconStarLine from "../components/icons/IconStarLine";


export default function TitlePage(props){
    const [viewDescription,setViewDescription]=useState(true)
    const [order,setOrder]=useState(true)
    const [data,setData]=useState()
    const [commentsData,setCommentsData]=useState()
    const {userId,authToken,user}=useContext(AuthContext)
    const [updateData,setUpdateData]=useState(false)
    const [chapters,setChapters]=useState()
    const commentRef=useRef()
    const {dir}=useParams()
    const numRating=Array.from({length:10},(_,i)=>i+1)
    const [userRating,setUserRating]=useState(0)
    const [showRatingMenu,setShowRatingMenu]=useState(false)
    const [isBookmark,setIsBookmark]=useState(false)
    useEffect(()=>{
        const fetchData=async ()=>{
            if (authToken){
                if(userId===null) return
            }
            try{
                const response = await axios.get(`http://localhost:5000/api/title/${dir}?user_id=${userId}`)
                setData(response.data)
                setChapters(response.data.chapters)
                setUserRating(response.data.user_rating)
                setIsBookmark(response.data.is_bookmark)
                return true
                
            }catch(error) {
                console.error(error)
            }
            
        }
        fetchData()
    },[updateData,userId])
    useEffect(()=>{
        const fetchCommentData=async ()=>{
            try{
                const response = await axios.get(`http://localhost:5000/api/title/${dir}/comments`)
                setCommentsData(response.data.data)
                console.log(response.data)
            }catch(error) {
                console.error(error)
            }
        }
        fetchCommentData()
    },[updateData])
    const sendComment= async (e)=>{
        e.preventDefault()
        const comment=commentRef.current.value
        try{
            const response = await axios.post("http://localhost:5000/api/create-comment",{"username":user,"user_id":userId,"title_id":data.id,"comment":comment},
                {
                    headers:{
                        Authorization: "Bearer "+authToken
                    }
                }
            )
            commentRef.current.value=""
            setUpdateData(!updateData)
        }catch(error) {
            console.error(error)
        }
    }
    const reverseHandler=()=>{
        if (data){
            setChapters(chapters.reverse())
            setOrder(!order)
        }
    }
    const inputCommentKeyDown=(event)=>{
        if (event.key === "Enter"){
            sendComment(event)
        }
    }
    const sendRatingFromUser=async(num)=>{
        setUserRating(num)
        setShowRatingMenu(false)
        try{
            const response = await axios.post("http://localhost:5000/api/set-rating",{"user_id":userId,"title_id":data.id,"value":num},
                {
                    headers:{
                        Authorization: "Bearer "+authToken
                    }
                }
            )
        }catch(error) {
            console.error(error)
        }
        setUpdateData(!updateData)
    }
    const addToBookmarks=async()=>{
        try{
            const response = await axios.post("http://localhost:5000/api/add-to-bookmarks",{"user_id":userId,"title_id":data.id},
                {
                    headers:{
                        Authorization: "Bearer "+authToken
                    }
                }
            )
        }catch(error) {
            console.error(error)
        }

        setUpdateData(!updateData)
    }
    return(
        <React.Fragment>
            {data?
            <div className="page-main-container" style={{minHeight:"100vh"}}>
                <div className="TitlePageMainRowContainer">
                    <div className="TitlePageLeftColumnContiner">
                        <div>
                            <img style={{width:"100%",borderRadius:"25px"}} src={`http://localhost:5000/media/${data.cover}`}/>
                        </div>
                        <div className="TitlePageButtonContainer">
                            <button className="button-main" style={{width:"100%"}}>Читать</button>
                            {authToken?
                                isBookmark?<button onClick={addToBookmarks} className="button-main" style={{width:"100%"}}>Удалить из закладок</button>:<button onClick={addToBookmarks} className="button-main" style={{width:"100%"}}>Добавить в закладки</button>
                            :
                                <></>
                            }
                        </div>
                    </div>
                    <div style={{boxSizing:"border-box",padding:"10px",width:"600px",maxWidth:"100%",display:"flex",flexDirection:"column"}}>
                        <div className="TitlePageInfoRow"  style={{color:"var(--text-secondary)"}}>
                            {data.type} {data.year}<span className="TitlePageMedia800Show" style={{textTransform:"lowercase"}}>, выпуск {data.status}</span>
                        </div>
                        <div className="TitlePageInfoRow">
                            <h2 style={{margin:"0"}}>{data.name_rus}</h2>
                        </div>
                        <div className="TitlePageInfoRow" style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between",borderBottom:"solid 1px var(--text-secondary)",paddingBottom:"1rem"}}>
                            <div>
                                <div style={{color:"var(--text-secondary)"}}>Глав</div>
                                <div>{data.chapter_count}</div>
                            </div>
                            <div>
                                <div style={{color:"var(--text-secondary)"}}>Лайков</div>
                                <div>{data.likes}</div>
                            </div>
                            <div>
                                <div style={{color:"var(--text-secondary)"}}>В закладках</div>
                                <div>{data.bookmarks}</div>
                            </div>
                            <div className="TitlePageMedia650Hide">
                                <div style={{color:"var(--text-secondary)"}}>Просмотров</div>
                                <div>{data.view_count}</div>
                            </div>
                            <div className="TitlePageMedia800Hide">
                                <div style={{color:"var(--text-secondary)"}}>Выпуск</div>
                                <div>{data.status}</div>
                            </div>
                            <div style={{position:"relative",display:"inline-block",cursor:"pointer"}} onClick={()=>{if(authToken)setShowRatingMenu(!showRatingMenu)}}>
                                <div onClick={(e)=>{e.stopPropagation()}} style={showRatingMenu?{position:"absolute",backgroundColor:"var(--bg-paper)",border:"solid 1px var(--text-secondary)",right:"110%",top:"0",display:"flex",gap:".25rem",flexDirection:"column",padding:"15px",textAlign:"center",borderRadius:"25px"}:{display:"none"}}>
                                    <span style={{whiteSpace:"nowrap",lineHeight:"1rem",fontWeight:"500"}}>Оцените произведение</span>
                                    {
                                        numRating.reverse().map(num=>(
                                            <div value={num} onClick={()=>sendRatingFromUser(num)} style={{display:"flex",flexDirection:"row",alignItems:"center",cursor:"pointer",fontSize:"1rem",height:"2.5rem"}}>
                                                <div style={{flexGrow:"1"}}>{num}</div>
                                                {num === userRating || num < userRating? <IconStar style={{width:"20%",color:"red"}}/>:<IconStarLine style={{width:"20%"}}/>}</div>
                                        ))
                                    }
                                </div>
                                <div style={{color:"var(--text-secondary)"}}>Рейтинг</div>
                                <div style={{display:"flex",alignItems:"center"}}><IconStar style={{color:"red",marginRight:"5px"}}/>{data.rating}</div>
                            </div>
                        </div>
                        <div style={{height:"100%",backgroundColor:"var(--bg-secondary)",borderRadius:"25px",marginTop:"1rem",paddingBottom:"2rem"}}>
                            <div style={{display:"flex",flexDirection:"row",marginLeft:"1rem"}}>
                                <div onClick={()=>{setViewDescription(true)}} style={viewDescription?{cursor:"pointer",margin:"10px 5px 10px 5px",color:"var(--primary)",borderBottom:"solid 1px var(--primary)",paddingBottom:"4px"}:{cursor:"pointer",margin:"10px 5px 10px 5px",paddingBottom:"4px"}}>
                                    описание
                                </div>
                                <div onClick={()=>{setViewDescription(false)}} style={!viewDescription?{cursor:"pointer",margin:"10px 5px 10px 5px",color:"var(--primary)",borderBottom:"solid 1px var(--primary)",paddingBottom:"4px"}:{cursor:"pointer",margin:"10px 5px 10px 5px",paddingBottom:"4px"}}>
                                    главы ({data.chapter_count})
                                </div>
                            </div>
                            {viewDescription?
                            <div style={{margin:"0 1rem 0 1rem"}}>
                                <div style={{wordBreak:"break-all"}}>
                                    {data.description}
                                </div>
                                <div style={{paddingTop:"1rem",display:"flex",flexWrap:"wrap",gap:"5px",flexDirection:'row'}}>
                                    {data.genres.map(gener=>(
                                       <Link key={gener.id} style={{padding:"4px 8px 4px 8px",borderRadius:"25px",backgroundColor:"hsla(240, 4%, 49%, .3)"}} to={`/catalog?genre=${gener.id}`}>{gener.name}</Link> 
                                    ))}
                                </div>
                                <div style={{paddingTop:"2.5rem"}}>
                                    <div style={{fontSize:"1.275rem",fontWeight:"600",lineHeight:"1.235"}}>
                                        Комментарии
                                    </div>
                                    {authToken?
                                    <div style={{backgroundColor:"#e1e1e1",marginTop:"1rem",display:"flex",flexDirection:"row",borderRadius:"25px",alignItems:"center"}}>
                                        <input onKeyDown={inputCommentKeyDown} ref={commentRef} style={{padding:"15px 20px"}} type="text" placeholder="Оставить комментарий"/>
                                        <button onClick={(e)=>{sendComment(e)}} style={{backgroundColor:"inherit",border:"none",height:"20px",margin:"0 10px",cursor:"pointer"}}><IconSend style={{fontSize:"large",color:"var(--primary)"}}/></button>
                                    </div>
                                    :
                                    <></>
                                    }
                                    <div style={{paddingTop:"1rem",display:"flex",flexDirection:"column",gap:"10px"}}>
                                        {commentsData?
                                            commentsData.map(comm=>(
                                                <Comment username={comm.username} comment={comm.comment}/>
                                            ))
                                        :<></>}
                                    </div>
                                </div>
                            </div>
                            :
                            <div style={{margin:"0 1rem 0 1rem"}}>
                                <button style={{backgroundColor:"inherit",border:"none",color:"var(--text-primary)",cursor:"pointer"}} onClick={reverseHandler}>{order?"показать с начала":"показать с конца"}</button>
                                <div>
                                    {
                                        chapters.map(chapter=>(
                                            <Chapter href={`/title/${dir}/${chapter.id}`} likes={chapter.likes} number={chapter.chapter_number} tom={chapter.chapter_number} name={chapter.name} date={chapter.date}/>
                                        ))
                                    }
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            :<></>}
        </React.Fragment>
    )
}