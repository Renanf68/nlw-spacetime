import { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
// import { useRouter } from "expo-router";

import { api } from "../src/lib/api";
import NLWLogo from "../src/assets/logo.svg";
import { useRouter } from "expo-router";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/bdad3ff0e3d232c037f2",
};

export default function App() {
  const router = useRouter();
  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "bdad3ff0e3d232c037f2",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );
  async function handleGithubOAuthCode(code: string) {
    try {
      const response = await api.post("/register", { code });
      const { token } = response.data;
      await SecureStore.setItemAsync("token", token);
      router.push("/memories");
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => {
  //   hack to get redirect url to save at github app "Authorization callback URL"
  //   console.log(makeRedirectUri({
  //     scheme: "nlwspacetime",
  //   }))
  // }, [])
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      handleGithubOAuthCode(code);
    }
  }, [response]);
  return (
    <View className="flex-1 items-center px-8 py-6">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-gray-50 font-title text-2xl leading-tight text-center">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200 py-10">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}
