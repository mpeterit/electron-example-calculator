// The function validates the input of the percentage fields.
function validatePercentageInput(inputElement) {
  console.log("validateInput started");

  return new Promise((resolve) => {
    inputElement.value = parseInt(inputElement.value); // Parse the input value to integer
    // Check if the input value is within the valid range 0-100
    if (inputElement.value > 100) {
      inputElement.value = 100;
    } else if (inputElement.value < 0) {
      inputElement.value = 0;
    }

    resolve();
  });
}

// The function adjusts the values of the percentage fields to ensure their sum equals 100.
function adjustPercentageValues(event, secondaryTargetId) {
  console.log("adjustPercentageValues started");

  return new Promise((resolve) => {
    const targetElement = event.target;
    const secondaryTargetElement = document.getElementById(secondaryTargetId);
    const passiveElement = document.getElementById("percentage-three");

    // Get the start values of each percentage field
    const targetStartValue = parseInt(targetElement.value);
    const secondaryTargetStartValue = parseInt(secondaryTargetElement.value);
    const passiveStartValue = parseInt(passiveElement.value || 0);

    // If any of the start values is not a number, clear the passive element
    if (isNaN(targetStartValue) || isNaN(secondaryTargetStartValue)) {
      passiveElement.value = "";
    } else {
      // Calculate the difference between the sum of the start values and 100
      const differenceSumHundred = targetStartValue + secondaryTargetStartValue + passiveStartValue - 100;

      // If the difference is greater than the passive start value, adjust the secondary target element
      if (passiveStartValue - differenceSumHundred < 0) {
        passiveElement.value = 0;
        secondaryTargetElement.value = secondaryTargetStartValue + passiveStartValue - differenceSumHundred;
      } else {
        // If the difference is less than or equal to the passive start value, adjust the passive element
        passiveElement.value = passiveStartValue - differenceSumHundred;
      }
    }

    resolve();
  });
}
