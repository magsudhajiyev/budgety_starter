var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(e){
            sum = sum + e.value;
        });
        data.total[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentege: -1
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            //Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            //Push it into data structer
            data.allItems[type].push(newItem);
            //return new element
            return newItem;
        },

        calculateBudget: function(){
            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;
            
            //Calculate the percentege of income that we spent
            if(data.total.inc > 0){
                data.percentege = Math.round((data.total.exp / data.total.inc)) * 100;
            }else{
                data.percentege = -1;
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentege: data.percentege
            }
        },
    }
})();

var UIControler = (function (){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        incomeLabel: '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentegeLabel : '.budget__expenses--percentage',
        budgetLabel : '.budget__value'

        
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            var html, newHTML, element;
            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">+ %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';

            } else if(type === 'exp'){
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            // Replace placeholder text with actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            
            // Insert HTML inte the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },

        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
        },

        displayBudget: function(obj){
        document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

        if(obj.percentege > 0){
            document.querySelector(DOMStrings.percentegeLabel).textContent = obj.percentege + '%';

        }else{
            document.querySelector(DOMStrings.percentegeLabel).textContent = "---";

        }
        },
        
        getDOMstrings: function(){
            return DOMStrings;
        }
    }

})();

var controller = (function (budgetCtrl, UICtrl){ 

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function(){
        //Calculate the budget
        budgetCtrl.calculateBudget();

        //Return the budget
        var budget = budgetCtrl.getBudget();

        //Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var ctrlAddItem = function(){
        var input, newItem;

        // Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //Add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);

            //Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //Calculate the budget
            updateBudget();
            //Display the budget on the UI
        }
    };

    return{
        init: function(){
            setupEventListeners();
        }
    };

})(budgetController, UIControler);

controller.init();