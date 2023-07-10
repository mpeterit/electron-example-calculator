function validateBaseValueInput(inputElement) {
  console.log("validateBaseValueInput started for element:", inputElement.id);
  return new Promise((resolve) => {
    inputElement.value = parseInt(inputElement.value);
    if (inputElement.value > 200000) {
      inputElement.value = 200000;
    } else if (inputElement.value < 0) {
      inputElement.value = 0;
    }

    resolve();
  });
}
