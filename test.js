// let arr=["1","2","3","4",'5',"6","7"]
// let c= getCombinations(["1","2","3","4",'5',"6","7"])
// console.log(c);

// function combo(a,b,g){
//     let arr1=[]
//     let arr2=[]
//     for(let i = 0; i < a.length -2; i++){
//         for(let j = i + 1; j < a.length -1; j++){
//           for(let k = j + 1; k < a.length; k++){
//              arr1.push([data[i],data[j],data[k]])
//              arr1.push([data[i],data[j],data[k]])
//           }
//         }
//       }

// }
// let a=["1","2","3","4",'5',"6","7"]
// function combo(a){

// for (let index = 0, length = a.length; index < length; index++) {
//     const prefix = a[index];

// }
// return prefix
// // }
// // console.log(combo("1","2","3","4",'5',"6","7"));

// // function max(a, b) {
// //     return (a > b) ? a : b;
// // }

// // Returns the maximum value that can
// // be put in a knapsack of capacity k
// function knapSack(k, arr1, arr2, a) {
//     var out = Array(k + 1).fill(0);

//     for (i = 1; i < a + 1; i++) {
//         for (j = k; j >= 0; j--) {

//             if (arr1[i - 1] <= j)
//                 out[j] = Math.max(out[j], out[j - arr1[i - 1]] + arr2[i - 1]);
//         }
//     }
//     return out[k];
// }

let arr1 =[ "1" ];
let arr2 = [60, 100, 120];
let k = arr1.concat(arr2)
if(arr1 [0]===""){ console.log("no");}
else{console.log("yes");}
// let c=k.split(" ")
console.log(k);