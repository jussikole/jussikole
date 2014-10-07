express = require 'express'
path = require 'path'
bodyParser = require 'body-parser'
port = 80
app = express()
instagram = require './api/instagram'

bio = require './data/bio'


app.use express.static path.join(__dirname, '../build')

app.get '/ig', instagram.getRecentMedia
app.get '/bio', bio.getBio



app.listen port

console.log "Running on port #{port}"
