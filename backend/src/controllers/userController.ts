import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/prisma';
import bcrypt from "bcrypt";
import { registerSchema, updateUserSchema } from '../utils/validation';
import { z } from 'zod';
import type { Prisma, Role } from '@prisma/client';

type RegisterRequest = z.infer<typeof registerSchema>;
type UpdateUserRequest = z.infer<typeof updateUserSchema>;

export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const getUserById = async (
  request: FastifyRequest<{ Params: { id: string} }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }
    
    return user
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const registerUser = async (
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply
) => {
  const { name, email, password, role } = request.body

  try {
    // Check if user with same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return reply.status(400).send({ error: 'User wth this email already' })
    }

    // Hash the passwrod
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STAFF'
      }
    })

    return reply.status(201).send(user)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const updateUser = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserRequest }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { name, email, password, role } = request.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return reply.status(404).send({ error: 'User not found' });
    }

    // Prepare the data object for the update
    const updateData: Prisma.UserUpdateInput = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // Ensure password hashing if needed
    if (role) updateData.role = role as Role; // Cast role to the enum

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return updatedUser;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};