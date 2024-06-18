import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";
import OnScreen from "../components/OnScreen";
import Chapter from "../components/Chapter";
import Menu from "../components/Menu";
import { AuthContext } from "../AuthProvider";

export default function ReadPage(){
    const {dir,chapter_id}=useParams()
    const [isFavorite,setIsFavorite]=useState(false)
    const [isOpenViewChapters,setIsOpenViewChapters]=useState(false)
    const [navBarIsShow,setNavBarIsShow]=useState(false)
    const [data,setData]=useState()
    const [activePage,setActivePage]=useState() 
    const [chapters,setChapters]=useState()
    const [order,setOrder]=useState(true)
    const [isListChaptersOpen,setIsListChaptersOpen]=useState(false)
    const [menuIsOpen,setMenuIsOpen]=useState(false)
    const [prevChapter,setPrevChapter]=useState()
    const [nextChapter,setNextChapter]=useState()
    const {userId} = useContext(AuthContext)
    useEffect(()=>{
        const fetchData=async ()=>{
            try{
                const response = await axios.get(`http://localhost:5000/api/chapter/${chapter_id}?user_id=${userId}`)
                setData(response.data)
                setChapters(response.data.other_chapters)
                setIsFavorite(response.data.current.liked)
            }catch(error) {
                console.error(error)
            }
        }
        fetchData()
    },[chapter_id])
    useEffect(()=>{
        if(data){
            const getNextAndPrewChapters=()=>{
                const currentChapterIndex=chapters.findIndex(chapter=>chapter.id===data.current.id)
                setPrevChapter(currentChapterIndex>0?chapters[currentChapterIndex-1]:null)
                setNextChapter(currentChapterIndex < chapters.length - 1?chapters[currentChapterIndex+1]:null)
            }
            getNextAndPrewChapters()
        }
    },[data])
    const sendIsFavorite=()=>{
        const fetchData=async ()=>{
            try{
                const response = await axios.post(`http://localhost:5000/api/add-to-favorite`,{"user_id":userId,"chapter_id":data.current.id})
                setIsFavorite(true)
            }catch(error) {
                console.error(error)
            }
        }
        fetchData()
    }
    const reverseHandler=()=>{
        if (data){
            setChapters(chapters.reverse())
            setOrder(!order)
        }
    }
    return(
        <React.Fragment>
            <main className="main-content" style={{paddingTop:"0"}}>
                {data?
                <>
                    <NavBar sendIsFavorite={sendIsFavorite} menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen} isListChaptersOpen={isListChaptersOpen} setIsListChaptersOpen={setIsListChaptersOpen} dir={dir} countPage={data.current.images.length} activePage={activePage} navBarIsShow={navBarIsShow} isOpenViewChapters={isOpenViewChapters} setIsOpenViewChapters={setIsOpenViewChapters} isFavorite={isFavorite} isReadPage={true}/>
                    <Menu setMenuIsOpen={setMenuIsOpen} menuIsOpen={menuIsOpen}/>
                    <div className="page-main-container" style={{minHeight:"100vh",margin:"0",display:"flex",flexDirection:"column",maxWidth:"800px"}} onClick={()=>{setNavBarIsShow(!navBarIsShow)}}>
                        {data?
                        data.current.images.map(page=>(
                            <OnScreen onCenterScreen={()=>{setActivePage(data.current.images.indexOf(page)+1)}}>
                                <img src={`http://localhost:5000/media/${page.filename}`} width={"100%"}/>
                            </OnScreen>
                        ))
                        :<></>
                        }
                        {data?
                        <div style={{minHeight:"150px",width:"100%",display:"flex",justifyContent:"space-around",alignItems:"center"}} onClick={(e)=>{e.stopPropagation()}}>
                            <Link onClick={()=>{window.scrollTo(0,0)}} to={prevChapter?`/title/${dir}/${prevChapter.id}`:""} style={prevChapter?{}:{backgroundColor:"var(--primary-500)",cursor:"default"}} className="button-main">Предыдущая глава</Link>
                            <Link onClick={()=>{window.scrollTo(0,0)}} to={nextChapter?`/title/${dir}/${nextChapter.id}`:""} style={nextChapter?{}:{backgroundColor:"var(--primary-500)",cursor:"default"}}  className="button-main">Следующая глава</Link>
                        </div>
                        :<></>
                        }
                    </div>
                    <div style={isListChaptersOpen?{position:"fixed",width:"100%",alignItems:"center",justifyContent:"center",display:"flex",bottom:"56px",top:"56px",zIndex:"1000",backgroundColor:"var(--bg-transparent)"}:{display:"none"}} onClick={()=>{setIsListChaptersOpen(!isListChaptersOpen)}}>
                        <div style={{position:"fixed",backgroundColor:"var(--bg-primary)",maxWidth:"600px",width:"100%",padding:"2rem 1rem",borderRadius:"50px"}} onClick={(e)=>{e.stopPropagation()}}>
                            <div style={{overflow:"auto",height:"100%"}}>
                                <button style={{backgroundColor:"inherit",border:"none",color:"var(--text-primary)",cursor:"pointer",paddingBottom:".75rem"}} onClick={reverseHandler}>{order?"показать с начала":"показать с конца"}</button>
                                <div style={{overflow:"auto",maxHeight:"500px"}}>
                                    {
                                        chapters.map(chapter=>(
                                            <Chapter href={`/title/${dir}/${chapter.id}`} style={chapter.id === data.current.id?{backgroundColor:"var(--primary)"}:{}} number={chapter.chapter_number} tom={chapter.chapter_number} name={chapter.name} hideLikes={true}/>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :<></>
                }
            </main>
        </React.Fragment>
    )
}