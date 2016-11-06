const expect = require('chai').expect;

describe(`ch4 数值的扩展`, () => {
    describe(`a. 二进制八进制表示法`, () => {
        it(`#1. 二进制用0b前缀表示`, () => {
            expect(0b11).to.be.deep.equal(3);
        });

        it(`#2. 八进制用0o前缀表示`, () => {
            expect(0o11).to.be.deep.equal(9);
        });

        it(`#3. 二进制八进制转成十进制：NUmber()`, () => {
            expect(Number(0o11).toString()).be.equal(`9`);
        });
    });

    describe(`b. 各类判断函数`, () => {
        it(`#1. 检验数值有限：Number.isFinite()`, () => {

            // infinity
            [Infinity, -Infinity].forEach((item) => {
                expect(Number.isFinite(item)).to.be.not.ok;
            });

            // invalid check value
            ['a', NaN, false, null, undefined].forEach((item) => {
                expect(Number.isFinite(item)).to.be.not.ok;
            });

            // finity
            [1,3, 99999].forEach((item) => {
                expect(Number.isFinite(item)).to.be.ok;
            });
        });

        it(`#2. 检验数值是NaN: Number.isNaN`, () => {
            expect(Number.isNaN(NaN)).to.be.ok;
        });

        it(`#3. 检验数值是不是整数: Number.isInteger()`, () => {
            expect(Number.isInteger(3)).to.be.ok;
            expect(Number.isInteger(3.0000)).to.be.ok;
            expect(Number.isInteger(3.3)).to.be.not.ok;
        });

        it(`#4. 有Bug: 。检验数值处在安全整数范围(-2^53, 2^53): Number.isSafeInteger()`);
        // it(`#4. 检验数值处在安全整数范围(-2^53, 2^53): Number.isSafeInteger()`, () => {
        //     expect(Number.isSafeInteger(Math.pow(2, 53) + 1)).to.be.not.ok;
        //     expect(Number.isSafeInteger(-Math.pow(2, 53) -1)).to.be.not.ok;

        //     // 即使数值溢出了，但是overN还能存储下来！而不是变成别的值
        //     let overN = Math.pow(2, 53) + 2;
        //     expect(Number.isSafeInteger(overN)).to.be.not.ok;
        //     expect(overN.toString()).to.be.equal(`9007199254740994`);

        //     // 但是这个溢出的数值参与计算 却依然是正确的？ 
        //     expect(Number.isSafeInteger(overN - 3)).to.be.ok;

        //     expect(Number.isSafeInteger(Math.pow(2, 53) - 1)).to.be.ok;
        //     expect(Number.isSafeInteger(-Math.pow(2, 53) + 1)).to.be.ok;

        //     expect(9007199254740993).to.be.equal(9007199254740992);
        // });

    });

    describe(`c. parseInt()与parseFloat()迁移到Number.parseInt()与Number.parseFloat()`, () => {
        it(`#1. parseInt()与parseFloat()从全局迁移出去`, () => {
            try {
                parseInt(`1`);
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }

            try {
                parseFloat(`32.3`);
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#2. Number.parseInt()与Number.parseFloat()行为不变`, () => {
            expect(Number.parseInt(`9`)).to.be.equal(9);

            expect(Number.parseFloat(`9.99`)).to.be.equal(9.99);
        });
    });

    describe(`d. 极小值常量2.22^-16: Number.EPSILON，用来判断计算误差`, () => {
        it(`#1. JS浮点数计算不精确`, () => {
            expect((0.1 + 0.2 - 0.3).toString()).to.be.not.equal(`0`);
        });

        it(`#2. 将运算结果与Number.EPSILON作比较，小于EPSILON即可视为运算精准`, () => {
            expect((0.1 + 0.2 - 0.3) < Number.EPSILON).to.be.ok;
        });
    });

    describe(`c. Math的扩展(只测试部分)`, () => {
        it(`#1. 返回数值的整数部分：Math.trunc()`, () => {
            expect(Math.trunc(323.3323)).to.be.equal(323);
        });

        it(`#2. 返回数值的sign(即整数、负数、零): Math.sign()`, () => {
            expect(Math.sign(-382.38)).to.be.equal(-1);
            expect(Math.sign(382.38)).to.be.equal(1);
            expect(Math.sign(0)).to.be.equal(0);
        });
    });
});
