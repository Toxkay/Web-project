let userInput = document.querySelector("[name='username']");
let userError = document.getElementById("user-error");

function flashIt(element) {
  element.classList.remove("error");
  void element.offsetWidth;
  element.classList.add("error");
}

document.forms[0].onsubmit = function (e) {
  let userValid = false;

  if (userInput.value !== "" && userInput.value.length <= 10) {
    userValid = true;
  } else {
    userError.textContent = "You must write your full name";
    flashIt(userError);
  }

  if (!userValid) {
    e.preventDefault();
  }
};
