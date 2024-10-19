import 'dotenv/config'
import express from 'express'

const app=express()

const port=process.env.PORT || 3000

app.use(express.json())

let users=[
    {id:1,name:"the avi"},
    {id:2,name:"gaurav"},
    {id:3,name:"akash"},
    {id:4,name:"anurag"},
    {id:5,name:"chintu"},
    {id:6,name:"bikash"},
]

app.get('/',(req,res)=>{
    res.send('Hello World')
})

//geting users
app.get('/users',(req,res)=>{
  res.json(users)
})

//posting new users
app.post('/users',(req,res)=>{
    const newUser=[
        {id:users.length+1,name:req.body.name}
    ]
    users.push(newUser)
    res.status(201).json(newUser)
})

//updating user info

app.put('/users/:id',(req,res)=>{
    const userId=parseInt(req.params.id)
    const user=users.find(u=>u.id===userId)
    console.log(user)
    if(user){
        user.name=req.body.name
        res.json(user)
    }
    else{
        res.status(404).json({message:"user not found"})
    }
})

//deleting user

app.delete('/users/:id',(req,res)=>{
    const userId=parseInt(req.params.id)
    users=users.filter(u=>u.id!==userId)
    res.status(204).send('User Delected')
   
})



app.listen(port,()=>{
    console.log(`Server Listening on: ${port}`)
})