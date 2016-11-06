const expect = require('chai').expect;

describe(`ch5 数组的扩展`, () => {
    describe(`a. 类数组、Iterable转成数组: Array.from()`, () => {
        it(`#1. 常规使用`, () => {
            let arrayLike = {
                length: 3,
                0: 0,
                1: 1,
                hehe: `haha`
            };
            let array = Array.from(arrayLike);

            expect(array[0]).to.be.equal(0);
            expect(array[2]).to.be.equal(undefined);
        });
    });

    describe(`b. 补充Array()，Array.of()`, () => {
        // Array.of是Array的语法糖

        it(`#1 Array()的行为`, () => {
            let arrP0 = Array();
            expect(arrP0.length).to.be.equal(0);

            // Array(), 单个参数是指定数组长度的
            let arrP1 = Array(3);
            expect(arrP1.length).to.be.equal(3);
            expect(arrP1[2]).to.be.equal(undefined);

            let arrP2 = Array(1, 2);
            expect(arrP2[1]).to.be.equal(2);
        });

        it(`#2 Array.of()的行为`, () => {
            let arrP0 = Array.of();
            expect(arrP0.length).to.be.equal(0);

            let arrP1 = Array.of(1);
            expect(arrP1[0]).to.be.equal(1);

            let arrP2 = Array.of(1, 2);
            expect(arrP2[1]).to.be.equal(2);
        });
    });

    describe(`c. 数组内部的复制替换：arrayInstance.copyWithin(target, start=0, end=this.length)`, () => {
        it(`#1. 基本使用`, () => {
            let arr = [0, 1, 2, 3, 4];
            arr.copyWithin(0, 3);

            expect(arr).to.be.deep.equal([3, 4, 2, 3, 4]);
        });
    });

    describe(`d. find()与findIndex()`, () => {
        it(`#1. arrayInstance.find(cb(value, index, arr))`, () => {
            let arr = [{val: 3}, {val: 9}, {val:0}];
            function findZeroVal(item) {
                return item.val === 0;
            }

            expect(arr.find(findZeroVal)).to.be.deep.equal({val: 0});
        });

        it(`#2. arrayInstance.findIndex(cb(value, index, arr))`, () => {
            let arr = [{val: 3}, {val: 9}, {val:0}];
            function findZeroVal(item) {
                return item.val === 0;
            }

            expect(arr.findIndex(findZeroVal)).to.be.deep.equal(2);
        });

        it(`#3. 传统的indexOf无法找出数组中的NaN`, () => {
            expect([NaN].indexOf(NaN)).to.be.equal(-1);
        });
    });

    describe(`e. 填充数组：arrayInstance.fill(fillValue, startIndex = 0, endIndex = this.length)`, () => {
        it(`#1. 基本使用: 单个参数`, () => {

            expect([1, 2, 3, 4].fill(0)).to.be.deep.equal([0, 0, 0, 0]);
        });

        it(`#2. 第二第三个参数指定填充范围: [startIndex, endIndex)`, () => {
            expect([0, 1, 2, 3, 4, 5].fill(0, 3, 6)).to.be.deep.equal([0, 1, 2, 0, 0, 0]);
        });
    });

    describe(`f. 数组->Iterator: entries(), keys(), values()`, () => {
        it(`#1. 转成键值对的Iterator: arrayInstance.entries()`, () => {
            let arr = ['a', 'b', 'c'];
            let entries = arr.entries();

            for (let [k, v] of entries) {
                expect(v).to.be.equal(arr[k]);
            }
        });

        it(`#2. 转成值或键的Itertor: arrayInstance.values() / arrayInstance.keys()`, () => {
            let arr = ['a', 'b', 'c'];

        });
    });

    describe(`g. 数组的includes()函数`, () => {
        it(`#1. 判断数组中是否包含某个值`, () => {
            expect([1, 2, 3].includes(3)).to.be.ok;
        });

        it(`#2. 可以查找出NaN`, () => {
            expect([1, 2, NaN].includes(NaN)).to.be.ok;
        });

        it(`#3. indexOf方法找不出NaN`, () => {
            expect([1, 2, NaN].indexOf(NaN) > -1).to.be.not.ok;
        });
    });

    describe(`h. 数组的空位处理不一致，尽量不要使用!`, () => {
        it(`#1. 什么是空位？空位不是指值是undefined`, () => {
            let emptyArry = [ , , ];
            expect(0 in emptyArry).to.be.not.ok;

            let noEmptyArray = [undefined, undefined, undefined];
            expect(0 in noEmptyArray).to.be.ok;
        });

        it(`#2. es6之前的方法基本都跳过空值(map函数会跳过，但是空位却会保留)`, () => {
            let arr = [0, 1, 2, 3, , , 6];
            let count = 0;

            arr.forEach(() => count++);
            expect(count).to.be.equal(5);

            // 类似的还有filter(), some(), every(), map()也跳过但是返回的新数组里依然保留空值
        });

        it(`#3. es6的新方法基本都会把空值转成undefined`, () => {
            let arr = Array.from([0, , 2]);

            expect(arr[1]).to.be.equal(undefined);
        });
    });
});
