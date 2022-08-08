/* eslint class-methods-use-this: "off" */
import React from 'react';

const Helper = {
    generateUniquKey() {
        let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
	    do {
	        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
	        const ascicode = Math.floor((Math.random() * 42) + 48);
	        if (ascicode < 58 || ascicode > 64) {
	            // exclude all chars between : (58) and @ (64)
	            idstr += String.fromCharCode(ascicode);
	        }
	    } while (idstr.length < 10);

	    return (idstr);
	    },

	  errorTooltip(error) {
        return (<div key={`error${error.id}`} className="error-tool-tip"><svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink"><use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-exclamation-circle`} /></svg>{error.message}</div>);
    },

    error(error){
        return (<div key={`error${error.id}`} className="error-text"><svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink"><use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-exclamation-circle`}  /></svg>{error.message}</div>);
    },

    LuhnCheck(str) {
        var luhnArr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
        var counter = 0;
        var incNum;
        var odd = false;
        var temp = String(str).replace(/[^\d]/g, "");
        if ( temp.length == 0) {
            return false;
        }

        var firstNum = parseInt(temp.charAt(0), 10);

        if(!(firstNum ==3 || firstNum ==4 || firstNum ==5)){
            return false;
        }
        for (var i = temp.length-1; i >= 0; --i) {
            incNum = parseInt(temp.charAt(i), 10);
            counter += (odd = !odd)? incNum : luhnArr[incNum];
        }
        return (counter%10 == 0);
    },

    formatMoney(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d == undefined ? "." : d,
                t = t == undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
        const retVal =  s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        return retVal;
    },

    checkCardType(cardNumber){
       var firstNum = cardNumber.charAt(0);
       let cardType = '';
       switch(firstNum){
         case '3':
         cardType = 'AX';
         break;

         case '4':
         cardType = 'VI';
         break;

         case '5':
         cardType = 'MC';
         break;

         default:
         break;
       }
       return cardType;
    },

   
    remove(array, element) {
        return array.filter(e => e !== element);
    },

    decodeHtmlEntity(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    },

    encodeHtmlEntity(str) {
      var buf = [];
      for (var i=str.length-1;i>=0;i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
      }
      return buf.join('');
    },

   
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },

    number_format(number, decimals, decPoint, thousandsSep) {
      decimals = Math.abs(decimals) || 0;
      number = parseFloat(number);

      if (!decPoint || !thousandsSep) {
          decPoint = '.';
          thousandsSep = ',';
      }

      var roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
      var numbersString = decimals ? (roundedNumber.slice(0, decimals * -1) || 0) : roundedNumber;
      var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
      var formattedNumber = "";

      while (numbersString.length > 3) {
          formattedNumber = thousandsSep + numbersString.slice(-3) + formattedNumber;
          numbersString = numbersString.slice(0, -3);
      }

      if (decimals && decimalsString.length === 1) {
          while (decimalsString.length < decimals) {
              decimalsString = decimalsString + decimalsString;
          }
      }

      return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
  },

  checkIsDecimal(number){
     return (parseFloat(number) != parseInt(number));
  },

  calcCibcPoint(fare) {
    return Math.floor(parseFloat(fare)*CIBC_POINTS_INCR);
  },

  calcHsbcPoint(fare) {
    return Math.floor(parseFloat(fare)*1000);
  },

};

export default Helper;
