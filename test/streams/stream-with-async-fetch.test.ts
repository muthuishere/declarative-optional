import {Stream} from "../../src";
import {expect} from "chai";

function getFromUserService(id:any){

    return new Promise((function (resolve) {

        resolve({id:id,name:"user" ,isAdmin:true })
    }))
}



describe('Stream with async', () => {

it("Stream.of with  Promise Array should work well",async () => {

    const input = [Promise.resolve(21),Promise.resolve(25),Promise.resolve(30)]
    const result = await Stream.of(input)
        .filter((value) => value %5 ==0)
        .map(getFromUserService)
        .getAsync()


    expect(result).not.to.be.null
    console.log(result)
    expect(result).deep.eq([
        { id: 25, name: 'user', isAdmin: true },
        { id: 30, name: 'user', isAdmin: true }
    ])


})
it("Stream.of with  Promise Array with toAsync should work well",async () => {

    const input = [Promise.resolve(21),Promise.resolve(25),Promise.resolve(30)]
    const result = await Stream.of(input)
        .filter((value) => value %5 ==0)
        .map(getFromUserService)
        .toAsync()


    let val = result.get();
    expect(val).not.to.be.null

    expect(val).deep.eq([
        { id: 25, name: 'user', isAdmin: true },
        { id: 30, name: 'user', isAdmin: true }
    ])


})
it("Stream.of with  Promise Array with reject should throw exception",async () => {

    try {


    const input = [Promise.resolve(21),Promise.reject(25),Promise.resolve(30)]
    const result = await Stream.of(input)
        .filter((value) => value %5 ==0)
        .map(getFromUserService)
        .toAsync()


    let val = result.get();
    expect(val).to.be.null
    }catch (e) {
        expect(e).not.to.be.null
    }

})
it("Stream.of with  Promise Array with orElseAsync should work if promise is rejected",async () => {

    const input = [Promise.resolve(21),Promise.reject(25),Promise.resolve(30)]
    const val = await Stream.of(input)
        .filter((value) => value %5 ==0)
        .map(getFromUserService)
        .orElseAsync(["default"])

    expect(val).not.to.be.null
    expect(val).deep.eq(["default"])
})
it("Stream.of with  Promise Array with orElseAsync should work if response is empty array",async () => {

    const input = [Promise.resolve(20),Promise.resolve(25),Promise.resolve(30)]
    const val = await Stream.of(input)
        .filter((value) => value %5 !=0)
        .map(getFromUserService)
        .first()
        .orElseAsync("novalueresponse")

    expect(val).not.to.be.null
    expect(val).deep.eq("novalueresponse")
})

});
