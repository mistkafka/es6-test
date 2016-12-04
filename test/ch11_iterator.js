const expect = require(`chai`).expect;

describe(`ch11 Iterator`, () => {
    describe(`a. 概念：统一的数据顺序访问接口`, () => {
        it(`#1. 实现Symbol.iterator`, () => {
            let obj = {
                * [Symbol.iterator]() {
                    yield 1;
                    yield 2;
                    yield 3;
                    yield 4;
                }
            };

            [...arr] = obj;
            expect(arr).to.be.deep.equal([1, 2, 3, 4]);
        });

        it.skip(`#2 这个概念真没什么好说的，在学习其他特性的时候，已经用烂了。`);
    });
});
