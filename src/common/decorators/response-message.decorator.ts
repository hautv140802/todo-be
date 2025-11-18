import { SetMetadata } from '@nestjs/common';

export const ResponseMessageKey = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(ResponseMessageKey, message);
