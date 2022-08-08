export default class Validation {

    static isEmpty(data) {
       
        if (data == null || data == undefined || data == '' || typeof data == 'undefined')
            return true;
        else if(typeof data === 'string')
            if(data.trim() == '')
                return true;
            else
                return false;
        else
            return false;
        
    }

    static minLength(text, len) {
        return text.length >= len;
    }

    static maxLength(text, len) {
        return text.length <= len;
    }

    static validName(name) {
        // let reg = /^[A-Za-z-'\u007D-\u00FF\s]{1,28}$/;
        let reg = /^[a-zA-Z\,\(\)\/\s]{2,}$/;
        return reg.test(name);
    }

    static validLatLng(name) {
        let reg = /^(-?\d+(\.\d+)?)$/;
        return reg.test(name);
    }

    static validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static validPassword(password) {

        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,20})");
        return  re.test(password);
    
    }

    static validateLink(userInput) {
        
        // var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        var res = userInput.match(/(http(s)?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);

        if (res == null)
            return false;
        else
            return true;
    }

    static validateNumber(number) {
        // ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$

        // const re = /^[0-9\b]+$/;
        // const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      //  const re = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
      
     //const re = /^[\+][1]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      const re = /^(\+{0,})(\d{0,})?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(number);
    }

    
    static validateExtNumber(number) {
        // ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$

        // const re = /^[0-9\b]+$/;
        // const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      //  const re = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
      
     //const re = /^[\+][1]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      const re = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;
        return re.test(number);
    }

    static validatePostalCode(number) {
        console.log("Number-->",number);
        // ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$

        // const re = /^[0-9\b]+$/;
        // const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      //  const re = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
      
     //const re = /^[\+][1]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      const re = /^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])\ {0,1}(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/im;
        return re.test(number);
    }
}