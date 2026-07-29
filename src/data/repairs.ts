export type RepairBrand = {
  id: string;
  name: string;
  models: Record<
    string,
    { name: string; screen: number; battery: number; port: number; camera: number; back: number }
  >;
};

export const REPAIR_BRANDS: RepairBrand[] = [
  {
    id: "apple",
    name: "Apple iPhone",
    models: {
      "iphone-16-pro-max": { name: "iPhone 16 Pro Max", screen: 319, battery: 109, port: 99, camera: 89, back: 169 },
      "iphone-15-pro": { name: "iPhone 15 Pro", screen: 249, battery: 99, port: 89, camera: 79, back: 129 },
      "iphone-15": { name: "iPhone 15", screen: 199, battery: 89, port: 79, camera: 69, back: 99 },
      "iphone-14": { name: "iPhone 14", screen: 169, battery: 79, port: 69, camera: 59, back: 89 },
      "iphone-13": { name: "iPhone 13", screen: 139, battery: 79, port: 59, camera: 59, back: 79 },
    },
  },
  {
    id: "samsung",
    name: "Samsung Galaxy",
    models: {
      "galaxy-s24-ultra": { name: "Galaxy S24 Ultra", screen: 299, battery: 89, port: 79, camera: 89, back: 99 },
      "galaxy-s24": { name: "Galaxy S24", screen: 179, battery: 79, port: 69, camera: 69, back: 79 },
      "galaxy-a54": { name: "Galaxy A54 5G", screen: 109, battery: 59, port: 49, camera: 39, back: 49 },
    },
  },
  {
    id: "xiaomi",
    name: "Xiaomi / Redmi",
    models: {
      "redmi-note-13-pro": { name: "Redmi Note 13 Pro 5G", screen: 99, battery: 59, port: 49, camera: 39, back: 49 },
      "redmi-note-12": { name: "Redmi Note 12", screen: 79, battery: 49, port: 39, camera: 29, back: 39 },
    },
  },
];

export const REPAIR_ISSUES = [
  { id: "screen", labelEn: "Screen / display", labelEs: "Pantalla", key: "screen" as const },
  { id: "battery", labelEn: "Battery", labelEs: "Batería", key: "battery" as const },
  { id: "port", labelEn: "Charging port", labelEs: "Puerto de carga", key: "port" as const },
  { id: "camera", labelEn: "Camera", labelEs: "Cámara", key: "camera" as const },
  { id: "back", labelEn: "Back glass", labelEs: "Cristal trasero", key: "back" as const },
];

export const REPAIR_DURATIONS: Record<string, string> = {
  screen: "60–90 mins",
  battery: "45 mins",
  port: "30–45 mins",
  camera: "45 mins",
  back: "90 mins",
};
