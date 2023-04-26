export function mergeArrayOfArrays(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? mergeArrayOfArrays(toFlatten) : toFlatten);
  }, []);
}