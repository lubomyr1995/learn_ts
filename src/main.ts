console.log('Hello this is TS');

// interface IUser<T> {
//     name: string;
//     age: number;
//     status: boolean;
//     data: T
// }
//
// let user1: IUser<string[]> = {name: 'Vasa', age: 25, status: true, data: ['hi']};
// let user2: Partial<IUser<string[]>> = {name: 'Vasa', age: 25, status: true};

class Car {
    constructor(public model: string, protected year: number, private _price: number) {
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }
}

const car: Car = new Car('BMW', 2020, 30000);

abstract class Shape {
    abstract perimeter(): number

    abstract area(): number
}

class Rectangle extends Shape {
    constructor(private a: number, private b: number) {
        super();
    }

    area(): number {
        return this.a * this.b;
    }

    perimeter(): number {
        return 2 * (this.a + this.b);
    }

}

class Triangle extends Shape {
    constructor(private a: number, private b: number, private c: number) {
        super();
    }

    area(): number {
        const s = (this.a + this.b + this.c) / 2
        return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
    }

    perimeter(): number {
        return this.a + this.b + this.c;
    }

}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }

    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    area(): number {
        return Math.PI * Math.pow(this.radius, 2);
    }
}

let shapes: Shape[] = [
    new Rectangle(10, 20),
    new Triangle(3, 4, 5),
    new Circle(5)
];

for (const shape of shapes) {
    console.log(shape.area())
    console.log(shape.perimeter())
}

interface ILanguage {
    language: () => string
}

interface IGreeting {
    greeting(): void
}

class EnglishGreeting implements IGreeting, ILanguage {

    constructor(private _language: string) {
    }

    greeting(): void {
        console.log("Hello!");
    }

    language(): string {
        return this._language;
    }

}

class SpanishGreeting implements IGreeting {
    greeting(): void {
        console.log("Hola!");
    }
}

interface IAddress {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
        lat?: string;
        lng?: string;
    }
}

interface IUser {
    id?: number;
    name: string;
    username: string;
    email: string;
    address: IAddress;
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    }
}