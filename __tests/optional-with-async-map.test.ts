// @ts-nocheck
import Optional from "../src";
import {expect} from "chai";


function getFromUserService({username,password}){
    return new Promise((function (resolve) {
        resolve({id:"212",name:"user" ,isAdmin:true})
    }))
}

// an Async based Optional
function productsForUserId(id){
    return Optional.of(new Promise((resolve) =>{
        resolve([
            {id:"1",name:"Macbook Pro 2017" },
            {id:"2",name:"Dell XPS 2021" }
        ])
    })).toAsync()
}


function getFromUserServiceError({username,password}){
    return new Promise((function (resolve,reject) {
        reject("invalid user")
    }))
}



it("optional chained and ended with toAsync to return another optional",async () => {

    const input = {username: "hi", password: "hi"};
    const result = await Optional.of(input)
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserService)
        .map(result=>result.isAdmin?"adminPage":"userPage")
        .toAsync()


    expect(result).not.to.be.null
    expect(result).to.be.an.instanceof(Optional)
    expect(result.get()).to.equal("adminPage")


})

it("optional chained and ended with getAsync to return another value",async () => {

    const input = {username: "hi", password: "hi"};
    const result = await Optional.of(input)
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserService)
        .map(result=>result.isAdmin?"adminPage":"userPage")
        .getAsync()


    expect(result).not.to.be.null
    expect(result).to.equal("adminPage")


})


it("optional chained and ended with toAsync can further be evaluated with ifPresentOrElse",(done) => {

    const input = {username: "hi", password: "hi"};


      Optional.of(input)
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserService)
        .map(result=> result.isAdmin?"adminPage":"userPage")
        .toAsync()
        .then(page=>{

            page.ifPresentOrElse((result)=>{
                expect(result).to.equal("adminPage")
                done()
            },()=>{
                done("Failed")
                throw new Error("Cannot be Null")
            })
        })
})
it("optional chained and ended with toAsync should act appropriate even if initial data validation fails",(done) => {

    const input = {username: null, password: "hi"};


      Optional.of(input)
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserService)
        .map(result=> result.isAdmin?"adminPage":"userPage")
        .toAsync()
        .then(page=>{

            page.ifPresentOrElse((result)=>{
                expect(result).to.equal("adminPage")
                done("Validation should Fail")
            },()=>{

                done()

            })
        })
})



it("optional chained and ended with toAsync can be catched with error", (done) => {



    const input = {username: "hi", password: "hi"};


    Optional.of(input)
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserServiceError)
        .map(result=> result.isAdmin?"adminPage":"userPage")
        .toAsync()
        .then(page=>{

            done("Failed should not be in then")
        })
        .catch(err=>{
            console.log(err)
            done()
        })



})

it("optional chained with  toAsync should work fine for non async operations as well ",async () => {


    const res = await Optional.of(45)
        .filter(i => i % 5 == 0)
        .map(i => i + 1)
        .toAsync()

    expect(res.get()).to.equal(46)
})

it("optional started with promise should work well ",async () => {


    const res = await Optional.of(new Promise(resolve => {
        resolve(45)
    }))
        .filter(i => i % 5 == 0)
        .map(i => i + 1)
        .toAsync()

    expect(res.get()).to.equal(46)
})

it("async optional should merge with other async optional as well ",async () => {

    const input = {username: "hi", password: "hi"};
    const result = await Optional.of(input)
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserService)
        .flatmap(({id})=>productsForUserId(id))
        .toAsync()


    expect(result).not.to.be.null
    expect(result).to.be.an.instanceof(Optional)
    expect(result.get()).deep.to.equal([
        {id:"1",name:"Macbook Pro 2017" },
        {id:"2",name:"Dell XPS 2021" }
    ])
})
