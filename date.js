module.exports = getDate;

function getDate(){
let today = new Date();
// var currentDay = today.getDay();
// var dayList = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// var day = dayList[currentDay];
let option = {
  weekday: "long",
  day: "numeric",
  month: "long"
};
let day = today.toLocaleDateString("en-PH", option);
return day;
}
