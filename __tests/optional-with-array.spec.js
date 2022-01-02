import 'regenerator-runtime/runtime'
import Optional from "../src/index";


test("optional works fine with map function against an array",()=>{


    const res  = Optional.of([23,45])
        .stream()
        .map(i=>i+1);

    expect(res).toStrictEqual([24,46]);
})

test("optional works fine with map function against an empty array",()=>{


    const res  = Optional.of([])
        .stream()
        .map(i=>i+1);

    expect(res).toStrictEqual([]);
})
test("optional works fine with map function against an null",()=>{


    const res  = Optional.of(null)
        .stream()
        .map(i=>i+1);

    expect(res).toStrictEqual([]);
})
test("optional works fine with map function against an single element",()=>{


    const res  = Optional.of(23)
        .stream()
        .map(i=>i+1);

    expect(res).toStrictEqual([24]);
})

test("optional works fine with flatten ",()=>{

    const emailForUserId = (id) => id + "@gmail.com"
    const isAdmin = (email)=> Optional.of(false)

    const res  = Optional.of(emailForUserId(12))
        .map(isAdmin)
        .flatten()



    expect(res.get()).toBe(false)
})
test("optional works fine with flatten for super hero",()=>{

    const superHeroById = (id) =>  "Spider-Man"
    //returns Optional
    const powersOf = (name)=>Optional.of(['web-shooters','syntheitic-webbing'])

    const res  = Optional.of(52001)
        .map(superHeroById)
        .map(powersOf )
        .flatten()
        .get()

    expect(res).toStrictEqual(['web-shooters','syntheitic-webbing'])
})
test("optional works fine with flatmap ",()=>{

    const emailForUserId = (id) => id + "@gmail.com"
    const isAdmin = (email)=> Optional.of(false)

    const res  = Optional.of(emailForUserId(12))
        .flatmap(isAdmin)




    expect(res.get()).toBe(false)
})
