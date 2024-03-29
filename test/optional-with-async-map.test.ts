
import {Optional} from "../src";
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const expect = chai.expect

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


function getFromUserServiceError(input:any){
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
it("optional with async error at last should throw rejected ",async () => {


    const res = Optional.of(Promise.resolve(45))
        .map(i => i + 1)
        .map(i => Promise.reject("error"))

    expect(res.getAsync()).to.eventually.be.rejected;
})
it("optional with async and sync should work fine ",async () => {


    const res = await Optional.of(Promise.resolve(45))
        .map(i => i + 1)
        .map(i => Promise.resolve(i+7))
        .getAsync()

    expect(res).to.equal(53);
})
it("optional with async error in middle should be rejected ",async () => {


    const res = Optional.of(Promise.resolve(45))
        .map(i => i + 1)
        .map(i => Promise.reject("error"))
        .map(i => i - 1)

    expect(res.getAsync()).to.eventually.be.rejected;
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
