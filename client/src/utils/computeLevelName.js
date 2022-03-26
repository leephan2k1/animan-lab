const computeRoleName = (points) => {
  if (points >= 50 && points < 100) {
    return "Thạc sĩ wibu";
  }
  if (points >= 100 && points < 300) {
    return "Tiến sĩ Otachym";
  }
  if (points >= 300 && points < 500) {
    return "Giáo sư weeaboo";
  }
  if (points >= 500 && points < 1000) {
    return "Lãnh tụ tinh thần wibu";
  }
  if (points >= 1000) {
    return "Đấng cứu thế wibu được Isekai";
  }
  return "Con dân wibu";
};

export default computeRoleName;
