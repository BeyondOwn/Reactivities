export function convertUTCDateToLocalDate(date:Date) {
  if (!(date instanceof Date)) {
      throw new Error("The provided value is not a Date object.");
    }

    console.log(date);
    console.log("hours: ",date.getHours());
  var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;   
}