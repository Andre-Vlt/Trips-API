import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";



export async function updateTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId', 
        {

        //ZOD É USADO PARA VALIDAÇÃO DE DADOS DENTRO DE UM SCHEMA:
        schema: {
            params:z.object({tripId: z.string().uuid()}),
            body: z.object({
                //DESTINATION TEM QUE SER UMA STRING COM NO MINMO 4 CARACTERES:
                destination: z.string().min(4),
                //DATA DE COMEÇO PRECISA SER TRATADA DE JSON PARA OBJETO DATE DO JS, PARA FAZER ISSO UTILIZO O COERCE
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date()
            })
        }
    },async (request) => {

        const{tripId} = request.params

        const { destination, starts_at, ends_at} = request.body;


        
        const trip = await prisma.trip.findUnique({
            where:{id:tripId}
        })
        

        if (!trip){
            throw new ClientError('Trip not found');
        }


        if (dayjs(starts_at).isBefore(new Date())){
            throw new ClientError('Invalid trip start date');
        }

        if (dayjs(ends_at).isBefore(starts_at)){
            throw new ClientError('Invalid trip end date');
        }


        await prisma.trip.update({
            where: {id: tripId},
            data:{
                destination,
                starts_at,
                ends_at
            }
        })

        
        return {tripId: trip.id};
    });
};

