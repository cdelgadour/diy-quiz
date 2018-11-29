let model = {
    data: [{
        theme: 'Math',
        questionList: [['nameofquestion', 'answer of question']]
    },
        {
            theme: 'Physics',
            questionList: [['nameofquestion','answer of question2']]
    }],

    init: function() {
        if (!localStorage.data) {
            localStorage.clear();
            localStorage.data = JSON.stringify([]);
        } else {
            model.data = JSON.parse(localStorage.data);
        }
    },

    addQuestion: function(question, answer, subject) {
        for (let item of this.data) {
            if (item.theme === subject) {
                item.questionList.push([question, answer]);
            }
        }
    }
};

let controller = {
    currentSubject: '',

    init: function() {
        model.init();
        view.init();
    },

    chooseSubject: function(subject) {
        for (let item of model.data) {
            if (item.theme === subject) {
                this.currentSubject = subject;
                return console.log(item);
            }
        }
    },

    addQuestion: function(question, answer) {
        model.addQuestion(question, answer, this);
    }
};

let view = {};

