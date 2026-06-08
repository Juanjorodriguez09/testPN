import { Role } from '../../common/enums/role.enum';
import { formatDate } from '../../common/helpers/format-date.helper';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  id!: string;
  email!: string;
  isActive!: boolean
  role!: Role;
  createdAt!: string;
  updatedAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this.createdAt = formatDate(partial.createdAt!);
  }
}