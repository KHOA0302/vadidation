// object 
function validator(options) {

    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        if(errorMessage) {
            errorElement.innerHTML = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    // take element which need validate
    var formElement = document.querySelector(options.form);
    if(formElement) {
        options.rules.forEach((rule) => {
            var inputElement = formElement.querySelector(rule.selector);
         
            if(inputElement) {
                // handle blur out of input element
                inputElement.onblur = () => {
                   validate(inputElement, rule);
                }

                // handle typing
                inputElement.oninput = () => {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        })
    }
}

//Define rules
//Law of rules ==> if errors, return massages. Else if non errors, return nothing
validator.isRequired = (selector) => {
    return {
        selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhâp trường này!!!!';
        }
    }
}

validator.isEmail = (selector) => {
    return {
        selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email!!';
        }
    }
}

validator.isPassword = (selector, min) => {
    return {
        selector,
        test: function (value) {
            if(value) {
                return value.length >= min? undefined : 'Mật khẩu phải có độ dài tối thiểu là 6 kí tự!!!';
            }
            else {
                return value.trim()? undefined : 'Vui lòng nhâp mật khẩu!!!';
            }
        }
    }
}