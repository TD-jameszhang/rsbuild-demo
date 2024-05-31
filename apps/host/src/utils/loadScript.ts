export default function loadScript(url: String) {
  if (url.indexOf('.js') === -1) {
    throw new Error('Invalid url in your manifest - the src must be a .js file')
  }

  let element:Element

  return new Promise<void>((resolve, reject) => {
    element = document.createElement('script')

    element.src = url
    element.type = 'text/javascript'
    element.async = true

    element.onload = () => {
      resolve()
    }

    element.onerror = () => {
      reject(new Error(`Unable to fetch the remote from the url: ${url}`))
    }

    document.head.appendChild(element)
  }).finally(() => {
    document.head.removeChild(element)
  })
}