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
    it("should not allow paper invalid submissions", ()=>{

        let sesion = new Session();
        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let paperA = new Paper("", [user1], user1);

        expect(sesion.canSubmit(paperA)).toBe(false);
        let submission = ()=>{sesion.submit(paperA)};
        expect(submission).toThrow();

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

describe("During the assigment process, a Session", ()=>{
    it("should not allow to receive bids", ()=>{
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
        sesion.closeBidding();

        let bidSubmission = ()=>{sesion.enterBid(paperB, user1, Interests.Interested)};
        expect(bidSubmission).toThrow();
        
    })
})

describe("During the revision process, a Session", ()=>{
    it("assigning papers should not be allowed", ()=>{
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
        sesion.closeBidding();
        sesion.closeAssigment();

        let assigment = ()=>{sesion.asignarRevisores()};
        expect(assigment).toThrow();
        
        let directAssigment = ()=>{sesion.enterAssigment(paperA,user1)};
        expect(directAssigment).toThrow();
        
        
    })
})

describe("During the selection process, a Session", ()=>{
    it("should not allow to receive reviews", ()=>{
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
        sesion.closeBidding();

        sesion.asignarRevisores()
        sesion.closeAssigment();

        sesion.enterReview(paperA,user2,"Rev user2",2);
        expect(paperA.reviews()).toHaveLength(1);

        sesion.closeRevision()
        let revision = ()=>{sesion.enterReview(paperA,user1,"Rev user1",2);};
        expect(revision).toThrow();
        
    })
})

describe("US1.1: Cálculo de la carga de revisiones por revisor", ()=>{
    it("con 4 artículos y 4 revisores, cada revisor tiene exactamente 3 revisiones", ()=>{
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
        sesion.closeBidding()

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
        sesion.closeBidding();

        sesion.asignarRevisores();

        expect(sesion.assigmentExistsFor(paperA,user1)).toBe(false);
        expect(sesion.assigmentExistsFor(paperA,user2)).toBe(false);
        expect(sesion.assigmentExistsFor(paperA,user3)).toBe(true);
        expect(sesion.assigmentExistsFor(paperA,user4)).toBe(true);
        expect(sesion.assigmentExistsFor(paperA,user5)).toBe(true);
        expect(sesion.assigmentsPapers(paperA)).toBe(3)
    })

    it("no se permite asignar más de una vez a un mismo revisor a un paper.", ()=>{
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
        
        let directAssigment = ()=>{sesion.enterAssigment(paperA,user2)};
        expect(directAssigment).toThrow();

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

describe("US2.2: Límite de revisiones por artículo", ()=>{
    it("Un artículo no puede admitir más de 3 revisiones en total.", ()=>{
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
       expect(sesion.assigmentExistsFor(paperA,user2)).toBe(true);
       expect(sesion.assigmentExistsFor(paperA,user3)).toBe(true);
       expect(sesion.assigmentExistsFor(paperA,user4)).toBe(true);

       sesion.closeAssigment();

       sesion.enterReview(paperA,user2,"Rev user2",2);
       sesion.enterReview(paperA,user3,"Rev user2",3);
       sesion.enterReview(paperA,user4,"Rev user2",3);
       expect(paperA.reviews()).toHaveLength(3);

       let invalidReview = ()=>{sesion.enterReview(paperA,user2,"Rev other user2",0)};
       expect(invalidReview).toThrow();

   })
})

describe("US2.3: Cálculo automático del score del artículo", ()=>{
    it("El score de un artículo debe calcularse como el promedio exacto de los puntajes de las revisiones que ha recibido hasta el momento.", ()=>{
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
       expect(sesion.assigmentExistsFor(paperA,user2)).toBe(true);
       expect(sesion.assigmentExistsFor(paperA,user3)).toBe(true);
       expect(sesion.assigmentExistsFor(paperA,user4)).toBe(true);

       sesion.closeAssigment();

       sesion.enterReview(paperA,user2,"Rev user2",2);
       sesion.enterReview(paperA,user3,"Rev user2",-1);
       expect(paperA.reviews()).toHaveLength(2);

       expect(paperA.score()).toBe(0.5)

   })
})

describe("US3.1: Configuración del porcentaje de aceptación de la sesión", ()=>{
    it("permite configurar un porcentaje válido y lo almacena correctamente", ()=>{
        let sesion = new Session();
        sesion.setAcceptancePercentage(25);
        expect(sesion.acceptancePercentage()).toBe(25);
    })

    it("lanza un Error si el porcentaje es menor a 0", ()=>{
        let sesion = new Session();
        let invalidConfig = ()=>{ sesion.setAcceptancePercentage(-5) };
        expect(invalidConfig).toThrow();
    })

    it("lanza un Error si el porcentaje es mayor a 100", ()=>{
        let sesion = new Session();
        let invalidConfig = ()=>{ sesion.setAcceptancePercentage(105) };
        expect(invalidConfig).toThrow();
    })
})

describe("US3.2: Ordenamiento de artículos por Score decreciente", ()=>{
    it("retorna los artículos ordenados por score descendente, desempatando por orden de llegada", ()=>{
        let sesion = new Session();
        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
        let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");

        let paperA = new Paper("Paper A", [user1], user1);
        let paperB = new Paper("Paper B", [user2], user2);
        let paperC = new Paper("Paper C", [user3], user3);

        sesion.submit(paperA);
        sesion.submit(paperB);
        sesion.submit(paperC);

        paperA.addReview(user2, "Rev A1", 1);
        paperA.addReview(user3, "Rev A2", 2);

        paperB.addReview(user1, "Rev B1", 2);
        paperB.addReview(user3, "Rev B2", 3);

        paperC.addReview(user1, "Rev C1", 1);
        paperC.addReview(user2, "Rev C2", 2);

        let ordenados = sesion.obtenerArticulosOrdenadosPorScore();

        expect(ordenados).toHaveLength(3);
        expect(ordenados[0]).toBe(paperB);
        expect(ordenados[1]).toBe(paperA);
        expect(ordenados[2]).toBe(paperC);
    })
})

describe("US3.3: Selección automática por Corte Fijo", ()=>{
    it("retorna la cantidad de articulos a aceptar de acuerdo al porcentaje de aceptación.", ()=>{
        let sesion = new Session();

        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
        let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
        let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");
        let user5 = new User("User 5", "Uni 5", "u5@mail.com", "pass");

        let paperA = new Paper("Paper A", [user1], user1);
        let paperB = new Paper("Paper B", [user2], user2);
        let paperC = new Paper("Paper C", [user3], user3);
        let paperD = new Paper("Paper D", [user4], user4);
        let paperE = new Paper("Paper D", [user5], user5);

        sesion.submit(paperA);
        sesion.submit(paperB);
        sesion.submit(paperC);
        sesion.setAcceptancePercentage(50)

        let cantidadArticulosAAceptar = sesion.cantidadArticulosAAceptar()
        expect(cantidadArticulosAAceptar).toBe(1);
    })

    it("se marcaron los papers aceptados de acuerdo al orden por score final y al porcentaje de aceptación.", ()=>{
        let sesion = new Session();

        let user1 = new User("User 1", "Uni 1", "u1@mail.com", "pass");
        let user2 = new User("User 2", "Uni 2", "u2@mail.com", "pass");
        let user3 = new User("User 3", "Uni 3", "u3@mail.com", "pass");
        let user4 = new User("User 4", "Uni 4", "u4@mail.com", "pass");

        let paperA = new Paper("Paper A", [user1], user1);
        let paperB = new Paper("Paper B", [user2], user2);
        let paperC = new Paper("Paper C", [user3], user3);
        let paperD = new Paper("Paper D", [user4], user4);

        sesion.submit(paperA);
        sesion.submit(paperB);
        sesion.submit(paperC);
        sesion.submit(paperD);
        sesion.setAcceptancePercentage(50)

        paperA.addReview(user2, "Rev A1", 1);
        paperA.addReview(user3, "Rev A2", 2);

        paperB.addReview(user1, "Rev B1", 3);
        paperB.addReview(user3, "Rev B2", 3);

        paperC.addReview(user1, "Rev C1", 1);
        paperC.addReview(user2, "Rev C2", 2);

        paperD.addReview(user1, "Rev C1", 2);
        paperD.addReview(user3, "Rev C3", 3);
        paperD.addReview(user3, "Rev C3", 3);

        
        let cantidadArticulosAAceptar = sesion.cantidadArticulosAAceptar()
        expect(cantidadArticulosAAceptar).toBe(2);

        let aceptados = sesion.obtenerArticulosAceptados()
        expect(aceptados).toHaveLength(2)
        expect(paperA.isAccepted()).toBe(false);
        expect(paperB.isAccepted()).toBe(true);
        expect(paperC.isAccepted()).toBe(false);
        expect(paperD.isAccepted()).toBe(true);
    })

    it("Para score final de un artículo se completan con puntaje -3 por review faltante.", ()=>{
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
       expect(sesion.assigmentExistsFor(paperA,user2)).toBe(true);
       expect(sesion.assigmentExistsFor(paperA,user3)).toBe(true);
       expect(sesion.assigmentExistsFor(paperA,user4)).toBe(true);

       sesion.closeAssigment();

       sesion.enterReview(paperA,user2,"Rev user2",2);
       sesion.enterReview(paperA,user3,"Rev user2",-1);
       expect(paperA.reviews()).toHaveLength(2);

       expect(paperA.score(true)).toBeCloseTo(-0.6666)

   })
})