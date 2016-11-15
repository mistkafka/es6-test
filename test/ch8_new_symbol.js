const expect = require(`chai`).expect;

`use strict`;

describe(`ch8 js的第七种类型：Symbol`, () => {
    describe(`a. 概述`, () => {
        it(`#1. Symbol是原始值(跟其它六种基本类型一样)，而不是对象，所以不能new`, () => {
            try {
                let key = new Symbol(`a key`);
                expect(true).to.be.not.ok;
            } catch (e) {
                expect(true).to.be.ok;
            }

            expect(typeof Symbol(`a key`)).to.be.equal(`symbol`);
        });

        it(`#2. 两个Symbol值可以保证各自独一无二`, () => {
            let key1 = Symbol();
            let key2 = Symbol();

            expect(key1).to.be.not.equal(key2);
        });

        it(`#3. 创建Symbol时传入Symbol(str)的参数是为了在控制台打印，易于coder区分, 不影响Symbol的值。`, () => {
            let key1 = Symbol(`this is a key`);
            let key2 = Symbol(`this is a key`);

            expect(key1).to.be.not.equal(key2);

            expect(key1.toString()).to.be.equal(`Symbol(this is a key)`);
        });

        it(`#4.1 Symbol值与类型混合运算：Symbol不能参与类型混合运行`, () => {
            let sym = Symbol(`this is a symbol`);

            try {
                let rslt = sym + `hehe`;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#4.2 Symbol值与类型混合运算：Symbol可以显示转成String`, () => {
            let sym = Symbol(`this is a symbol`);

            expect(sym.toString()).to.be.deep.equal(`Symbol(this is a symbol)`);
        });
    });

    describe(`b. 应用：作为属性名的Symbol`, () => {
        it(`#1. 基本使用：只能用方括号和Object.defineProperty()来赋予对象属性, 并且只能使用方括号来调用对象属性`, () => {
            const KEY1 = Symbol(`a key`);
            let obj = {
                [KEY1]: `this is a property, which key type is Symbol`
            };

            expect(obj[KEY1]).to.be.equal(`this is a property, which key type is Symbol`);
        });

        it(`总结：个人感觉Symbol作为对象的属性key，也不是那么方便，虽然保证了独一无二，但是那只是小概率下的需求；它带来的负面却有：1. 增加不透明性，你总要提前知道一个属性key是Sybmol，并且要用方括号才能调用 2. 命名污染，有了方括号你还需要有对象的Symbol的值，总要放在变量里，这样就把属性命名重复的问题往外迁移了； 3. 不方便， 不管这个类走到哪里，它总要设法让使用者获取到它所有Sybmol键的值。`);
    });

    describe(`c. 应用：创建内部使用的“私有变量”`, () => {
        it(`#1. Symbol无法被for...in等常规方法调用到，外部没有对应的Symbol值，也无法访问到对象的方法或变量`, () => {
            let Women = (() => {
                let SYM = {
                    age: Symbol(`age`),
                    weight: Symbol(`weight`)
                };

                function Women(name) {

                    this[SYM.age] = Math.trunc(Math.random() * 100);
                    this[SYM.weight] = Math.random() * 100;

                    this.name = name;
                };
                Women.prototype.getWomenRate = function() {
                    return 70 / this[SYM.age]  + 20 / this[SYM.weight];
                };

                return Women;
            })();

            let aWomen = new Women(`Lucy`);

            // 我们永远无法方便直接的访问women的age与weight属性，除非使用getOwnPropertySymbols()等方法，但这样做实在没有意义！
            // getWomenRate()获取女性的评分，它根据体重跟年龄来计算分数，我们只能获得分数，却没那么容易获取到很私密的年龄与体重
        });
    });

    describe(`d. Symbol注册到全局变量：Symbol.for()与Symbol.keyFor()`, () => {
        it(`#1. 基本使用：两次注册会返回同一个key`, () => {
            let key1 = Symbol.for(`a key`);
            let key2 = Symbol.for(`a key`);

            expect(key1).to.be.deep.equal(key2);
        });

        it(`#2. Symbol.keyFor()会返回key的描述`, () => {
            let key1 = Symbol.for(`a key`);
            expect(Symbol.keyFor(key1)).to.be.equal(`a key`);
        });

        it(`#3. Symbol.keyFor()对Symbol()创建的symbol值没有用`, () => {
            let key = Symbol(`a key`);

            expect(Symbol.keyFor(key)).to.be.deep.equal(undefined);
        });
    });

    describe(`e. 内置的Symbol值：用来指定对象的行为`, () => {
        it(`#1. 指定对象执行instanceof时的行为：Symbol.hasInstance`, () => {
            let obj = {
                display() {
                    console.log(`Haha, I'm Array, maybe!`);
                },
                [Symbol.hasInstance]: (p) => {
                    return p instanceof Array;
                }
            };

            let rslt = [1, 2, 3] instanceof obj;
            expect(rslt).to.be.ok;
        });

        it(`#2.1 指定对象使用Array.prototype.concat()时是否可以展开：Symbol.isConcatSpreadable`, () => {
            let arrayLikeObj = {
                '0': 'a',
                '1': 'b',
                '2': 'c',
                'length': 3,

                [Symbol.isConcatSpreadable]: true
            };
            expect([1, 2, 3].concat(arrayLikeObj)).to.be.deep.equal([1, 2, 3, 'a', 'b', 'c']);


            let arr = [1, 2, 3];
            arr[Symbol.isConcatSpreadable] = false;
            expect([3, 4, 5].concat(arr, 'k')).to.be.deep.equal([3, 4, 5, [1, 2, 3], 'k']);
        });

        it(`#2.2 因为是否展开是实例行为，所以定义类时，如果指定Symbol.isConcatSpreadable属性，需要定义在实例上`, () => {
        });

        it.skip(`#3. Symbol.species, 无法理解`);

        it(`#4. 指定myObj在被str.match(myObj)时的行为，方法的参数就是那个str: Symbol.match`, () => {
            let myObj = {
                [Symbol.match]: function(str) {
                    return true; // 我们总是返回true吧！
                }
            };

            expect('hello, world'.match(myObj)).to.be.deep.equal(true);
        });

        it(`#5. Symbol.replace: 指定Obj作为String.prototype.replace(searchValue, replaceVal)的searchValue参数时，这个replace()方法的行为`, () => {
            let obj = {
                name: `Kafka`,
                [Symbol.replace](srcStr, replaceVal) {
                    return srcStr.replace(this.name, replaceVal);
                },
            };

            expect('KafkaHeheda'.replace(obj, 'k')).to.be.equal(`kHeheda`);
        });

        it(`#6. Symbol.search: 指定Obj作为String.prototype.search(p1)的p1参数时，这个search()方法的行为`, () => {
            let obj = {
                name: `Kafka`,
                [Symbol.search](str) {
                    return str.indexOf(this.name);
                },
            };

            expect(`0123Kafka3234`.search(obj)).to.be.equal(4);
        });

        it.skip(`#7. Symbol.split: 同上`);

        it(`#9. Symbol.iterator, 定义对象的迭代器接口`, () => {
            let obj = {
                * [Symbol.iterator]() {
                    yield 1;
                    yield 2;
                    yield 3;
                }
            };

            expect([...obj]).to.be.deep.equal([1, 2, 3]);
        });

        it(`#10. Symbol.toPrimitive: 指定一个方法，当对象被转成原始值时调用`, () => {
            let obj = {
                [Symbol.toPrimitive](hint) {
                    switch(hint) {
                    case `number`:
                        return 123;
                    case `string`:
                        return 'hjk';
                    case `default`:
                        return `default`;
                    default:
                        throw new Error();
                    }
                }
            };

            expect(obj * 3).to.be.equal(369);
            expect(String(obj)).to.be.equal(`hjk`);
        });

        it.skip(`#11. bug, 还不work. Symbol.toStringTag: 指定一个方法，用来定制对象的toString()中的tag`, () => {
            let obj = {
                [Symbol.toStringTag]() {
                    return `mytype`;
                }
            };


            expect(Object.prototype.toString.call(obj)).to.be.equal(`[Object mytype]`);
        });

        it.skip(`#12. Symbol.unscopables: 指向一个对象，该对象指定使用with时，会被忽略掉的属性`, () => {
        });
    });

});
