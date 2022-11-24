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

});
