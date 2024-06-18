import React, { useRef, useState } from "react";
import getStyle from "../components/ReactSelectStyle";
import Select from "react-select"
import "./NewTitlePage.css"
import axios from "axios";
const typesOption=[
    {value:"1",label:"Манга"},
    {value:"2",label:"Манхва"},
    {value:"3",label:"Маньхуа"},
    {value:"4",label:"Западный комикс"}
]
const genresOption=[
    {value:"1",label:"Genre1"},
    {value:"2",label:"Genre2"},
    {value:"3",label:"Genre3"},
    {value:"4",label:"Genre4"},
    {value:"5",label:"Genre5"},
    {value:"6",label:"Genre6"},
    {value:"7",label:"Genre7"},
    {value:"8",label:"Genre8"},
    {value:"9",label:"Genre9"},
    {value:"10",label:"Genre10"},
]
const statusOption=[
    {value:"1",label:"Продолжается"},
    {value:"2",label:"Закончен"},
    {value:"3",label:"Заморожен"},
    {value:"4",label:"Заброшен"},
]
export default function NewTitlePage(){
    const [nameRus,setNameRus]=useState("")
    const [nameEng,setNameEng]=useState("")
    const [description,setDescription]=useState("")
    const [type,setType]=useState(null)
    const [status,setStatus]=useState(null)
    const [genres,setGenres]=useState([])
    const [year,setYear]=useState("")
    const [file,setFile]=useState(null)
    const [filePreview, setFilePreview] = useState(null);

    const inputImageRef=useRef()
    const selectTypesRef=useRef()
    const selectStatusRef=useRef()
    const selectGenresRef=useRef()
    const submitButton=useRef()
    const textToStateHandleChange=(e,setText)=>{
        const value = e.target.value
        setText(value)
    }
    const yearHandleChange = (e)=>{
        const value = e.target.value
        if (/^\d*$/.test(value)){
            setYear(value)
        }
    }
    const yearHandleBlur = (e)=>{
        const value = e.target.value
        if(value === '' || (parseInt(value)>=1900 && parseInt(value) <= 2100)){
            setYear(value)
        } else {
            setYear('')
        }
    }
    const inputFileHandleChange=(e)=>{
        let img=e.target.files[0]
        if (img) {
            setFile(img);
            setFilePreview(URL.createObjectURL(img));
        } else {
            setFile(null);
            setFilePreview(null);
        }
    }
    const inputHandleReset=()=>{
        if (inputImageRef.current){
            inputImageRef.current.value=""
            setFile(null)
            setFilePreview(null);
        }
        selectGenresRef.current.clearValue()
        selectStatusRef.current.clearValue()
        selectTypesRef.current.clearValue()
        setYear('')
        setNameEng('')
        setNameRus('')
        setDescription('')
    }
    const createRequest=async (e)=>{
        e.preventDefault()
        let data=[{
            "rus_name":nameRus,
            "eng_name":nameEng,
            "description":description,
            "type":type,
            "status":status,
            "genres":genres,
            "year":year
        }]
        const formData = new FormData()
        formData.append('file',file)
        formData.append('data',JSON.stringify(data))
        try {
            const response = await axios.post('http://localhost:5000/api/new-title',formData, {
                headers: {
                    "Content-Type":"multipart/form-data"
                }
            })
            if (response.status === 200) {
                submitButton.current.disabled=true
                submitButton.current.style.backgroundColor="var(--primary-500)"
            }
            else{
                submitButton.current.style.backgroundColor="red"
            }
        } catch (error) {
            submitButton.current.style.backgroundColor="red"
            console.error('Error',error)
        }

    }
    const style=getStyle()
    
    return(
        <React.Fragment>
            <div className="page-main-container" style={{minHeight:"100vh"}}>
                <h1 style={{paddingLeft:"1rem",margin:"0",paddingBottom:"2rem"}}>Создание нового тайтла</h1>
                <div className="newTitleContainer">
                    <div className="newTitleImageInput">
                        <div className="image-container" style={{backgroundColor:"var(--bg-secondary)"}}>
                            <div className="Image" style={{backgroundImage: `url(${filePreview})`}}></div>
                        </div>
                        <input style={{display:"none"}} ref={inputImageRef} type="file" accept="image/png, image/gif, image/jpeg" onChange={(e)=>{inputFileHandleChange(e)}}/>
                        <button onClick={()=>{inputImageRef.current?.click()}} className="button-main">Выбрать лого</button>
                        <button className="button-main" onClick={inputHandleReset}>Отчистить всё</button>
                    </div>
                    <div style={{boxSizing:"border-box",maxWidth:"900px",width:"100%",padding:"1rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
                        <input value={nameRus} onChange={(e)=>{textToStateHandleChange(e,setNameRus)}} placeholder="Название" type="text" style={{backgroundColor:"var(--bg-input)"}}/>
                        <input value={nameEng} onChange={(e)=>{textToStateHandleChange(e,setNameEng)}} placeholder="Название на английском" type="text" style={{backgroundColor:"var(--bg-input)"}}/>
                        <textarea value={description} onChange={(e)=>{textToStateHandleChange(e,setDescription)}} placeholder="Описание" type="text" style={{backgroundColor:"var(--bg-input)",height:"100%",minHeight:"150px"}}/>
                        <div style={{display:'flex',flexDirection:"row",width:"100%",gap:"10px"}}>
                            <div style={{width:"50%"}}>
                                <Select
                                ref={selectTypesRef}
                                isSearchable={false}
                                options={typesOption}
                                styles={style}
                                placeholder="Тип"
                                onChange={setType}
                                />
                            </div>
                            <div style={{width:"50%"}}>
                                <Select
                                ref={selectStatusRef}
                                isSearchable={false}
                                options={statusOption}
                                styles={style}
                                placeholder="Статус"
                                onChange={setStatus}
                                />
                            </div>
                        </div>
                        <Select
                        ref={selectGenresRef}
                        styles={style}
                        placeholder={"Жанры"}
                        isMulti={true}
                        onChange={setGenres}
                        options={genresOption}
                        hideSelectedOptions={false}
                        closeMenuOnSelect={false}
                        blurInputOnSelect={false}
                        />
                        <div style={{display:"flex",flexDirection:"row",gap:"10px"}}>
                            <input value={year} maxLength={4} onBlur={(e)=>{yearHandleBlur(e)}} onChange={(e)=>{yearHandleChange(e)}} placeholder="Год" type="text" style={{backgroundColor:"var(--bg-input)"}}/>
                            <button ref={submitButton} className="button-main" onClick={createRequest}>Отправить</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}