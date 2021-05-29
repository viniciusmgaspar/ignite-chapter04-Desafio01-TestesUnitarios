import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'receiver_id' |
  'sender_id' |
  'amount' |
  'type'
>
