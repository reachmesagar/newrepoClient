import React, { useEffect, useState } from 'react'
import ResponsiveAppBar from '../Component/ResponsiveAppBar'
import axios from 'axios'
import { ColorRing} from  'react-loader-spinner'
import RecipeReviewCard from '../Component/RecipeReviewCard'
import { Button } from '@mui/material'
import TransitionsModal from '../Component/TransitionsModal'

export default function SharedLocations() {
    const [locations , setlocations] = useState([])    
    const[isloading, setIsLoading] = useState(true)
    const [isModal, setIsModalOpening] = useState(false)
    const [reload, setReload] = useState(false)

    useEffect(
        ()=>{
            axios.get(
                "http://127.0.0.1:8000/locations/",{
                    headers:{
                            "Content-Type":"application/json",
                             Authorization:"Bearer "+localStorage.getItem("token"),
                    }
                }
            ).then(x=>{
                if(x.data){  
                setIsLoading(false)
                console.log(x.data)
                setlocations(x.data)
            }
            }).catch(y=>console.log(y))

        },[reload]

    )


    const handleClose = ()=>{
        setIsModalOpening()
    }

    const handleReload = ()=>{
        console.log("RELOADDD")
        setReload(!reload)
    }

    


  return (


    <div > 
        <ResponsiveAppBar></ResponsiveAppBar>
        <div style={{
        paddingBottom:"20px",
        // backgroundColor:"gray"

    }}>
        <TransitionsModal  reloadAction ={handleReload} action={handleClose} isModal={isModal}></TransitionsModal>
         <img 
        style={{
            width:"1800px",
            height:"350px",
            objectFit:"cover"
        }}
        src='https://images.pexels.com/photos/17152635/pexels-photo-17152635/free-photo-of-the-arc-de-triomphe-in-paris-france.jpeg?auto=compress&cs=tinysrgb&w=1290&h=750&dpr=1'></img>
        <Button onClick={()=>{
            
            setIsModalOpening(true)
        }} variant='outlined' style={{
            marginTop:"20px",
            padding:"15px",
            marginLeft:"45%"
        }}> Add Your Visited Place </Button>

        {isloading? <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{
                margin:"20%"
            }}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            /> : 
            <div style={{
                display:"flex",
                flexDirection:"row",
                flexWrap:"wrap",
                marginTop:"2%",
                backgroundColor:"#f7f8fa",
                marginLeft:"4%",
                marginRight:"4%",
                padding:"2%",
                borderRadius:"2%",
                borderWidth:"4",
                
            }}>
           { locations.map(
                x=>
                <div style={{
                    marginRight:"5%",
                    marginLeft:"5%",
                   
                }}>

                <RecipeReviewCard reload={handleReload} location ={x}></RecipeReviewCard>
                </div>
            )}
                </div>
                
                

        }

        </div>

    </div>
  )
}
