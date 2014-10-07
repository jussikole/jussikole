var accessToken, credentials, formatMedias, getRecentMedia, ig, userId;

ig = require('instagram-node').instagram();

credentials = require('../credentials');

userId = 36297206;

accessToken = '36297206.8c86279.2028fae4deb740f39c440bb902f569e1';

ig.use({
  access_token: accessToken
});

formatMedias = function(medias) {
  return medias.map(function(media) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    return {
      type: 'image',
      source: 'instagram',
      caption: media.caption.text,
      location: {
        name: (_ref = (_ref1 = media.location) != null ? _ref1.name : void 0) != null ? _ref : null,
        lat: (_ref2 = (_ref3 = media.location) != null ? _ref3.latitude : void 0) != null ? _ref2 : null,
        lon: (_ref4 = (_ref5 = media.location) != null ? _ref5.lon : void 0) != null ? _ref4 : null
      },
      timestamp: media.created_time,
      thumbnail: {
        url: media.images.thumbnail.url,
        size: [media.images.thumbnail.width, media.images.thumbnail.height]
      },
      image: {
        url: media.images.standard_resolution.url,
        size: [media.images.standard_resolution.width, media.images.standard_resolution.height]
      }
    };
  });
};

getRecentMedia = function(req, res) {
  var options;
  options = {};
  return ig.user_self_media_recent(options, function(err, medias, pagination) {
    if (err != null) {
      return res.json(err);
    } else {
      return res.json({
        medias: formatMedias(medias)
      });
    }
  });
};

module.exports = {
  getRecentMedia: getRecentMedia
};
