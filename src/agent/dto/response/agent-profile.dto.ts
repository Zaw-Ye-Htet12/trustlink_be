import { UserResponseDto } from 'src/auth/dto/user-response.dto';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';

export class AgentProfileResponse {
  id: number;
  user: UserResponseDto;
  verification_status: VerificationStatus;
  bio: string;
  years_of_experience: number;
  location: string;
  service_area: string;
  total_reviews: number;
  follower_count: number;
  profile_photo_url: string;
}
