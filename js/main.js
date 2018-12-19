/*
   TODO: validar en el edit function para que no llame la funcion cuando el prompt sea cancel
   TODO: el ok del prompt me esta actualizando la pagina.Tengo que parar eso. Cuando le doy click, vuelvo a math.
 * TODO: remove function
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
        this.currentSubject = '';
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
        this.chooseSubject('');
        view.updateSubjectList();
    },

    edit: function(index, newQuestion, newAnswer) {
        model.editQuestion(index, newQuestion, newAnswer, this.currentSubject);
        /*view.updateSubjectList();*/
    },

    getAllData: function() {
        return model.data;
    },

    getDataBySubject: function(subject) {
        return model.data
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
                view.updateSubjectList();
            }
        });

        this.deleteSubject = document.querySelector('#delete-subject');
        this.deleteSubject.addEventListener('click', () => {
            if (controller.currentSubject !== ''){
                controller.removeSubject();
            }
        });

        this.addQuestionBttn = document.querySelector('#add-question');
        this.addQuestionBttn.addEventListener('click', () => {
            let questionText = document.querySelector('#question-area');
            let answerText = document.querySelector('#answer-area');

            controller.add(questionText.value, answerText.value);
            questionText.value = '';
            answerText.value = '';
            this.subjectList.onchange();
        });
        this.createEvents(this.subjectList);
    },

    updateSubjectList: function() {
        this.subjectList.innerHTML = '';
        for (let item of controller.getAllData()) {
            let subjectElement = document.createElement('option');
            subjectElement.value = item.theme;
            subjectElement.textContent = `${item.theme}`;

            this.subjectList.appendChild(subjectElement);
        }
    },

    updateQuestions: function() {

    },

    /*TODO: Lamberme esta funcion*/
    createEvents: function(subjectList) {
        subjectList.onchange = function() {
            if (subjectList.value !== '-') {
                let data = controller.chooseSubject(subjectList.value);
                view.renderQuestions(data);
            }
        }
    },

    renderQuestions: function(data) {
        document.querySelector('#all-questions').innerHTML = '';

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
        document.querySelector('#all-questions').appendChild(questionContainer);

        //this.assignBttnEvents();
    },

    /*assignBttnEvents: function() {
       poner el evento sobre ul
        discriminar por e target
        dependiendo del target se accesa al parent, parent
    }*/
};
controller.init();

function editBttn(e) {
    if (e.target.textContent === 'Edit'){
        e.stopPropagation();
        let parent = e.srcElement.parentElement.parentElement;
        let questionText = parent.firstChild.childNodes[1].textContent;
        let answerText = parent.firstChild.childNodes[3].textContent;
        console.log(questionText, answerText);
        console.log(parent.index);

        let newQuestion, newAnswer;
        newQuestion = prompt('Edit question', questionText);
        console.log(newQuestion);
        newAnswer = prompt('Edit answer', answerText);

        if (newQuestion !== null && newAnswer !== null) {
            controller.edit(parent.index, newQuestion, newAnswer);
        }

    }
}

/*Cuando yo uso edit no se actualiza porque yo no tengo nada para actualizarlo. Lo que yo tengo para actualizar
* el view, es el evento que yo puse cuando se cambiara el subjectList. El llama a la funcion render questions*/
