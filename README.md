Declarative-Optional
===================

> A Declarative way to deal with null or undefined or promises with an Optional monad and chaining them




```javascript


// Consider the function
function incrementIfDivisableByFive(input) {
    if (null == input || undefined == input)
        return 0;

    const result = 0;
    if (input % 5 == 0)
        result = input + 1
    return result;
}

// With Declarative Optional
function incrementIfDivisableByFive(input) {
    return Optional.of(input)
        .filter(i => i % 5 == 0)
        .map(i => i + 1)
        .orElse(0)
}

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

There are so much you can play with declarative Optional. It does have some features similar to Java Optional & RX libraries, except the code is  small (one file around 4 Kb original source) and simple. 


##### Features

> Lazily evaluated

> Merging multiple Optionals

> Convert to Stream

> Promises chaining

> Most of the Java Optional Features


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

    // Error ? Use toAsync to deal with promises

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

**The below will also work fine**

      const optionalData = await Optional.of(21)
                              .filter(val => val % 5 == 0)
                              .map(val => val + 5)

      // optionalData.get() holds the result

<br/>
    </td>

</tr>

</table>

###### Alternatives

There are some wonderful alternatives to check out
[Optional.js](https://github.com/spencerwi/Optional.js)
[amidevtech/optional.js](https://github.com/amidevtech/optional.js)


