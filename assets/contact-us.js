/******************** contact-us page js ****************************/
document.getElementById("cstm_btn").setAttribute("disabled", true);
let allInputs = document.querySelectorAll(".field__input");
// console.log("allinputs---->", allInputs);

allInputs.forEach((item) => {
  item.addEventListener("keyup", function (e) {
    if (e.target.value.length > 0) {
      item.nextElementSibling.innerText = "";
    } else {
      item.nextElementSibling.innerText = `Please Enter Valid ${item.getAttribute(
        "placeholder"
      )}`;
    }
    let allInputsHaveValue = Array.from(
      document.querySelectorAll(".field__input")
    )
      .slice(1, allInputs.length)
      .every((item) => item.value);
    // console.log("allInputsHaveValue", allInputsHaveValue);
    if (allInputsHaveValue) {
      document.getElementById("cstm_btn").removeAttribute("disabled");
    }
  });
});

let selectTags = document.querySelectorAll(".select__select");
// console.log(selectTags);
selectTags[0].addEventListener("change", function () {
  selectTags[1].nextElementSibling.innerText = "Please select reason";
});

selectTags[1].addEventListener("change", function () {
  selectTags[1].nextElementSibling.innerText = "";
});

document.querySelectorAll(".contact-form").forEach((item) => {
  item.addEventListener("keyup", function (e) {
    let nameval = document.querySelector(".field__input_name").value;

    if (!/^[A-Za-z\s]+$/.test(nameval)) {
      event.preventDefault();
      document.getElementById("error1").innerHTML = "Enter a valid Name.";
    } else {
      document.getElementById("error1").innerHTML = "";
    }
  });
});

document.querySelectorAll(".contact-form").forEach((item) => {
  item.addEventListener("keyup", function (e) {
    let email = document.querySelector(".field__input_Email").value;
    if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
      document.getElementById("error").innerHTML = "Please Enter Valid Emails";
    } else {
      document.getElementById("error").innerHTML = "";
    }
  });
});
document.querySelectorAll(".contact-form").forEach((item) => {
  item.addEventListener("keyup", function (e) {
    let mobilval = document.querySelector(".field__input_mobile").value;
    if (!/^\d{10}$/.test(mobilval)) {
      document.getElementById("error2").innerHTML =
        "Please Enter Valid Phone number";
    } else {
      document.getElementById("error2").innerHTML = "";
    }
  });
});
/******************** contact-us page js end ****************************/
