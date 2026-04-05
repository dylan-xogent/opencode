export async function onRequest() {
  const url =
    "https://raw.githubusercontent.com/dylan-xogent/opencode/dev/install"
  const response = await fetch(url)
  const text = await response.text()
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}
