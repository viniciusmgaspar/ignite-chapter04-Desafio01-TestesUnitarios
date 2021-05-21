import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import {ProfileMap} from "@modules/users/mappers/ProfileMap"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it("should be able to authenticate an user", async () => {
        const user = {
            email: "user@test.com",
            password: "1234",
            name: "User Test"
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        })

        expect(result).toHaveProperty("token")
        expect(result).toHaveProperty("user.id")
    })

    it("should not be able to authenticate an non-existent user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "false password",
            });
        }).rejects.toBeInstanceOf(AppError)
    })

     it("should not be able to authenticate with incorrect password", async () => {
        expect(async () => {
          const user = {
            email: "user@test.com",
            password: "1234",
            name: "User Test"
        }

        await createUserUseCase.execute(user);


        await authenticateUserUseCase.execute({
          email: "false@email.com",
          password: "false password",
          });
        }).rejects.toBeInstanceOf(AppError)
    })


})
