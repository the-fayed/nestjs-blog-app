import { UseInterceptors } from '@nestjs/common';

import { IClassConstructor, SerializeInterceptor } from 'src/interceptors';

export function Serialize(dto: IClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
