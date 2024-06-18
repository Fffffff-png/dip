import React, { useEffect, useRef, useState } from "react";
import "./Filter.css"
import Select from "react-select"
import { MultiValue } from "react-select/animated";
import { useLocation, useNavigate } from "react-router-dom";
import getStyle from "./ReactSelectStyle"
const typesOptions=[
    {value:"1",label:"Манга"},
    {value:"2",label:"Манхва"},
    {value:"3",label:"Маньхуа"},
    {value:"4",label:"Западный комикс"}
]
const genresOptions=[
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
const statusOptions=[
    {value:"1",label:"Продолжается"},
    {value:"2",label:"Закончен"},
    {value:"3",label:"Заморожен"},
    {value:"4",label:"Заброшен"},
]

const style=getStyle()
export default function Filter(props){
    // рейтинг
    const [ratingFrom,setRatingFrom]=useState('')
    const [ratingTo,setRatingTo]=useState('')
    const ratingHandleChange = (e, setRating) =>{
        const value = e.target.value
        const regex = /^(10|[1-9](\.\d{0,1})?)$/
        if (value === '' || regex.test(value)) {
            setRating(value)
        }
    }
    // год выпуска
    const [yearFrom,setYearFrom]=useState('')
    const [yearTo,setYearTo]=useState('')
    const yearHandleChange = (e, setYear)=>{
        const value = e.target.value
        if (/^\d*$/.test(value)){
            setYear(value)
        }
    }
    const yearHandleBlur= (e,setYear)=>{
        const value = e.target.value
        if(value === '' || (parseInt(value)>=1900 && parseInt(value) <= 2100)){
            setYear(value)
        } else {
            setYear('')
        }
    }
    //выпадающие селекторы
    const getElementsByIndices=(dataArray,indicesArray)=>{
        return indicesArray.map(index=>dataArray[index-1])
    }
    const [selectTypes,setSelectTypes]=useState([])
    const [selectGenres,setSelectGenres]=useState([])
    const [selectStatus,setSelectStatus]=useState([])

    const selectTypesRef=useRef()
    const selectStatusRef=useRef()
    const selectGenresRef=useRef()

    //отчистка полей фильтра
    const clearFilter=()=>{
        selectTypesRef.current.clearValue()
        selectGenresRef.current.clearValue()
        selectStatusRef.current.clearValue()
        setRatingFrom('')
        setRatingTo('')
        setYearFrom('')
        setYearTo('')
    }

    const navigate=useNavigate()
    const location=useLocation()

    const getFilterParams=()=>{
        const searchParams = new URLSearchParams(location.search)
        const type=getElementsByIndices(typesOptions,searchParams.getAll("type"))
        setSelectTypes(type)
        const genre=getElementsByIndices(genresOptions,searchParams.getAll("genre"))
        setSelectGenres(genre)
        const status=getElementsByIndices(statusOptions,searchParams.getAll("status"))
        setSelectStatus(status)
        setRatingFrom(searchParams.get("rating_from")?searchParams.get("rating_from"):'')
        setRatingTo(searchParams.get("rating_to")?searchParams.get("rating_to"):'')
        setYearFrom(searchParams.get("year_from")?searchParams.get("year_from"):'')
        setYearTo(searchParams.get("year_to")?searchParams.get("year_to"):'')
    }
    useEffect(()=>{
        getFilterParams()
    },[location.search])
    useEffect(()=>{
        getFilterParams()
    },[])
    const submitHandleCLick=()=>{
        const oldSearchParams = new URLSearchParams(location.search)
        const searchParams = new URLSearchParams()
        // searchParams.append(oldSearchParams.get("order"))
        const order = oldSearchParams.get("order")
        if (order !== null){
            searchParams.append("order",order)
        }
        if (selectTypes) {
            selectTypes.forEach(value => {
                searchParams.append("type", value.value);
            });
        }
        if (selectGenres) {
            selectGenres.forEach(value => {
                searchParams.append("genre", value.value);
            });
        }
        if (selectStatus) {
            selectStatus.forEach(value => {
                searchParams.append("status", value.value);
            });
        }
        if (yearTo !== '' && yearTo !== undefined && yearTo !== null) {
            searchParams.append("year_to", yearTo);
        }
        if (yearFrom !== '' && yearFrom !== undefined && yearFrom !== null) {
            searchParams.append("year_from", yearFrom);
        }
        if (ratingTo !== '' && ratingTo !== undefined && ratingTo !== null) {
            searchParams.append("rating_to", ratingTo);
        }
        if (ratingFrom !== '' && ratingFrom !== undefined && ratingFrom !== null) {
            searchParams.append("rating_from", ratingFrom);
        }
        navigate({
            pathname:location.pathname,
            search:searchParams.toString()
        })
    }
    return(
        <React.Fragment>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".5rem"}}>
                <h1 className="FilterH1">Фильтры</h1>
                <button onClick={()=>{clearFilter()}} className="FilterResetButton">Отчистить</button>
            </div>
            <div style={{marginBottom:"16px"}}>
                <Select
                ref={selectTypesRef}
                styles={style}
                placeholder={"Тип"}
                isMulti={true}
                noOptionsMessage={({inputValue})=>""}
                value={selectTypes}
                onChange={setSelectTypes}
                options={typesOptions}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                blurInputOnSelect={false}
                />
                <div style={{padding:".25rem"}}/>
                <Select
                ref={selectGenresRef}
                styles={style}
                placeholder={"Жанры"}
                isMulti={true}
                noOptionsMessage={({inputValue})=>""}
                value={selectGenres}
                onChange={setSelectGenres}
                options={genresOptions}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                blurInputOnSelect={false}
                />
                <div style={{padding:"1rem"}}/>
                <Select
                ref={selectStatusRef}
                styles={style}
                placeholder={"Статус"}
                isMulti={true}
                noOptionsMessage={({inputValue})=>""}
                value={selectStatus}
                onChange={setSelectStatus}
                options={statusOptions}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                blurInputOnSelect={false}
                />
                <div style={{padding:"1rem"}}/>
                <h1 className="FilterH1">Год выпуска</h1>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",gap:"6px",marginTop:".75rem"}}>
                    <div style={{border:"solid 1px hsl(0, 0%, 80%)", borderRadius:"4px"}}>
                        <input type="text" style={{paddingLeft:"10px",boxSizing:"border-box"}} placeholder="от" maxLength={4} value={yearFrom} onBlur={(e)=>yearHandleBlur(e,setYearFrom)} onChange={(e)=>yearHandleChange(e,setYearFrom)}/>
                    </div>
                    <div style={{border:"solid 1px hsl(0, 0%, 80%)", borderRadius:"4px"}}>
                        <input type="text" style={{paddingLeft:"10px"}} placeholder="до" maxLength={4} value={yearTo} onBlur={(e)=>yearHandleBlur(e,setYearTo)} onChange={(e)=>yearHandleChange(e,setYearTo)}/>
                    </div>
                </div>
                <div style={{padding:"1rem"}}/>
                <h1 className="FilterH1">Рейтинг</h1>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",gap:"6px",marginTop:".75rem"}}>
                    <div style={{border:"solid 1px hsl(0, 0%, 80%)", borderRadius:"4px"}}>
                        <input type="text" style={{paddingLeft:"10px"}} placeholder="от" value={ratingFrom} onChange={(e)=>ratingHandleChange(e,setRatingFrom)}/>
                    </div>
                    <div style={{border:"solid 1px hsl(0, 0%, 80%)", borderRadius:"4px"}}>
                        <input type="text" style={{paddingLeft:"10px"}} placeholder="до" value={ratingTo} onChange={(e)=>ratingHandleChange(e,setRatingTo)}/>
                    </div>
                </div>
                <div style={{padding:"2rem",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <button className="button-main" onClick={submitHandleCLick}>
                        Применить
                    </button>
                </div>
            </div>
            
        </React.Fragment>
    )
}