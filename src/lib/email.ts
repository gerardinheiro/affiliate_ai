import { Resend } from 'resend';

export async function sendWelcomeEmail(email: string, name: string) {
    if (!process.env.RESEND_API_KEY) {
        console.log("RESEND_API_KEY not found, skipping email.")
        return
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'AffiliateAI <onboarding@resend.dev>', // Use resend.dev for testing if no domain
            to: email,
            subject: 'Bem-vindo ao AffiliateAI! 🚀',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Olá, ${name}! 👋</h1>
                    <p>Estamos muito felizes em ter você conosco.</p>
                    <p>O AffiliateAI foi criado para ajudar você a escalar suas vendas como afiliado usando o poder da Inteligência Artificial.</p>
                    
                    <h2>O que você pode fazer agora:</h2>
                    <ul>
                        <li>📦 <strong>Cadastrar Produtos:</strong> Adicione seus links de afiliado.</li>
                        <li>📢 <strong>Gerar Copys:</strong> Crie textos persuasivos em segundos.</li>
                        <li>🎨 <strong>Creative Studio:</strong> Gere imagens e roteiros de vídeo.</li>
                    </ul>

                    <p>Se precisar de ajuda, basta responder a este e-mail.</p>
                    <br/>
                    <p>Sucesso,</p>
                    <p><strong>Time AffiliateAI</strong></p>
                </div>
            `
        });
        console.log(`Welcome email sent to ${email}`)
    } catch (error) {
        console.error("Error sending welcome email:", error)
    }
}
