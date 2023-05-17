
const express = require('express')
const router = express.Router()
const Students = require('../models/Students');
const Teachers = require('../models/Teachers');
const jwt = require('jsonwebtoken')
const secretKey = 'secretKey';

const verifyToken = async (req, res, next)=>{
    const token = req.cookies.jwt;
    await jwt.verify(token, secretKey, (err, userData)=>{
        if(err){
            res.redirect('/teacherLogin')
        }else{
            console.log(userData)
            req.token = token
            req.user = userData
            next();
        }
    })
}

const errorHandler = err =>{
    console.log('Error : '+err);
}

const isLogin = (req, res, next)=>{
    req.token = req.cookies.jwt
    next();
}

router.get('/', isLogin, (req, res)=>{
    res.render('home', {login:req.token})
})

router.get('/teacherLogin', isLogin, (req, res)=>{
    if(req.cookies.jwt !== undefined){
        res.redirect('/studentList')   
    }
    res.render('teacherLogin', {login:req.token})
})

router.post('/teacherLogin', isLogin, async (req, res)=>{
    var teachers = await Teachers.findAll({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    }).catch(errorHandler);
    if(teachers.length > 0){
        const teacher = {
            id: teachers[0].dataValues.id,
            email: teachers[0].dataValues.email
        }
        jwt.sign({teacher}, secretKey, {expiresIn:'500s'}, (err, token)=>{
            res.cookie("jwt", token, {
                expires: new Date(Date.now()+600000),
                httpOnly: true
            })
        });
        console.log(req.token)
        var students = await Students.findAll().catch(errorHandler);
        res.render('studentList', {students, login:true});
    }else{
        res.render('teacherLogin', {message:'Enter correct email and password', login:req.token});
    }
})

router.get('/studentLogin', isLogin, (req, res)=>{
    res.render('studentLogin', {login:req.token});
})

router.post('/studentLogin', isLogin, async (req, res)=>{
    const students = await Students.findAll({
        where: {
            roll: req.body.roll
        }
    }).catch(errorHandler);
    if(students.length > 0){
        const student = students[0];
        res.render('studentDetail', {student:student, login:req.token});
    }else{
        res.render('studentLogin', {message:'Please enter correct roll number', login:req.token});
    }

})

router.get('/studentList', verifyToken, async (req, res)=>{
    var students = await Students.findAll().catch(errorHandler);;
    res.render('studentList', {students, login:req.token});
})

router.get('/AddStudent', verifyToken, (req, res)=>{
    res.render('addStudent', {login:req.token});
})

router.post('/AddStudent', verifyToken, async (req, res)=>{
    const formData = req.body;
    const student = await Students.create({
        roll: formData.roll,
        name: formData.name,
        dob: formData.dob,
        score: formData.score
    })
    res.redirect('/studentList');
})

router.get('/editStudent/:roll', verifyToken, async (req, res)=>{
    const roll = req.params.roll;

    const students = await Students.findAll({
        where: {
            roll: roll
        }
    }).catch(errorHandler);
    const student = students[0].dataValues;
    console.log(student);
    res.render('editStudent', {student:student, login:req.token});
})

router.post('/editStudent/:roll', verifyToken, async (req, res)=>{
    const roll = req.params.roll;
    const formData = req.body;
    const student = await Students.update({ 
        roll: formData.roll, 
        name: formData.name, 
        dob: formData.dob, 
        score: formData.score
    },
    {
        where: {
            roll: roll
        }
    }).catch(errorHandler);
    res.redirect('/studentList')
})

router.get('/deleteStudent/:roll', verifyToken, async (req, res)=>{
    const roll = req.params.roll;

    const student = await Students.destroy({
        where:{
            roll: roll
        }
    }).catch(errorHandler)
    res.redirect('/studentList')
})

router.get('/logout', verifyToken, async (req, res)=>{
    try {
        console.log(req.user);
        res.clearCookie('jwt')
        console.log('logout successful')
        res.render('teacherLogin', {message:'Successfully logout', login:false});
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router