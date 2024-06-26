const url = import.meta.env.VITE_BACKEND_URL;

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      return response;
    } catch (error) {
      console.error('An error occurred during login:', error);
      throw error;
    }
  },
  send_verification_email: async email => {
    try {
      const response = await fetch(`${url}/send-verification-email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      return response;
    } catch (error) {
      console.error('An error occurred during email verification:', error);
      throw error;
    }
  },
  verify_email: async token => {
    try {
      const response = await fetch(`${url}/verify-mail`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      return response;
    } catch (error) {
      console.error('An error occurred during email verification:', error);
      throw error;
    }
  },
  forget_password: async email => {
    try {
      const response = await fetch(`${url}/send-forget-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      return response;
    } catch (error) {
      console.error('An error occurred during password reset:', error);
      throw error;
    }
  },
  check_token: async token => {
    try {
      const response = await fetch(`${url}/check-token/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      });
      return response;
    } catch (error) {
      console.error('An error occurred during token verification:', error);
      throw error;
    }
  },
  reset_password: async (password, token) => {
    try {
      const response = await fetch(`${url}/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({
          password: password,
          token: token,
        }),
      });
      return response;
    } catch (error) {
      console.error('An error occurred during password reset:', error);
      throw error;
    }
  },
  me: async (token, signal) => {
    const response = await fetch(`${url}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/ld+json',
        Authorization: `Bearer ${token}`,
      },
      signal: signal,
    });
    return response;
  },
};

export default AuthService;
