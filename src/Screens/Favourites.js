import axios from 'axios'
import React, { useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ResponsiveAppBar from '../Component/ResponsiveAppBar';
import { useNavigate } from 'react-router-dom';

export default function Favourites() {
  const [fav, setFav] = useState([])
  const [relaod, setReload] = useState(false)
  const naviagte = useNavigate()

  useEffect(
    ()=>{
      axios.get("http://127.0.0.1:8000/favorites/",{
        headers:{
          "Content-Type":"application/json",
          Authorization:"Bearer "+localStorage.getItem('token')
      }
      }).then(
        x=>{console.log("Result", x.data)
      
        setFav(x.data)
      }
      ).catch(
        y=>console.log(y)
      )
    },[relaod]
  )

    const handleDeleteFav = (id)=>{
      axios.delete("http://127.0.0.1:8000/favorites/"+id+"/",{
        headers:{
          "Content-Type":"application/json",
          Authorization:"Bearer "+localStorage.getItem('token')
      }
      }).then(x=>setReload(!relaod)).catch(y => console.log("Error"))
    }


  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <h3 style={{
        marginLeft:"2%"
      }}>
        <FavoriteIcon style={{
          marginTop:"10px",
          color:"#f7a8d5"
        }}></FavoriteIcon>Favourites
      </h3>
      <p style={{
        marginLeft:"30px",
        color:"gray"
      }}>Choose Your next visiting Destination</p>
      {
        fav.map(
          x=>
          <List   key={x.id} style={{
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center",
            paddingLeft:"2%",
            paddingRight:"2%",
            backgroundColor:"#e9f0ea",
            marginBottom:"10px",
            marginLeft:"20px",
            marginRight:"20px"
          }}>
            <div>
            <ListItem onClick={()=>{
             naviagte(`/${x.location.id}`)
            }} style={{
              margin:"0px"
            }}>{x.owner[0]}</ListItem>
            <ListItem style={{
              margin:"0px"
            }}>{x.location.locationName}</ListItem>
            <ListItem style={{
              fontWeight:"bold",
              fontSize:"15px",
              margin:"0px"
            }}>{x.location.category}</ListItem>

            </div>
            <Button style={{
              color:"red"
            }} onClick={()=>{
              
              console.log("MMMMMMM")
              handleDeleteFav(x.id)
              }}>
             <DeleteIcon  ></DeleteIcon>
            </Button>
          </List>
        )
      }


    </div>
  )
}
