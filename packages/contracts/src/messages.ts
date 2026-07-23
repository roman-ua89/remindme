export const MessageKey = {
  AUTH_UNAUTHORIZED: 'auth.unauthorized',
  AUTH_INVALID_CREDENTIALS: 'auth.invalid_credentials',
  AUTH_INVALID_SESSION: 'auth.invalid_session',
  AUTH_EMAIL_ALREADY_REGISTERED: 'auth.email_already_registered',
  AUTH_DEFAULT_ROLE_NOT_CONFIGURED: 'auth.default_role_not_configured',
  AUTH_INVALID_RESET_TOKEN: 'auth.invalid_reset_token',
  AUTH_LOGGED_OUT: 'auth.logged_out',
  AUTH_PASSWORD_RESET: 'auth.password_reset',
  AUTH_RESET_EMAIL_SENT: 'auth.reset_email_sent',
} as const

export type MessageKeyValue = (typeof MessageKey)[keyof typeof MessageKey]

export const messages = {
  [MessageKey.AUTH_UNAUTHORIZED]: 'Unauthorized',
  [MessageKey.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [MessageKey.AUTH_INVALID_SESSION]: 'Invalid or expired session',
  [MessageKey.AUTH_EMAIL_ALREADY_REGISTERED]: 'Email is already registered',
  [MessageKey.AUTH_DEFAULT_ROLE_NOT_CONFIGURED]:
    'Default user role is not configured',
  [MessageKey.AUTH_INVALID_RESET_TOKEN]: 'Invalid or expired reset token',
  [MessageKey.AUTH_LOGGED_OUT]: 'Logged out',
  [MessageKey.AUTH_PASSWORD_RESET]: 'Password has been reset',
  [MessageKey.AUTH_RESET_EMAIL_SENT]:
    'If the email exists, a reset link has been sent',
} satisfies Record<MessageKeyValue, string>
