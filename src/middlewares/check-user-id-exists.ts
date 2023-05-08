import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const cookieUserId = request.cookies.userId

  if (!cookieUserId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
