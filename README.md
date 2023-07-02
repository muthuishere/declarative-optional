![Build](https://img.shields.io/github/workflow/status/muthuishere/declarative-optional/Node.js%20CI)
![Coverage](https://img.shields.io/codecov/c/github/muthuishere/declarative-optional)
![License](https://img.shields.io/npm/l/declarative-optional)
![Version](https://img.shields.io/npm/v/declarative-optional)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmuthuishere%2Fdeclarative-optional.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmuthuishere%2Fdeclarative-optional?ref=badge_shield)


Declarative-Optional
===================

A Javascript library to write concise functional code.Combined with features of Java Optional & Javascripts Promise chaining

##### Features

> Lazily evaluated

> chaining async and sync functions

> Most of the Java Optional Features

> Some of the Java Stream Features



<hr/>

##### Installation

```
    npm install declarative-optional   
```


##### Usage
To Import
```
// Common JS
    const {Optional} = require( "declarative-optional");

//ES6
    import {Optional} from "declarative-optional";

```

Common Usages

```

//Increment By 5 
  function incrementByFive(input) {
        return Optional.of(input)
            .map(i=>i+5)
            .orElse(0)
    }


// incrementByFive(41)  => 46
// incrementByFive(null)  => 0
// incrementByFive(undefined)  => 0



// All the expressions will be evaluated only after you specified get()

//Increment a Number by 5, Only if its dividable by 5
Optional.of(input)
    .filter(val=>val % 5 == 0)
    .map(val=>val+5)
    .get()


   
```


On  Asynchronous code

```javascript
// Consider the async function

function getFromUserService({username, password}) {
    return new Promise((function (resolve) {
        resolve({name: "user", isAdmin: true})
    }))
}

async function login({username, password}) {

    if (null == username || null == password) {
        throw new Error("Cannot be Null")
    }

    const result = await getFromUserService(username, password)


    if (result.isAdmin) {
        redirectTo("adminPage")
    } else {
        redirectTo("userPage")
    }

}

// With Declarative Optional
async function login({username, password}) {


    const page = await Optional.of({username: user, password: pass})
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserService)
        .map(result => result.isAdmin ? "adminPage" : "userPage")
        .toAsync();


    page.ifPresentOrElse(redirectTo, () => {
        throw new Error("Cannot be Null")
    })
}
```


#### fetch Api with Optional 

```javascript

    // Typical code 

    const url  ='https://jsonplaceholder.typicode.com/todos/' + item
    const rawResults = await fetch(url);
    const response = await rawResults.json();

    if (response.completed) {
        return response.title
    } else {
        return null
    }

    
    // Can be rewritten with optional as 
    return await Optional.of('https://jsonplaceholder.typicode.com/todos/' + item)
        .map(fetch)
        .map(response => response.json())
        .filter(response => response.completed == true)
        .map(response => response.title)
        .getAsync();

   
    


```
There are so much you can play with declarative suite. It does have some features similar to Java Optional & RX libraries, except the code is  small (one file around 4 Kb original source) and simple. 


It also features a stream library,  a wrapper for array , with lazy evaluation and functional programming features.


```javascript

//commonjs
    const {Stream} = require("declarative-optional");

//ES6
    import {Stream} from "declarative-optional";
    
    
```



```javascript

    const results = Stream.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .filter(val => val % 2 == 0)
        .map(val => val * 2)
        .get();

    console.log(stream) // [4,8,12,16,20]
    
    
    // first
    Stream.of([45,46,80])
        .first()
        .get()
    // [45]
    
    
    
    // last
    Stream.of([45,46,80])
        .last()
        .get()
    // [80]
    
    //The first and last methods are useful when you want to get the first or last element of a stream and also you can chain up map operations.

    Stream.of([45,46,80])
        .last()
        .map(val=>val*2)
        .get()
    // [160]
    

// Async Stream
    const input = [Promise.resolve(21),Promise.resolve(25),Promise.resolve(30)]
    const result = await Stream.of(input)
        .filter((value) => value %5 ==0)
        .map(getFromUserService)
        .getAsync()
    
    // [25,30]
    
    
// handle async errors or empty values with default value

    const input = [Promise.resolve(21),Promise.reject(25),Promise.resolve(30)]
    const val = await Stream.of(input)
        .filter((value) => value %5 ==0)
        .map(getFromUserService)
        .orElseAsync(["default"])

    // ["default"]    


```


### Documentation

<table>
<tr>
<td> Function </td> <td> Description </td><td> Example </td>
</tr>

<tr>
    <td> Optional.of </td>
    <td> To create a new Optional .Can be value or promise or null or undefined </td>
    <td>  
<br/>

     Optional.of(input)

<br/>
    </td>
</tr>
<tr>
    <td> map </td>
    <td>
        convert from one form to other, returns optional instance, can return async functions as well
    </td>
    <td>
<br/>

      Optional.of(21)
      .map(val => val + 1)


<br/>
    </td>

</tr>
<tr>
    <td> filter </td>
    <td>
        apply a predicate function over a value
    </td>
    <td>
<br/>

      Optional.of(21)
      .filter(val => val % 5 == 0)

<br/>
    </td>

</tr>
<tr>
    <td> flatmap </td>
    <td>
if an existing function returns Optional , it will flatten the value and pass it below         
    </td>
    <td>

<br/>

    // Consider a function which will return Optional
    //returns Optional 
    const powersOf = (name)=>Optional.of(['web-shooters','syntheitic-webbing'])
    
    const superHeroById = (id) =>  "Spider-Man"

<br/>

    const res  = Optional.of(52001)
        .map(superHeroById)
        .map(powersOf )
        .flatten()
        .get()

    // results ['web-shooters','syntheitic-webbing']


<br/>

    const res  = Optional.of(52001)
        .map(superHeroById)
        .flatmap(powersOf )
        .get()

    // results ['web-shooters','syntheitic-webbing']





<br/>
    </td>

</tr>

<tr>
    <td> get </td>
    <td>
evaluate all the chained functions and give the result. If no value is available , will return null        
    </td>
    <td>
<br/>

      Optional.of(21)
      .filter(val => val % 5 == 0)
      .map(val => val + 5)
      .get() ;  // returns null

<br/>

      Optional.of(20)
      .filter(val => val % 5 == 0)
       .map(val => val + 5)
      .get() ;  // returns 25

<br/>

***Error***

      Optional.of(input)      
       .map(promiseFunctionToValidateUserDetails)
       .map(promiseFunctionToValidateSomeOther)
      .get() ;  

    // Error ? Use getAsync to deal with promises

<br/>
    </td>

</tr>
<tr>
    <td> orElse </td>
    <td>
Evaluate all the chained functions and if result exists, give the result. If no value is available , will return value passed by        
    </td>
    <td>
<br/>

      Optional.of(21)
      .filter(val => val % 5 == 0)
      .map(val => val + 5)
      .orElse(45) ;  // returns 45 , as the evaluation will return null

<br/>

      Optional.of(20)
      .filter(val => val % 5 == 0)
       .map(val => val + 5)
      .orElse(45) ;  // returns 25


<br/>
    </td>

</tr>

<tr>
    <td> stream </td>
    <td>
Evaluates all the chained functions and give an array object , if the result is  already an array, it will provide as it is , if its single element, it converts to an array of single element        
    </td>
    <td>
<br/>

    const res  = Optional.of([23,45])
        .stream()
        .map(i=>i+1);

    //returns [24,46]

<br/>

    const res  = Optional.of(null)
        .stream()
        .map(i=>i+1);

    //returns []

<br/>



    const res  = Optional.of(23)
        .stream()
        .map(i=>i+1);

    //returns [24]

    

<br/>
    </td>

</tr>

<tr>
    <td> getAsync </td>
    <td>
<br/>
Evaluate all the chained functions combined with promises give another Promise&lt;result&gt;  

<br/>
</td>
    <td>


<br/>



     const result = await Optional.of(input)      
                   .map(promiseFunctionToValidateUserDetails)
                   .map(promiseFunctionToValidateRole)
                    .map(regularFunctionToFormatData)
                    .getAsync()
                   



<br/>


    
    const result = await Optional.of('https://jsonplaceholder.typicode.com/todos/' + item)
                        .map(fetch)
                        .map(response => response.json())
                        .filter(response => response.completed == true)
                        .map(response => response.title)
                        .getAsync();


<br/>

**The below will also work fine**

      const result = await Optional.of(21)
                              .filter(val => val % 5 == 0)
                              .map(val => val + 5)
                              .getAsync()  

      

<br/>
    </td>

</tr>

<tr>
    <td> toAsync </td>
    <td>
<br/>
Evaluate all the chained functions combined with promises give another Promise&lt;Optional&gt;  which hold the response.<br/>
<br/>
All the async based results must use toAsync and then they can use the Optional consolidation functions , get ,orElse,stream etc..

<br/>
</td>
    <td>


<br/>



      Optional.of(input)      
       .map(promiseFunctionToValidateUserDetails)
       .map(promiseFunctionToValidateSomeOther)
      .toAsync()
       .then(optionalData=>{
            // optionalData.get() holds the result
        })

  

<br/>



     const optionalData = await Optional.of(input)      
                       .map(promiseFunctionToValidateUserDetails)
                       .map(promiseFunctionToValidateSomeOther)
                      .toAsync()

    // optionalData.get() holds the result





<br/>
    </td>

</tr>

</table>

###### Alternatives

There are some alternatives , Have a look into them as well

 [Optional.js](https://github.com/spencerwi/Optional.js)

 [amidevtech/optional.js](https://github.com/amidevtech/optional.js)





## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmuthuishere%2Fdeclarative-optional.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmuthuishere%2Fdeclarative-optional?ref=badge_large)