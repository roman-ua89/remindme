import { loginSchema } from '@remindme/contracts/auth';
import type { LoginInput } from '@remindme/contracts/auth';

export const loginFormSchema = loginSchema;

export type LoginFormValues = LoginInput;
