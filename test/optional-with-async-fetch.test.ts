import {Optional} from "../src";
import {expect} from "chai";

function validationError(){
    throw new Error("Cannot be Null")
}
function getFromUserService(input:any){
    const  {username,password} =input
    return new Promise((function (resolve) {
        resolve({id:"212",name:"user" ,isAdmin:true})
    }))
}

// an Async based Optional
function productsForUserId(id:any){
    return Optional.of(new Promise((resolve) =>{
        resolve([
            {id:"1",name:"Macbook Pro 2017" },
            {id:"2",name:"Dell XPS 2021" }
        ])
    })).toAsync()
}

// an Optional
function couponsForUserId(id: any){
    return Optional.of([
            {id:"1",code:"XGHGSHGIDLGLWGHVDL" },
            {id:"2",code:"732JFSDLFJDSF" }
        ])

}

function getFromUserServiceError(input:any){
    const  {username,password} =input
    return new Promise((function (resolve,reject) {
        reject("invalid user")
    }))
}

function redirectTo(pagename:any){

    console.log("redirecting to page"+pagename)
}

describe('Optional with async', () => {

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

it("optional chained and ended with toAsync can further be evaluated with ifPresentOrElse",(done) => {

    const input = {username: "hi", password: "hi"};


    const page =  Optional.of(input)
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

    const input:any = {username: null, password: "hi"};


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



it("optional chained and ended with toAsync can be catched with error", async () => {


    const input = {username: "hi", password: "hi"};


    try {
        const page = await Optional.of(input)
            .filter(({username, password}) => (null != username && null != password))
            .map(getFromUserServiceError)
            .map(result => result.isAdmin ? "adminPage" : "userPage")
            .getAsync()
        return Promise.reject("Should not pass,Exception should be thrown")
    }catch (e){
        return Promise.resolve()
    }



})

it("optional chained with  toAsync should work fine for non async operations as well ",async () => {


    const res = await Optional.of(45)
        .filter(i => i % 5 == 0)
        .map(i => i + 1)
        .toAsync()

    expect(res.get()).to.equal(46)
})
it("optional chained with  orElseAsync should return default value if no value ",async () => {


    const res = await Optional.of(Promise.resolve(41))
        .filter(i => i % 5 == 0)
        .map(i => i + 1)
        .orElseAsync(23);

    expect(res).to.equal(23)
})
it("optional chained with  orElseAsync should return computed value if value can pass through chains ",async () => {


    const res = await Optional.of(Promise.resolve(41))
        .filter(i => i % 5 == 0)
        .map(i => i + 1)
        .orElseAsync(23);

    expect(res).to.equal(23)
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
it("optional started with promise should handle reject properly ",async () => {


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
    expect(result.get()).deep.eq([
        {id:"1",name:"Macbook Pro 2017" },
        {id:"2",name:"Dell XPS 2021" }
    ])
})


it("async optional should merge with other async optional as well ",async () => {

    const input = {username: "hi", password: "hi"};

    const {username, password} = input


    const result = await Optional.of(input)
        .filter(({username, password}) => (null != username && null != password))
        .map(getFromUserService)
        .flatmap(({id})=>productsForUserId(id))
        .toAsync()


    expect(result).not.to.be.null
    expect(result).to.be.an.instanceof(Optional)

    expect(result.get()).deep.eq([
        {id:"1",name:"Macbook Pro 2017" },
        {id:"2",name:"Dell XPS 2021" }
    ])
})

});
