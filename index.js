// object 
function validator(options) {

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            } else {
                element = element.parentElement;
            }
        }
    }
    
    var selectorRules = {};
    
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Take rules from selector
        var rules = selectorRules[rule.selector];
       
        // loop per rule (check rule)
        // if error, stop checking
       for(var i = 0; i < rules.length; i++) {
           switch(inputElement.type) {
               case 'radio':
               case 'checkbox':
                   errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                //    console.log(errorMessage);
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
           }
           if(errorMessage) break;
       }
        
        if(errorMessage) {
            errorElement.innerHTML = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }

    // take element which need validate
    var formElement = document.querySelector(options.form);
    if(formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault();
///////////////////////////////////////////////////////////////////////////
            var isFormValid = true;
            // loop per rule and validate
            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });
         
////////////////////////////////////////////////////////////////////////////
            if(isFormValid) {
                // Submit by using javascript
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
            
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        values[input.name] = input.value
                        return values;  
                    }, {});
                    options.onSubmit(formValues);
                }
                /// Submit by using form element 
                else {
                    formElement.submit();
                }
            }
        }
        options.rules.forEach((rule) => {
            
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } 
            else {
                // Save rules into selectorRules
                selectorRules[rule.selector] = [rule.test];
            } 

            var inputElement = formElement.querySelector(rule.selector);
         
            if(inputElement) {
                // handle blur out of input element
                inputElement.onblur = () => {
                   validate(inputElement, rule);
                }

                // handle typing
                inputElement.oninput = () => {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
                    errorElement.innerHTML = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            }
        });
    }
}

//Define rules
//Law of rules ==> if errors, return massages. Else if non errors, return nothing
validator.isRequired = (selector, massage) => {
    return {
        selector,
        test: function (value) {
            return value ? undefined : massage || 'Vui lòng nhâp trường này!!!!';
        }
    }
}

validator.isEmail = (selector, massage) => {
    return {
        selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : massage || 'Trường này phải là email!!';
        }
    }
}

validator.isPassword = (selector, min, massage) => {
    return {
        selector,
        test: function (value) {
            if(value) {
                return value.length >= min? undefined : massage || 'Mật khẩu phải có độ dài tối thiểu là 6 kí tự!!!';
            }
            else {
                return 'Vui lòng nhập mật khẩu!!!';
            }
        }
    }
}

validator.isConfirmed = (selector, getConfirmValue, massage) => {
    return {
        selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : massage || 'Giá trị nhập vào không chính xác!!!';
        }
    }
}
 