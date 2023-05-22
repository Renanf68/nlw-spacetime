import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";

import NLWLogo from "../src/assets/logo.svg";
import { api } from "../src/lib/api";

dayjs.locale(ptBr);

interface Memory {
  id: string;
  coverUrl: string;
  excerpt: string;
  createdAt: string;
}

export default function Memories() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const [memories, setMemories] = useState<Memory[]>([]);

  async function signOut() {
    await SecureStore.deleteItemAsync("token");
    router.push("/");
  }

  async function loadmemories() {
    const token = await SecureStore.getItemAsync("token");
    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMemories(response.data);
  }

  useEffect(() => {
    loadmemories();
  }, []);

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="flex-row mt-4 items-center justify-between">
        <NLWLogo />
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="w-10 h-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View key={memory.id} className="space-y-4">
              <View className="flex-row items-center gap-2 -ml-10">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
                </Text>
              </View>
              <View>
                <Image
                  source={{
                    uri: memory.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt="capa da memória"
                />
              </View>
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href={`/memories/${memory.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
