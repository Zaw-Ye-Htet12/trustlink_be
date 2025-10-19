import { UserRole } from 'src/common/enums/user-role.enum';

export class UserResponseDto {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  phone_no: string;
  is_active: boolean;
  profile_photo_url?: string;
}
