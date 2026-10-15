let arr = [1, 0, 3, 4, 5, 2];
arr.sort((a, b) => {
    return (a - b);
});

arr.forEach((item, index) => {
    console.log(item, index);
});

console.log("------------------");

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i], i);
}

console.log("------------------");

for (let item of arr) {
    console.log(item);
}
