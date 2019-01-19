/*
 * */

let model = {
   /* data: [{
        theme: 'Math',
        questionList: [['nameofquestion', 'answer of question']]
    },
        {
            theme: 'Physics',
            questionList: [['nameofquestion','answer of question2']]
    }],*/

    init: function() {
        if (localStorage.data) {
            model.data = JSON.parse(localStorage.data);
        } else {
            model.data = [];
        }
    },

    saveToStorage: () => {
        localStorage.data = JSON.stringify(model.data);
    },

    addQuestion: function(question, answer, subject) {
        for (let item of this.data) {
            if (item.theme === subject) {
                item.questionList.push([question, answer]);
            }
        }
        this.saveToStorage();
    },

    removeQuestion: function(index, subject) {
        for (let item of this.data) {
            if (item.theme === subject) {
                item.questionList.splice(index, 1);
            }
        }
        this.saveToStorage();
    },

    editQuestion: function(index, question, answer, subject) {
        for (let item of this.data) {
            if (item.theme === subject) {
                item.questionList[index][0] = question;
                item.questionList[index][1] = answer;

            }
        }
        this.saveToStorage();
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
        this.chooseSubject(newSubject);
    },

    chooseSubject: function(subject) {
        this.currentSubject = subject;
    },

    add: function(question, answer) {
        model.addQuestion(question, answer, this.currentSubject);
    },

    removeQuestion: function (index) {
        model.removeQuestion(index, this.currentSubject);
        view.renderQuestions();
    },

    /*
    * TODO: Elemino el elemento
    * TODO: Tengo que seleccionar otro como */

    removeSubject: function(){
        model.data.forEach((element, index) => {
            if (element.theme === this.currentSubject) {
                model.data.splice(index, 1);
                this.chooseSubject('');
            }
        });
    },

    edit: function(index, newQuestion, newAnswer) {
        model.editQuestion(index, newQuestion, newAnswer, this.currentSubject);
        /*view.updateSubjectList();*/
    },

    getAllData: function() {
        return model.data;
    },

    getDataBySubject: function() {
       for (let item of model.data) {
           if (item.theme === this.currentSubject) return item.questionList;
       }
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
                view.updateSubjectList(false);
                view.renderQuestions();
            }
        });

        this.deleteSubject = document.querySelector('#delete-subject');
        this.deleteSubject.addEventListener('click', () => {
            if (controller.currentSubject !== ''){
                controller.removeSubject();
                view.updateSubjectList();
                view.renderQuestions();
            }
        });

        this.addQuestionBttn = document.querySelector('#add-question');
        this.addQuestionBttn.addEventListener('click', () => {
            let questionText = document.querySelector('#question-area');
            let answerText = document.querySelector('#answer-area');

            controller.add(questionText.value, answerText.value);
            questionText.value = '';
            answerText.value = '';
            view.renderQuestions();
        });

        this.subjectList.onchange = function(subjectList) {
            controller.chooseSubject(subjectList.target.value);
            view.renderQuestions();
        }
    },

    updateSubjectList: function(defaultPosition = true) {
        this.subjectList.innerHTML = '';
        let nullSubject = document.createElement('option');
        nullSubject.value = '-';
        nullSubject.textContent = '-';
        this.subjectList.appendChild(nullSubject);

        for (let item of controller.getAllData()) {
            let subjectElement = document.createElement('option');
            subjectElement.value = item.theme;
            subjectElement.textContent = `${item.theme}`;

            this.subjectList.appendChild(subjectElement);
        }

        if (defaultPosition) this.subjectList.options.selectedIndex = 0;
        else this.subjectList.options.selectedIndex = this.subjectList.length - 1;
    },

    renderQuestions: function() {
        let data = controller.getDataBySubject();

        document.querySelector('#all-questions').innerHTML = '';

        if (data) {
            let questionContainer = document.createElement('ul');
            let index = 0;

            for (let questionAnswer of data) {

                let item = document.createElement('li');
                item.index = index;


                item.innerHTML = `<span class="info-box">
                <h2 class="question-text">${questionAnswer[0]}</h2>
                <h3 class="answer-text">${questionAnswer[1]}</h3>
                </span>
                <span class="button-box">
                <button class="edit">Edit</button>
                <button class="remove">Remove</button>
                </span>`;

                questionContainer.appendChild(item);
                index++;
            }
            questionContainer.addEventListener('click', editBttn);
            questionContainer.addEventListener('click', removeBttn);
            document.querySelector('#all-questions').appendChild(questionContainer);
        }
    },
};
controller.init();

function editBttn(e) {
    if (e.target.textContent === 'Edit'){
        e.stopPropagation();
        let parent = e.srcElement.parentElement.parentElement;
        let questionText = parent.firstChild.childNodes[1].textContent;
        let answerText = parent.firstChild.childNodes[3].textContent;

        let newQuestion, newAnswer;
        newQuestion = prompt('Edit question', questionText);
        if (newQuestion !== null) {
            newAnswer = prompt('Edit answer', answerText);
            if (newAnswer !== null) {
                controller.edit(parent.index, newQuestion, newAnswer);
                view.renderQuestions()
            }
        }
    }
}

function removeBttn(e) {
    if (e.target.textContent === 'Remove'){
        e.stopPropagation();
        let parent = e.srcElement.parentElement.parentElement;
        controller.removeQuestion(parent.index);
    }
}

/*Cuando yo uso edit no se actualiza porque yo no tengo nada para actualizarlo. Lo que yo tengo para actualizar
* el view, es el evento que yo puse cuando se cambiara el subjectList. El llama a la funcion render questions*/
