class Review{
    constructor(reviewer, text, score){
        this._reviewer = reviewer;
        this._text = text;

        if (score <= 3 && score >= -3) 
            this._score = score;
        else
            throw(new Error("Score no permitido."))
    }
    reviewer(){
        return this._reviewer;
    }
    text(){
        return this._text;
    }
    score(){
        return this._score;
    }
    setScore(score){
        if (score <= 3 && score >= -3) 
            this._score = score;
        else
            throw(new Error("Score no permitido."))
    }
    setReview(review){
        this._text = review;
    }
}

module.exports = Review;