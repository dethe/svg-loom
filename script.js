const SVGNS = "http://www.w3.org/2000/svg";
const svg = document.querySelector("svg");
const SVGHEAD = `<?xml version="1.0" standalone="yes"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`;
// Viewport units are 1/80 of an inch, set in index.html

const BREAKAWAY = 1;

function elem(name, attributes) {
  let e = document.createElementNS(SVGNS, name);
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      e.setAttribute(key, value);
    }
  }
  return e;
}

function html(name, attributes) {
  let e = document.createElement(name);
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      e.setAttribute(key, value);
    }
  }
  return e;
}

function addPath(path) {
  let e = elem("path", { d: path.join(" ") });
  svg.append(e);
  return e.getBBox().width;
}

function comment(txt) {
  svg.append(document.createComment(txt));
}

function clear() {
  console.log("clearing %s children", svg.children.length - 1);
  while (svg.lastElementChild.tagName !== "style") {
    svg.lastElementChild.remove();
  }
  if (svg.children.length > 1) {
    console.error(
      "something went wrong, there are still %s children",
      svg.children.length
    );
  }
}

function resize(width, height) {
  svg.setAttribute("width", width / 80 + 0.1 + "in");
  svg.setAttribute("height", height / 80 + 0.1 + "in");
}

function outerFrame(x, y, teeth, height) {
  comment("The outer frame of the loom with teeth and locks for yarn");
  const radius = 20;
  const r2 = radius * 2;
  return addPath([
    `M${x} ${y + radius}`,
    lock(1),
    `a${radius} ${radius} 0 0 1 ${radius} ${-radius}`,
    Array(teeth)
      .fill(0)
      .map(_ => roundNotch(1))
      .join(" "),
    `a${radius} ${radius} 0 0 1 ${radius} ${radius}`,
    lock(-1),
    `v${height - r2}`,
    lock(-1),
    `a${radius} ${radius} 0 0 1 ${-radius} ${radius}`,
    Array(teeth)
      .fill(0)
      .map(_ => roundNotch(-1))
      .join(" "),
    `a${radius} ${radius} 0 0 1 ${-radius} ${-radius}`,
    lock(1),
    "z",
  ]);
}

function lock(dir) {
  return `l${15 * dir} ${-1 * dir} a3 3 0 1 0 0 ${-2 * dir} l${-15 * dir} ${
    -1 * dir
  }`;
}

function rect(x, y, width, height, stroke) {
  stroke = stroke || "black";
  svg.appendChild(elem("rect", { x, y, width, height, stroke }));
}

function text(textId, x, y) {
  let source = document.getElementById(textId);
  let t = elem("text", { x, y, id: textId + "_svg" });
  t.textContent = source.value;
  svg.appendChild(t);
}

function notch(dir) {
  return `v${10 * dir} a5 5 0 0 0 ${10 * dir} 0 v${-10 * dir}`;
}

function roundNotch(dir) {
  // each adds 15 to width
  return [
    `h${1 * dir}`,
    `a2 2 0 0 1 ${2 * dir} ${2 * dir}
      v${7 * dir}
      a4.5 4.5 0 0 0 ${9 * dir} 0
      v${-7 * dir}
      a2 2 0 0 1 ${2 * dir} ${-2 * dir}`,
    `h${1 * dir}`,
  ].join(" ");
}

// Prop for display, and to hold comb and needles
function innerFrame(x, y, width, height, radius) {
  const r2 = radius * 2;
  const radius2 = (radius * 2) / 3;
  const r3 = radius + radius2;
  const r2_2 = radius2 * 2;
  const r3_2 = r3 * 2;
  const r4 = radius * 2 + radius2;
  comment(
    "The inner frame, used to prop up the loom and to hold the needles and comb"
  );
  addPath([
    `M${x} ${y + radius + radius2}`,
    `a${radius} ${radius} 0 0 1 ${radius} ${-radius}`,
    `a${radius2} ${radius2} 0 0 1 ${radius2} ${-radius2}`,
    `h${width - r3_2}`,
    `a${radius2} ${radius2} 0 0 1 ${radius2} ${radius2}`,
    `a${radius} ${radius} 0 0 1 ${radius} ${radius}`,
    `v${height * 0.3 - BREAKAWAY}`,
    `m0 ${BREAKAWAY}`,
    `v${height * 0.7 - r4}`,
    `a${radius} ${radius} 0 0 1 ${-radius} ${radius}`,
    `h${-(width - r2)}`,
    `a${radius} ${radius} 0 0 1 ${-radius} ${-radius}`,
    `v${-(height * 0.3 - BREAKAWAY)}`,
    `m0 ${-BREAKAWAY}`,
    `v${-(height * 0.7 - r4)}`,
  ]);
}

