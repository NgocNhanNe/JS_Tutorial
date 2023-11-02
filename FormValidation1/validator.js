//ham validator
function Validator(options){

    function getParent(element, selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    //ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMsg;

        //lay ra cac rules cua selector
        var rules = selectorRules[rule.selector];

        //lap qua tung rule (check)
        for(var i = 0; i < rules.length; ++i){
            switch(inputElement.type)   {
                case 'checkbox':
                case 'radio':
                    errorMsg = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMsg = rules[i](inputElement.value);
            }
            if(errorMsg) break;
        }

        if(errorMsg){
            errorElement.innerText = errorMsg
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        }
        else{
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }

        return !errorMsg;
    }

    //lay element cua form
    var formElement = document.querySelector(options.form);
    if(formElement){

        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            //thuc hien lap qua tung rule va validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid){
                    isFormValid = false;
                }
            });

            
            if(isFormValid){
                //truong hop submit voi js
                if(typeof options.onSubmit === 'function'){
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
                    options.onSubmit(formValues)
                }
                else {
                    formElement.submit();
                }
            }

        }

        //xu li lap qua moi rule va xu li
        options.rules.forEach(function(rule){
            //luu lai cac rules
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];
            }


            var inputElements = formElement.querySelectorAll(rule.selector);
            
            Array.from(inputElements).forEach((inputElement) => {
                if(inputElement){
                    //xu li truong hop blur khoi input
                    inputElement.onblur = function() {
                        validate(inputElement, rule);
                    }
    
                    //xu li moi khi nguoi dung nhap vao input
                    inputElement.oninput = function() {
                        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
                        errorElement.innerText = '';
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                    }
                }
            })

            
        })
    }
}

//dinh nghia cac rules
//nguyen tac cua cac rules:
//1. khi co loi thi tra ra msg loi
//2. khi hop le thi k tra ra cai gi ca (undifined)
Validator.isRequired = function(selector, msg) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : msg || 'Vui long nhap truong nay'
        }
    }
}

Validator.isEmail = function(selector, msg) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : msg || 'Truong nay phai la email'
        }
    }
}

Validator.minLength = function(selector, min, msg) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : msg || `Vui long nhap toi thieu ${min} ki tu`;
        }
    }
}

Validator.isConfirmPassword = function(selector, getConfirmPasswordValue, msg) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmPasswordValue() ? undefined : msg || 'Gia tri nhap vao khong chinh xac'
        }
    }
}