[] go to this : https://firebase.google.com/
[] go to console 
[]create project
[]C:\Users\vishnu> 
[]   npm i -g firebase-tools
[]  firebase login  
[]  mkdir socialape-functions 
[]  cd  socialape-functions 
[] firebase init 
[] functions(select that one)
[] select your project 
[] download dependenies - yes
[] go to functions/index.js remove helloworld as a comment and then 
[]firebase deploy
[] open postman and paste this : https://us-central1-socialape-f4797.cloudfunctions.net/helloWorld  (get request)
[] initializing our database : press database(firebase)
[] start in test mode(when you are developing)
[] firebase deploy : important command 
[] admin.firestore is like db 
[] firebase serve not working for me .
[] db.collection('screams') = admin.firestore.collection('screams') 
[] error = 500 (server side error )
[]  error = 400 (client side error )


[] cd functions : npm i --save express


[] npm i --save busboy 
[] for uploading profile picture

[] error 9 : for solving this we have to create a index in our db.

   