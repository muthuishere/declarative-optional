// @ts-nocheck

import {expect} from "chai";
import {Optional} from "../src";



describe('Optional', () => {


it("Creating Optional and applying map should return optional",()=>{


    const res  = Optional.of(25)
        .map((i: number)=>i+1);
    console.log(res);
    console.log(typeof res);
    expect(res.isPresent()).to.equal(true)
    expect(res.get()).to.equal(26);
})

it("applying peek function should be called , but response should not be considered",()=>{

    let optional = new Optional(45);
    let peekedres = null
    const res  = optional
        .map((i: number)=>i+1)
        .peek((i: number)=>{
            peekedres =i+1
            return peekedres
        })
        .get()

    expect(res).to.equal(46)
    expect(peekedres).to.equal(47)
})


it("optional with Undefined should return null",()=>{

    let optional = new Optional(undefined);
    const res  = optional
        .map(i=>i+1)

    expect(res.isPresent()).to.equal(false)
    expect(res.get()).to.be.null

})


it("optional with filter and map should apply both",()=>{


    const res  = Optional.of(45)
        .filter(i=>i %5 ==0)
        .map(i=>i+1)
        .get()

    expect(res).to.equal(46)
})


it("optional with appropriate filter and map should work fine for failure",()=>{


    const res  = Optional.of(46)
        .filter(i=>i %5 ==0)
        .map(i=>i+1)
        .get()

    expect(res).to.be.null
})


it("when using orElse optional should return default value, if evaluation is null",()=>{


    const res  = Optional.of(46)
        .filter(i=>i %5 ==0)
        .map(i=>i+1)
        .orElse(9898)

    expect(res).to.equal(9898)
})



it("when using orElse optional should return evaluated value, if evaluation is not null",()=>{


    const res  = Optional.of(45)
        .filter(i=>i %5 ==0)
        .map(i=>i+1)
        .orElse(9898)

    expect(res).to.equal(46)
})

it("when using ifPresent the function arguement should not be invoked, if evaluation is null",()=>{

    let res  = null
    Optional.of(46)
        .filter(i=>i %5 ==0)
        .map(i=>i+1)
        .ifPresent((data)=>{
            res =data
        })

    expect(res).to.equal(null)
})
it("when using ifPresent the function arguement should be invoked, if evaluation is not null",()=>{

    let res  = null
    Optional.of(45)
        .filter(i=>i %5 ==0)
        .map(i=>i+1)
        .ifPresent((data)=>{
            res =data
        })

    expect(res).to.equal(46)
})



it("when using orElse optional should return evaluated value, if evaluation is not null",()=>{


    const res  = Optional.of(45)
        .filter(i=>i %5 ==0)
        .map(i=>i+1)
        .orElse(9898)

    expect(res).to.equal(46)
})
});
