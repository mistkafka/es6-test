const expect = require('chai').expect;

describe(`ch3 字符串扩展`, () => {
    it(`#1. includes(patten, [startIndex])`, () => {
        let str = 'hello, world!';

        expect(str.includes('hello')).to.be.deep.ok;
        expect(str.includes('o', 6)).to.be.deep.ok;
    });

    it(`#2. startsWith()`, () => {
        let str = 'hello, world!';

        expect(str.startsWith(`hello`)).to.be.deep.ok;
        expect(str.startsWith(`world`, 7)).to.be.deep.ok;
    });

    it(`#3. endsWith()`, () => {
        let str = `543210`;

        expect(str.endsWith(`210`)).to.be.deep.ok;
        expect(str.endsWith(`5`, 1)).to.be.deep.ok;
    });

    it(`#4. repeat()`, () => {
        let str = 'x';

        expect(str.repeat(3)).to.be.equal(`xxx`);
        expect(str.repeat(0.5)).to.be.equal(``);
    });

    it(`#5.1 字符串模版：基本使用`, () => {
        let name = 'mistkafka';

        expect(`my name is ${name}`).to.be.equal(`my name is mistkafka`);
    });

    it(`#5.2 字符串模版：输出多行文本`, () => {
        let str =
`
012345
7
9
`;
        expect(str.includes('\n')).to.be.ok;

    });

    //it(`#5.3 字符串模版：\${}中执行代码、嵌套另一个字符串模版`, () => {
    //    let names = ['kafka', 'jolie'];
    //    let helloStr =
    //    `
    //        hello,
    //        ${``}
    //    `

    //    expect(helloStr).includes(`dear kafka`).to.be.ok;
    });
});
