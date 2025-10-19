import { UserResponseDto } from 'src/auth/dto/user-response.dto';

export class AgentProfileResponse {
  id: number;
  bio: string;
  years_of_experience: number;
  location: string;
  service_area: string;
  user: UserResponseDto;
}
