/*
 * todo: view.init and render
 * todo: view adding questions, removing questions, editing questions
 * */

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
    },

    editQuestion: function(index, question, answer, subject) {
        for (let item of this.data) {
            if (item.theme === subject) {
                item.questionList[index][0] = question;
                item.questionList[index][1] = answer;

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

    addSubject: function(newSubject) {
        model.data.push({theme: newSubject, questionList: []});
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
    },

    edit: function(index, newQuestion, newAnswer) {
        model.editQuestion(index, newQuestion, newAnswer, this.currentSubject);
    },

    getAllData: function() {
        return model.data;
    }
};

let view = {
    init: (function() {
        this.subjectList = document.querySelector('#exam-themes');

        for (let item of controller.getAllData()) {
            let subjectElement = document.createElement('option');
            subjectElement.value = item.theme;
            subjectElement.textContent = `${item.theme}`;

            this.subjectList.appendChild(subjectElement);
        }

        this.createEvents();

    })(),

};

