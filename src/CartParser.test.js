import CartParser from './CartParser';

let parser;

beforeEach(() => {
    parser = new CartParser();
});

describe("CartParser - unit tests", () => {

    describe('parseLine', () => {
        let csvLine = 'Mollis consequat,9.00,2';

        it('return an item.name', () => {
            expect(parser.parseLine(csvLine).name).toEqual("Mollis consequat")
        });
    
        it('return an item.price', () => {
            expect(parser.parseLine(csvLine).price).toEqual(9.00)
        });
        it('return an item.quantity', () => {
            expect(parser.parseLine(csvLine).quantity).toEqual(2)
        });
    
    });
    describe("validate", () => {
        it("should return empty array: no errors", () => {
            let items = [
                'Product name,Price,Quantity',
                'Tvoluptatem,10.32,1',
                'Scelerisque lacinia,18.90,1'
            ];

            let errors = parser.validate(items.join('\n'));
    
            expect(errors).toEqual([]);
        }) 
        it("should return error: not valid header", () => {
            let items = [
                'Product name,Err,Quantity',
                'Tvoluptatem,10.32,1',
                'Scelerisque lacinia,18.90,1'
            ];

            let errors = parser.validate(items.join('\n'));
            let error = parser.createError(
                parser.ErrorType.HEADER, 
                0, 
                1, 
                `Expected header to be named "Price" but received Err.`
            );

            expect(errors[0]).toEqual(error);
        })
        it("should return error: wrong number of cells", () => {
            let items = [
                'Product name,Price,Quantity',
                'Tvoluptatem,10.32'
            ];

            let errors = parser.validate(items.join('\n'));
            let error = parser.createError(
                parser.ErrorType.ROW,
                1, 
                -1, 
                `Expected row to have 3 cells but received 2.`
            );

            expect(errors[0]).toEqual(error);
        }) 
        it("should return error: empty first cell", () => {
            let items = [
                'Product name,Price,Quantity',
                ',10.32,1'
            ];

            let errors = parser.validate(items.join('\n'));
            let error = parser.createError(
                parser.ErrorType.CELL,
                1, 
                0, 
                `Expected cell to be a nonempty string but received "".`
            );

            expect(errors[0]).toEqual(error);
        }) 
        it("should return error: not a number in cell", () => {
            let items = [
                'Product name,Price,Quantity',
                'Tvoluptatem,-1,1'
            ];

            let errors = parser.validate(items.join('\n'));
            let error = parser.createError(
                parser.ErrorType.CELL,
                1, 
                1, 
                `Expected cell to be a positive number but received "-1".`
            );

            expect(errors[0]).toEqual(error);
        }) 
    }) 

});

describe("CartParser - integration tests", () => {
    const path1 = "./samples/cart.csv";
    const path2 = "./samples/cartWithErr.csv";

    it('Should return an validation error', () => {
        expect(()=>{
            parser.parse(path2);
        }).toThrow("Validation failed!");
    })

    it('Should return number of items equal to 5', () => {
        console.log(parser.parse(path1).items.length)
        expect(parser.parse(path1).items.length).toEqual(5)
    })
});