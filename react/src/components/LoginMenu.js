import axios from "axios";
import React, { useContext, useRef, useState } from "react";

import { AuthContext } from "../AuthProvider";

export default function LoginMenu(props){
    const loginMenuIsOpen=props.loginMenuIsOpen
    const setLoginMenuIsOpen=props.setLoginMenuIsOpen
    const [isRegistration,setIsRegistration]=useState(false)

    const {login} = useContext(AuthContext)

    const emailRef=useRef()
    const PasswordRef=useRef()
    const secondPasswordRef=useRef()
    const errorRef=useRef()
    const loginRequest=async (e)=>{
        errorRef.current.textContent=""
        if (isRegistration){
            setIsRegistration(false)
            errorRef.current.textContent=""
            return null
        }
        const email=emailRef.current.value
        const password=PasswordRef.current.value
        let data=[{
            "username":email,
            "password":password
        }]
        const formData = new FormData()
        formData.append('data',JSON.stringify(data))
        try {
            const response = await axios.post('http://localhost:5000/api/login',formData, {
                headers: {
                    "Content-Type":"multipart/form-data"
                }
            })
            if (response.status === 200) {
                login(response.data.access_token)                
                setLoginMenuIsOpen(false)
            }
            else{
                errorRef.current.textContent="Неверный логин или пароль"
            }
        } catch (error) {
            console.error('Error',error)
            errorRef.current.textContent="Произошла ошибка"
        }

    }
    const registerRequest=async (e)=>{
        errorRef.current.textContent=""
        if (!isRegistration){
            setIsRegistration(true)
            errorRef.current.textContent=""
            return null
        }
        const email=emailRef.current.value
        const password=PasswordRef.current.value
        const secondPassword=secondPasswordRef.current.value
        if (password & secondPassword){
            return null
        }
        if (password !== secondPassword){
            errorRef.current.textContent="Пароли не совпадают"
            return null
        }
        let data=[{
            "username":email,
            "password":password
        }]
        const formData = new FormData()
        formData.append('data',JSON.stringify(data))
        try {
            const response = await axios.post('http://localhost:5000/api/register',formData, {
                headers: {
                    "Content-Type":"multipart/form-data"
                }
            })
            if (response.status === 200) {
                setIsRegistration(false)
            }
            else{
                errorRef.current.textContent="Логин занят"
            }
        } catch (error) {
            console.error('Error',error)
            errorRef.current.textContent="Произошла ошибка"
        }

    }
    return(
        <React.Fragment>
            <div onClick={()=>{setLoginMenuIsOpen(!loginMenuIsOpen)}} style={loginMenuIsOpen?{display:"flex",position:"absolute",height:"100vh",width:"100vw", right:"0",top:"0",backgroundColor:"var(--bg-transparent)",justifyContent:"center",alignItems:"center"}:{display:"none"}} >
                <div onClick={(e)=>{e.stopPropagation()}} style={{display:"flex",backgroundColor:"var(--bg-primary)",width:"450px",height:"300px",justifyContent:"center",flexDirection:"column",alignItems:"center",gap:".75rem",borderRadius:"50px",margin:"10px"}}>
                    <div style={{display:"flex",width:"300px",gap:".5rem",flexDirection:"column"}}>
                        <div ref={errorRef} style={{color:"#ff6666"}}></div>
                        <input ref={emailRef} style={{border:"solid 2px var(--bg-input)"}} type="login" placeholder="Логин"></input>
                        <input ref={PasswordRef} style={{border:"solid 2px var(--bg-input)"}} type="password" placeholder="Пароль"></input>
                        {isRegistration ? <input ref={secondPasswordRef} style={{border:"solid 2px var(--bg-input)"}} type="password" placeholder="Повторите пароль"></input>:<></>}
                    </div>
                    <div style={{display:"flex",flexDirection:"row",width:"300px",height:"auto", marginTop:"1rem",justifyContent:"space-around"}}>
                        <button onClick={(e)=>{loginRequest(e)}} className="button-main">Вход</button>
                        <button onClick={(e)=>{registerRequest(e)}} className="button-main">Регистрация</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}