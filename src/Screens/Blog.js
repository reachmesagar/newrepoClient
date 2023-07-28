import { Button, Divider, Modal, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MyCard from '../Component/MyCard'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Blog() {
  const [data, setData ] = useState([])
  const [open, setOpen] = React.useState(false);
  const[blogTitle, setBlogTitle] = useState()
  const[blogDescription, setBlogDescription] = useState('')
  const [tags, setTags] = useState('')
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedimages, setselectedimages] = React.useState([])
  const [reload, setReload] = useState(false)  
  useEffect(
    ()=>{
      axios.get("http://127.0.0.1:8000/blogs/",{
      headers:{
          Authorization:"Bearer "+ localStorage.getItem("token")
        },
        
      }).then(
        x=>{
          console.log(x.data)
          setData(x.data)}
      ).catch(
        y=>console.log("Error")
      )
    },[reload]
  )


    const handleSubmit = ()=>{
      const formData =new FormData()
      formData.append("blogTitle",blogTitle )
      formData.append("tagS", tags)
      formData.append("blogDescription",blogDescription)
      
      for (let i=0; i<selectedimages.length; i++){
        console.log("Image size ", selectedimages[i])
        formData.append('uploaded_images',selectedimages[i])
      }
  


      axios.post("http://127.0.0.1:8000/createblog/",formData,{
        headers:{
          Authorization:"Bearer "+ localStorage.getItem("token")
        },
      }).then(x=>{
        setReload(!reload)
        handleClose()
        
      }).catch(y=>{
        alert("Please check your credential")
      })
    }


  return (
  <>
    <Modal
   
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        
      >
        <div style={{
          backgroundColor:"white",
          height:"65%",
          margin:"5%",
          padding:"5%"
        }}>
        <h3 style={{
          marginBottom:"4%"
        }}>Please Create a new blog on place where you recently visited!</h3>
       <TextField 
        onChange={(e)=>{
          setBlogTitle(e.target.value)
        }}
       id="outlined-basic" style={{
        marginBottom:"30px",
        width:"75%"
       }}  label="Blog Title" variant="outlined" /><br></br>
       <TextField 
       onChange={(e)=>{
        setBlogDescription(e.target.value)
      }}
       id="outlined-basic" style={{
        marginBottom:"30px",
        width:"75%"
       }} label="About Blog" variant="outlined" multiline /><br></br>
       <TextField
        onChange={(e)=>{
          setTags(e.target.value)
        }}
       id="outlined-basic" style={{
        marginBottom:"30px",
        width:"75%"
       }} label="Tags" variant="outlined" /><br></br>
        <input type='file' multiple onChange={e => setselectedimages(e.target.files)}></input>
        <br></br>
    
        <Button
        onClick={handleSubmit}
        variant='outlined' style={{
          marginTop:"2%"
        }}>Submit</Button>
        
        </div>
      </Modal>


    <img src= "https://themetrust.com/wp-content/uploads/2018/06/blog-resource-cover-1000x500.jpg"
      style={{
        width:"1800px",
        height:"400px",
        objectFit:"cover"
      }}    
    ></img>
    <Button 
    onClick={handleOpen}
    style={{
      marginTop:"30px",
      padding:"20px",
      marginLeft:"45%"
    }} variant='outlined'>Write your Own Blog</Button>

    <div style={{
      margin:"100px",
      backgroundColor:"#f5f7f6",
      padding:"50px",
      borderRadius:"10px",
      display:"flex",
      flexDirection:"row"
    }}>

      {
        data.map(
          x=>
          <div key={x.id} style={{
            margin:"5%"
          }}>
            <MyCard blog={x}></MyCard>
          </div>)
      }
      </div>
    
    </>



  )
}
