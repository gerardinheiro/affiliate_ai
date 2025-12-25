import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    // This HTML page will send the code back to the main window and close itself
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Autenticando...</title>
      </head>
      <body>
        <script>
          const code = "${code || ""}";
          const error = "${error || ""}";
          
          if (window.opener) {
            window.opener.postMessage(
              { type: "OAUTH_CALLBACK", code, error },
              window.location.origin
            );
            window.close();
          } else {
            document.body.innerHTML = "Erro: Janela principal não encontrada. Você pode fechar esta aba.";
          }
        </script>
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
          <p>Autenticação concluída! Fechando janela...</p>
        </div>
      </body>
    </html>
  `

    return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
    })
}
