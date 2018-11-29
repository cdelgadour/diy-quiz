/*
* todo: model.removeQuestion
* todo: model.EditQuestion
 * todo: controller and model add new subject
 * todo: view.init and render
 * todo: view adding questions, removing questions, editing questions*/

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
    },

    removeQuestion: function(index, subject) {
        for (let item of this.data) {
            if (item.theme === subject) {
                item.questionList.splice(index, 1);
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

    add: function(question, answer) {
        model.addQuestion(question, answer, this.currentSubject);
    },

    remove: function (index) {
        model.removeQuestion(index, this.currentSubject);
    }
};

let view = {};

