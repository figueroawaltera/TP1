const Session = require("../src/Session");
const User = require("../src/User");
const Paper = require("../src/Paper");
const {Bid, Interests} = require("../src/Bid");

let newSession;
let asse;
let juan, julian, matias;
let paper01, paper02, paper03;

beforeEach( ()=> {
    newSession = new Session();
    asse = new Session();
    juan = new User("Juan Gardey", "LIFIA, UNLP", "jgardey@lifia.ar", "123");
    julian = new User("Julián Grigera", "LIFIA, UNLP", "jgrigera@lifia.ar", "123");
    matias = new User("Matias Urbieta", "LIFIA, UNLP", "murbieta@lifia.ar", "123");
    paper01 = new Paper("A new approach on something", [juan, julian], juan);
    paper02 = new Paper("Another approach on something else", [matias, julian], matias);
    paper03 = new Paper("Yet another approach on something", [juan, matias], juan);
});

describe("A new Session", () =>{
    it("should have an empty name", ()=> {
        expect(newSession.name()).toBe("");
    })

    it("should have an empty Program Committee", ()=>{
        expect(newSession.programCommittee()).toHaveLength(0);
    })
})

describe("A Session", ()=>{
    it("should be able to add PC members.", ()=>{
        asse.addReviewer(juan);
        expect(asse.reviewers()).toContain(juan);
        expect(asse.reviewers()).toHaveLength(1);
    })
    it("should allow paper submissions", ()=>{
        expect(asse.canSubmit(paper01)).toBe(true);
        asse.submit(paper01);
        expect(asse.papers()).toContain(paper01);
    })
})

describe("During the bidding process, a Session", ()=>{
    it("should receive bids", ()=>{
        asse.closeSubmissions();
        asse.enterBid(paper02, juan, Interests.Interested);
        expect(asse.bidExistsFor(paper02, juan)).toBe(true);
        expect(asse.interestFor(paper02, juan)).toBe(Interests.Interested);
    })
    it("should allow overriding bids", ()=>{
        asse.closeSubmissions();
        asse.enterBid(paper02, juan, Interests.Interested);
        const secondBid = () => {asse.enterBid(paper02, juan, Interests.Maybe)};
        expect(secondBid).not.toThrow();
        expect(asse.interestFor(paper02, juan)).toBe(Interests.Maybe);
        expect(asse.bids()).toHaveLength(1);
    })
    it("should not allow to receive submissions", ()=>{
        asse.closeSubmissions();
        expect(asse.canSubmit(paper01)).toBe(false);
    })
    it("should fail to receive submissions", ()=>{
        asse.closeSubmissions();
        let submission = ()=>{asse.submit(paper01)};
        expect(submission).toThrow();
    })
})

describe("US1.1: Cálculo de la carga de revisiones por revisor", ()=>{
    it("con 4 artículos y 4 revisores, cada revisor tiene exactamente 3 revisiones", ()=>{
        let totalArticulos = 4;
        let totalRevisores = 4;

        let sesion = new Session();
        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
        let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
        let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");
        let paperA = new Paper("Paper A", [user1], user1);
        let paperB = new Paper("Paper B", [user2], user2);
        let paperC = new Paper("Paper C", [user3], user3);
        let paperD = new Paper("Paper D", [user4], user4);
        
        newSession.addReviewer(user1)
        newSession.addReviewer(user2)
        newSession.addReviewer(user3)
        newSession.addReviewer(user4)

        newSession.submit(paperA)
        newSession.submit(paperB)
        newSession.submit(paperC)
        newSession.submit(paperD)

        let carga = newSession.calcularCargaDeRevisiones();

        expect(Object.keys(carga)).toHaveLength(4);
        expect(carga[0]).toBe(3);
        expect(carga[1]).toBe(3);
        expect(carga[2]).toBe(3);
        expect(carga[3]).toBe(3);
    })

    it("con 10 artículos y 7 revisores, distribuye el resto: 2 revisores con 5 y 5 con 4", ()=>{
        let totalArticulos = 10;
        let totalRevisores = 7;

        let sesion = new Session();
        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
        let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
        let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");
        let user5 = new User("User 5", "Uni 5", "u5@mail.com", "pass");
        let user6 = new User("User 6", "Uni 6", "u6@mail.com", "pass");
        let user7 = new User("User 7", "Uni 7", "u7@mail.com", "pass");
        let paperA = new Paper("Paper A", [user1], user1);
        let paperB = new Paper("Paper B", [user2], user2);
        let paperC = new Paper("Paper C", [user3], user3);
        let paperD = new Paper("Paper D", [user4], user4);
        let paperE = new Paper("Paper E", [user5], user5);
        let paperF = new Paper("Paper F", [user6], user6);
        let paperG = new Paper("Paper G", [user7], user7);
        let paperH = new Paper("Paper H", [user1], user1);
        let paperI = new Paper("Paper I", [user2], user2);
        let paperJ = new Paper("Paper J", [user3], user3);
        
        newSession.addReviewer(user1)
        newSession.addReviewer(user2)
        newSession.addReviewer(user3)
        newSession.addReviewer(user4)
        newSession.addReviewer(user5)
        newSession.addReviewer(user6)
        newSession.addReviewer(user7)

        newSession.submit(paperA)
        newSession.submit(paperB)
        newSession.submit(paperC)
        newSession.submit(paperD)
        newSession.submit(paperE)
        newSession.submit(paperF)
        newSession.submit(paperG)
        newSession.submit(paperH)
        newSession.submit(paperI)
        newSession.submit(paperJ)

        let carga = newSession.calcularCargaDeRevisiones();

        expect(Object.keys(carga)).toHaveLength(7);
        expect(carga[0]).toBe(5);
        expect(carga[1]).toBe(5);
        expect(carga[2]).toBe(4);
        expect(carga[3]).toBe(4);
        expect(carga[4]).toBe(4);
        expect(carga[5]).toBe(4);
        expect(carga[6]).toBe(4);
    })
})

