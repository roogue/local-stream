const replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerText = text;
};

const replaceValue = (selector, value) => {
  const element = document.getElementById(selector);
  if (element) element.value = value;
};

// When Dom content is loaded, load data from main
window.addEventListener("DOMContentLoaded", async () => {
  const api = window.api;
  const ip = await api.ipAddress();
  replaceText("local-ip-address", ip);

  const port = await api.port();
  replaceValue("port-exposed", port);

  const directory = await api.directory();
  replaceValue("directory", directory);
});

// Port handling
const setPort = async () => {
  const port = document.getElementById("port-exposed").value;
  console.log("Setting port to", port);
  const returnedPort = await window.api.setPort(port);
  console.log("Returned port", returnedPort);
  // returnedPort can be undefined if error occurs
  if (!returnedPort) return;

  replaceValue("port-exposed", returnedPort);
};
document.getElementById("changePortBtn").addEventListener("click", setPort);

// Directory handling
const selectDirectory = async () => {
  const filePath = await window.api.selectDirectory();
  // filePath can be undefined if user cancels
  if (!filePath) return;

  replaceValue("directory", filePath);
};
document
  .getElementById("selectDirectory")
  .addEventListener("click", selectDirectory);
