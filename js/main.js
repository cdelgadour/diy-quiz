let model = {
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

    removeSubject: function(){
        model.data.forEach((element, index) => {
            if (element.theme === this.currentSubject) {
                model.data.splice(index, 1);
                this.chooseSubject('-');
            }
        });
    },

    edit: function(index, newQuestion, newAnswer) {
        model.editQuestion(index, newQuestion, newAnswer, this.currentSubject);
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
                document.getElementById('play-quiz').disabled = true;
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

        this.subjectList.onchange = function(e) {
            controller.chooseSubject(e.target.value);
            document.getElementById('play-quiz').disabled = e.target.value === '-';
            view.renderQuestions();
        };

        document.getElementById('play-quiz').disabled = true;
        document.getElementById('play-quiz').onclick = () => {
            document.querySelector('.quiz-area').classList.toggle('active-quiz');
            document.querySelector('.main').classList.toggle('inactive');
            quizView.init();
        };
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
        if (data) this.enablePlayButton(data.length < 1);


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

    enablePlayButton: function(enable) {
        document.getElementById('play-quiz').disabled = enable;
    }
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

let quizView = {
    init: function() {
        let quizViewData = controller.getDataBySubject().map(x => x);

        document.querySelector('#question-view').textContent = quizViewData[0][0];
        document.querySelector('#answer-view').textContent = quizViewData[0][1];
        quizViewData.splice(0, 1);

        document.querySelector('#next').disabled = false;
        document.querySelector('#answer-view').style.visibility = 'hidden';

        //Button Events
        document.querySelector('#flip').onclick = () => {
            document.querySelector('#answer-view').style.visibility = 'visible';
        };
        document.querySelector('#next').onclick = () => {
            let data = quizViewData[Math.floor(Math.random()*quizViewData.length)];
            if (!data) {
                document.querySelector('#next').disabled = true;
            } else {
                document.querySelector('#answer-view').style.visibility = 'hidden';
                document.querySelector('#question-view').textContent = data[0];
                document.querySelector('#answer-view').textContent = data[1];
                quizViewData.splice(quizViewData.indexOf(data), 1);
            }
        };

        document.querySelector('#quit').onclick = () => {
            quizView.exitQuizView();
        };

    },
    exitQuizView: function() {
        document.querySelector('.quiz-area').classList.toggle('active-quiz');
        document.querySelector('.main').classList.toggle('inactive');
    }
};