function needle(x, y, width, height, r1, r2) {
  comment("Needle");
  addPath([
    `M${x} ${y}`,
    `a${r1} ${r1} 0 0 1 ${r1 * 2} 0`,
    `l${-(r1 - r2) * 0.3}, ${height * 0.3 - BREAKAWAY}`,
    `m0, ${BREAKAWAY}`,
    `l${-(r1 - r2) * 0.7}, ${height * 0.7}`,
    `a${r2} ${r2} 0 0 1 ${-r2 * 2} 0`,
    // `l${-r1 + r2}, ${-height}`,
    `l${-(r1 - r2) * 0.3}, ${-(height * 0.3 - BREAKAWAY)}`,
    `m0, ${-BREAKAWAY}`,
    `l${-(r1 - r2) * 0.7}, ${-(height * 0.7)}`,
    // 'z'
  ]);
  addPath([
    `M${x + 6} ${y + 4}`,
    `a${r2} ${r2} 0 0 1 ${r2 * 2} 0`,
    `v20`,
    `a${r2} ${r2} 0 0 1 ${-r2 * 2} 0`,
    "z",
  ]);
}

function comb(x, y, width, teeth, radius) {
  const height = teeth * 20 - 10;
  const toothLength = 60;
  comment("Comb");
  addPath([
    `M${x} ${y + radius}`,
    `a${radius} ${radius} 0 0 1 ${radius} ${-radius}`,
    `m${BREAKAWAY},0`,
    Array(teeth)
      .fill(0)
      .map(_ => tooth(60))
      .join(" a5 5 0 0 0 0 10 "),
    `m${-BREAKAWAY},0`,
    `a${radius} ${radius} 0 0 1 ${-radius} ${-radius}`,
    `v${-(height - radius * 2)}`,
  ]);
}

function tooth(length) {
  return `h${length - 5} a5 5 0 0 1 0 10 h${-(length - 5)}`;
}

function loomWithAccessories(teeth) {
  const width = teeth * 15 + 40;
  const height = width * 2;
  clear();
  resize(width, height);
  let actualWidth = outerFrame(0, 0, teeth, height, 20); // should be 280 or 3.5"
  if (actualWidth !== width) {
    console.error("Expected %s, but got %s", width, actualWidth);
  } else {
    console.log('All good, %s" wide', width / 80);
  }
  // original height = 570
  rect(20, 50, width - 40, height - 100, "red"); // decorative
  innerFrame(30, 70, width - 60, height - 190, 30);
  rect(55, height - 100, width - 120, 14); // slot for stand
  let needleHeight = height / 2 - 35;
  let needleWidth = needleHeight / 10;
  needle(50, 130, needleWidth, needleHeight, 10, 4);
  needle(width - 60, 130, needleWidth, needleHeight, 10, 4);
  comb(100, 150, 90, 13, 30);
  text("text1", width / 2, 30);
  text("text2", width / 2, height - 30);
}

loomWithAccessories(16);

function chooseSize(evt) {
  console.log(evt);
  switch (evt.currentTarget.value) {
    case "large":
      loomWithAccessories(20);
      break;
    case "medium":
      loomWithAccessories(16);
      break;
    case "small":
      loomWithAccessories(12);
      break;
    default:
      // do nothing
      console.log(evt.currentTarget.value);
      break;
  }
}

function downloadFile() {
  save(`${SVGHEAD}${svg.outerHTML}`);
}

function save(data) {
  var reader = new FileReader();
  reader.onloadend = function () {
    var a = html("a", {
      href: reader.result,
      download: "loom.svg",
      target: "_blank",
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  reader.readAsDataURL(new Blob([data], { type: "image/svg+xml" }));
}

function setValue(evt) {
  let source = evt.currentTarget;
  let target = svg.querySelector("#" + source.id + "_svg");
  target.textContent = source.value;
}

// setup event handlers

document
  .querySelector("#download-file")
  .addEventListener("click", downloadFile);

document
  .querySelectorAll("input[type='radio']")
  .forEach(e => e.addEventListener("input", chooseSize));

document
  .querySelectorAll("input[type='text']")
  .forEach(e => e.addEventListener("input", setValue));
