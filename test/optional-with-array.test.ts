import {Optional} from "../src";
import {expect} from "chai";

describe('Optional with array', () => {

it("optional works fine with map function against an array",()=>{

    const res  = Optional.of([23,45])
        .stream()
        .map(i=>i+1);

    expect(res).deep.eq([24,46]);
})

it("optional works fine with map function against an empty array",()=>{


    const res  = Optional.of([])
        .stream()
        .map(i=>i+1);

    expect(res).deep.eq([]);
})
it("optional works fine with map function against an null",()=>{



    const res  = Optional.of(null)
        .stream()
        .map((i: any)=>i+1);

    expect(res).deep.eq([]);
})
it("optional works fine with map function against an single element",()=>{


    const res  = Optional.of(23)
        .stream()
        .map((i: any)=>i+1);

    expect(res).deep.eq([24]);
})

it("optional works fine with flatten ",()=>{

    const emailForUserId = (id:any) => id + "@gmail.com"
    const isAdmin = (email:any)=> Optional.of("admin")

    const res  = Optional.of(emailForUserId(12))
        .map(isAdmin)
        .flatten()
    expect(res.get()).deep.eq("admin")
})
it("optional works fine with flatten for super hero",()=>{

    const superHeroById = (id:any) =>  "Spider-Man"
    //returns Optional
    const powersOf = (name:any)=>Optional.of(['web-shooters','syntheitic-webbing'])

    const res  = Optional.of(52001)
        .map(superHeroById)
        .map(powersOf )
        .flatten()
        .get()

    expect(res).deep.eq(['web-shooters','syntheitic-webbing'])
})
it("optional works fine with flatmap ",()=>{

    const emailForUserId = (id:any) => id + "@gmail.com"
    const isAdmin = (email:any)=> Optional.of("admin")

    const res  = Optional.of(emailForUserId(12))
        .flatmap(isAdmin)

    let val = res.get();
    console.log(val)

    expect(val).deep.eq("admin")
})


});
