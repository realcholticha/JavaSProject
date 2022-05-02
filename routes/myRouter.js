const express = require('express');
const res = require('express/lib/response');
const router = express.Router()
const User = require('../models/dbtest')
const Room = require('../models/roomdb')

var statusRoom = [0,0,0,0,0,0];

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next()
}

router.post('/book/:id', (req, res) => {
    let id = parseInt(req.params.id);
    statusRoom[id-1] = 1;
    res.status(200).json({data: statusRoom});
});


router.get('/',isLoggedIn,(req,res)=>{
    res.render('/checkroom')
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register', async (req, res) => {
    const user = new User({
        userID: req.body.userID,
        password : req.body.password,
        name : req.body.name,
        address : req.body.address,
        email : req.body.email
    })
    try {
        const newUser = await user.save()
        return res.render('login')
        
        }catch (err) {
        return res.status(400).json({ message: err.message })
        }
})

//login post
router.post('/login',async (req, res) => {
    const{userID,password} = req.body
    const user = await User.findOne({
        userID,
        password
    })
    if (user){
        req.session.user = user;
        return res.render('checkroom', {statusRoom: statusRoom} )
    }else{
        return res.render('login')
    }
})

router.get('/checkroom',(req,res)=>{
    res.render('checkroom', {statusRoom: statusRoom})
})
router.post('/rent',isLoggedIn,async(req,res)=>{
    const room = new Room({
        date: req.body.date,
        Time: [req.body.time_start, req.body.time_end],
        RoomID: req.body.roomId, 
        UserID: req.session.user._id,
    });
    const Savedroom = await room.save();
    if (Savedroom){
        statusRoom[parseInt(req.body.roomId)] = 1;
        res.redirect('success')
    }
})

router.get('/rent',(req,res) => {
    let id = parseInt(req.query.id);
    res.render('rent', {statusRoom: statusRoom, idRoom: id});
})

router.get('/modify',(req,res)=>{
    res.render('modify')
})

router.get('/success',isLoggedIn, async (req,res)=>{
    
    const findroom = await Room.find({UserID:req.session.user._id})
    res.render('success',{user:req.session.user,listRoom:findroom})
})

router.get('/logout',(req,res)=>{
    req.session = null
    res.redirect('/login')
})


module.exports = router