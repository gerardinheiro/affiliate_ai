import Link from "next/link"
import { Logo3D } from "@/components/ui/logo-3d"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-12">
                    <Logo3D className="w-10 h-10" />
                    <span className="text-2xl font-bold text-white">Affiliate<span className="text-yellow-500">AI</span></span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>

                <div className="space-y-8 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introdução</h2>
                        <p>
                            A sua privacidade é importante para nós. É política do AffiliateAI respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site AffiliateAI, e outros sites que possuímos e operamos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Coleta de Dados</h2>
                        <p>
                            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                        </p>
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>Informações de perfil (nome, e-mail) via login social (Google, Facebook, etc).</li>
                            <li>Dados de integração (tokens de acesso) para gerenciar suas campanhas e redes sociais.</li>
                            <li>Dados de uso para melhorar a nossa plataforma e ferramentas de IA.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Uso das APIs de Terceiros</h2>
                        <p>
                            Nossa plataforma utiliza APIs oficiais da Meta (Facebook/Instagram), Google, TikTok e Pinterest. Ao conectar suas contas, você nos autoriza a acessar os dados necessários para o funcionamento das ferramentas de automação e analytics, conforme as permissões solicitadas no momento da conexão.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Retenção de Dados</h2>
                        <p>
                            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Seus Direitos</h2>
                        <p>
                            Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados. O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Contato</h2>
                        <p>
                            Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco através do e-mail de suporte.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        ← Voltar para a Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
