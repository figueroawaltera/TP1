const Review = require("../src/Review");
const User = require("../src/User");

let review1;
let user1;

beforeEach(()=>{
    user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
    review1 = new Review(user1,"Texto de review1",0)
})

describe("Una revisión", () =>{
    it("deberia tener un revisor.", () => {
        expect(review1.reviewer()).not.toBeUndefined();
    })

    it("deberia tener un texto.", () => {
        expect(review1.text()).not.toBeUndefined();
    })

    it("deberia tener un score.", () => {
        expect(review1.score()).not.toBeUndefined();
    })

    it("deberia tener un score entre -3 y +3", () => {
        expect(review1.score()).toBeGreaterThan(-4)
        expect(review1.score()).toBeLessThan(4)

        let invalidScore = ()=>{review1.setScore(4)};
        expect(invalidScore).toThrow();
    })

    it("deberia poder actualizar su score.", () => {
        expect(review1.score()).toBe(0)
        review1.setScore(3)
        expect(review1.score()).toBe(3)
    })

    it("deberia poder actualizar su texto.", () => {
        let texto1 = review1.text()
        expect(review1.text()).toEqual(texto1)

        let newText1 = "Nuevo texto1"
        review1.setReview(newText1)
        expect(review1.text()).toEqual(newText1)
    })
})
