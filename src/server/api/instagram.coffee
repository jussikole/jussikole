ig = require('instagram-node').instagram()
credentials = require '../credentials'

#ig.use credentials.instagram
userId = 36297206
accessToken = '36297206.8c86279.2028fae4deb740f39c440bb902f569e1'
ig.use { access_token: accessToken }

formatMedias = (medias) ->
  medias.map (media) -> {
    type: 'image'
    source: 'instagram'
    caption: media.caption.text
    location:
      name: media.location?.name ? null
      lat: media.location?.latitude ? null
      lon: media.location?.lon ? null
    timestamp: media.created_time
    thumbnail:
      url: media.images.thumbnail.url
      size: [media.images.thumbnail.width, media.images.thumbnail.height]
    image:
      url: media.images.standard_resolution.url
      size: [media.images.standard_resolution.width, media.images.standard_resolution.height]
  }

getRecentMedia = (req, res) ->
  options = {}
  ig.user_self_media_recent options, (err, medias, pagination) ->
    if err?
      res.json err
    else
      res.json {
        medias: formatMedias medias
      }
    
  
  
module.exports =
  getRecentMedia: getRecentMedia