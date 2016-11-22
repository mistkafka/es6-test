const expect = require(`chai`).expect;
const hash = require(`object-hash`);

`use strict`;

describe(`ch9 Proxy与Reflect`, () => {
    describe(`a. Proxy概述`, () => {
        it(`#1.1 基本使用：handler.get(target, key, receiver), 拦截getter`, () => {
            let obj = {
                get name() {
                    return `kafka`;
                }
            };

            let objProxy = new Proxy(obj, {
                get: function(target, key, receiver) {
                    let srcStr =  Reflect.get(target, key, receiver);
                    return `mist${srcStr}`;
                }
            });

            expect(objProxy.name).to.be.equal(`mistkafka`);
        });

        it(`#1.2 基本使用：handler.set(target, key, value, receiver), 拦截setter`, () => {
            let obj = {
                set name(str) {
                    this._name = str;
                },
                get name() {
                    return this._name;
                }
            };

            let objProxy = new Proxy(obj, {
                set: function(target, key, val, receiver) {
                    let name = val;
                    if (!name.startsWith(`mist`)) {
                        name = `mist${name}`;
                    }
                    return Reflect.set(target, key, name, receiver);
                }
            });

            objProxy.name = `kafka`;

            expect(objProxy.name).to.be.equal(`mistkafka`);
        });

        it(`#1.3 基本使用：handler.has(target, key), 拦截in/hasOwnProperty`, () => {
            let obj = {};
            let objProxy = new Proxy(obj, {
                has: function(target, key) {
                    return true;
                }
            });

            expect(`asdfasdf` in objProxy).to.be.ok;
        });

        it(`#2. 高级例子： 利用handler.get()创建支持负数索引的数组`, () => {
            function createArray(...elements) {
                let handler = {
                    get(target, index, receiver) {
                        let i = Number(index);

                        if (i >= 0) {
                            return target[i];
                        } else {
                            return target[target.length + i];
                        }
                    }
                };

                let arr = [...elements];

                return new Proxy(arr, handler);
            };

            let arr = createArray(1, 2, 3);
            expect(arr[-1]).to.be.equal(3);
        });

        it(`#3. 我觉得重要的拦截器：handler.apply(target, ctx, args): 拦截函数调用、call、apply`, () => {
            let helloworldHandler = {
                apply(target, ctx, args) {
                    // return Reflect.apply(...arguments);
                    return `hello, world`;
                }
            };

            function sayHello() {
                return `hello`;
            }

            expect((new Proxy(sayHello, helloworldHandler))()).to.be.equal(`hello, world`);
        });

        it.skip(`#4. node.js 还不支持 我觉得重要的拦截器：handler.has(target, key): 拦截hasProperty/in操作`, () => {
            let privatePropertyHandler = {
                has(target, key) {
                    debugger;
                    if (key.startsWith(`_`)) {
                        return false;
                    }

                    return Reflect.has(...arguments);
                }
            };

            let obj = {
                _privateName: 'mistkafka'
            };

            let privateAbleObj = new Proxy(obj, privatePropertyHandler);

            expect(`_privateName` in obj).to.be.equal(false);
        });

        it(`#5. 通用的cache机制`, () => {
            let count = 0; // just for test
            let cacheHandler = {
                cache: {},
                apply(target, ctx, args) {
                    let key = hash(args);

                    // just for test
                    if (!this.cache[key]) {
                        count++;
                    };
                    // just for test, end

                    return this.cache[key] ? this.cache[key] : this.cache[key] = Reflect.apply(...arguments);
                }
            };
            function add(a, b) {
                return a + b;
            }
            let addCache = new Proxy(add, cacheHandler);

            addCache(1, 1);
            addCache(1, 1);
            addCache(1, 1);

            expect(count).to.be.equal(1);
        });
    });

    describe(`b. 可以取消的Proxy`, () => {
        it(`#1. Proxy.revocable()`, () => {
            let obj = {};
            let {proxy, revoke}=  Proxy.revocable(obj, {
                has: function(target, key) {
                    return true;
                }
            });
            expect(`asdfasdf` in proxy).to.be.ok;

            revoke();
            try {
                proxy.a;
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });
    });

    describe(`c. Object对象的新归宿：Reflect对象`, () => {
        it.skip(`#1. 与Proxy的hander相对应`);
        it.skip(`#2. 包含Object的所有方法`);
    });
});
