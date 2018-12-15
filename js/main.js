/*
 * TODO: Addsubject button
 * TODO: Each item's buttons (edit, delete)
 * TODO: add question button
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

    /*init: function() {
        if (!localStorage.data) {
            localStorage.clear();
            localStorage.data = JSON.stringify([]);
        } else {
            model.data = JSON.parse(localStorage.data);
        }
    },*/

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
        /*model.init();*/
        view.init();
    },

    addSubject: function(newSubject) {
        model.data.push({theme: newSubject, questionList: []});
    },

    chooseSubject: function(subject) {
        for (let item of model.data) {
            if (item.theme === subject) {
                this.currentSubject = subject;
                return (item.questionList);
            }
        }
    },

    add: function(question, answer) {
        model.addQuestion(question, answer, this.currentSubject);
    },

    removeQuestion: function (index) {
        model.removeQuestion(index, this.currentSubject);
    },

    removeSubject: function(){
        model.data.forEach((element, index) => {
            if (element.theme === this.currentSubject) {
                model.data.splice(index, 1);
            }
        })
    },

    edit: function(index, newQuestion, newAnswer) {
        model.editQuestion(index, newQuestion, newAnswer, this.currentSubject);
    },

    getAllData: function() {
        return model.data;
    }
};

let view = {
    init: function() {
        this.subjectList = document.querySelector('#exam-themes');

        for (let item of controller.getAllData()) {
            let subjectElement = document.createElement('option');
            subjectElement.value = item.theme;
            subjectElement.textContent = `${item.theme}`;

            this.subjectList.appendChild(subjectElement);
        }

        this.addSubject = document.querySelector('#add-subject');
        this.addSubject.addEventListener('click', function(){
            let promptAnswer = prompt();
            if (promptAnswer != null && promptAnswer !== '') {
                controller.addSubject(promptAnswer);
                view.updateView();
            }
        });

        this.deleteSubject = document.querySelector('#delete-subject');
        this.deleteSubject.addEventListener('click', () => {
            if (controller.currentSubject !== ''){
                controller.removeSubject();
                this.updateView();
            }
        });



        this.createEvents(this.subjectList);
    },

    updateView: function() {
        this.subjectList.innerHTML = '';
        for (let item of controller.getAllData()) {
            let subjectElement = document.createElement('option');
            subjectElement.value = item.theme;
            subjectElement.textContent = `${item.theme}`;

            this.subjectList.appendChild(subjectElement);
        }
    },

    createEvents: function(subjectList) {
        subjectList.onchange = function() {
            if (subjectList.value !== '-') {
                let data = controller.chooseSubject(subjectList.value);
                view.renderQuestions(data);
            }
        }
    },

    renderQuestions: function(data) {
        document.querySelector('.main').innerHTML = '';

        let questionContainer = document.createElement('ul');

        for (let questionAnswer of data) {

            let item = document.createElement('li');

            item.innerHTML = `<span class="info-box">
                <h2 class="question-text">${questionAnswer[0]}</h2>
                <h3 class="answer-text">${questionAnswer[1]}</h3>
                </span>
                <span class="button-box">
                <button class="play"></button>
                <button class="edit"></button>
                <button class="remove"></button>
                </span>`;

            questionContainer.innerHTML += item.innerHTML;
        }
        document.querySelector('.main').appendChild(questionContainer);
    }
};

controller.init();
