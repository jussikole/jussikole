express = require 'express'
path = require 'path'
bodyParser = require 'body-parser'
port = 80
app = express()
dbApi = require './db_api'
instagram = require './api/instagram'

bio = require './data/bio'


app.use express.static path.join(__dirname, '../build')
app.use bodyParser.json()

app.get '/entries', dbApi.getEntries
app.post '/entry', dbApi.createEntry

app.get '/ig', instagram.getRecentMedia
app.get '/bio', bio.getBio



app.listen port

console.log "Running on port #{port}"
