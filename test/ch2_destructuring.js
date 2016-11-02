const expect = require('chai').expect;

describe(`ch2. 解构赋值`, () => {
    describe(`#a 对Iterator进行解构`, () => {
        it(`#1.1 对数组解构`, () => {
            let [a, b, c] = [1, 2, 3];

            expect(a).to.be.equal(1);
            expect(b).to.be.equal(2);
            expect(c).to.be.equal(3);
        });

        it(`#1.2 对String解构`, () => {
            let [a, b, c] = 'abc';

            expect(a).to.be.equal(`a`);
            expect(b).to.be.equal(`b`);
            expect(c).to.be.equal(`c`);
        });

        it(`#1.3 对Map解构`, () => {
            let map = new Map();
            map.set(`a`, 1);
            map.set(`b`, 1);
            map.set(`c`, 1);

            let [[key1, val1], [key2, val2], [key3, val3]] = map;

            expect(key1).to.be.equal(`a`);
            expect(val1).to.be.equal(1);
        });

        it(`#1.4 对Generator函数解构`, () => {
            // 斐波那契额数列generator
            function* fibs() {
                let current = 0;
                let next = 1;
                while(true) {
                    yield current;
                    [current, next] = [next, current + next];
                }
            }

            // 0 1 1 2 3 5
            let [first, second, third, fouth, fifth, sixth] = fibs();

            expect(sixth).to.be.equal(5);
        });

        it(`#1.5 非Iterator对象无法解构`, () => {
            try {
                let [a] = 1; // 类似的还有 true/false, null, undefined, NaN
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#1.6 可以嵌套解构(#1.3 解构Map也是嵌套解构)`, () => {
            let [a, [b1, b2], c] = [1, [2, 3], 4];

            expect(b1).to.be.equal(2);
            expect(b2).to.be.equal(3);
            expect(c).to.be.equal(4);
        });

        it(`#1.7 可以不对等解构`, () => {
            let [a, [b1, b2], c] = [1, [21, 22, 23], 3];

            expect(b1).to.be.equal(21);
            expect(b2).to.be.equal(22);
            expect(c).to.be.equal(3);
        });

        it(`#1.8 不对等解构是否可以被解构的"小于"承载解构的? 结论：可以，不过承载不到值的变量会undefined`, () => {
            let [a, b, c, d] = [1, 2];

            expect(a).to.be.equal(1);
            expect(b).to.be.equal(2);
            expect(c).to.be.equal(undefined);
            expect(d).to.be.equal(undefined);
        });

        it(`#1.9 当且仅当 解构值===undefiend时, 承载变量会取预设的默认值`, () => {
            let [a = 1] = [];
            let [b = 1] = [null];

            expect(a).to.be.equal(1);
            expect(b).to.be.deep.equal(null);
        });

        it(`#总结：迭代器的解构赋值是根据"承载结构"(等号左边)来遍历"被解构的对象"(等号右边)的`, () => {
            let [a, arr, c] = [1, [7, 8, 9], 3];

            expect(arr.toString()).to.be.equal([7, 8, 9].toString());
        });
    });

    describe(`#b. 对对象进解构`, () => {
        it(`#1. 一般使用方式: 承载变量与对象key同名, 与顺序无关!!!`, () => {
            let {age, name} = {name: 'mistkafka', age: 23};

            expect(age).to.be.equal(23);
            expect(name).to.be.equal('mistkafka');
        });

        it(`#2. 承载变量与key不同名，则需要手动构建schema来匹配`, () => {
            let {age: myAge, name: myName} = {name: 'mistkafka', age: 23};

            expect(myAge).to.be.equal(23);
            try {
                age;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok; // age只是模式而已并没有声明，所以会报错
            }
        });

        it(`#3. 对象的解构赋值背后的本质是：匹配schema进行赋值`, () => {
            let {age: age, name: name} = {name: 'mistkafka', age: 23};

            expect(age).to.be.equal(23);
            expect(name).to.be.equal('mistkafka');
        });

        it(`#4.1 数组、字符串、true/false、数字转成对象后(如果需要)进行对象的解构赋值`, () => {
            let {toString: toStringFun} = true;

            expect(typeof toStringFun).to.be.equal('function');
        });

        it(`#4.2 null/undefiend 无法解构赋值`, () => {
            try {
                let {toString: toStringFun} = null;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok; // null无法转成真正的对象, 虽说null是特殊的对象
            }
        });
    });

    describe(`#c. 解构赋值的注意事项`, () => {
        it(`#1. 一般形式的解构赋值兼具声明作用`, () => {
            let [a, b] = [1];

            try {
                let a = 3;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });

        it(`#2.1 可以先声明变量，再用来承载解构出来的值`, () => {
            let a, b, c;
            [a, b, c] = [1, 2, 3];

            expect(b).to.be.equal(2);
        });

        it(`#2.2 先声明再承载解构，对于对象来说需要特殊处理`, () => {
            let name, age;
            let obj = {name: 'mistkafka', age: 23};

            // {name, age} = obj;
            ({name, age} = obj); // 需要圆括号括起来，以此消除语法歧义: {} 表示代码块，用()来转成表达式

            expect(name).to.be.equal('mistkafka');
        });

        it(`#3.1 可以混合解构: 对象中嵌套迭代器`, () => {
            let {education_set: [first, second]} = {education_set: ['福清第二中学', '福建师范大学']};

            expect(first).to.be.equal('福清第二中学');

            try {
                education_set;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok; // 这是嵌套解构的缺点: education_set没法被整个承载，而是直接解构到first, second
            }
        });

        it(`#3.2 可以混合解构：迭代器中嵌套对象`, () => {
            let [a, {name, age}] = [1, {name: 'mistkafka', age: '23'}];

            expect(name).to.be.equal('mistkafka');
        });

        it(`#4. 不要再模式中使用圆括号(对比#c 2.2)`, () => {
            //直接无法运行，各种语法报错，总之不要用就对了！

            // try {
            //     var [(a)] = [1];
            //     var {x: (c)} = {};
            //     var ({x: c}) = {};
            //     var {(x: c)} = {};
            //     var {(x): c} = {};
            //     var { o: ({ p: p }) } = { o: { p: 2 } };
            // } catch(e) {
            // }
        });
    });

    describe(`#d. 特别注意事项：函数参数的解构赋值`, () => {
        it(`#1. 进行迭代器式的解构：很好理解，参数本来就是个数组。不过这样似乎多此一举！`, () => {

            // 看来真的是多此一举，这种写法add直接undefined, http://es6.ruanyifeng.com/#docs/destructuring#函数参数的解构赋值 真不知道这个例子怎么通过的
            // function add([x = 0, y = 0]){
            //     return x + y;
            // }

            function add(x = 0, y = 0){
                return x + y;
            }

            let rslt = add(1, 3);

            expect(rslt).to.be.equal(4);
        });

        it(`#2.1 进行对象式的解构: 推荐写法`, () => {
            function moveTo({x = 0, y = 0} = {}) {
                return [x, y];
            }

            let to00 = moveTo();
            expect(to00).to.be.deep.equal([0, 0]);

            let to31 = moveTo({y: 1, x: 3});
            expect(to31).to.be.deep.equal([3, 1]);

            let to30 = moveTo({x: 3});
            expect(to30).to.be.deep.equal([3, 0]);

            let to02 = moveTo({y: 2});
            expect(to02).to.be.deep.equal([0, 2]);
        });

        it(`#2.2 进行对象式的解构：诡异情况`, () => {
            function moveTo({x, y} = {x: 0, y: 0}) {
                return [x, y];
            }

            let to00 = moveTo();
            expect(to00).to.be.deep.equal([0, 0]);

            let to31 = moveTo({y: 1, x: 3});
            expect(to31).to.be.deep.equal([3, 1]);

            // 特别注意
            let to30 = moveTo({x: 3});
            expect(to30).to.be.deep.equal([3, undefined]);

            // 特别注意
            let to02 = moveTo({y: 2});
            expect(to02).to.be.deep.equal([undefined, 2]);
        });

        it(`#2.3 进行对象式的解构: 两个对象参数`, () => {
            function moveTo({x = 0, y = 0} = {}, {speed, startTime}) {
                return {
                    target: [x, y],
                    speed: speed,
                    startTime: startTime
                };
            }

            let to33 = moveTo({x: 3, y: 3}, {speed: 3, startTime: '12:00'});

            expect(to33).to.be.deep.equal({
                target: [3,3],
                speed: 3,
                startTime: '12:00'
            });
        });


        it(`#2.4 进行对象式的解构：尝试捕获arguments的toString属性。无法捕获!!!`, () => {
            function foo({toString}) {
                return toString;
            }

            try {
                let fun = foo();
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok; // 这个例子足以证明参数的解构赋值实际上是： [{toString}] = arguments 而不是 {toString} = arguments
            }
            let fun = foo(1, 2, 3);

            expect(fun.toString()).to.be.not.equal(arguments.toString());
        });

        it(`#2.5 综上：函数参数的解构形式是"[用户的解构模式] = arguments"`, () => {
            // 以 #2.3 写一个等价版本
            function moveTo() {

                let [{x = 0, y = 0} = {}, {speed, startTime}] = arguments;

                return {
                    target: [x, y],
                    speed: speed,
                    startTime: startTime
                };
            }

            let to33 = moveTo({x: 3, y: 3}, {speed: 3, startTime: '12:00'});

            expect(to33).to.be.deep.equal({
                target: [3,3],
                speed: 3,
                startTime: '12:00'
            });
        });
    });

    describe(`#e. 经典用途(上面的例子的不再展示)`, () => {
        it(`#1. 交换变量：不再需要第三个变量了！`, () => {
            let a = 3;
            let b = 7;
            //...
            //...
            // 一系列操作后需要交换a, b的值

            [a, b] = [b, a];

            expect(a).to.be.equal(7);
            expect(b).to.be.equal(3);
        });

        it(`#2. 函数返回多值可以直接赋值`, () => {
            function getArray() {
                return [1, 2, 3];
            }

            let [n1, n2, n3] = getArray();

            expect(n1).to.be.equal(1);
            expect(n2).to.be.equal(2);
            expect(n3).to.be.equal(3);

            function getObj() {
                return {x: 1, y: 3};
            }

            let {x, y} = getObj();

            expect(x).to.be.equal(1);
            expect(y).to.be.equal(3);
        });

        it(`#3. 输入模块指定的函数/变量`, () => {
            // import {isArray, isFunction} form 'loash';
        });
    });
});
