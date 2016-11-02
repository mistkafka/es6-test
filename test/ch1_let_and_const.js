const expect = require('chai').expect;

describe('ch1. let与const', () => {

    describe(`#1 let/const不会污染全局变量window/global`, () => {
        it(`#1.1 var/function会污染全局变量window/global`, () => {

            // 代码无法在mocha下运行，因为会被function包裹住 无法测验

            // var b = 1;
            // function foo() {}

            // let g = global || window;
            // expect(g.b && g.foo).to.be.ok;
        });

        it(`#1.2 let/const不会污染全局变量`, () => {
            // 代码无法在mocha下运行，因为会被function包裹住 无法测验

            // let b = 1;
            // const foo = 1;

            // let g = global || window;
            // expect(g.b || g.foo).to.be.not.ok;
        });
    });

    describe(`#2 let/const 不会变量提升`, () => {
        it(`#2.1 let 不会变量提升`, () => {
            try {
                a = 1;
                let a;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#2.2 const 不会变量提升`, () => {
            try {
                var b = a;
                const a = 1;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });
    });

    describe(`#3 let/const 是块作用域`, () => {
        it(`#3.1 let生命循环变量不会泄漏`, () => {
            for (let i = 0; i < 3; i++) {
            };

            try {
                i;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#3.2 不在需要IIFE来创造作用域, let/const的块作用域可以替代`, () => {
            // IIFE
            (function() {
                var a = 1; // var声明的a不用IIFE包裹，会暴露在外部
            }());
            try {
                a;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }

            {
                let a = 1;
            }
            try {
                a;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });
    });

    describe(`#4 let/const不能重复声明`, () => {
        it(``, () => {
            let a;
            try {
                let a;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });
    });

    describe(`#5 const声明的变量不能变更引用`, () => {
        it(`#5.1 const声明变量时一定要赋值`, () => {
            // const a; 还没进入运行状态就报语法错误！

            // try {
            //     const a;
            //     expect(true).to.be.not.ok;
            // } catch(e) {
            //     expect(true).to.be.ok;
            // }
        });

        it(`#5.2 const声明的变量不能变更引用`, () => {
            const obj = {};
            try {
                let arr = [];
                obj = arr;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#5.3 const声明的变量 是引用不能变更，而引用的对象的内容可以变更`, () => {
            const obj = {};

            obj.a = true;

            expect(obj.a).to.be.ok;
        });
    });
});
