const download = ({ url, name }) => {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  console.log(name, url)
  a.click()
}
const makePreview = ([name, src]) => {
  const cont = document.createElement('div')
  const button = document.createElement('button')
  const img = document.createElement('img')
  const title = document.createElement('h2')
  title.innerText = name
  const url = URL.createObjectURL(src)
  img.src = url
  button.textContent = 'download'
  button.addEventListener('click', () => {
    download({ url, name })
  })
  cont.classList.add('preview')
  cont.appendChild(title)
  cont.appendChild(img)
  cont.appendChild(button)
  return cont
}
const script = `const getOrientation = ({ width, height }) =>
  width < height ? "vertical" : "horizontal";
const getSide = function (src, orientation, side) {
  if (!(side === "large" || side === "small")) {
    throw new Error("invalid side...");
  }
  switch (orientation) {
    case "vertical": {
      switch (side) {
        case "large": {
          return src.height;
        }
        case "small": {
          return src.width;
        }
      }
      break;
    }
    case "horizontal": {
      switch (side) {
        case "small": {
          return src.height;
        }
        case "large": {
          return src.width;
        }
      }
      break;
    }
    default:
      throw new Error("invalid invalid orientation");
  }
};
postMessage("initalized");
this.onmessage = async (message) => {
  const { data } = message;
  const img = await createImageBitmap(data.file);
  const canvasOrient = getOrientation(img);
  const length = getSide(img, canvasOrient, "large");
  const canvas = new OffscreenCanvas(length, length);
  const ctx = canvas.getContext("2d");
  ctx.filter = "blur(80px)";
  ctx.drawImage(img, 0, 0, length, length);
  ctx.filter = "none";
  const xCenter = canvas.width / 2 - img.width / 2,
    yCenter = canvas.height / 2 - img.height / 2;
  ctx.drawImage(img, xCenter, yCenter);
  const res = await canvas.convertToBlob();
  this.postMessage({
    res,
  });
};`
async function fromAsync(arrayLike, mapFn) {
    const arr = []
    const iter = [...arrayLike].map(mapFn)
    for await (const item of iter) {
        arr.push(item);
    }
    return arr
}
function sqaurify(file) {
  return new Promise((res, rej) => {
    const blob = new Blob([script], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    worker.postMessage({ file })
    worker.onmessage = ({ data }) => {
      console.log(data)
      if (data.res) res(data.res)
    }
  })
}
const makeDownloadAllButton = (imgs) => {
  const button = document.createElement('button')
  button.innerText = 'download all'
  button.addEventListener('click', () => {
    for (let [name, blob] of imgs) {
      download({ url: URL.createObjectURL(blob), name })
    }
  })
  return button
}
{
  const fileIn = document.querySelector('#fileIn')
  const previewCont = document.querySelector('#preview')
  fileIn.onchange = async ({ target }) => {
    const files = Array.from(target.files)
    const imgs = await fromAsync(files, async (file) => {
      return [file.name, await sqaurify(file)]
    })
    document.body.insertBefore(
      makeDownloadAllButton(imgs),
      previewCont
    )
    for (let img of imgs) {
      const preview = makePreview(img)
      previewCont.appendChild(preview)
    }
  }
}
