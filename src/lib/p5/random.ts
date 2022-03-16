// variables used for random number generators
const randomStateProp = "_lcg_random_state";
// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
// m is basically chosen to be large (as it is the max period)
// and for its relationships to a and c
const m = 4294967296;
// a - 1 should be divisible by m's prime factors
const a = 1664525;
// c and m should be co-prime
const c = 1013904223;
let y2 = 0;

export const random = function (min?: any, max?: any) {
  let rand;

  rand = Math.random();

  if (typeof min === "undefined") {
    return rand;
  } else if (typeof max === "undefined") {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};
