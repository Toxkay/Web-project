document.addEventListener("DOMContentLoaded", () => {
  setupBackToTopButton();

  function setupBackToTopButton() {
    const button =
      document.querySelector(".back-to-top") ||
      addElementToPage(
        "button",
        "back-to-top",
        "⬆ Back to Top",
        "append",
        "body"
      );

    button.style.display = "none";

    window.addEventListener("scroll", () => {
      button.style.display = window.scrollY > 200 ? "block" : "none";
    });

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function addElementToPage(
    tag,
    className,
    text = "",
    position = "append",
    targetSelector = "body"
  ) {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;

    const target = document.querySelector(targetSelector) || document.body;

    switch (position) {
      case "prepend":
        target.prepend(element);
        break;
      case "before":
        target.parentNode.insertBefore(element, target);
        break;
      default:
        target.appendChild(element);
    }

    return element;
  }
});
