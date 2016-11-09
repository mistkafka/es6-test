const expect = require('chai').expect;

'use strict';

describe(`ch6 函数的扩展`, () => {
    describe(`a. 默认参数`, () => {
        it(`#1. 略基本使用与配合解构`);

        it(`#2. 用undefined(null不行)触发默认值`, () => {
            function add(x = 1, y = 2) {
                return x + y;
            }

            expect(add(undefined, 9)).to.be.equal(10);

            expect(add(null, 9)).to.be.equal(9);
        });

        it(`#3.1 默认参数的默认值可以是变量`, () => {
            function add(x = 3, y = x) {
                return x + y;
            }

            expect(add(4)).to.be.equal(8);
            expect(add()).to.be.equal(6);
        });

        it(`#3.2 应用：设置不可以缺省的变量`, () => {
            function throwMissingParamError(str = ``) {
                throw new Error(`Missing Param ${str}`);
            }

            function display(name = throwMissingParamError(`name`)) {
                return name;
            }

            expect(display(`mistkafka`)).to.be.equal(`mistkafka`);

            try {
                display();
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });
    });

    describe(`b. rest参数: 承载剩余参数`, () => {
        it(`#1. 基本使用：...变量名`, () => {
            function add(...values) {
                return values.reduce((sum, curr) => sum + curr, 0);
            }

            expect(add()).to.be.equal(0);
            expect(add(1, 2)).to.be.equal(3);
            expect(add(1, 2, 3)).to.be.equal(6);
        });

        it(`#2. 注意, rest参数只能是最后一个参数`, () => {
            // 直接语法报错

            // function add(...values, hehe) {
            // }
        });

        it(`#3. rest参数的应用：与解构一起使用，生成数组`, () => {
            [a, ...arr] = [1, 2, 3];

            expect(a).to.be.equal(1);
            expect(arr).to.be.deep.equal([2, 3]);
        });

        it(`#4. rest的逆运算--扩展运算符...: 将数组扩展成参数`, () => {
            function add(x, y) {
                return x + y;
            }

            expect(add(...[2, 3])).to.be.equal(5);
        });

        it(`#5.1 扩展运算符的应用：不再需要apply来扩展参数`, () => {
            function add(x, y) {
                return x + y;
            }

            expect(add.apply(null, [2, 3])).to.be.equal(5);
        });

        it(`#5.2 扩展运算符的应用：合并数组`, () => {
            let arr1 = [1, 2, 3];
            let arr2 = [4, 5, 6];

            expect([...arr1, ...arr2]).to.be.deep.equal([1, 2, 3, 4, 5, 6]);
        });

        it(`#5.3 扩展运算符的应用：将iterator转成数组`, () => {
            function* aGenerator() {
                yield 1;
                yield 1;
                yield 1;
            }

            expect([...aGenerator()]).to.be.deep.equal([1, 1, 1]);
        });
    });

    describe(`c. 箭头函数lamada表达式`, () => {
        it(`#1. 没有this、arguments、super、new.targe。这些都指向上层。例：this穿透`, () => {
            this.name = 'mistkafka';

            let name = (() => this.name)();

            expect(name).to.be.equal(`mistkafka`);
        });

        it(`#2. 不可以使用new`, () => {
            let Cat = (name) => {
                this.name
            };

            try {
                let cat = new Cat('mistkafka');

                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#3. 不能使用yield命令`, () => {
            //  这个case还真不知道怎么写
            // function* aGenerator() {
            // }                   // 
        });

        it(`#4. 没有arguments`, () => {
            [1, 2, 3].forEach(() => {
                // 这个arguments也是外层函数的
                expect(arguments.length).to.be.not.equal(1);
            });
        });
    });

    describe(`d. 尾调用优化: 以下case无法test，只是例子。`, () => {
        it(`尾调用的概念：返回函数调用。`, function() {
            // 尾调用
            function f(a) {
                a = a + 1;
                return g(a);
            };

            function g(a) {
                return a;
            }
        });

        it(`尾递归`, () => {
            function fibs(n, a = 0, b = 1) {
                if (n === 1) {
                    return b;
                }
                [a, b] = [b, a + b];
                return fibs(n - 1, a, b);
            }

            expect(fibs(6)).to.be.equal(8);
        });

        it(`蹦床函数：在不支持尾调用优化的情况下使用`, () => {
            function trampoline(fn) {
                while(fn && fn instanceof Function) {
                    fn = fn();
                }

                return fn;
            }

            function sum(total = 0, index = 0) {
                if (index > 0) {
                    return sum.bind(null, total + 1, index - 1);
                } else {
                    return total + 1;
                }
            }

            expect(trampoline(sum(1, 100000))).to.be.equal(100002);
        });
    });
});
