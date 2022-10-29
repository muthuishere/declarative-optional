// @ts-nocheck
import Optional from "../src";
import {expect} from "chai";

describe('Optional with array', () => {

it("optional works fine with map function against an array",()=>{

    const res  = Optional.of([23,45])
        .stream()
        .map(i=>i+1);

    expect(res).deep.to.equal([24,46]);
})

it("optional works fine with map function against an empty array",()=>{


    const res  = Optional.of([])
        .stream()
        .map(i=>i+1);

    expect(res).deep.to.equal([]);
})
it("optional works fine with map function against an null",()=>{


    const res  = Optional.of(null)
        .stream()
        .map(i=>i+1);

    expect(res).deep.to.equal([]);
})
it("optional works fine with map function against an single element",()=>{


    const res  = Optional.of(23)
        .stream()
        .map(i=>i+1);

    expect(res).deep.to.equal([24]);
})

it("optional works fine with flatten ",()=>{

    const emailForUserId = (id) => id + "@gmail.com"
    const isAdmin = (email)=> Optional.of("admin")

    const res  = Optional.of(emailForUserId(12))
        .map(isAdmin)
        .flatten()
    expect(res.get()).to.equal("admin")
})
it("optional works fine with flatten for super hero",()=>{

    const superHeroById = (id) =>  "Spider-Man"
    //returns Optional
    const powersOf = (name)=>Optional.of(['web-shooters','syntheitic-webbing'])

    const res  = Optional.of(52001)
        .map(superHeroById)
        .map(powersOf )
        .flatten()
        .get()

    expect(res).deep.to.equal(['web-shooters','syntheitic-webbing'])
})
it("optional works fine with flatmap ",()=>{

    const emailForUserId = (id) => id + "@gmail.com"
    const isAdmin = (email)=> Optional.of("admin")

    const res  = Optional.of(emailForUserId(12))
        .flatmap(isAdmin)

    let val = res.get();
    console.log(val)

    expect(val).to.equal("admin")
})


});
