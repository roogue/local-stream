window.addEventListener("DOMContentLoaded", async () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  const api = window.api;
  const ip = await api.ipAddress();
  replaceText("local-ip-address", ip);

  const port = await api.port();
  replaceText("port-exposed", port);
});
