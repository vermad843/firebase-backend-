const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();


admin.initializeApp();

const config = {
    apiKey: "AIzaSyDTDcGTbkb1p22FzTrjk2u_7O6YLjLpx5s",
    authDomain: "socialape-f4797.firebaseapp.com",
    databaseURL: "https://socialape-f4797.firebaseio.com",
    projectId: "socialape-f4797",
    storageBucket: "socialape-f4797.appspot.com",
    messagingSenderId: "248864740682",
    appId: "1:248864740682:web:4ad5f52a7e8bf6f2f85db3",
    measurementId: "G-JSWKZ2Q4N6"
  };



const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();



app.get('/screams', (req, res) => {
        db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let screams = [];
            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(screams);
        })
        .catch((err) => console.error(err));
});



app.post('/scream', (req, res,next) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };
        db 
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({
                message: `document ${doc.id} created successfully`
            });
        })
        .catch(err => {
            res.status(500).json({
                error: 'something went wrong'
            });
            console.error(err)
        })
});

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}


const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false ;
}


app.post('/signup', (req,res) => {
    const newUser = {
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
        handle : req.body.handle,
    };

    let errors = {};

    if(isEmpty(newUser.email)) {
        errors.email = 'Must not be empty'
    }else if(!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address'
    }

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty'
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

 

 db.doc(`/users/${newUser.handle}`)
   .get()
   .then(doc => {
       if(doc.exists) {
           return res.status(400).json({handle : 'this handle is already taken'});   
       }else {
      return  firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
       }
   })
   .then(data => {
      return data.user.getIdToken(); 
   })
   .then(token => {
       return res.status(201).json({token});
   })
   .catch(err => {
       console.error(err);
       return res.status(500).json({error : err.code});
   });

  });


exports.api = functions.https.onRequest(app);