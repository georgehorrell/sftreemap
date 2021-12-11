import json, sys

l = json.load(sys.stdin)
vals = []
for i in range(0, len(l), 3):
    x, y, z = l[i:i+3]
    vals.append('%.4f, %.4f, %.4f' % (x,y,z))

print("[\n%s\n]" % (",\n".join(vals)))
