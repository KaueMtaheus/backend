// Importando os módulos necessários
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import  dayjs from 'dayjs'
import  nodemailer from 'nodemailer'
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";

// Define a rota para criar uma viagem
export async function createTrip(app: FastifyInstance) {
    //get, post, put, patch, delete

    // Definindo a rota POST para criar uma nova viagem
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
        body: z.object({
            destination: z.string().min(4),
            starts_at: z.coerce.date(),
            ends_at: z.coerce.date(),
            owner_name: z.string(),
            owner_email: z.string().email(),
            


        })         
        },


       // Extraindo os campos do corpo da requisição  
    } ,async (request) => {
        const { destination, starts_at, ends_at, owner_name, owner_email } = request.body
        
        // Verifica se a data de início é no passado
        if (dayjs(starts_at).isBefore(new Date())) {
            throw new Error('Invalid trip start date.')
        }
        
        // Verifica se a data de término é antes da data de início
        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new Error('Invalid trip start date.')
        }


    // Criando uma nova viagem no banco de dados usando o Prisma

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
            }
        })

     // Obtendo o cliente de e-mail configurado

        const mail = await getMailClient()
    // Enviando um e-mail de teste para o proprietário da viagem
    
    const message = await mail.sendMail({
            from: {
                name: 'Equipe plann.er',
                address: 'boanoite@planer'
            },
            to: {
                name: owner_name,
                address: owner_email,  
            },
            subject: 'Testando envio de e-mail.',
            html: `<p>Teste do envio de e-mail.</p>`

        })


        console.log(nodemailer.getTestMessageUrl(message))


        return { tripId: trip.id }
    })
}