export const normaliserDate = date => {
  const dateObj = new Date(date);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let dt = dateObj.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return `${dt}/${month}/${year}`;
};

export default normaliserDate;
