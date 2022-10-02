const getDateString = (date: Date | undefined) => {
  if (date === undefined) {
    return "";
  } else {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  }
};

export default getDateString;
