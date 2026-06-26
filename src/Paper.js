const Review = require("./Review");

class Paper{
    constructor(title, authors, correspondingAuthor){
        if(!authors.includes(correspondingAuthor)) throw new Error("Corresponding author must be an author");
        this._title = title;
        this._reviews = [];
        this._authors = authors;
        this._correspondingAuthor = correspondingAuthor;
        this._accepted = false
    }
    title(){
        return this._title;
    }
    authors(){
        return this._authors;
    }
    correspondingAuthor(){
        return this._correspondingAuthor;
    }
    reviews(){
        return this._reviews;
    }
    isValid(){
        return (this._title !== "") && (this._authors.length > 0);
    }
    addReview(reviewer, review, score){
        if (this.reviewsCount() < this.constructor.allowedReviews)
            this._reviews.push(new Review(reviewer, review, score));
        else throw(new Error("Cannot allow any more reviews"))
    }
    reviewsCount(){
        return this.reviews().length;
    }
    score(){
        let sum = this.reviews().reduce( (partialSum, review) => partialSum + review.score(), 0 );
        if (this.reviewsCount() > 0){
            return sum / this.reviewsCount();
        }else{
            return 0;
        }
        
    }

    finalScore(){
        let sum = this.reviews().reduce( (partialSum, review) => partialSum + review.score(), 0 );
        if (this.reviewsCount() < 3){
            sum += (3 - this.reviewsCount()) * -3
            return sum / 3
        } else {
            return sum / this.reviewsCount();
        }
    }

    reviewFor(reviewer){
        return this._reviews.find( (suspect) => (suspect.reviewer()==reviewer));
    }

    reviewExistsFor(reviewer){
        return typeof(this.reviewFor(reviewer)) != "undefined";
    }

    acceptPaper(){
        this._accepted = true
    }

    declinePaper(){
        this._accepted = false
    }

    isAccepted(){
        return this._accepted
    }

    esAutor(reviewer){
        return this.authors().includes(reviewer);
    }

}

Paper.allowedReviews = 3;

module.exports = Paper;