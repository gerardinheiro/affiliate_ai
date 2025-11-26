"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Key, Lock, User } from "lucide-react"

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                    <p className="text-muted-foreground mt-2">
                        Gerencie suas preferências e chaves de acesso.
                    </p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="api_keys">Chaves de API</TabsTrigger>
                        <TabsTrigger value="notifications">Notificações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Perfil</CardTitle>
                                <CardDescription>
                                    Atualize suas informações pessoais e foto de perfil.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Alterar Foto</Button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input id="name" defaultValue="Usuário Demo" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue="demo@affiliateai.com" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Salvar Alterações</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="api_keys">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chaves de API Centralizadas</CardTitle>
                                <CardDescription>
                                    Gerencie as chaves de acesso para todas as integrações em um só lugar.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="openai_key">OpenAI API Key</Label>
                                    <div className="flex gap-2">
                                        <Input id="openai_key" type="password" value="sk-........................" readOnly />
                                        <Button variant="secondary">
                                            <Key className="w-4 h-4 mr-2" />
                                            Atualizar
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amazon_key">Amazon Associate Tag</Label>
                                    <div className="flex gap-2">
                                        <Input id="amazon_key" type="password" value="my-store-20" readOnly />
                                        <Button variant="secondary">
                                            <Key className="w-4 h-4 mr-2" />
                                            Atualizar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferências de Notificação</CardTitle>
                                <CardDescription>
                                    Escolha como você quer ser notificado sobre suas vendas.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <Bell className="w-6 h-6 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Notificações de Venda</p>
                                            <p className="text-sm text-muted-foreground">Receba um alerta a cada nova conversão.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline">Ativado</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
