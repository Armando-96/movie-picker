function validateForm() {
  var password = document.forms["form_utente"]["password"].value;
  var confirm_password =
    document.forms["form_utente"]["confirm_password"].value;

  if (password != confirm_password) {
    alert("Le password non coincidono");
    return false;
  } else return true;
}
