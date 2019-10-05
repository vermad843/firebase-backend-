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


app.get('/screams', (req, res) => {
    admin
        .firestore()
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



app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };
    admin.firestore()
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


app.post('/signup', (req,res) => {
    const newUser = {
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
        handle : req.body.handle,
    };


firebase
   .auth()
   .createUserWithEmailAndPassword(newUser.email, newUser.password)
   .then((data) => {
       return res
          .status(201)
          .json({ message : `user ${data.user.uid} signed up successfully`});
   })
   .catch((err) => {
     console.error(err);
     return res.status(500).json({error : err.code});
       });
});


exports.api = functions.https.onRequest(app);