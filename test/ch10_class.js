const expect = require(`chai`).expect;

describe(`ch10 类`, () => {
    describe(`a. 基本使用`, () => {
        it(`#1. 定义一个类`, () => {
            class Animal {
                constructor(name) {
                    this.name = name;
                    this.speed = 10;
                }

                run() {
                    return this.speed;
                }
            }

            let animal = new Animal();

            expect(animal.run()).to.be.equal(10);
        });

        it(`#1.1 ES6的constructor相当于ES5的构造函数`, () => {
            class Animal {}

            expect(typeof Animal).to.be.equal('function');
            expect(Animal === Animal.prototype.constructor).to.be.ok;
        });

        it(`#1.2 类中定义的方法都定义在prototype上, 并且不可枚举`, () => {
            class Animal {
                run() { }
            }

            let cat = new Animal();

            expect(Object.keys(cat)).to.be.deep.equal([]);
        });

        it(`#1.3 构造函数做了限制：一定要用new`, () => {
            class Animal {}

            try {
                Animal();
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }
        });
    });

    describe(`b. 继承`, () => {
        it(`#1. 关键字：extend`, () => {
            class Living {
                constructor() {
                    this.health = 10;
                }

                eat() {
                    this.health += 3;
                }
            }

            class Plant extends Living {
                constructor() {
                    super();
                    this.health += 20;
                }

                eat() {
                    super.eat();
                    this.health +=1;
                }
            }


            let plant = new Plant();


            expect(plant.health).to.be.equal(30);

            plant.eat();
            expect(plant.health).to.be.equal(34);

            expect(plant instanceof Living).to.be.ok;
            expect(plant instanceof Plant).to.be.ok;
        });

        it(`#2. 子类的constructor一定要调用super()才能使用this`, () => {
            class Living{}
            class Plant extends Living {
                constructor() {
                    try {
                        this.health += 1;
                        super();
                        expect(true).to.be.not.ok;
                    } catch(e) {
                        expect(true).to.be.ok;
                    }
                }
            }
        });
    });

    describe.skip(`c. setter与getter`, () => {
    });

    describe(`d. 静态方法、静态属性、实例属性`, () => {
        it(`#1. 静态方法不被实例继承而是直接在类上调用`, () => {
            class Living {
                static kill(id) {
                    return `kill ${id}`;
                }
            }

            let living = new Living();
            try {
                living.kill(3);
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }

            expect(Living.kill(3)).to.be.equal(`kill 3`);
        });

        it(`#2. es6静态属性的定义`, () => {
            class Living {
                constructor() {
                    Living.instanceCount++;
                }
            }
            Living.instanceCount = 0;

            new Living();
            new Living();
            new Living();
            new Living();
            let living = new Living();
            expect(Living.instanceCount).to.be.equal(5);
        });
    });

    describe(`e. 利用new.target来实现不允许实例化的抽象类`, () => {
        it(`#1. new.target 指向真正实例化的那个类（继承时）`, () => {
            class Base {
                constructor() {
                    this.target = new.target;
                }
            }

            class SubClass extends Base {}

            let base = new Base();
            expect(base.target).to.be.equal(Base);

            let subclass =new SubClass();
            expect(subclass.target).to.be.equal(SubClass);
        });

        it(`#2. 实现抽象类的例子`, () => {
            class Base {
                constructor() {
                    if (new.target === Base) {
                        throw Error(`这个类不能实例化`);
                    }
                }
            }

            class SubClass extends Base {}

            try {
                new Base();
                expect(true).to.be.not.ok;
            } catch(e) {
                expect(true).to.be.ok;
            }

            try {
                new SubClass();
                expect(true).to.be.ok;
            } catch(e) {
                expect(true).to.be.not.ok;
            }
        });
    });

});
