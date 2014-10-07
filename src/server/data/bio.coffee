getAge = ->
  birthday = new Date '1989-06-10'
  now = new Date()
  diff = now.getTime() - birthday.getTime()
  MS_PER_YEAR = 365*86400000.0
  
  years = (diff / MS_PER_YEAR).toFixed 0
  remainder = (diff - years * MS_PER_YEAR) / MS_PER_YEAR

  "#{years} years old"

getImages = () -> {
  beach: { name: 'bio_beach_640.jpg', location: 'Byron Bay, Australia', pos: [0,50] }
  bridge: { name: 'bio_bridge_h640.jpg', location: 'Sydney, Australia', pos: [0,0]  }
  corona: { name: 'bio_corona_640.jpg', location: 'Hong Kong', pos: [0,50]  }
  fishing: { name: 'bio_fishing_h640.jpg', location: 'Fraser Island, Australia', pos: [50,50]  }
  plane: { name: 'bio_plane_h640.jpg', location: 'Taupo, NZ', pos: [50,50]  }
  street: { name: 'bio_street_640.jpg', location: 'Hong Kong', pos: [50,50]  }
  whitsunday: { name: 'bio_whitsunday_640.jpg', location: 'Whitsundays, Australia', pos: [50,50]  }
  chichen: { name: 'bio_chichen_640.jpg', location: 'Chichen Itza, Mexico', pos: [50,50]  }
  hcr: { name: 'bio_hcr_640.jpg', location: 'Helsinki, Finland', pos: [50,50]  }
  ny: { name: 'bio_ny_640.jpg', location: 'New York, USA', pos: [20,40] }
  fiji: { name: 'bio_fiji_640.jpg', location: 'Fiji Islands', pos: [50,50]  }
}
  
getTiles = () ->
  images = getImages()
  tiles = [
    { text: 'Jussi Kolehmainen', image: images.bridge, color: '#FFA23F' }
    { text: getAge(), image: images.beach, color: '#E87680' }
    { text: 'Lives in Helsinki, Finland', image: images.corona, color: '#14FFA5' }
    { text: 'M.Sc. in Engineering Physics', image: images.street, color: '#D17EEA'  }
    { text: 'Programmer / mathematician / consultant', image: images.plane, color: '#69AAB0' }
    { text: 'Works at HiQ Finland', image: images.ny, color: '#A3B997' }
    { text: 'GMAT 760', image: images.fiji, color: '#FEB13E' }
    { text: 'Speaks Finnish, Swedish, English and Spanish', image: images.whitsunday, color: '#795655' }
    { text: 'Finance student at Aalto University School of Business', image: images.chichen, color: '#52A7D5'  }
    { text: '38 countries visited', image: images.hcr, color: '#D4B199' }
    { text: 'Half marathon 1:39', image: images.fishing, color: '#A5D404' }
  ]
  
exports.getBio = (req, res) ->
  res.json { tiles: getTiles() }