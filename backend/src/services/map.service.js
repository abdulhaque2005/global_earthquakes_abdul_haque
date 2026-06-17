import Earthquake from '../models/Earthquake.js';
class MapService {
  async getEarthquakesWithinRadius(latitude, longitude, radiusKm = 500, limit = 100) {
    const radiusInRadians = radiusKm / 6378.1;
    return await Earthquake.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
    })
      .sort('-time')
      .limit(limit);
  }
  async getEarthquakesInBoundingBox(swLng, swLat, neLng, neLat, limit = 200) {
    return await Earthquake.find({
      location: {
        $geoWithin: {
          $box: [
            [swLng, swLat],
            [neLng, neLat],
          ],
        },
      },
    })
      .sort('-time')
      .limit(limit);
  }
}
export default new MapService();
