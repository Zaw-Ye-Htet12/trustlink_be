import { UserResponseDto } from 'src/auth/dto/user-response.dto';

export class CustomerProfileResponse {
  id: number;
  bio?: string;
  location?: string;
  user: UserResponseDto;
}
