import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let showUserProfile: ShowUserProfileUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe("List Cars", () => {

    beforeEach(() => {
      usersRepositoryInMemory = new InMemoryUsersRepository()
      showUserProfile= new ShowUserProfileUseCase(usersRepositoryInMemory)
    })

    it("should be able to the users by id", async () => {
      const user = await usersRepositoryInMemory.create({
        name: "UserNameTest",
        email: "teste@email.com",
        password: "passwordTest"
      })

      const userId = await showUserProfile.execute(user.id)




      expect(user).toEqual(userId)
    })

    it("should to be able to show show a user when the past id is incorrect", async () => {
      expect(async () => {
        const userId = await showUserProfile.execute("incorrect id")
      }).rejects.toBeInstanceOf(AppError)

    })


})
