const expect = require(`chai`).expect;

`use strict`;

describe(`ch7 对象的扩展`, () => {
    describe(`a. 属性的简洁表示法`, () => {
        it(`#1. 基本使用：对象可以直接写入变量与方法作为对象的属性`, ()=> {
            let name = `mistkafka`;
            function displayName() {
                return this.name;
            }
            let obj = {
                name,
                displayName,
            };

            expect(obj.displayName).to.be.ok;
            expect(obj.displayName()).to.be.equal(`mistkafka`);
        });

        it(`#2. 应用：函数返回对象`, () => {
            function point({x, y,} = {x: 0, y: 0,}) {
                x = x + 1;
                y = y + 1;

                return {x, y,};
            }

            expect(point()).to.be.deep.equal({x: 1, y: 1});
        });

        it(`#3.1 注意点：属性名总是字符串，所以可以使用js的保留字(但还是有点怪异....)`, () => {
            let obj = {
                class () { // 这里的class会被转义成`class`
                }
            };

            expect(obj.class).to.be.ok;
        });

        it(`#3.2 注意点：当变量是一个generator函数时，并且这个generator是在对象内声明时，需要有前缀*`, () => {
            function* aGenerator() {
                yield 1;
                yield 2;
                yield 3;
            }

            let obj = {
                aGenerator,
                * anotherGenerator() {
                    yield 4;
                    yield 5;
                    yield 6;
                }
            };
            let iterA = obj.aGenerator();
            let iterAnother = obj.anotherGenerator();

            expect(iterA.next()).to.be.deep.equal({ value: 1, done: false });
            expect(iterAnother.next()).to.be.deep.equal({ value: 4, done: false });
        });
    });

    describe(`c. 大括号声明对象也提供属性表达式`, () => {
        it(`#1. 基本使用`, () => {
            let name = `haha`;
            let obj = {
                [name + 1]: `hehe`,
            };

            expect(obj.haha1).to.be.equal(`hehe`);
        });

        it(`#2. 注意点：在声明同一个属性时，不能与"属性的简洁表示法"同时使用！`, () => {
            let name = `haha`;
            let obj = {
                name,
                [name + 1]: `hehe`
            };

            // 语法错误
            // let objError = {
            //     [name]
            // };

            expect(obj.name).to.be.equal(`haha`);
            expect(obj.haha1).to.be.equal(`hehe`);
        });
    });

    describe(`d. 补充===, Object.is()`, () => {
        it(`#1. NaN等于NaN`, () => {
            expect(Object.is(NaN, NaN)).to.be.ok;
        });

        it(`#2. -0 不等于 +0`, () => {
            expect(Object.is(-0, +0)).to.be.not.ok;
        });
    });

    describe(`e. 浅拷贝源对象的自身可枚举属性：Object.assign()`, () => {
        it(`#1. 基本使用`, () => {
            let targetObj = {};
            let srcObj1 = {name: 'haha'};
            let srcObj2 = {age: 17};

            expect(Object.assign(targetObj, srcObj1, srcObj2)).to.be.deep.equal({name: 'haha', age: 17});
        });

        it(`#2. 只拷贝可枚举属性: `, () => {
            let targetObj = {};
            let srcObj = Object.defineProperty({}, 'invisible', {
                enumerable: false,
                value: 'hello'
            });

            expect(Object.assign(targetObj, srcObj)).to.be.deep.equal({});
        });

        it(`#3. 不拷贝prototype里的属性`, () => {
            let targetObj = {};

            function Animal() {
            }
            Animal.prototype.speical = 'animal';
            function Cat() {
            }
            Cat.prototype = Object.create(Animal.prototype);
            Cat.prototype.legCount = 4;

            let cat = new Cat();

            expect(Object.assign(targetObj, cat).speical).to.be.not.ok;
            expect(Object.assign(targetObj, cat).legCount).to.be.not.ok;
        });

        it(`#4. 只是浅拷贝`, () => {
            let targetObj = {};
            let srcObj = {
                people: {
                    name: 'haha',
                    age: 17
                }
            };

            let rslt = Object.assign(targetObj, srcObj);

            expect(rslt.people).to.be.equal(srcObj.people);
        });
    });

    describe(`f. 复习总结：属性的遍历`, () => {
        function Animal() {}
        Animal.prototype.speical = 'animal';


        let prototypeKey = Symbol(`prototype key`);
        let instanceKey = Symbol(`instance key`);
        function Cat(color) {
            this.color = color;
            this[instanceKey] = function() {
                return `instance key`;
            };
        }
        Cat.prototype = Object.create(Animal.prototype);
        Cat.prototype.legCount = 4;

        Cat.prototype[prototypeKey] = function() {return `prototype key`;};

        let cat = new Cat();
        Object.defineProperty(cat, 'hehe', {
            enumerable: false,
            value: 'hello'
        });

        it(`#1. for...in 便利自身和继承的可枚举属性，不包含Symbol属性`, () => {
            let keys = [];
            for (let key in cat) {
                keys.push(key);
            }

            expect(keys.sort()).to.be.deep.equal([`speical`, `color`, `legCount`].sort());
        });

        it(`#2. Object.keys(obj) 返回对象自身可枚举的instance属性（不包含Symbol属性)`, () => {
            expect(Object.keys(cat)).to.be.deep.equal([`color`]);
        });

        it(`#3. Object.getOwnPropertyNames(obj), 返回对象的instance属性（包含不可枚举属性，不包含Symbol属性）`, () => {
            expect(Object.getOwnPropertyNames(cat).sort()).to.be.deep.equal([`color`, `hehe`].sort());
        });

        it(`#4. Object.getOwnPropertySymbols(obj), 返回instance属性中的Symbol属性`, () => {
            expect(Object.getOwnPropertySymbols(cat).sort()).to.be.deep.equal([instanceKey]);
        });

        it(`#5. Reflect.ownKeys(obj), 返回对象的所有instance属性（包括Symbols属性与不可枚举属性）`, () => {
            expect(Reflect.ownKeys(cat).map((item) => item.toString()).sort()).to.be.deep.equal([instanceKey, `color`, `hehe`].map((item) => item.toString()).sort());
        });

        it.skip(`总结：带有own关键字的方法都是返回instance属性, 只有for...in会遍历到prototype上的属性`);
    });

    describe(`g. 对象的prototype操作`, () => {
        it.skip(`#1. 特化'__prop__'属性：只要有__prop__属性，那它就一定指向prototype`, () => {
            let obj = {
                age: 17,
                __prop__: {
                    color: `yellow`
                }
            };

            expect(Object.getPrototypeOf(obj)).to.be.deep.equal({color: `yellow`});
        });

        it(`#2. prototype的正规读写方式：Object.setPrototypeOf()与Object.getPrototypeOf()`, () => {
            let obj = {};
            Object.setPrototypeOf(obj, {color: `yellow`});

            expect(Object.getPrototypeOf(obj)).to.be.deep.equal({color: `yellow`});
        });
    });

    describe(`h. 配套Object.keys()， 增加Object.values(), Object.entries()`, () => {
    });
});
