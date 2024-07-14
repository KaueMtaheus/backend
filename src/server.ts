import fastify from "fastify";
import { createTrip } from "./routes/create-trips";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";

// Criando a instância do Fastify
const app = fastify()

// Configurando o compilador de validação e o compilador de serialização
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Registrando a rota de criação de viagens
app.register(createTrip)

// Iniciar o servidor e fornecer feedback visual no console de que o servidor está em execução.
app.listen({ port: 3000 }).then(() => {
    console.log('server running on port 3000!')
})