describe("US1.2: Asignación de revisores basada en prioridades de Bidding", ()=>{
    it("asigna los 3 revisores de mayor prioridad al Paper A", ()=>{
        let sesion = new Session();
        let autor = new User("Autor", "Uni A", "autor@mail.com", "pass");
        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
        let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
        let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");
        let paperA = new Paper("Paper A", [autor], autor);
        let paperB = new Paper("Paper B", [autor], autor);

        sesion.addReviewer(user1);
        sesion.addReviewer(user2);
        sesion.addReviewer(user3);
        sesion.addReviewer(user4);
        sesion.submit(paperA);
        sesion.submit(paperB);
        sesion.closeSubmissions();

        sesion.enterBid(paperA, user1, Interests.Interested);
        sesion.enterBid(paperA, user2, Interests.Interested);
        sesion.enterBid(paperA, user3, Interests.Maybe);

        sesion.asignarRevisores();

        expect(sesion.assigmentExistsFor(paperA,user1)).toBe(true);
        expect(sesion.assigmentExistsFor(paperA,user2)).toBe(true);
        expect(sesion.assigmentExistsFor(paperA,user3)).toBe(true);
        expect(sesion.assigmentExistsFor(paperA,user4)).toBe(false);
        expect(sesion.assigmentsPapers(paperA)).toBe(3)

        expect(sesion.assigmentsPapers(paperB)).toBe(3)
    })
})

describe("US1.3: Exclusión de revisores por Conflicto de Interés", ()=>{
    it("excluye al autor del paper aunque tenga el bid de mayor prioridad", ()=>{
        let sesion = new Session();
        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
        let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
        let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");
        let user5 = new User("User 5", "Uni 5", "u5@mail.com", "pass");
        let paperA = new Paper("Paper A", [user1, user2], user1);

        sesion.addReviewer(user1);
        sesion.addReviewer(user2);
        sesion.addReviewer(user3);
        sesion.addReviewer(user4);
        sesion.addReviewer(user5);
        sesion.submit(paperA);
        sesion.closeSubmissions();

        sesion.enterBid(paperA, user1, Interests.Interested);
        sesion.enterBid(paperA, user2, Interests.Maybe);
        sesion.enterBid(paperA, user3, Interests.Maybe);
        sesion.enterBid(paperA, user4, Interests.NotInterested);
        sesion.enterBid(paperA, user5, Interests.NotInterested);

        sesion.asignarRevisores();

        expect(sesion.assigmentExistsFor(paperA,user1)).toBe(false);
        expect(sesion.assigmentExistsFor(paperA,user2)).toBe(false);
        expect(sesion.assigmentExistsFor(paperA,user3)).toBe(true);
        expect(sesion.assigmentExistsFor(paperA,user4)).toBe(true);
        expect(sesion.assigmentExistsFor(paperA,user5)).toBe(true);
        expect(sesion.assigmentsPapers(paperA)).toBe(3)
    })
})

describe("US2.1: Registro de revisión por un revisor asignado", ()=>{
   it("solo permite cargar una review a un artículo asignado.", ()=>{
       let sesion = new Session();
       let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
       let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
       let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
       let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");
       let paperA = new Paper("Paper A", [user1], user1);

       sesion.addReviewer(user1);
       sesion.addReviewer(user2);
       sesion.addReviewer(user3);
       sesion.addReviewer(user4);
       sesion.submit(paperA);
       sesion.closeSubmissions();

       sesion.enterBid(paperA, user1, Interests.Interested);
       sesion.enterBid(paperA, user2, Interests.Maybe);
       sesion.enterBid(paperA, user3, Interests.Maybe);
       sesion.enterBid(paperA, user4, Interests.NotInterested);
       sesion.closeBidding();

       sesion.asignarRevisores();
       expect(sesion.assigmentExistsFor(paperA,user1)).toBe(false);
       expect(sesion.assigmentExistsFor(paperA,user2)).toBe(true);

       sesion.closeAssigment();
       
       sesion.enterReview(paperA,user2,"Rev user2",2);
       expect(paperA.reviews()).toHaveLength(1);

       let invalidReview = ()=>{sesion.enterReview(paperA,user1,"Rev user1",3)};
       expect(invalidReview).toThrow();

   })

   it("solo permite cargar una review con un score entre -3 y +3.", ()=>{
       let sesion = new Session();
       let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
       let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
       let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
       let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");
       let paperA = new Paper("Paper A", [user1], user1);

       sesion.addReviewer(user1);
       sesion.addReviewer(user2);
       sesion.addReviewer(user3);
       sesion.addReviewer(user4);
       sesion.submit(paperA);
       sesion.closeSubmissions();

       sesion.enterBid(paperA, user1, Interests.Interested);
       sesion.enterBid(paperA, user2, Interests.Maybe);
       sesion.enterBid(paperA, user3, Interests.Maybe);
       sesion.enterBid(paperA, user4, Interests.NotInterested);
       sesion.closeBidding();

       sesion.asignarRevisores();
       expect(sesion.assigmentExistsFor(paperA,user1)).toBe(false);
       expect(sesion.assigmentExistsFor(paperA,user2)).toBe(true);

       sesion.closeAssigment();

       let invalidReview = ()=>{sesion.enterReview(paperA,user2,"Rev user2",4)};
       expect(invalidReview).toThrow();

   })
})