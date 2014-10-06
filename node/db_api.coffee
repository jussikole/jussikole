monk = require 'monk'
config = require './config'
db = monk config.mongodb.connectionString

entries = db.get 'entries'


exports.getEntries = (req, res) ->
  entries.find {}, (err, docs) ->
    if err
      res.status(500).json err
    else
      res.json docs
      
exports.createEntry = (req, res) ->
  entry = req.body
  entries.insert entry, (err, doc) ->
    if err
      res.status(500).json err
    else
      res.json doc
      
exports.getBioTiles = (req, res) ->
  