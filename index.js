const exampleLinks = [
  {
    "title": "🚁 Helicopter",
    "link": "/examples/helicopter/interactive.html",
  },
  {
    "title": "🐸 Jump",
    "link": "/examples/jump/interactive.html",
  },
  {
    "title": "🌧 Rain",
    "link": "/examples/rain/interactive.html",
  },
  {
    "title": "🏹 Vectors",
    "link": "/examples/vectors/interactive.html",
  },
];


const buildExampleLinkElement = function hstBuildExampleLinkElement(exampleLinkInfo) {
  const exampleLinkElement = document.createElement("p");
  exampleLinkElement.setAttribute("class", "linkBlock")
  const link = document.createElement("a");
  link.setAttribute("href", exampleLinkInfo.link);
  link.innerHTML = exampleLinkInfo.title;
  exampleLinkElement.appendChild(link);
  return exampleLinkElement;
}


document.addEventListener(
  "DOMContentLoaded",
  () => {
    const containerElement = document.getElementById("body-example-links");
    const containerDocumentFragment = document.createDocumentFragment();
    for (const exampleLinkInfo of exampleLinks) {
      containerDocumentFragment.append(
        buildExampleLinkElement(exampleLinkInfo)
      );
    }
    containerElement.appendChild(containerDocumentFragment);
    return;
  },
);
