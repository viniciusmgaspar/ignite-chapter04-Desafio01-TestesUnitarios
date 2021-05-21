import { AppError } from "@shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Create User", () => {
    beforeEach(()=>{
      usersRepositoryInMemory = new InMemoryUsersRepository()
      createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })


    it("should be able to create a new user", async ()=> {
        const user = {
            name: "UserNameTest",
            email: "teste@email.com",
            password: "passwordTest"
        }
        await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password
            });

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email)

        expect(userCreated).toHaveProperty("id")
    })

    it("should not be able to create a new user with the same email", async ()=> {

        expect(async () => {
          const user = {
            name: "UserNameTest",
            email: "teste@email.com",
            password: "passwordTest"
          }
          await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
          });
          await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
          });
        }).rejects.toBeInstanceOf(AppError)


    })
})
