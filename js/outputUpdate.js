window.api.receive("fromMain", (data) => {
  console.log(`Received data from main process: ${data}`);
  console.log(data.output1String, data.output2String, data.output3String)
  updateOutputItems(data.output1String, data.output2String, data.output3String);
});

function updateOutputItems(output1String, output2String, output3String) {
  const output1Element = document.getElementById("output1").querySelector(".output-value");
  output1Element.textContent = output1String;

  const output2Element = document.getElementById("output2").querySelector(".output-value");;
  output2Element.textContent = output2String;

  const output3Element = document.getElementById("output3").querySelector(".output-value");;
  output3Element.textContent = output3String;
}

