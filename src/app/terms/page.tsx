import Link from "next/link"
import { Logo3D } from "@/components/ui/logo-3d"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-12">
                    <Logo3D className="w-10 h-10" />
                    <span className="text-2xl font-bold text-white">Affiliate<span className="text-yellow-500">AI</span></span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-8">Termos de Uso</h1>

                <div className="space-y-8 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar e usar o AffiliateAI, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Uso da Licença</h2>
                        <p>
                            É concedida permissão para usar o software AffiliateAI para fins pessoais ou comerciais, conforme o plano contratado. Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença você não pode:
                        </p>
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>Modificar ou copiar os materiais (código-fonte, design);</li>
                            <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site AffiliateAI;</li>
                            <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais;</li>
                            <li>Transferir os materiais para outra pessoa ou "espelhar" os materiais em qualquer outro servidor.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Planos e Pagamentos</h2>
                        <p>
                            O serviço é oferecido em modelos de assinatura (mensal ou anual). Ao assinar, você concorda que:
                        </p>
                        <ul className="list-disc ml-6 mt-4 space-y-2">
                            <li>O pagamento será cobrado automaticamente no início de cada período de faturamento;</li>
                            <li>Você pode cancelar a qualquer momento, mantendo o acesso até o fim do período pago;</li>
                            <li>Não oferecemos reembolsos para períodos parciais, exceto conforme exigido por lei.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Isenção de Responsabilidade</h2>
                        <p>
                            Os materiais no site da AffiliateAI são fornecidos "como estão". AffiliateAI não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Limitações</h2>
                        <p>
                            Em nenhum caso o AffiliateAI ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em AffiliateAI, mesmo que AffiliateAI ou um representante autorizado da AffiliateAI tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Precisão dos Materiais</h2>
                        <p>
                            Os materiais exibidos no site da AffiliateAI podem incluir erros técnicos, tipográficos ou fotográficos. AffiliateAI não garante que qualquer material em seu site seja preciso, completo ou atual. AffiliateAI pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Links</h2>
                        <p>
                            O AffiliateAI não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por AffiliateAI do site. O uso de qualquer site vinculado é por conta e risco do usuário.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Modificações</h2>
                        <p>
                            O AffiliateAI pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
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
