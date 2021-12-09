import random
from re import match as re_match

TREES_FILE_PATH = "data/trees.elevation.csv"

def histogram(data, nbins, min_val=None, max_val=None, keyFn=lambda x: x):
    hist_vals = [0]*(nbins+1)
    if min_val is None:
        min_val = keyFn(min(data, key=keyFn))
    if max_val is None:
        max_val = keyFn(max(data, key=keyFn))

    bins = [[] for x in range(nbins+1)]
    for d in data:
        v = keyFn(d)
        bin_number = int(nbins * ((v - min_val) / (max_val - min_val)))
        bins[bin_number].append(d)
    bin_lower_bounds = [min_val + i*(max_val - min_val)/len(hist_vals) for i in range(len(hist_vals))]
    return bins, bin_lower_bounds

def is_number_regex(s):
    """ Returns True is string is a number. """
    if re_match("^\d+?\.\d+?$", s) is None:
        return s.isdigit()
    return True

def main():
    data = []
    with open(TREES_FILE_PATH) as f:
        for line in f:
            fields = line.split(",")
            (x, z), y = fields[13:15], fields[-1]
            if not (is_number_regex(x) and is_number_regex(y) and is_number_regex(z)): continue
            x = float(x)
            y = float(y)
            z = float(z)
            if x == 0 or y == 0 or z == 0: continue
            data.append((x,y,z))

    # bins, _ = histogram(data, 10, keyFn=lambda x: x[0])
    # max_bin = max(bins, key=len)

    minX, maxX, minY, maxY, minZ, maxZ = None, None, None, None, None, None
    for x, y, z in data:
        if minX is None:
            minX = x
            maxX = x
            minY = y
            maxY = y
            minZ = z
            maxZ = z
        else:
            if x < minX: minX = x
            if x > maxX: maxX = x
            if y < minY: minY = y
            if y > maxY: maxY = y
            if z < minZ: minZ = z
            if z > maxZ: maxZ = z

    random.shuffle(data)
    scaled = []
    for x, y, z in data:
        scaled_x, scaled_y, scaled_z = (((x - minX) / (maxX - minX))), (((y - minY) / (maxX - minX))), (((z - minZ) / (maxX - minX))) 
        scaled.append((scaled_x, scaled_y, scaled_z))

    print("[")
    avg_x, avg_z = sum(x[0] for x in scaled) / len(data), sum(x[2] for x in scaled) / len(data)
    for x, y, z in scaled[:-1]:
        print("{},{},{},".format(x - avg_x,y, z - avg_z))

    x, y, z = scaled[-1]
    print("{},{},{}".format(x - avg_x,y,z-avg_z))
    print("]")

if __name__ == '__main__':
    main()
