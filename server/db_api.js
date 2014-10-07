var config, db, entries, monk;

monk = require('monk');

config = require('./config');

db = monk(config.mongodb.connectionString);

entries = db.get('entries');

exports.getEntries = function(req, res) {
  return entries.find({}, function(err, docs) {
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.json(docs);
    }
  });
};

exports.createEntry = function(req, res) {
  var entry;
  entry = req.body;
  return entries.insert(entry, function(err, doc) {
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.json(doc);
    }
  });
};

exports.getBioTiles = function(req, res) {};
