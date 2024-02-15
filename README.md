# Node JS login portal application

This application is a full fledged login portal connected with mongodb and the email verification and then login. If not a member then you need to register to the portal

## Email Verification

I commented out the original info for sending the email and added my own credentials. It's in `/routes/users`

## Requirements

You need to have mongodb installed in your system. You can find the schema in `/models/user` to see how the data is organised. You'll have to register a new user to be able to log in (or already have them in your local DB)

## Dependencies

To install all the dependencies:

``` javascript
npm install
```

## To run the application

``` javascript
nodemon app.js
      or
  npm start
```

## Made by

### Deepankur Lohiya
