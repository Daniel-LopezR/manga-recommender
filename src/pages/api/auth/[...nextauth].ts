import { generatePKCECode } from "@/utils/generatePKCECode";
import axios from "axios";
import NextAuth from "next-auth";

const pkceCode = generatePKCECode();

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    {
      id: "myanimelist",
      name: "MyAnimeList",
      type: "oauth",
      version: "2.0",
      clientId: process.env.MAL_CLIENT_ID,
      clientSecret: process.env.MAL_CLIENT_SECRET,
      authorization: {
        url: `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${
          process.env.MAL_CLIENT_ID
        }&state=${generatePKCECode()}&code_challenge=${pkceCode}&code_challenge_method=plain`,
      },
      token: {
        async request(context) {
          const tokens = await axios
            .post(
              "https://myanimelist.net/v1/oauth2/token",
              {
                client_id: context.provider.clientId,
                client_secret: context.provider.clientSecret,
                code: context.params.code,
                code_verifier: pkceCode,
                redirect_uri:
                  "http://localhost:3000/api/auth/callback/myanimelist",
                grant_type: "authorization_code",
              },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            )
            .then(
              (response) => {
                return {
                  token_type: response.data.token_type,
                  expires_at: Date.now() + response.data.expires_in * 1000,
                  access_token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                };
              },
              (error) => {
                console.log(error);
                return {};
              }
            );
          console.log(tokens);

          return {
            tokens,
          };
        },
      },
      userinfo: "https://api.myanimelist.net/v2/users/@me",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
        };
      },
    },
  ],
  debug: false,
});