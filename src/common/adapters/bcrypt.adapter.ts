import { Injectable } from "@nestjs/common";
import { PasswordHasher } from "../interfaces/password-hasher.interface";

import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter implements PasswordHasher {

  async hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  async compare(
    password: string,
    hash: string,
  ) {
    return bcrypt.compare(password, hash);
  }
}