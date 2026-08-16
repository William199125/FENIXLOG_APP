import * as Device from "expo-device";

export const API_URL = Device.isDevice
  ? process.env.EXPO_PUBLIC_API_URL_PHYSICAL
  : process.env.EXPO_PUBLIC_API_URL_EMULATOR;