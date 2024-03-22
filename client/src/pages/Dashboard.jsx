import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { decodeToken } from "react-jwt";
import { useState } from 'react'

const Dashboard = () => {
    const navigate = useNavigate();
    const [quote, setQuote] = useState("");
    const [tempQuote, setTempQuote] = useState("");

    const populateQuote = async () => {
        const req = await fetch("http://localhost:3000/api/quote", {
            method: "GET",
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        });
       const data = await req.json();
       if (data.status==="ok"){
        setQuote(data.quote);
       }
       else{
        alert(data.error);
       }

    }

    const updateQuote = async (e) => {
        e.preventDefault();
        const req = await fetch("http://localhost:3000/api/quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                quote: tempQuote,
            }),
        });
        const data = await req.json();
        if (data.status==="ok"){
            setQuote(tempQuote);
            setTempQuote("");
        }
        else{
            alert(data.error);
        }
    }

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if (token){
            const user = decodeToken(token);
            if (!user){
                localStorage.removeItem("token");
                navigate("/login");
            }
            else{
                populateQuote();
            }
        }
    }, [])
  return (
    <div>
        <h1>your quote: {quote || "no quote found"}</h1>
        <form onSubmit={updateQuote}> 
            <input type="text" placeholder='Quote'
            value = {tempQuote}
            onChange = {(e)=>setTempQuote(e.target.value)} />
            <input type="submit" value="update Quote" />
        </form>
    </div>
  )
}

export default Dashboard;
