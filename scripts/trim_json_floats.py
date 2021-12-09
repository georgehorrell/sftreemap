import json, sys
import simplejson
    
class PrettyFloat(float):
    def __repr__(self):
        return '%.5g'.format(self)

def pretty_floats(obj):
    if isinstance(obj, float):
        return PrettyFloat(obj)
    elif isinstance(obj, dict):
        return dict((k, pretty_floats(v)) for k, v in obj.items())
    elif isinstance(obj, (list, tuple)):
        return list(map(pretty_floats, obj))
    return obj

print(simplejson.dumps(pretty_floats(json.load(sys.stdin))))
