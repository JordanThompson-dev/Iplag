// Using Set.prototype.forEach(callback[, thisarg])
// creating set
var set1 = new Set();

// adding element to the set
set1.add({Firstname: "Sumit", Lastname: "Ghosh"});
set1.add(50);
set1.add(30);
set1.add(40);
set1.add("Geeks");
set1.add("GFG");

// Declaring a call back function
// we are using only one parameter value
// so it will ignore other two .
function printOne(values)
{
	console.log(values);
}

// It prints value of all the element
// of the set
set1.forEach(printOne);

// Declaring a call back function
// we are using two parameter value
// so it will ignore last one
function printTwo(key, values)
{
	console.log(key+" "+values);
}

// As key and values are same in set
// so it will print values twice
set1.forEach(printTwo);

// Declaring a call back function
// we are using all three parameter value
function printThree(key, values, set)
{
	// it will print key and value
	// and the set object
				
	console.log(key+" "+values);
	console.log(set);
}

// It prints key and value of each
// element and the entire set object
set1.forEach(printThree);
