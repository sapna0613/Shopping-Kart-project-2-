// // function reverse(n)
// // {
// // 	n = n + "";
// // 	return n.split("").reverse().join("");
// // }
// // console.log(Number(reverse(32243)));


// // function sum (j){
// //     var j = j +"";
// //     return j.split("").reverse("").join("");

// // }
// // console.log(Number(reverse(67876)));

// // function reverse_a_number(){
// //     a = a;
// //     return a.split("").reverse("").join();
// // }
// // console.log(Number(reverse(76)))

// // reverse();



// // function multiply(){
// //     a = a;
// //     return abbb.split("").join("")
// // }
// // console.log(Number(reverse(9899)))


// // let name = 'sapna';
// // console.log(`Hello Good Evening ${name} Hope you are learning well`)

// // let name2 = "amar";
// // console.log(`Hello Good Evening ${name2} Hope you are learning well`)

// function greet(name){
//     console.log(`Hello Good Evening ${name} Hope you are learning well`)
// }
// let name = "sapna"
// greet(name)

// function sum (add){
//     console.log("the sum of twoo numer is 4")
// }
//   let add = 4
//   sum();


// function person(Name,thanks){
//     console.log(`hello ${Name},Hope you are ready for your exam ${thanks}`)
// }

// let Name = "sapnaa";
// let thanks ="thanks a lot";
// person(Name,thanks)


const mymultiply = function(one,two){
    let multiply  =
   `the multiply of ${one} and ${two} is 63` ;
   return multiply;

    
}

let one = '7';
let two ='9'; 



let val = mymultiply(one,two);
 console.log(val)


 let sum = function (first,second){
    let add = ` the ${first} and ${second} is 90`;
     return add
 }

let first = "70";
let second = "20";

let val1 = (sum (first,second))
console.log(val1)


let car={
    color :"black",
    model : "2015",
   carname : function (){
    return "scorpio, inovaa";
   }
}

console.log(car)
console.log(this.carname)


function name(name1){
    return `hello welcome to the javascript ${name1}`
}
console.log(name("sapna"))
