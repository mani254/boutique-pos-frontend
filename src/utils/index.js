import { v4 as uuidv4 } from 'uuid';

export const generateRandom6DigitNumber = () => {
   const uuid = uuidv4();
   const random6Digit = parseInt(uuid.replace(/[^0-9]/g, '').slice(0, 5));
   return random6Digit;
};

export function getFormattedDateTime() {
   let now = new Date();

   let monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

   let day = now.getDate();
   let monthIndex = now.getMonth();
   let year = now.getFullYear();
   let hours = now.getHours();
   let minutes = now.getMinutes();
   let seconds = now.getSeconds();

   let month = monthNames[monthIndex];

   if (day < 10) {
      day = "0" + day;
   }
   if (hours < 10) {
      hours = "0" + hours;
   }
   if (minutes < 10) {
      minutes = "0" + minutes;
   }
   if (seconds < 10) {
      seconds = "0" + seconds;
   }
   let formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
   return formattedDateTime;
}

export function convertAmountToWords(amount) {

   const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
   const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

   const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

   function twoDigitsToWords(num) {
      if (num < 10) {
         return units[num];
      } else if (num < 20) {
         return teens[num - 10];
      } else {
         let ten = Math.floor(num / 10);
         let unit = num % 10;
         return tens[ten] + (unit !== 0 ? " " + units[unit] : "");
      }
   }

   // Function to convert a three-digit number to words
   function threeDigitsToWords(num) {
      let hundred = Math.floor(num / 100);
      let remainder = num % 100;
      let words = "";

      if (hundred !== 0) {
         words += units[hundred] + " hundred";
         if (remainder !== 0) {
            words += " ";
         }
      }

      if (remainder !== 0) {
         words += twoDigitsToWords(remainder);
      }

      return words;
   }

   function numberToWords(num) {
      if (num === 0) {
         return "zero";
      }

      let words = "";
      let billion = Math.floor(num / 1000000000);
      let million = Math.floor((num % 1000000000) / 1000000);
      let thousand = Math.floor((num % 1000000) / 1000);
      let remainder = num % 1000;

      if (billion !== 0) {
         words += threeDigitsToWords(billion) + " billion ";
      }
      if (million !== 0) {
         words += threeDigitsToWords(million) + " million ";
      }
      if (thousand !== 0) {
         words += threeDigitsToWords(thousand) + " thousand ";
      }
      if (remainder !== 0) {
         words += threeDigitsToWords(remainder);
      }

      return words.trim();
   }

   return numberToWords(amount);
}

export function validateField(fieldName, value) {
   let errorMessage = '';
   switch (fieldName) {
      case 'name':
         if (!value || value.length < 3 || value.length > 40) {
            errorMessage = 'Name must be between 3 and 40 characters';
         }
         break;
      case 'address':
         if (!value || value.length < 5 || value.length > 100) {
            errorMessage = 'Address must be between 5 and 100 characters';
         }
         break;
      case 'location':
         const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
         if (!urlPattern.test(value)) {
            errorMessage = 'Please enter a valid URL';
         }
         break;
      default:
         break;
   }
   return errorMessage;
}
