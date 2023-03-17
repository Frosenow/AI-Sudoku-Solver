const express = require('express')

// Default setup 
const app = express()
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

// Setting view rendering engine 
app.set("view engine", "ejs")

// Set value of the PORT 
const PORT = process.env.PORT || 8000;

// Set the server to listen on the PORT
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})

// Routing to main site
app.get('/', (req, res) => {
    res.render('index.ejs')
})

