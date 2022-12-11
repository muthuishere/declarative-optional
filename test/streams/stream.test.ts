import {Optional, Stream} from "../../src";
import {expect} from "chai";

describe('Stream with array', () => {

it("stream works fine with map function against an array",()=>{

    const res  = Stream.of([23,45])
        .map(i=>i+1)
        .get();

    expect(res).deep.eq([24,46]);
})

    it("stream with filter and map should apply both",()=>{

        const res  = Stream.of([45,46,80])
            .filter(i=>i %5 ==0)
            .map(i=>i+1)
            .peek(i=>console.log(i))
            .get()

        expect(res).deep.eq([46,81]);
    })


    it("stream with take should take first x elements",()=>{

        const res  = Stream.of([45,46,80])
            .take(2)
            .get()

        expect(res).deep.eq([45,46]);
    })
    it("stream with skip should skip first x elements",()=>{

        const res  = Stream.of([45,46,80])
            .skip(2)
            .get()

        expect(res).deep.eq([80]);
    })

    it("stream with first should take first element",()=>{

        const res  = Stream.of([45,46,80])
            .first()
            .get()

        expect(res).deep.eq([45]);
    })
    it("stream with last should take last element",()=>{

        const res  = Stream.of([45,46,80])
            .last()
            .get()

        expect(res).deep.eq([80]);
    })
    it("stream with last and map should work correct",()=>{

        const res  = Stream.of([45,46,80])
            .last()
            .map(val=>val*2)
            .get()

        expect(res).deep.eq([160]);
    })
    it("stream with nth(2) should take second element",()=>{

        const res  = Stream.of([45,46,80])
            .nth(2)
            .get()

        expect(res).deep.eq([46]);
    })
    it("stream with next after first should give empty array",()=>{

        const res  = Stream.of([45,46,80])
            .first()
            .nth(2)
            .get()

        expect(res).deep.eq([]);
    })
    it("stream example even number multiply by 2 ",()=>{

        const res = Stream.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .filter(val => val % 2 == 0)
            .map(val => val * 2)
            .get();

     expect(res).deep.eq([4,8,12,16,20]);
    })

});

