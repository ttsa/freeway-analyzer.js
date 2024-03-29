const gentries = require('./_gentries')
module.exports = function (id) {
  let gentry = gentries[id]
  if (typeof gentry === 'object') {
    return gentry
  } else {
    return {
      id,
      sectionStart: ''
    }
    // console.log('WRYY')
    // process.exit()
    // throw new Error(`未知 (${id})`)
  }
}

const fs = require('fs')
function updateGentries () {
  // const url = 'tisvcloud.freeway.gov.tw/history/motc20/ETag.xml'
  const xml = fs.readFileSync(__dirname + '/etag.xml').toString()
  var parseString = require('xml2js').parseString
  var gentries = {

  }
  parseString(xml, function (err, result) {
    // console.log(Object.keys(result.ETagList.ETags[0]))
    // console.log(result.ETagList.ETags[0].ETag)
    result.ETagList.ETags[0].ETag.forEach(v => {
      let id = v.ETagGantryID[0]
      // console.log(v.RoadSection[0].Start[0])
      let locationMile = v.LocationMile[0].split('K+')
      locationMile = parseFloat(locationMile[0] + '.' + locationMile[1])

      gentries[id] = {
        roadName: v.RoadName[0],
        direction: v.RoadDirection[0],
        linkId: v.LinkID[0],
        PositionLat: v.PositionLat[0],
        PositionLon: v.PositionLon[0],
        sectionStart: v.RoadSection[0].Start[0],
        sectionEnd: v.RoadSection[0].End[0],
        locationMileRaw: v.LocationMile[0],
        locationMile
      }
    })

    console.log('module.exports = ')
    console.log(gentries)
  })
}

switch (process.argv[2]) {
  case 'update':
    try {
      updateGentries()
    } catch (error) {
      console.log(error)
    }

    break
}
