import { Role } from '../../common/enums/role.enum';

export class UserResponseDto {
  id!: string;
  email!: string;
  isActive!: boolean
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}