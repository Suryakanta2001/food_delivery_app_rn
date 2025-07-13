import React, { useEffect, useState, Fragment } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import cn from "clsx";

import CartButton from "@/components/CartButton";
import { images, offers } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { getCleanFirstName, getGreeting } from "@/lib/utils";

export default function Index() {
  const [locationName, setLocationName] = useState("Locating...");
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "Location permission is required to show nearby offers."
          );
          setLocationName("Permission denied");
          return;
        };

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

        const city = place.city || place.subregion || place.region || "Unknown";
        setLocationName(city);
      } catch (error) {
        console.error("Location error:", error);
        setLocationName("Location error");
      }
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View>
              <Pressable
                className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: "#fffff22" }}
              >
                {() => (
                  <Fragment>
                    <View className="h-full w-1/2">
                      <Image
                        source={item.image}
                        className="size-full"
                        resizeMode="contain"
                      />
                    </View>

                    <View
                      className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}
                    >
                      <Text className="h1-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor="#ffffff"
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View className="w-full my-5">
            {/* Delivery Info */}
            <View className="flex-between flex-row mb-4">
              <View>
                <Text className="small-bold text-primary">DELIVER TO</Text>
                <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                  {locationName === "Locating..." ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text className="paragraph-bold text-dark-100">{locationName}</Text>
                  )}
                  <Image
                    source={images.arrowDown}
                    className="size-3 ml-1"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <CartButton />
            </View>

            {/* Greeting with Emoji */}
            <Text className="text-lg font-semibold text-dark-100 mb-4">
              Hi {getCleanFirstName(user?.name)}, {getGreeting()}            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
