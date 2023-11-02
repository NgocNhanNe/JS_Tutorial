function Validator(formSelector) {

    var _this = this;
    var formRules = {};

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }


    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui long nhap truong nay';
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Truong nay phai la email'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui long nhap it nhat ${min} ki tu`;
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui long nhap toi da ${max} ki tu`;
            }
        }
    };

    var formElement = document.querySelector(formSelector);
    
    //chi xu li khi co element
    if (formElement) {

        var inputs = formElement.querySelectorAll('[name][rules]');

        for(var input of inputs) {

            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){

                var ruleInfor;
                var isRuleHasValue = rule.includes(':');
                
                if(isRuleHasValue){
                    ruleInfor = rule.split(':');
                    rule = ruleInfor[0];
                }

                var ruleFunc = validatorRules[rule];
                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfor[1])
                }

                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                }
                else{
                    formRules[input.name] = [ruleFunc];
                }
            }

            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        
        //ham xu li loi
        function handleValidate(e) {
            var rules = formRules[e.target.name];
            var errorMsg;

            for(var rule of rules){
                errorMsg = rule(e.target.value);
                if(errorMsg) break;
            }

            if(errorMsg) {
                var formGroup = getParent(e.target, '.form-group');
                if(formGroup){
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = errorMsg;
                    }
                }
            }

            return !errorMsg;
        }

        //ham clear error message
        function handleClearError(e) {
            var formGroup = getParent(e.target, '.form-group');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');

                if(formMessage){
                    formMessage.innerText = '';
                }
            }
        }
    }

    //xu li hanh vi submit form
    formElement.onsubmit = function(e) {
        e.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;

        for(var input of inputs) {
            if(!handleValidate({target: input})){
                isValid = false;
            } 
        }

        //khi khong co loi thi submit form
        if(isValid){
            if(typeof _this.onsubmit === 'function'){
                var enableInputs = formElement.querySelectorAll('[name]');
        
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        switch(input.type){
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    _this.onSubmit(formValues)
            } else{
                formElement.submit();
            }
        }
    }
}

