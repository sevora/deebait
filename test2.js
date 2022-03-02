class Parent {
    callback() {
        this.implementMe();
    }
}

class Child extends Parent {
    constructor() {
        super();
        this.x = false;
    }

    async fixX() {
        this.x = true;
    }

    implementMe() {
        console.log(`3 ${this.x}`);
    }
}

async function main() {
    let test = new Child();

    if (true) {
        await test.fixX();
        console.log(`1 ${test.x}`);
    }

    console.log(`2 ${test.x}`);
    test.callback();
    console.log(`4 ${test.x}`);
}

main();
