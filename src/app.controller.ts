import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './auth/auth.decorator';

@Public()
@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  @Redirect('/api', 302)
  redirectToApiDoc() {}
}
