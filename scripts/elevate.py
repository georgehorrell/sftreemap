import json, os, random
from shapely.geometry import Point, Polygon
from tqdm import tqdm
from re import match as re_match

# depending on your version, use: from shapely.geometry import shape, Point

def is_number_regex(s):
    """ Returns True is string is a number. """
    if re_match("^\d+?\.\d+?$", s) is None:
        return s.isdigit()
    return True

def make_polygon(coords):
    return Polygon(coords)

def main():

    data = []
    with open('data/trees.csv') as f:
        for line in f:
            fields = line.split(",")
            lat, long = fields[15:17]
            if not (is_number_regex(lat) or is_number_regex(long)): continue
            lat = float(lat)
            long = float(long)
            if lat == 0 or long == 0: continue
            data.append((long,lat))

    # load GeoJSON file containing sectors
    shapes = []
    with open('data/elevation.geojson') as f:
        js = json.load(f)

    # check each polygon to see if it contains the point
    for feature in tqdm(js['features']):
        coords = feature['geometry']['coordinates']
        elevation = float(feature['properties']['elevation'])
        if len(coords) < 3:
            continue
        shapes.append((elevation, make_polygon(coords)))

    shapes.sort(key=lambda x: x[0], reverse=True)
    random.shuffle(data)
    for i, (long, lat) in enumerate(data):
        # construct point based on lon/lat returned by geocoder
        point = Point(long, lat)

        # check each polygon to see if it contains the point
        for j, (elevation, polygon) in enumerate(shapes):
            if polygon.contains(point):
                print("found a match for point {}/{} on poly {}/{}".format(i, len(data), j, len(shapes)))
                break

if __name__ == '__main__':
    main()