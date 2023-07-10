// This function is triggered when an input changes.
async function onInputChange(event) {
  console.log("onInputChange is started.");

  // Check if the event is an object.
  if (isEventObject(event)) {
    const targetId = event.target.id;

    // If the target id is a percentage input, validate the input and adjust its values.
    if (targetId === "percentage-one" || targetId === "percentage-two") {
      await validatePercentageInput(event.target);
      const secondaryTargetId = targetId === "percentage-one" ? "percentage-two" : "percentage-one";
      await adjustPercentageValues(event, secondaryTargetId);
    } 
    // If the target id is a base value input, validate the input.
    else if (targetId === "base-value") {
      await validateBaseValueInput(event.target);
    }
  }

  console.log("Input field changed!");

  // Get the updated input data and send it to the main process.
  inputData = await getInputData();
  window.api.send("toMain", inputData);
}

// This function checks if the provided object is a trusted event.
function isEventObject(obj) {
  return typeof obj === "object" && obj !== null && "isTrusted" in obj && typeof obj.isTrusted === "boolean";
}

// This function retrieves the current input data.
function getInputData() {
  return new Promise((resolve) => {
    const baseValue = parseFloat(document.getElementById("base-value").value);
    const sampleRadioValues = document.querySelector("input[name='sample-radio-values']:checked")?.value;
    const percentageOne = getPercentageValueById("percentage-one");
    const percentageTwo = getPercentageValueById("percentage-two");
    const percentageThree = getPercentageValueById("percentage-three");
    const sliderValue = parseFloat(document.getElementsByClassName("noUi-handle")[0].getAttribute("aria-valuenow"));

    resolve({
      baseValue,
      sampleRadioValues,
      percentageOne,
      percentageTwo,
      percentageThree,
      sliderValue,
    });
  });
}

// Helper function to get and parse percentage values by id
function getPercentageValueById(id) {
  const percentageValue = parseFloat(document.getElementById(id).value);
  return isNaN(percentageValue) ? undefined : percentageValue;
}

const inputFields = document.querySelectorAll("input");
var slider = document.getElementById("slider-round");

// Add event listener for each input field.
inputFields.forEach((inputField) => {
  inputField.addEventListener("input", onInputChange);
});

// Add event listener for the slider.
slider.noUiSlider.on("update", onInputChange);
