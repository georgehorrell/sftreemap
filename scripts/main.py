import random
from re import match as re_match

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
    with open("data/trees.csv") as f:
        data = []
        for line in f:
            fields = line.split(",")
            x, y = fields[13:15]
            if not (is_number_regex(x) and is_number_regex(y)): continue
            x = float(x)
            y = float(y)
            if x == 0 or y == 0: continue
            data.append((x,y))

        bins, _ = histogram(data, 10, keyFn=lambda x: x[0])
        max_bin = max(bins, key=len)

        minX, maxX, minY, maxY = None, None, None, None
        for x, y in max_bin:
            if minX is None:
                minX = x
                maxX = x
                minY = y
                maxY = y
            else:
                if x < minX: minX = x
                if x > maxX: maxX = x
                if y < minY: minY = y
                if y > maxY: maxY = y

        count = len(max_bin)
        random.shuffle(max_bin)
        view = max_bin[:count]
        scaled = []
        for x, y in max_bin[:count]:
            scaled_x, scaled_y = (((x - minX) / (maxX - minX))), (((y - minY) / (maxX - minX)))
            scaled.append((scaled_x, scaled_y))

        print("[")
        avg_x, avg_y = sum(x[0] for x in scaled) / len(view), sum(x[1] for x in scaled) / len(view)
        for x, y in scaled[:-1]:
            print("{},{},".format(x - avg_x,y - avg_y))

        x, y = scaled[-1]
        print("{},{},".format(x - avg_x,y - avg_y))
        print("]")

if __name__ == '__main__':
    main()
