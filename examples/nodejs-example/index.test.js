const {expect} =require("chai") ;
const {Optional} =require("declarative-optional") ;


it('should create token', async function () {

    const res =  createToken({email:"invalid@mail.com"});
    expect(res).not.to.be.null;
});
