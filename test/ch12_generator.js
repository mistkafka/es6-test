const expect = require(`chai`).expect;

describe(`ch12 Generator`, () => {
    describe(`a. 基本概念`, () => {
        it(`#1. 基本使用`, () => {
            function* userInput() {
                let name = yield `Input your name:`;
                let age = yield `Input your age:`;

                return `Your name is ${name}, and you are ${age} years old.`;
            }

            let input = userInput();
            let helpInofOfName = input.next().value;
            let helpInofOfAge = input.next(`Kafka`).value;
            let rslt = input.next(25).value;

            expect(helpInofOfName).to.be.equal(`Input your name:`);
            expect(helpInofOfAge).to.be.equal(`Input your age:`);
            expect(rslt).to.be.equal(`Your name is Kafka, and you are 25 years old.`);
        });

        it(`#2. yield 作为表达式的一部分时，需要加括号`, () => {
            function *dollerToRMB() {
                let RMB = 6 * (yield `Input doller:`);

                return RMB;
            }

            let $2RMB = dollerToRMB();

            expect($2RMB.next()).to.be.deep.equal({value: `Input doller:`, done: false});
            expect($2RMB.next(3)).to.be.deep.equal({value: 18, done: true});
        });

        it(`#3. Generator.prototype.throw(): 在生成器外抛出错误给Generator 捕获`, () => {
            let g = function* () {
                try {
                    yield;
                } catch(e) {
                    expect(true).to.be.ok;
                }
            };

            let i = g();
            i.next();

            try {
                i.throw(`a`);
            } catch(e) {
                expect(true).to.be.not.ok;
            }

        });

        it(`#4. Generator.prototype.return(): 提前终止generator`, () => {
            let g = function* () {
                yield 1;
                yield 2;
                yield 3;
            };

            let i = g();

            expect(i.next()).to.be.deep.equal({value: 1, done: false});
            expect(i.return(7)).to.be.deep.equal({value: 7, done: true});
            expect(i.next()).to.be.deep.equal({value: undefined, done: true});
        });
    });

    describe(`b. Generator的嵌套`, () => {
        function* inner() {
            yield 'a';
            yield 'b';
            yield 'c';

            return 10;
        }

        it(`#1. 直接调用没有效果`, () => {
            function* outter() {
                yield 1;
                yield inner();
                yield 3;
            }

            [...arr] = outter();
            expect(arr).to.be.deep.equal([1, inner(), 3]);
        });

        it(`#2. 需要加上yield* 语句`, () => {
            function* outter() {
                yield 1;
                yield* inner();
                yield 3;
            }

            [...arr] = outter();
            expect(arr).to.be.deep.equal([1, 'a', 'b', 'c', 3]);
        });

        it(`#3. yield* 运算符的返回值：被yield* Generator的return语句`, () => {
            function* outter() {
                yield 1;
                let rslt = yield* inner();
                yield rslt;
            }

            [...arr] = outter();
            expect(arr).to.be.deep.equal([1, 'a', 'b', 'c', 10]);
        });
    });
});
